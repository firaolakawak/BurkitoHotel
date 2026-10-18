import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { WarehouseLocationId } from '../../types/index.ts';
import {
  X,
  ArrowRightLeft,
  CheckCircle2
} from 'lucide-react';

export const StockTransferModal: React.FC = () => {
  const {
    isStockTransferOpen,
    setIsStockTransferOpen,
    stockTransferItem,
    inventoryItems,
    transferStock
  } = useHotel();

  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [fromLocation, setFromLocation] = useState<WarehouseLocationId>('MAIN_WAREHOUSE');
  const [toLocation, setToLocation] = useState<WarehouseLocationId>('FLOOR_LINEN_CLOSET');
  const [quantity, setQuantity] = useState<number>(10);
  const [reason, setReason] = useState<string>('Floor 5 morning replenishment');
  const [staffName, setStaffName] = useState<string>('Duty Inventory Supervisor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stockTransferItem) {
      setSelectedItemId(stockTransferItem.id);
    } else if (inventoryItems.length > 0) {
      setSelectedItemId(inventoryItems[0].id);
    }
  }, [stockTransferItem, inventoryItems, isStockTransferOpen]);

  if (!isStockTransferOpen) return null;

  const currentItem = inventoryItems.find(i => i.id === selectedItemId);
  const sourceStock = currentItem ? (currentItem.stockByLocation[fromLocation] || 0) : 0;
  const destStock = currentItem ? (currentItem.stockByLocation[toLocation] || 0) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    if (fromLocation === toLocation) {
      alert('Source and destination locations must be different.');
      return;
    }
    if (quantity <= 0) {
      alert('Please enter a valid transfer quantity.');
      return;
    }
    if (quantity > sourceStock) {
      alert(`Cannot transfer ${quantity} units. Only ${sourceStock} available in ${fromLocation}.`);
      return;
    }

    setIsSubmitting(true);
    const success = await transferStock({
      itemId: selectedItemId,
      fromLocation,
      toLocation,
      quantity,
      reason,
      staffName
    });
    setIsSubmitting(false);

    if (success) {
      setIsStockTransferOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Internal Stock Transfer</h2>
              <p className="text-xs text-slate-500">Transfer supplies to floor closets</p>
            </div>
          </div>
          <button
            onClick={() => setIsStockTransferOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item to Transfer</label>
            <select
              value={selectedItemId}
              onChange={e => setSelectedItemId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {inventoryItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku}) - {item.totalStock} total in stock
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Origin</label>
              <select
                value={fromLocation}
                onChange={e => setFromLocation(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              >
                <option value="MAIN_WAREHOUSE">Main Central Warehouse</option>
                <option value="FLOOR_LINEN_CLOSET">Floor Linen Closet</option>
                <option value="KITCHEN_PANTRY">Kitchen Pantry</option>
              </select>
              <div className="mt-1 text-[11px] text-slate-500">
                Stock: <strong className="text-slate-900 font-mono">{sourceStock}</strong>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Destination</label>
              <select
                value={toLocation}
                onChange={e => setToLocation(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              >
                <option value="FLOOR_LINEN_CLOSET">Floor Linen Closet</option>
                <option value="MAIN_WAREHOUSE">Main Central Warehouse</option>
                <option value="KITCHEN_PANTRY">Kitchen Pantry</option>
              </select>
              <div className="mt-1 text-[11px] text-slate-500">
                Stock: <strong className="text-slate-900 font-mono">{destStock}</strong>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Quantity</label>
            <input
              type="number"
              min="1"
              max={sourceStock || 1}
              required
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsStockTransferOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || quantity > sourceStock || fromLocation === toLocation}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Transferring...' : 'Execute Transfer'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
