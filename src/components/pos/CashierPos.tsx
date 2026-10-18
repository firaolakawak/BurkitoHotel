import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { POS_MENU_ITEMS, PosMenuItem, PosOrderItem } from '../../data/posMenuData.ts';
import {
  Utensils,
  Bell,
  ShoppingBag,
  Wine,
  Users,
  Sparkles,
  Search,
  Heart,
  Pencil,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Printer,
  CreditCard,
  Banknote,
  Bed,
  Wallet,
  MoreHorizontal,
  ArrowRight,
  Coffee,
  Soup,
  Salad,
  Pizza,
  Flame,
  Fish,
  Cake,
  GlassWater,
  Star,
  Leaf,
  X,
  Share2,
  Percent,
  Receipt
} from 'lucide-react';

export const CashierPos: React.FC = () => {
  const { rooms, postPosCharge, addToast } = useHotel();

  // Dining Mode (Top Horizontal Bar)
  const [diningMode, setDiningMode] = useState<'DINE_IN' | 'ROOM_SERVICE' | 'TAKE_AWAY' | 'POOL_BAR' | 'BANQUET' | 'MINI_BAR'>('DINE_IN');

  // Selected Category (Left Vertical Menu)
  const [selectedCategory, setSelectedCategory] = useState<string>('All Menu Items');

  // Quick Tag Filter (Above Menu Grid)
  const [tagFilter, setTagFilter] = useState<'ALL' | "Chef's Special" | 'Vegetarian' | 'Spicy' | 'Gluten Free'>('ALL');

  // Search Input
  const [searchQuery, setSearchQuery] = useState('');

  // Table & Guest State
  const [selectedTable, setSelectedTable] = useState<string>('12');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [guestRoomNumber, setGuestRoomNumber] = useState<string>('502');
  const [guestName, setGuestName] = useState<string>('Sarah Jenkins');
  const [isChangeTableOpen, setIsChangeTableOpen] = useState(false);

  // Cart Tab: 'Current Order' vs 'Guest Details'
  const [cartTab, setCartTab] = useState<'ORDER' | 'GUEST'>('ORDER');

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'ROOM_CHARGE' | 'OTHER'>('CARD');

  // Add Note Modal
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // Initial Cart matching the attached reference image!
  const [orderItems, setOrderItems] = useState<PosOrderItem[]>([
    {
      id: 'ord-1',
      menuItem: POS_MENU_ITEMS.find(m => m.name === 'Margherita Pizza') || POS_MENU_ITEMS[1],
      quantity: 1,
      note: 'Regular'
    },
    {
      id: 'ord-2',
      menuItem: POS_MENU_ITEMS.find(m => m.name === 'Grilled Salmon') || POS_MENU_ITEMS[2],
      quantity: 2,
      note: 'No sauce, extra vegetables'
    },
    {
      id: 'ord-3',
      menuItem: POS_MENU_ITEMS.find(m => m.name === 'Caesar Salad') || POS_MENU_ITEMS[3],
      quantity: 1,
      note: 'Regular'
    },
    {
      id: 'ord-4',
      menuItem: POS_MENU_ITEMS.find(m => m.name === 'Fresh Orange Juice') || POS_MENU_ITEMS[12],
      quantity: 2,
      note: 'AED 12.00 each'
    }
  ]);

  // Categories list matching screenshot
  const categories = [
    { id: 'All Menu Items', label: 'All Menu Items', icon: Utensils, color: 'text-blue-600' },
    { id: 'Breakfast', label: 'Breakfast', icon: Coffee, color: 'text-amber-500' },
    { id: 'Starters', label: 'Starters', icon: Soup, color: 'text-rose-500' },
    { id: 'Soups', label: 'Soups', icon: Coffee, color: 'text-amber-600' },
    { id: 'Salads', label: 'Salads', icon: Salad, color: 'text-emerald-500' },
    { id: 'Main Course', label: 'Main Course', icon: Utensils, color: 'text-rose-600' },
    { id: 'Pizza & Pasta', label: 'Pizza & Pasta', icon: Pizza, color: 'text-amber-600' },
    { id: 'Grill & Barbecue', label: 'Grill & Barbecue', icon: Flame, color: 'text-orange-500' },
    { id: 'Seafood', label: 'Seafood', icon: Fish, color: 'text-blue-500' },
    { id: 'Asian Cuisine', label: 'Asian Cuisine', icon: Utensils, color: 'text-rose-500' },
    { id: 'Vegetarian', label: 'Vegetarian', icon: Leaf, color: 'text-emerald-600' },
    { id: 'Desserts', label: 'Desserts', icon: Cake, color: 'text-rose-400' },
    { id: 'Beverages', label: 'Beverages', icon: GlassWater, color: 'text-cyan-500' },
    { id: 'Kids Menu', label: 'Kids Menu', icon: Star, color: 'text-yellow-500' },
  ];

  // Filter menu items
  const filteredMenuItems = useMemo(() => {
    return POS_MENU_ITEMS.filter(item => {
      // Category filter
      if (selectedCategory !== 'All Menu Items') {
        if (selectedCategory === 'Vegetarian') {
          if (!item.isVegetarian) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Tag filter
      if (tagFilter !== 'ALL') {
        if (tagFilter === 'Vegetarian' && !item.isVegetarian) return false;
        if (tagFilter === 'Spicy' && !item.isSpicy) return false;
        if (tagFilter === "Chef's Special" && item.tag !== "Chef's Special") return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesDesc;
      }

      return true;
    });
  }, [selectedCategory, tagFilter, searchQuery]);

  // Cart Management
  const handleAddToCart = (menuItem: PosMenuItem) => {
    setOrderItems(prev => {
      const existingIndex = prev.findIndex(item => item.menuItem.id === menuItem.id);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: copy[existingIndex].quantity + 1
        };
        return copy;
      }
      return [
        ...prev,
        {
          id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          menuItem,
          quantity: 1,
          note: menuItem.defaultNote || 'Regular'
        }
      ];
    });

    addToast({
      type: 'info',
      title: 'Item Added',
      message: `${menuItem.name} added to Table ${selectedTable} order.`
    });
  };

  const handleUpdateQty = (orderId: string, delta: number) => {
    setOrderItems(prev =>
      prev
        .map(item => {
          if (item.id === orderId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as PosOrderItem[]
    );
  };

  const handleRemoveItem = (orderId: string) => {
    setOrderItems(prev => prev.filter(i => i.id !== orderId));
  };

  // Calculations matching screenshot
  const subtotal = useMemo(() => {
    return orderItems.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  }, [orderItems]);

  const serviceCharge = Number((subtotal * 0.10).toFixed(2));
  const tourismFee = orderItems.length > 0 ? 15.00 : 0.00;
  const vat = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + serviceCharge + tourismFee + vat).toFixed(2));

  // Complete Order
  const handleCompleteOrder = async () => {
    if (orderItems.length === 0) {
      addToast({ type: 'warning', title: 'Empty Order', message: 'Please add items to complete order.' });
      return;
    }

    if (paymentMethod === 'ROOM_CHARGE') {
      await postPosCharge({
        roomNumber: guestRoomNumber,
        category: 'FOOD_BEVERAGE',
        description: `Restaurant Order - Table ${selectedTable} (${orderItems.length} items)`,
        amount: total,
        serverName: 'Sarah Khan'
      });
    } else {
      addToast({
        type: 'success',
        title: 'Order Paid & Dispatched',
        message: `Order for Table ${selectedTable} (AED ${total.toFixed(2)}) settled via ${paymentMethod}. Kitchen KDS notified.`
      });
    }

    // Reset with confirmation
    setOrderItems([]);
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Dining Mode Tabs (Top Horizontal Bar) matching screenshot */}
      <div className="bg-white border border-slate-200/90 rounded-2xl px-4 py-1.5 shadow-xs flex items-center gap-6 overflow-x-auto scrollbar-none select-none">
        {[
          { id: 'DINE_IN', label: 'Dine In', icon: Utensils },
          { id: 'ROOM_SERVICE', label: 'Room Service', icon: Bell },
          { id: 'TAKE_AWAY', label: 'Take Away', icon: ShoppingBag },
          { id: 'POOL_BAR', label: 'Pool Bar', icon: Wine },
          { id: 'BANQUET', label: 'Banquet', icon: Users },
          { id: 'MINI_BAR', label: 'Mini Bar', icon: Sparkles }
        ].map(mode => {
          const Icon = mode.icon;
          const isActive = diningMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => {
                setDiningMode(mode.id as any);
                if (mode.id === 'ROOM_SERVICE') {
                  setPaymentMethod('ROOM_CHARGE');
                }
              }}
              className={`py-2 px-3 text-xs font-semibold flex items-center gap-2 relative whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{mode.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Main POS Workspace: Category Sidebar + Menu Grid + Right Cart Folio */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        
        {/* A. Category Sidebar (Vertical Left Menu) */}
        <div className="w-full lg:w-48 xl:w-52 bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs shrink-0 select-none space-y-0.5">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-3 border-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-600' : cat.color}`} />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* B. Center Menu Items Grid & Filter Bar */}
        <div className="flex-1 w-full space-y-3.5 min-w-0">
          
          {/* Filter Bar: Search + Quick Tags */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs">
            {/* Search menu items */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Quick Filter Tags matching screenshot */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <button
                onClick={() => setTagFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  tagFilter === 'ALL'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setTagFilter("Chef's Special")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  tagFilter === "Chef's Special"
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Chef's Special
              </button>

              <button
                onClick={() => setTagFilter('Vegetarian')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                  tagFilter === 'Vegetarian'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Leaf className="w-3 h-3 text-emerald-600" />
                <span>Vegetarian</span>
              </button>

              <button
                onClick={() => setTagFilter('Spicy')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                  tagFilter === 'Spicy'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flame className="w-3 h-3 text-rose-600" />
                <span>Spicy</span>
              </button>

              <button
                onClick={() => setTagFilter('Gluten Free')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap ${
                  tagFilter === 'Gluten Free'
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3 h-3 text-amber-500" />
                <span>Gluten Free</span>
              </button>
            </div>
          </div>

          {/* 4-Column Food Menu Cards Grid matching screenshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredMenuItems.map(item => (
              <div
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group"
              >
                {/* Food Image with Favorite Heart Icon */}
                <div>
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToast({ type: 'info', title: 'Favorites', message: `${item.name} toggled in chef highlights` });
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 backdrop-blur-xs text-white/90 hover:text-rose-400 transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h4>
                        {item.isVegetarian && <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />}
                        {item.isSpicy && <Flame className="w-3 h-3 text-rose-600 shrink-0" />}
                      </div>
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                      AED {item.price.toFixed(2)}
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Tag Badge if available */}
                <div className="px-3 pb-3 pt-0">
                  {item.tag === "Chef's Special" && (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                      Chef's Special
                    </span>
                  )}
                  {item.tag === 'Vegetarian' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Leaf className="w-2.5 h-2.5" />
                      <span>Vegetarian</span>
                    </span>
                  )}
                  {item.tag === 'Spicy' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                      <Flame className="w-2.5 h-2.5" />
                      <span>Spicy</span>
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* C. Right-Hand Cart / Folio Panel matching screenshot */}
        <div className="w-full lg:w-[360px] xl:w-[390px] bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between shrink-0 select-none">
          
          <div>
            {/* Header: Table / Outlet info + Change Table Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">Table {selectedTable}</span>
                    <span className="text-slate-400 text-xs">›</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                      {diningMode === 'ROOM_SERVICE' ? 'Room Service' : 'Dine In'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {diningMode === 'ROOM_SERVICE' ? `Room ${guestRoomNumber} (${guestName})` : `${guestCount} Guests`}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChangeTableOpen(true)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-blue-600 transition-colors"
              >
                Change Table
              </button>
            </div>

            {/* Sub-tabs: Current Order vs Guest Details */}
            <div className="flex border-b border-slate-200 mt-3 text-xs font-semibold">
              <button
                onClick={() => setCartTab('ORDER')}
                className={`py-2 px-3 transition-colors relative ${
                  cartTab === 'ORDER' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Current Order ({orderItems.length})</span>
                {cartTab === 'ORDER' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setCartTab('GUEST')}
                className={`py-2 px-3 transition-colors relative ${
                  cartTab === 'GUEST' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Guest Details</span>
                {cartTab === 'GUEST' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            </div>

            {/* Order Items List */}
            {cartTab === 'ORDER' ? (
              <div className="py-2 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {orderItems.length > 0 ? (
                  orderItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-none"
                    >
                      {/* Left: Qty Badge + Title & Modifiers */}
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-mono font-bold text-slate-800 text-xs shrink-0 mt-0.5">
                          {item.quantity}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{item.menuItem.name}</div>
                          {item.note && (
                            <div className="text-[10px] text-slate-400 truncate">{item.note}</div>
                          )}
                        </div>
                      </div>

                      {/* Right: Price + Edit / Trash Icons */}
                      <div className="flex items-center gap-2.5 shrink-0 pl-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          AED {(item.menuItem.price * item.quantity).toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => {
                            const newQty = prompt(`Update quantity for ${item.menuItem.name}:`, String(item.quantity));
                            if (newQty && Number(newQty) > 0) {
                              handleUpdateQty(item.id, Number(newQty) - item.quantity);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          title="Edit Quantity"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-rose-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No items in current order. Click any dish to add.
                  </div>
                )}

                {/* + Add Note Bar Button */}
                <button
                  onClick={() => setIsNoteModalOpen(true)}
                  className="w-full py-2 bg-blue-50/60 hover:bg-blue-50 border border-blue-200/60 rounded-xl text-blue-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{orderNote ? `Note: ${orderNote}` : 'Add Note'}</span>
                </button>
              </div>
            ) : (
              /* Guest Details Tab */
              <div className="p-3 bg-slate-50 rounded-xl mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Guest Name</span>
                  <span className="font-bold text-slate-900">{guestName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hotel Room</span>
                  <span className="font-bold text-blue-700 font-mono">Room {guestRoomNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">VIP Status</span>
                  <span className="font-bold text-amber-600">Gold Elite</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Folio Balance</span>
                  <span className="font-mono text-slate-700 font-semibold">AED 1,420.00</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Billing Summary & Checkout Controls */}
          <div className="pt-3 border-t border-slate-100 space-y-3 mt-2">
            
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-800">AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Service Charge (10%)</span>
                <span className="font-mono font-semibold text-slate-800">AED {serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Tourism Fee (AED 15)</span>
                <span className="font-mono font-semibold text-slate-800">AED {tourismFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>VAT (5%)</span>
                <span className="font-mono font-semibold text-slate-800">AED {vat.toFixed(2)}</span>
              </div>

              {/* Total Display */}
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                  AED {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick Actions Row 1: % Discount + Split Bill + Print Bill */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addToast({ type: 'info', title: 'Discount', message: 'Applied 10% Hotel Resident Discount.' })}
                className="py-1.5 px-2 bg-blue-50/50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-blue-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Discount</span>
              </button>

              <button
                onClick={() => addToast({ type: 'info', title: 'Split Bill', message: 'Split into 2 equal folios (AED 110.42 each).' })}
                className="py-1.5 px-2 bg-blue-50/50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-blue-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Split Bill</span>
              </button>

              <button
                onClick={() => addToast({ type: 'success', title: 'Receipt Printed', message: `Printed guest receipt for Table ${selectedTable}.` })}
                className="py-1.5 px-2 bg-blue-50/50 hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-semibold text-blue-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>

            {/* Payment Method Row 2: Cash + Card (selected blue) + Room Charge */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'CASH'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Cash</span>
              </button>

              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod('ROOM_CHARGE')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'ROOM_CHARGE'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Bed className="w-4 h-4" />
                <span>Room Charge</span>
              </button>
            </div>

            {/* Secondary Row: Other Payment + More */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPaymentMethod('OTHER')}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  paymentMethod === 'OTHER'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-slate-500" />
                <span>Other Payment</span>
              </button>

              <button
                onClick={() => addToast({ type: 'info', title: 'Payment Options', message: 'Supports Apple Pay, Samsung Pay, Hotel Voucher, and City Ledger.' })}
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Big Complete Order Button matching screenshot green button */}
            <button
              onClick={handleCompleteOrder}
              className="w-full py-3 bg-[#059669] hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-colors shadow-sm active:scale-99"
            >
              <span>Complete Order</span>
              <span className="font-mono">AED {total.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

      {/* Change Table & Room Modal */}
      {isChangeTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="font-bold text-slate-900 text-base">Select Table or Room</div>
              <button onClick={() => setIsChangeTableOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Restaurant Table</label>
              <div className="grid grid-cols-4 gap-2">
                {['01', '04', '08', '12', '15', '18', '20', '24'].map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => setSelectedTable(tbl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      selectedTable === tbl
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Table {tbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Or Charge to Guest Room</label>
              <select
                value={guestRoomNumber}
                onChange={e => setGuestRoomNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                <option value="502">Room 502 (Executive Suite - Sarah Jenkins)</option>
                <option value="501">Room 501 (Deluxe King - Michael Scott)</option>
                <option value="408">Room 408 (Standard Double - Elena Rostova)</option>
                <option value="305">Room 305 (Executive Suite - David Miller)</option>
              </select>
            </div>

            <button
              onClick={() => setIsChangeTableOpen(false)}
              className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-sm p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-bold text-slate-900 text-sm">Add Kitchen Instruction</div>
              <button onClick={() => setIsNoteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={3}
              placeholder="e.g. Extra spicy, dressing on the side, allergic to peanuts..."
              value={orderNote}
              onChange={e => setOrderNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={() => setIsNoteModalOpen(false)}
              className="w-full py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
