import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import {
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  MessageSquare,
  Plus,
  Command,
  Calendar
} from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, openBookingWizardForRoom, setIsAddStaffOpen, addToast } = useHotel();
  const [searchVal, setSearchVal] = useState('');

  const searchPlaceholder = activeTab === 'POS'
    ? 'Search guest, room, or order...'
    : activeTab === 'STAFF'
    ? 'Search staff, department, position, or ID...'
    : activeTab === 'INVENTORY'
    ? 'Search SKU, product name, barcode, or vendor...'
    : 'Search guest name, reservation, room, or folio...';

  const propertyName = activeTab === 'POS'
    ? 'Aurelia Grand Hotel - Main Restaurant'
    : 'Aurelia Grand Hotel';

  const userRole = activeTab === 'POS'
    ? 'Restaurant Cashier'
    : 'Hotel Manager';

  const notifCount = activeTab === 'POS' ? 3 : 2;
  const messageCount = activeTab === 'POS' ? 1 : 7;
  const timeString = activeTab === 'POS' ? ' 1:24 PM' : '';

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      
      {/* Left controls: Property selector + Date selector + Search input */}
      <div className="flex items-center gap-3 flex-1 max-w-3xl">
        
        {/* Property / Outlet Selector */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Outlet', message: `${propertyName} (Terminal 01)` })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-800 shrink-0"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>{propertyName}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Date & Time Selector */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shrink-0">
          <button
            onClick={() => addToast({ type: 'info', title: 'Date Navigator', message: 'Showing previous session' })}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 border-r border-slate-200 rounded-l-lg transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 text-slate-800 font-semibold select-none flex items-center gap-1.5">
            {activeTab === 'POS' && <Calendar className="w-3.5 h-3.5 text-slate-400" />}
            <span>Tue, 14 Oct 2025{timeString}</span>
          </span>
          <button
            onClick={() => addToast({ type: 'info', title: 'Date Navigator', message: 'Showing next session' })}
            className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 border-l border-slate-200 rounded-r-lg transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Search Bar with exact ⌘ K keyboard shortcut */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 rounded-lg pl-9 pr-12 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] text-slate-400 font-mono">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

      </div>

      {/* Right controls: Notifications + Chat + Sarah Khan User Profile */}
      <div className="flex items-center gap-3.5 shrink-0">
        
        {/* Notification Bell */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Notifications', message: `${notifCount} new operational alerts` })}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {notifCount}
          </span>
        </button>

        {/* Message / Chat */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Internal Messaging', message: `${messageCount} kitchen / cashier messages pending` })}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {messageCount}
          </span>
        </button>

        {/* Sarah Khan User Profile Avatar matching Image */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 ring-1 ring-slate-100 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Khan"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-slate-900 leading-none">Sarah Khan</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{userRole}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

      </div>
    </header>
  );
};
