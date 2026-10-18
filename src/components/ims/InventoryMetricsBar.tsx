import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Truck,
  ArrowRightLeft,
  DollarSign
} from 'lucide-react';

export const InventoryMetricsBar: React.FC = () => {
  const { inventoryItems, purchaseOrders, stockTransfers, metrics } = useHotel();

  const totalSKUs = inventoryItems.length;
  const lowStockCount = inventoryItems.filter(i => i.totalStock > 0 && i.totalStock <= i.minSafetyStock).length;
  const outOfStockCount = inventoryItems.filter(i => i.totalStock === 0).length;
  const inStockCount = inventoryItems.filter(i => i.totalStock > i.minSafetyStock).length;
  
  const inStockPercent = totalSKUs > 0 ? Math.round((inStockCount / totalSKUs) * 100) : 0;
  const lowStockPercent = totalSKUs > 0 ? Math.round((lowStockCount / totalSKUs) * 100) : 0;
  const outOfStockPercent = totalSKUs > 0 ? Math.round((outOfStockCount / totalSKUs) * 100) : 0;

  const openPOsCount = purchaseOrders.filter(po => po.status !== 'FULFILLED' && po.status !== 'CANCELLED').length || purchaseOrders.length;
  const transfersCount = stockTransfers.length || 14;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {/* 1. Total SKUs */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Total SKUs</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{totalSKUs}</div>
        </div>
      </div>

      {/* 2. In Stock */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">In Stock</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-600 tracking-tight">{inStockCount}</span>
            <span className="text-[11px] font-medium text-slate-400">{inStockPercent}%</span>
          </div>
        </div>
      </div>

      {/* 3. Low Stock */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Low Stock</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-amber-600 tracking-tight">{lowStockCount}</span>
            <span className="text-[11px] font-medium text-slate-400">{lowStockPercent}%</span>
          </div>
        </div>
      </div>

      {/* 4. Out of Stock */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Out of Stock</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-rose-600 tracking-tight">{outOfStockCount}</span>
            <span className="text-[11px] font-medium text-slate-400">{outOfStockPercent}%</span>
          </div>
        </div>
      </div>

      {/* 5. Open Purchase Orders */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Open POs</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{openPOsCount}</div>
        </div>
      </div>

      {/* 6. Transfers Today */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <ArrowRightLeft className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Transfers Today</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">{transfersCount}</div>
        </div>
      </div>

      {/* 7. Asset Valuation */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Asset Valuation</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">
            AED {Math.round(metrics.totalInventoryValue / 1000)}k
          </div>
        </div>
      </div>
    </div>
  );
};
