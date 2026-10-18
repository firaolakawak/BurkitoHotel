import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { PosProduct } from '../../types/index.ts';
import {
  UtensilsCrossed,
  Coffee,
  Wine,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  User,
  Search
} from 'lucide-react';

export const PosTerminal: React.FC = () => {
  const {
    posProducts,
    rooms,
    bookings,
    postPosCharge,
    openFolioModal
  } = useHotel();

  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'BREAKFAST' | 'DINING' | 'BEVERAGE' | 'SPA' | 'MINIBAR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Array<{ product: PosProduct; quantity: number }>>([]);
  const [targetRoomNumber, setTargetRoomNumber] = useState<string>('502');
  const [serverName, setServerName] = useState('Sarah Khan');
  const [isPosting, setIsPosting] = useState(false);

  const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED' && r.currentBookingId);

  const filteredProducts = posProducts.filter(p => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const addToCart = (product: PosProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as Array<{ product: PosProduct; quantity: number }>
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartTax = Number((cartSubtotal * 0.05).toFixed(2));
  const cartTotal = Number((cartSubtotal + cartTax).toFixed(2));

  const handlePostOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty. Please add items before posting charge.');
      return;
    }
    if (!targetRoomNumber) {
      alert('Please select a valid occupied guest room to charge.');
      return;
    }

    const itemNames = cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ');
    const primaryCategory = cart[0].product.category === 'SPA' ? 'SPA' : cart[0].product.category === 'MINIBAR' ? 'MINIBAR' : 'FOOD_BEVERAGE';

    setIsPosting(true);
    const success = await postPosCharge({
      roomNumber: targetRoomNumber,
      category: primaryCategory as any,
      description: itemNames,
      amount: cartTotal,
      serverName
    });
    setIsPosting(false);

    if (success) {
      setCart([]);
    }
  };

  const targetRoom = rooms.find(r => r.roomNumber === targetRoomNumber);
  const targetBooking = targetRoom?.currentBookingId ? bookings.find(b => b.id === targetRoom.currentBookingId) : null;
  const targetGuest = targetBooking?.guest;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Menu offerings */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food, beverage, or spa service..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Station: <strong className="text-slate-800">Aurelia In-Room Dining & Spa</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
            {[
              { id: 'ALL', label: 'All Items', icon: UtensilsCrossed },
              { id: 'BREAKFAST', label: 'Breakfast', icon: Coffee },
              { id: 'DINING', label: 'Dining', icon: UtensilsCrossed },
              { id: 'BEVERAGE', label: 'Beverage', icon: Wine },
              { id: 'SPA', label: 'Spa & Wellness', icon: Sparkles },
              { id: 'MINIBAR', label: 'Minibar', icon: ShoppingBag }
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white border border-slate-200/90 hover:border-blue-400 p-4 rounded-xl text-left transition-all hover:shadow-xs group flex flex-col justify-between"
            >
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
                  <span>{product.category}</span>
                  <span className="text-blue-600 group-hover:underline">+ Add</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1">{product.name}</h4>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  AED {product.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">Post to room</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart & Room Folio Posting */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Room Folio Order</h3>
            </div>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700">Target Guest Room</label>
            <select
              value={targetRoomNumber}
              onChange={e => setTargetRoomNumber(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-blue-700 focus:outline-none focus:border-blue-500"
            >
              {occupiedRooms.map(r => {
                const bk = bookings.find(b => b.id === r.currentBookingId);
                const g = bk?.guest;
                return (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} - {g ? `${g.firstName} ${g.lastName}` : 'Occupied Guest'}
                  </option>
                );
              })}
            </select>
            {targetGuest && (
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Guest: <strong>{targetGuest.firstName} {targetGuest.lastName}</strong></span>
              </div>
            )}
          </div>

          {/* Cart items */}
          <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
            {cart.map(item => (
              <div key={item.product.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex-1 mr-2">
                  <div className="font-semibold text-slate-800">{item.product.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">AED {item.product.price.toFixed(2)}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-slate-800 text-xs">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                Select items from the menu to charge directly to the guest room.
              </div>
            )}
          </div>
        </div>

        {/* Totals & Submit */}
        <div className="pt-3 border-t border-slate-200 space-y-3">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono">AED {cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>VAT (5%):</span>
              <span className="font-mono">AED {cartTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
              <span>Total Charge:</span>
              <span className="font-mono text-blue-600">AED {cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            disabled={cart.length === 0 || isPosting || !targetRoomNumber}
            onClick={handlePostOrder}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isPosting ? 'Posting Charge...' : `Post AED ${cartTotal.toFixed(2)} to Room ${targetRoomNumber}`}
          </button>
        </div>
      </div>
    </div>
  );
};
