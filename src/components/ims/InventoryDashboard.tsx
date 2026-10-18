import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { InventoryCategory, InventoryItem, WarehouseLocationId, PurchaseOrderStatus } from '../../types/index.ts';
import {
  Boxes,
  Package,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowRightLeft,
  Truck,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  FileSpreadsheet,
  Building,
  Layers,
  ArrowUpRight,
  TrendingDown,
  ShieldAlert,
  Send,
  Calendar
} from 'lucide-react';

export const InventoryDashboard: React.FC = () => {
  const {
    inventoryItems,
    purchaseOrders,
    stockTransfers,
    consumptionLogs,
    metrics,
    selectedInventoryItem,
    setSelectedInventoryItem,
    openStockTransferModal,
    setIsPurchaseOrderOpen,
    transitionPOStatus,
    addToast
  } = useHotel();

  // Active sub-navigation tab matching RoomGrid
  const [subTab, setSubTab] = useState<'CATALOG' | 'MATRIX' | 'ALERTS' | 'POS' | 'TRANSFERS' | 'CONSUMPTION'>('CATALOG');
  
  // View mode: Grid Cards vs Data Table
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<WarehouseLocationId | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<InventoryCategory | 'ALL'>('ALL');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');

  // Location Hub items matching Floor Selector
  const locationList = [
    { id: 'ALL', name: 'All Warehouses', desc: '18 SKUs tracked', count: inventoryItems.length },
    { id: 'MAIN_WAREHOUSE', name: 'Central Depot', desc: 'Basement Store', count: inventoryItems.filter(i => (i.stockByLocation.MAIN_WAREHOUSE || 0) > 0).length },
    { id: 'FLOOR_LINEN_CLOSET', name: 'Floor Closets', desc: 'Floors 1-5 Closets', count: inventoryItems.filter(i => (i.stockByLocation.FLOOR_LINEN_CLOSET || 0) > 0).length },
    { id: 'KITCHEN_PANTRY', name: 'Kitchen Pantry', desc: 'Ground F&B Depot', count: inventoryItems.filter(i => (i.stockByLocation.KITCHEN_PANTRY || 0) > 0).length },
  ];

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

      // Location filter
      if (selectedLocation !== 'ALL') {
        const qtyInLoc = item.stockByLocation[selectedLocation] || 0;
        if (qtyInLoc === 0) return false;
      }

      // Stock status filter
      if (selectedStockStatus === 'OUT_OF_STOCK' && item.totalStock > 0) return false;
      if (selectedStockStatus === 'LOW_STOCK' && (item.totalStock === 0 || item.totalStock > item.minSafetyStock)) return false;
      if (selectedStockStatus === 'IN_STOCK' && item.totalStock <= item.minSafetyStock) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesSupplier = item.supplierName.toLowerCase().includes(q);
        const matchesCategory = (item.categoryLabel || item.category).toLowerCase().includes(q);
        return matchesName || matchesSku || matchesSupplier || matchesCategory;
      }

      return true;
    });
  }, [inventoryItems, selectedCategory, selectedLocation, selectedStockStatus, searchQuery]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    return inventoryItems.filter(i => i.totalStock <= i.minSafetyStock);
  }, [inventoryItems]);

  // Card status badge styling matching RoomGrid exactly:
  const getStockCardStyle = (item: InventoryItem) => {
    if (item.totalStock === 0) {
      return {
        container: 'bg-[#FEF2F2] border-[#FECDD3] hover:border-rose-400',
        badgeBg: 'bg-[#FEE2E2] text-[#B91C1C]',
        badgeText: 'Out of Stock',
        badgeIcon: AlertCircle,
        dotColor: 'bg-rose-600'
      };
    }
    if (item.totalStock <= item.minSafetyStock) {
      return {
        container: 'bg-[#FFFBEB] border-[#FDE68A] hover:border-amber-400',
        badgeBg: 'bg-[#FEF3C7] text-[#B45309]',
        badgeText: 'Low Stock',
        badgeIcon: AlertTriangle,
        dotColor: 'bg-amber-600'
      };
    }
    return {
      container: 'bg-[#F0FDF4] border-[#BBF7D0] hover:border-emerald-400',
      badgeBg: 'bg-[#DCFCE7] text-[#15803D]',
      badgeText: 'In Stock',
      badgeIcon: CheckCircle2,
      dotColor: 'bg-emerald-600'
    };
  };

  const handleExportAudit = () => {
    addToast({
      type: 'success',
      title: 'Inventory Audit Exported',
      message: 'Comprehensive stock ledger with 18 SKUs exported to CSV format.'
    });
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Sub Tabs & View Mode Strip (Matching RoomGrid navigation) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-6 text-xs font-semibold overflow-x-auto scrollbar-none">
          {[
            { id: 'CATALOG', label: 'Stock Catalog', count: inventoryItems.length },
            { id: 'MATRIX', label: 'Multi-Location Matrix', count: null },
            { id: 'ALERTS', label: 'Reorder Alerts', count: metrics.lowStockCount, badgeColor: 'bg-rose-500 text-white' },
            { id: 'POS', label: 'Purchase Orders', count: purchaseOrders.length, badgeColor: 'bg-purple-100 text-purple-700' },
            { id: 'TRANSFERS', label: 'Internal Transfers', count: stockTransfers.length },
            { id: 'CONSUMPTION', label: 'PMS Auto-Deductions', count: consumptionLogs.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`py-3 transition-colors relative whitespace-nowrap flex items-center gap-1.5 ${
                subTab === tab.id
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                  tab.badgeColor || (subTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500')
                }`}>
                  {tab.count}
                </span>
              )}
              {subTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* View mode toggle + Filters + Action Buttons */}
        <div className="flex items-center gap-2.5 pb-2 sm:pb-0">
          
          {/* Grid / List segmented toggle */}
          {subTab === 'CATALOG' && (
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
              <button
                onClick={() => setViewMode('GRID')}
                className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'GRID'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('LIST')}
                className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'LIST'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          )}

          {/* Export Audit button */}
          <button
            onClick={handleExportAudit}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1 text-xs font-medium"
            title="Export CSV Audit"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Transfer Stock Shortcut */}
          <button
            onClick={() => openStockTransferModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
            <span>Transfer</span>
          </button>

          {/* Primary New PO Action */}
          <button
            onClick={() => setIsPurchaseOrderOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New PO</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Location Hub Bar (Like Floor Selector in RoomGrid) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {locationList.map(loc => {
          const isSelected = selectedLocation === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc.id as any)}
              className={`px-3.5 py-2 rounded-xl text-left border transition-all shrink-0 flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                <Building className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                    {loc.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">({loc.count})</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">{loc.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Global Filters Strip: Search + Category + Stock Status */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU, product name, barcode, or vendor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-lg pl-8 pr-12 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="ROOM_AMENITIES">Room Amenities</option>
              <option value="CLEANING_SUPPLIES">Cleaning Supplies</option>
              <option value="FNB_SUPPLIES">F&B Supplies</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OFFICE_SUPPLIES">Office Supplies</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Stock Status Filter */}
          <div className="relative">
            <select
              value={selectedStockStatus}
              onChange={e => setSelectedStockStatus(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock Only</option>
              <option value="LOW_STOCK">Low Stock (Reorder)</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset Filters shortcut */}
          {(selectedCategory !== 'ALL' || selectedStockStatus !== 'ALL' || selectedLocation !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedStockStatus('ALL');
                setSelectedLocation('ALL');
                setSearchQuery('');
              }}
              className="px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Reset
            </button>
          )}

        </div>

      </div>

      {/* 4. MAIN CONTENT ROUTER ACCORDING TO ACTIVE SUBTAB */}

      {/* VIEW A: STOCK CATALOG (Grid or List View) */}
      {subTab === 'CATALOG' && (
        <>
          {viewMode === 'GRID' ? (
            /* 4-column Card Grid matching RoomGrid style */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredItems.map(item => {
                const style = getStockCardStyle(item);
                const BadgeIcon = style.badgeIcon;
                const isSelected = selectedInventoryItem?.id === item.id;
                const progressPct = Math.min(100, Math.round((item.totalStock / (item.targetStockLevel || item.minSafetyStock * 2)) * 100));

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedInventoryItem(item)}
                    className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs ${
                      style.container
                    } ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-md border-blue-500 scale-[1.01]'
                        : 'hover:shadow-sm hover:border-slate-300'
                    }`}
                  >
                    {/* Top Row: SKU, Category icon & Status Pill */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                            {item.sku}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {item.categoryLabel || item.category}
                          </span>
                        </div>

                        {/* Status pill */}
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${style.badgeBg}`}>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{style.badgeText}</span>
                        </div>
                      </div>

                      {/* Item Name & Specs */}
                      <div className="mb-3">
                        <div className="font-bold text-slate-900 text-sm line-clamp-1">{item.name}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                          {item.specs || item.description || 'Hotel Grade Inventory'}
                        </div>
                      </div>

                      {/* Stock Level Gauge */}
                      <div className="bg-white/90 border border-slate-200/80 rounded-lg p-2.5 mb-2.5 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Total Quantity</span>
                          <span className="font-bold font-mono text-slate-900">
                            {item.totalStock} <span className="text-[10px] font-normal text-slate-500">{item.unit}s</span>
                          </span>
                        </div>

                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                          <div
                            className={`h-full ${
                              item.totalStock === 0 ? 'bg-rose-500 w-0' : item.totalStock <= item.minSafetyStock ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(4, progressPct)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Min: {item.minSafetyStock}</span>
                          <span>Target: {item.targetStockLevel || item.minSafetyStock * 2}</span>
                        </div>
                      </div>

                      {/* Location distribution chips */}
                      <div className="grid grid-cols-3 gap-1 text-[10px] text-center mb-2.5">
                        <div className="bg-white/80 border border-slate-200 rounded p-1">
                          <div className="text-slate-400">Whse</div>
                          <div className="font-mono font-bold text-slate-800">{item.stockByLocation.MAIN_WAREHOUSE}</div>
                        </div>
                        <div className="bg-white/80 border border-slate-200 rounded p-1">
                          <div className="text-slate-400">Closet</div>
                          <div className="font-mono font-bold text-slate-800">{item.stockByLocation.FLOOR_LINEN_CLOSET}</div>
                        </div>
                        <div className="bg-white/80 border border-slate-200 rounded p-1">
                          <div className="text-slate-400">Kitchen</div>
                          <div className="font-mono font-bold text-slate-800">{item.stockByLocation.KITCHEN_PANTRY}</div>
                        </div>
                      </div>

                      {/* Pricing & Supplier line */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60 text-slate-500">
                        <span>Cost: <strong className="font-mono font-bold text-slate-800">AED {item.unitCost.toFixed(2)}</strong></span>
                        <span className="font-mono text-emerald-700 font-semibold">AED {(item.totalStock * item.unitCost).toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Quick Action Footer */}
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openStockTransferModal(item);
                        }}
                        className="flex-1 py-1 px-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                        <span>Transfer</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPurchaseOrderOpen(true);
                        }}
                        className="flex-1 py-1 px-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Data Table View */
            <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-3 text-center">Main Whse</th>
                      <th className="py-3 px-3 text-center">Floor Closets</th>
                      <th className="py-3 px-3 text-center">Kitchen</th>
                      <th className="py-3 px-4 text-right">Total Stock</th>
                      <th className="py-3 px-4 text-right">Unit Cost</th>
                      <th className="py-3 px-4 text-right">Valuation</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredItems.map(item => {
                      const style = getStockCardStyle(item);
                      const BadgeIcon = style.badgeIcon;
                      const isSelected = selectedInventoryItem?.id === item.id;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedInventoryItem(item)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{item.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.sku}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                              {item.categoryLabel || item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-medium">
                            {item.stockByLocation.MAIN_WAREHOUSE}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-medium">
                            {item.stockByLocation.FLOOR_LINEN_CLOSET}
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-medium">
                            {item.stockByLocation.KITCHEN_PANTRY}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                            {item.totalStock} {item.unit}s
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">
                            AED {item.unitCost.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                            AED {(item.totalStock * item.unitCost).toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.badgeBg}`}>
                              <BadgeIcon className="w-2.5 h-2.5" />
                              <span>{style.badgeText}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => openStockTransferModal(item)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-md text-[11px] font-semibold transition-colors"
                              >
                                Transfer
                              </button>
                              <button
                                onClick={() => setSelectedInventoryItem(item)}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-[11px] font-semibold transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* VIEW B: MULTI-LOCATION MATRIX */}
      {subTab === 'MATRIX' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cross-Warehouse Stock Distribution</h3>
              <p className="text-xs text-slate-500">Live multi-location counts comparing depot holdings and service stations</p>
            </div>
            <button
              onClick={() => openStockTransferModal()}
              className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 self-start"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Initiate Internal Transfer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-4">Central Depot (Basement)</th>
                  <th className="py-3 px-4">Floor Linen Closets (1-5)</th>
                  <th className="py-3 px-4">Kitchen & Pantry</th>
                  <th className="py-3 px-4 text-right">Combined Total</th>
                  <th className="py-3 px-4 text-center">Transfer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.name}
                      <span className="block text-[10px] text-slate-400 font-mono font-normal">{item.sku}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.stockByLocation.MAIN_WAREHOUSE} {item.unit}s
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.stockByLocation.FLOOR_LINEN_CLOSET} {item.unit}s
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.stockByLocation.KITCHEN_PANTRY} {item.unit}s
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">
                      {item.totalStock} {item.unit}s
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openStockTransferModal(item)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-md text-[11px] font-semibold transition-colors"
                      >
                        Rebalance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW C: REORDER ALERTS */}
      {subTab === 'ALERTS' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Automated Safety Reorder Thresholds:</strong> Highlighting items where total stock is at or below defined safety margins.
              </span>
            </div>
            <button
              onClick={() => setIsPurchaseOrderOpen(true)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0"
            >
              Batch Reorder PO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white border border-rose-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {item.sku}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      CRITICAL REORDER
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.specs || item.description}</p>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400">Current Stock</div>
                      <div className="font-bold text-rose-600 text-sm">{item.totalStock} {item.unit}s</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Safety Buffer</div>
                      <div className="font-bold text-slate-700 text-sm">{item.minSafetyStock} {item.unit}s</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Target Level</div>
                      <div className="font-bold text-emerald-600 text-sm">{item.targetStockLevel || item.minSafetyStock * 2} {item.unit}s</div>
                    </div>
                  </div>

                  <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Vendor: <strong className="text-slate-800">{item.supplierName}</strong></span>
                    <span>Lead Time: <strong className="text-slate-800">{item.leadTime || '3-5 days'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => openStockTransferModal(item)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Transfer Stock
                  </button>
                  <button
                    onClick={() => setIsPurchaseOrderOpen(true)}
                    className="flex-1 py-1.5 px-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Generate PO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW D: PURCHASE ORDERS */}
      {subTab === 'POS' && (
        <div className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Procurement & Purchase Orders (PO)</h3>
              <p className="text-xs text-slate-500">Track supplier contracts, delivery statuses, and warehouse receiving dock</p>
            </div>
            <button
              onClick={() => setIsPurchaseOrderOpen(true)}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Purchase Order</span>
            </button>
          </div>

          <div className="space-y-3">
            {purchaseOrders.map(po => {
              const isFulfilled = po.status === 'FULFILLED';
              const isSent = po.status === 'SENT';

              return (
                <div key={po.id} className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {po.poNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isFulfilled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isSent
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {po.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Vendor: <strong className="text-slate-800">{po.vendorName}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Total:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">AED {po.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Target Warehouse:</span>
                      <span className="font-semibold text-slate-800 ml-1">{po.targetWarehouse.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Expected Delivery:</span>
                      <span className="font-semibold text-slate-800 ml-1 font-mono">{po.expectedDeliveryDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Line Items:</span>
                      <span className="font-semibold text-slate-800 ml-1">{po.items?.length || 1} SKUs</span>
                    </div>
                    <div className="flex justify-end">
                      {isSent && (
                        <button
                          onClick={() => transitionPOStatus(po.id, 'FULFILLED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                        >
                          Receive & Restock to Warehouse
                        </button>
                      )}
                      {isFulfilled && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Restocked into Depot
                        </span>
                      )}
                    </div>
                  </div>

                  {po.items && po.items.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-2.5 text-[11px] divide-y divide-slate-100">
                      {po.items.map(item => (
                        <div key={item.id} className="py-1 flex items-center justify-between">
                          <span className="font-medium text-slate-800">{item.itemName} ({item.sku})</span>
                          <span className="font-mono text-slate-600">{item.quantityOrdered} units @ AED {item.unitPrice.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW E: INTERNAL TRANSFERS AUDIT */}
      {subTab === 'TRANSFERS' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Internal Stock Movement Log</h3>
              <p className="text-xs text-slate-500">Full audit trail of goods transferred between Central Depot, Floor Closets, and Kitchen</p>
            </div>
            <button
              onClick={() => openStockTransferModal()}
              className="px-3 py-1.5 bg-[#2563EB] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>New Transfer</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Transfer Ref</th>
                  <th className="py-3 px-4">Item & Quantity</th>
                  <th className="py-3 px-4">Origin Store</th>
                  <th className="py-3 px-4">Destination Store</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Operator</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockTransfers.map(trf => (
                  <tr key={trf.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{trf.reference}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{trf.itemName}</div>
                      <div className="text-[11px] text-slate-500 font-mono font-bold">Qty: {trf.quantity} units</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium">
                        {trf.fromLocation.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">
                        {trf.toLocation.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{trf.reason}</td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{trf.transferredBy}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {new Date(trf.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW F: PMS AUTO-DEDUCTIONS */}
      {subTab === 'CONSUMPTION' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>PMS Front Desk to IMS Automated Consumption Linkage</span>
            </div>
            <p className="text-blue-700 leading-relaxed">
              When front desk agents check in guests to rooms (e.g. Deluxe Suite 502), the system automatically deducts corresponding linens, toiletries, and minibar items from the floor linen closet, maintaining accurate real-time inventory balances without manual data entry.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Event / Trigger</th>
                  <th className="py-3 px-4">Room Number</th>
                  <th className="py-3 px-4">Item Consumed</th>
                  <th className="py-3 px-4 text-center">Quantity Deducted</th>
                  <th className="py-3 px-4">Source Closet</th>
                  <th className="py-3 px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {consumptionLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>Guest Check-In</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">Room {log.roomNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.itemName}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                      -{log.quantity} units
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      Floor {Math.floor(Number(log.roomNumber || 100) / 100)} Linen Closet
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
