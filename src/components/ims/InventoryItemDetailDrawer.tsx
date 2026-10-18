import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { InventoryItem, WarehouseLocationId } from '../../types/index.ts';
import {
  X,
  Package,
  Boxes,
  Truck,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  DollarSign,
  Barcode,
  Layers,
  Sparkles,
  Phone,
  Mail,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

export const InventoryItemDetailDrawer: React.FC<Props> = ({ item, onClose }) => {
  const {
    openStockTransferModal,
    setIsPurchaseOrderOpen,
    stockTransfers,
    consumptionLogs,
    addToast
  } = useHotel();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LOCATIONS' | 'SUPPLIER' | 'CONSUMPTION'>('OVERVIEW');

  const isOutOfStock = item.totalStock === 0;
  const isLowStock = item.totalStock <= item.minSafetyStock;

  // Filter consumption logs related to this item
  const itemLogs = consumptionLogs.filter(
    log => log.itemId === item.id || log.itemName?.toLowerCase() === item.name.toLowerCase()
  );

  // Filter transfers related to this item
  const itemTransfers = stockTransfers.filter(
    trf => trf.itemId === item.id || trf.itemName?.toLowerCase() === item.name.toLowerCase()
  );

  // Get background gradient by category
  const getBannerGradient = () => {
    switch (item.category) {
      case 'ROOM_AMENITIES':
      case 'LINEN':
        return 'from-[#8B7355] via-[#A89078] to-[#D5C7B8]';
      case 'FNB_SUPPLIES':
      case 'FOOD_BEVERAGE':
        return 'from-[#60492C] via-[#856743] to-[#BFA888]';
      case 'CLEANING_SUPPLIES':
      case 'CLEANING_CHEMICALS':
        return 'from-[#2C5E7A] via-[#4882A3] to-[#86B4CE]';
      case 'MAINTENANCE':
        return 'from-[#4B5563] via-[#6B7280] to-[#9CA3AF]';
      default:
        return 'from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]';
    }
  };

  const stockPercent = Math.min(100, Math.round((item.totalStock / (item.targetStockLevel || item.minSafetyStock * 2.5)) * 100));

  return (
    <aside className="w-80 lg:w-96 bg-white border-l border-slate-200/90 flex flex-col shrink-0 h-full overflow-y-auto select-none shadow-sm z-20">
      
      {/* 1. Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">{item.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <span>{item.sku}</span>
              {item.locationShelf && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-slate-500 font-sans text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.locationShelf}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            isOutOfStock
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : isLowStock
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isOutOfStock ? 'bg-rose-600' : isLowStock ? 'bg-amber-600' : 'bg-emerald-600'
            }`} />
            <span>{isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}</span>
          </span>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Visual Banner / Asset Representation */}
      <div className="p-4 pb-0">
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
          <div className={`absolute inset-0 bg-gradient-to-tr ${getBannerGradient()} flex items-center justify-center`}>
            <div className="absolute inset-0 opacity-70 mix-blend-multiply bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-slate-800/40 to-slate-950/80" />
            <div className="relative z-10 text-center p-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mx-auto mb-2 text-white shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-white font-bold text-sm tracking-wide drop-shadow-sm">{item.name}</div>
              <div className="text-white/80 text-xs font-medium tracking-tight mt-0.5">
                {item.specs || item.categoryLabel || item.category}
              </div>
            </div>

            {/* Bottom Barcode pill */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono">
              <span className="flex items-center gap-1">
                <Barcode className="w-3 h-3" />
                {item.barcode || '123456789012'}
              </span>
              <span>Unit: {item.unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="px-5 pt-3 border-b border-slate-200 flex space-x-6 text-xs font-semibold">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'LOCATIONS', label: 'Locations' },
          { id: 'SUPPLIER', label: 'Supplier' },
          { id: 'CONSUMPTION', label: 'History' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 4. Tab Body */}
      <div className="p-5 flex-1 space-y-5">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <>
            {/* Stock Gauge Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Current Total Stock</span>
                <span className="text-slate-900 font-mono font-bold text-lg">
                  {item.totalStock} <span className="text-xs font-normal text-slate-500">{item.unit}s</span>
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isOutOfStock ? 'bg-rose-500 w-0' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.max(4, stockPercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>Safety Buffer: {item.minSafetyStock}</span>
                  <span>Target: {item.targetStockLevel || item.minSafetyStock * 2}</span>
                </div>
              </div>

              {isLowStock && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Reorder Recommended:</span> Stock is below the safety threshold of {item.minSafetyStock} units.
                  </div>
                </div>
              )}
            </div>

            {/* Financial & Logistics KPI Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
                  <span>Unit Cost</span>
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-base font-bold text-slate-900 font-mono mt-1">
                  AED {item.unitCost.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Per {item.unit}</div>
              </div>

              <div className="p-3 bg-white border border-slate-200/90 rounded-xl shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
                  <span>Total Value</span>
                  <Boxes className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-base font-bold text-emerald-600 font-mono mt-1">
                  AED {(item.totalStock * item.unitCost).toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Current inventory asset</div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Specifications</h4>
              <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 text-xs">
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-800">{item.categoryLabel || item.category}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-500">Specification</span>
                  <span className="font-semibold text-slate-800">{item.specs || 'Standard Hotel Grade'}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-500">Lead Time</span>
                  <span className="font-semibold text-slate-800">{item.leadTime || '3-5 business days'}</span>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-slate-500">Storage Shelf</span>
                  <span className="font-semibold text-slate-800 font-mono">{item.locationShelf || 'Main Store - Bay 1'}</span>
                </div>
              </div>
            </div>

            {/* PMS Auto-Deduction Rule */}
            {item.autoDeductOnCheckInQty && (
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>PMS Auto-Deduction Active</span>
                </div>
                <p className="text-blue-700 text-[11px] leading-relaxed">
                  When a guest checks in at the Front Desk, the system automatically deducts{' '}
                  <strong className="font-bold">{item.autoDeductOnCheckInQty} {item.unit}s</strong> from the corresponding floor closet.
                </p>
              </div>
            )}
          </>
        )}

        {/* LOCATIONS TAB */}
        {activeTab === 'LOCATIONS' && (
          <div className="space-y-3.5">
            <div className="text-xs text-slate-500 leading-relaxed">
              Stock distribution across property depots and service stations:
            </div>

            {/* Main Warehouse */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Main Central Warehouse</div>
                  <div className="text-[11px] text-slate-400">Basement receiving dock & store</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-slate-900">
                    {item.stockByLocation.MAIN_WAREHOUSE}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.unit}s</div>
                </div>
              </div>
              <button
                onClick={() => openStockTransferModal(item)}
                className="w-full mt-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                <span>Transfer from Main Store</span>
              </button>
            </div>

            {/* Floor Linen Closets */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Floor Linen Closets (Floors 1-5)</div>
                  <div className="text-[11px] text-slate-400">Housekeeping turnaround closets</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-slate-900">
                    {item.stockByLocation.FLOOR_LINEN_CLOSET}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.unit}s</div>
                </div>
              </div>
              <button
                onClick={() => openStockTransferModal(item)}
                className="w-full mt-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                <span>Replenish Floor Closet</span>
              </button>
            </div>

            {/* Kitchen & Pantry */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Kitchen & F&B Pantry</div>
                  <div className="text-[11px] text-slate-400">Ground floor culinary storeroom</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono text-slate-900">
                    {item.stockByLocation.KITCHEN_PANTRY}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.unit}s</div>
                </div>
              </div>
              <button
                onClick={() => openStockTransferModal(item)}
                className="w-full mt-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                <span>Transfer to/from Kitchen</span>
              </button>
            </div>
          </div>
        )}

        {/* SUPPLIER TAB */}
        {activeTab === 'SUPPLIER' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Primary Vendor</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{item.supplierName}</div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>orders@{item.supplierName.toLowerCase().replace(/[^a-z]/g, '')}.com</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+971 4 800 {Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Guaranteed Lead Time: {item.leadTime || '3-5 business days'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1.5">
              <div className="font-semibold text-slate-800">Purchasing Terms</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Standard Net-30 payment terms with free delivery on purchase orders exceeding AED 500. Automatic receiving invoice issued upon warehouse arrival.
              </p>
            </div>

            <button
              onClick={() => setIsPurchaseOrderOpen(true)}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Issue New Purchase Order</span>
            </button>
          </div>
        )}

        {/* CONSUMPTION & HISTORY TAB */}
        {activeTab === 'CONSUMPTION' && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700">Recent Automated Check-In Deductions</div>
            {itemLogs.length > 0 ? (
              <div className="space-y-2">
                {itemLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-0.5">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Room {log.roomNumber} Check-In</span>
                      <span className="text-rose-600 font-mono font-bold">-{log.quantity} {item.unit}s</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Auto-deducted from floor closet
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No recent front-desk deductions for this SKU.
              </div>
            )}

            <div className="text-xs font-bold text-slate-700 pt-2">Internal Warehouse Transfers</div>
            {itemTransfers.length > 0 ? (
              <div className="space-y-2">
                {itemTransfers.slice(0, 4).map(trf => (
                  <div key={trf.id} className="p-2.5 bg-white border border-slate-200/80 rounded-lg text-xs space-y-0.5 shadow-2xs">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{trf.reference}</span>
                      <span className="text-blue-600 font-mono font-bold">{trf.quantity} {item.unit}s</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {trf.fromLocation.replace(/_/g, ' ')} → {trf.toLocation.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(trf.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No transfer logs recorded.
              </div>
            )}
          </div>
        )}

      </div>

      {/* 5. Sticky Bottom Action Controls */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0 flex items-center gap-2.5 z-10">
        <button
          onClick={() => openStockTransferModal(item)}
          className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>Transfer Stock</span>
        </button>

        <button
          onClick={() => setIsPurchaseOrderOpen(true)}
          className="flex-1 py-2 px-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>New PO</span>
        </button>
      </div>

    </aside>
  );
};
