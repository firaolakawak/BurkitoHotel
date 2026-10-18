import { Router, Request, Response } from 'express';
import { db } from '../database.ts';
import { InventoryCategory, WarehouseLocationId, PurchaseOrder } from '../../types/index.ts';

const router = Router();

// GET /api/inventory/items - List catalog items with stock levels and reorder alerts
router.get('/items', (req: Request, res: Response) => {
  try {
    const { category, lowStockOnly } = req.query;
    let items = Array.from(db.inventoryItems.values());

    if (category) {
      items = items.filter(i => i.category === category);
    }
    if (lowStockOnly === 'true') {
      items = items.filter(i => i.totalStock <= i.minSafetyStock);
    }

    const itemsWithMetrics = items.map(item => ({
      ...item,
      isBelowSafetyStock: item.totalStock <= item.minSafetyStock,
      stockHealthPercent: Math.round((item.totalStock / item.targetStockLevel) * 100),
      totalValue: Number((item.totalStock * item.unitCost).toFixed(2))
    }));

    res.json({
      success: true,
      count: itemsWithMetrics.length,
      data: itemsWithMetrics,
      summary: {
        totalSKUs: items.length,
        criticalAlertCount: items.filter(i => i.totalStock <= i.minSafetyStock).length,
        totalInventoryValue: Number(itemsWithMetrics.reduce((sum, i) => sum + i.totalValue, 0).toFixed(2))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/inventory/items - Add new item to catalog
router.post('/items', (req: Request, res: Response) => {
  try {
    const {
      name,
      sku,
      category,
      unit,
      unitCost,
      minSafetyStock,
      targetStockLevel,
      supplierName,
      initialLocation,
      initialQty,
      autoDeductOnCheckInQty
    } = req.body;

    const existing = Array.from(db.inventoryItems.values()).find(i => i.sku.toLowerCase() === sku.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: `SKU '${sku}' is already registered.` });
    }

    const id = `inv-${Date.now()}`;
    const initialLoc = (initialLocation as WarehouseLocationId) || 'MAIN_WAREHOUSE';
    const initialCount = Number(initialQty) || 0;

    const newItem = {
      id,
      sku: sku.toUpperCase(),
      name,
      category: category as InventoryCategory,
      unit: unit || 'unit',
      unitCost: Number(unitCost) || 0,
      minSafetyStock: Number(minSafetyStock) || 10,
      targetStockLevel: Number(targetStockLevel) || 100,
      supplierId: `v-${Date.now()}`,
      supplierName: supplierName || 'General Distributor',
      stockByLocation: {
        MAIN_WAREHOUSE: initialLoc === 'MAIN_WAREHOUSE' ? initialCount : 0,
        FLOOR_LINEN_CLOSET: initialLoc === 'FLOOR_LINEN_CLOSET' ? initialCount : 0,
        KITCHEN_PANTRY: initialLoc === 'KITCHEN_PANTRY' ? initialCount : 0
      },
      totalStock: initialCount,
      autoDeductOnCheckInQty: Number(autoDeductOnCheckInQty) || 0
    };

    db.inventoryItems.set(id, newItem);
    res.status(201).json({ success: true, message: `Item ${newItem.name} added to catalog!`, data: newItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/inventory/transfers - Internal transfer between Warehouse and Department Closets
router.post('/transfers', (req: Request, res: Response) => {
  try {
    const { itemId, fromLocation, toLocation, quantity, reason, staffName } = req.body;

    const result = db.transferInventory(
      itemId,
      fromLocation as WarehouseLocationId,
      toLocation as WarehouseLocationId,
      Number(quantity),
      reason || 'Internal staging transfer',
      staffName || 'Duty Inventory Manager'
    );

    res.json({
      success: true,
      message: `Transferred ${quantity} unit(s) of ${result.item.name} from ${fromLocation} to ${toLocation}`,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/inventory/transfers - Get transfer audit logs
router.get('/transfers', (req: Request, res: Response) => {
  res.json({ success: true, count: db.stockTransfers.length, data: db.stockTransfers });
});

// GET /api/inventory/locations - Get warehouse locations
router.get('/locations', (req: Request, res: Response) => {
  res.json({ success: true, data: Array.from(db.warehouseLocations.values()) });
});

// GET /api/inventory/consumption-logs - View auto-deductions and room linkage
router.get('/consumption-logs', (req: Request, res: Response) => {
  res.json({ success: true, count: db.inventoryConsumptionLogs.length, data: db.inventoryConsumptionLogs });
});

// ---------------- PURCHASE ORDERS ----------------

// GET /api/inventory/purchase-orders
router.get('/purchase-orders', (req: Request, res: Response) => {
  res.json({ success: true, data: Array.from(db.purchaseOrders.values()) });
});

// POST /api/inventory/purchase-orders - Create PO
router.post('/purchase-orders', (req: Request, res: Response) => {
  try {
    const { vendorName, items, targetWarehouse, expectedDeliveryDate, notes } = req.body;

    const poId = `po-${Date.now()}`;
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    let totalAmount = 0;
    const poItems = items.map((item: any, idx: number) => {
      const lineTotal = Number(item.quantityOrdered) * Number(item.unitPrice);
      totalAmount += lineTotal;
      return {
        id: `poi-${Date.now()}-${idx}`,
        itemId: item.itemId,
        itemName: item.itemName,
        sku: item.sku,
        quantityOrdered: Number(item.quantityOrdered),
        quantityReceived: 0,
        unitPrice: Number(item.unitPrice),
        totalPrice: lineTotal
      };
    });

    const newPO: PurchaseOrder = {
      id: poId,
      poNumber,
      vendorId: `v-${Date.now()}`,
      vendorName,
      status: 'DRAFT',
      items: poItems,
      totalAmount,
      targetWarehouse: targetWarehouse || 'MAIN_WAREHOUSE',
      createdAt: new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      notes
    };

    db.purchaseOrders.set(poId, newPO);
    res.status(201).json({ success: true, message: `PO ${poNumber} generated in Draft status`, data: newPO });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/inventory/purchase-orders/:id/status - Progress PO lifecycle (Draft -> Sent -> Partially Received -> Fulfilled)
router.patch('/purchase-orders/:id/status', (req: Request, res: Response) => {
  try {
    const { status, receiveQtyMap } = req.body;
    const updated = db.transitionPurchaseOrder(req.params.id, status, receiveQtyMap);

    res.json({
      success: true,
      message: `Purchase order ${updated.poNumber} status transitioned to ${status}`,
      data: updated
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
