import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  X,
  Truck,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const PurchaseOrderModal: React.FC = () => {
  const {
    isPurchaseOrderOpen,
    setIsPurchaseOrderOpen,
    inventoryItems,
    createPurchaseOrder
  } = useHotel();

  const [vendorName, setVendorName] = useState('Aura Spa & Botanical Supplies');
  const [targetWarehouse, setTargetWarehouse] = useState<'MAIN_WAREHOUSE' | 'FLOOR_LINEN_CLOSET' | 'KITCHEN_PANTRY'>('MAIN_WAREHOUSE');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2025-10-21');
  const [notes, setNotes] = useState('Safety threshold replenishment.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lines, setLines] = useState<Array<{ itemId: string; qty: number; unitCost: number }>>([
    {
      itemId: inventoryItems[2]?.id || inventoryItems[0]?.id || '',
      qty: 250,
      unitCost: inventoryItems[2]?.unitCost || 8.50
    }
  ]);

  if (!isPurchaseOrderOpen) return null;

  const handleAddLine = () => {
    if (inventoryItems.length > 0) {
      setLines(prev => [
        ...prev,
        { itemId: inventoryItems[0].id, qty: 100, unitCost: inventoryItems[0].unitCost }
      ]);
    }
  };

  const handleRemoveLine = (idx: number) => {
    setLines(prev => prev.filter((_, i) => i !== idx));
  };

  const handleLineChange = (index: number, field: 'itemId' | 'qty' | 'unitCost', value: any) => {
    setLines(prev => {
      const copy = [...prev];
      if (field === 'itemId') {
        const item = inventoryItems.find(i => i.id === value);
        copy[index] = {
          ...copy[index],
          itemId: value,
          unitCost: item ? item.unitCost : copy[index].unitCost
        };
      } else {
        copy[index] = {
          ...copy[index],
          [field]: Number(value)
        };
      }
      return copy;
    });
  };

  const calculateTotal = () => {
    return lines.reduce((sum, l) => sum + (l.qty * l.unitCost), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    const poItems = lines.map(line => {
      const item = inventoryItems.find(i => i.id === line.itemId);
      return {
        itemId: line.itemId,
        itemName: item ? item.name : 'Unknown Item',
        sku: item ? item.sku : 'SKU-000',
        quantityOrdered: line.qty,
        unitPrice: line.unitCost
      };
    });

    setIsSubmitting(true);
    const success = await createPurchaseOrder({
      vendorName,
      targetWarehouse,
      expectedDeliveryDate,
      notes,
      items: poItems,
      totalAmount: calculateTotal()
    });
    setIsSubmitting(false);

    if (success) {
      setIsPurchaseOrderOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Purchase Order (PO)</h2>
              <p className="text-xs text-slate-500">Aurelia central warehouse logistics</p>
            </div>
          </div>
          <button
            onClick={() => setIsPurchaseOrderOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vendor</label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
              <select
                value={targetWarehouse}
                onChange={e => setTargetWarehouse(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              >
                <option value="MAIN_WAREHOUSE">Main Central Warehouse</option>
                <option value="FLOOR_LINEN_CLOSET">Floor Linen Closet</option>
                <option value="KITCHEN_PANTRY">Kitchen Pantry</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Line Items</label>
              <button
                type="button"
                onClick={handleAddLine}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {lines.map((line, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <select
                      value={line.itemId}
                      onChange={e => handleLineChange(idx, 'itemId', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800"
                    >
                      {inventoryItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      value={line.qty}
                      onChange={e => handleLineChange(idx, 'qty', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs text-slate-800 font-mono text-center"
                    />
                  </div>

                  <div className="w-20 font-mono text-right text-slate-700 font-bold">
                    AED {(line.qty * line.unitCost).toFixed(2)}
                  </div>

                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLine(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-600">Total Purchase Value:</span>
            <span className="font-mono font-bold text-slate-900 text-base">
              AED {calculateTotal().toLocaleString()}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsPurchaseOrderOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
