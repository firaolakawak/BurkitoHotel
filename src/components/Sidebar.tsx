import React from 'react';
import { useHotel } from '../context/HotelContext.tsx';
import {
  LayoutDashboard,
  Building2,
  Calendar,
  Users,
  Sparkles,
  Wrench,
  Package,
  ShoppingCart,
  UserCheck,
  Banknote,
  Store,
  TrendingUp,
  BarChart3,
  Settings,
  ChevronDown,
  Building
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, addToast } = useHotel();

  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'PMS_GRID', label: 'Front Desk', icon: Building2 },
    { id: 'RESERVATIONS', label: 'Reservations', icon: Calendar },
    { id: 'GUESTS', label: 'Guests', icon: Users },
    { id: 'HOUSEKEEPING', label: 'Housekeeping', icon: Sparkles },
    { id: 'INVENTORY', label: 'Inventory', icon: Package },
    { id: 'PURCHASING', label: 'Purchasing', icon: ShoppingCart },
    { id: 'STAFF', label: 'Staff Management', icon: UserCheck },
    { id: 'FINANCE', label: 'Finance', icon: Banknote },
    { id: 'POS', label: 'Cashier / POS', icon: Store },
    { id: 'OUTLETS', label: 'Sales & Outlets', icon: TrendingUp },
    { id: 'REPORTS', label: 'Reports', icon: BarChart3 },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-[#0B132B] text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800/60 select-none z-30">
      {/* Top Logo */}
      <div className="overflow-y-auto scrollbar-none flex-1">
        <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-800/40">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            {/* Aurelia stylized flower / crest */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-5 5m5-5l5 5M3 12h18m-18 0l5-5m-5 5l5 5m13-5l-5-5m5 5l-5 5" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold tracking-wider text-white uppercase">AURELIA</div>
            <div className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Hospitality Cloud</div>
          </div>
        </div>

        {/* Navigation list matching attached screenshot */}
        <nav className="p-2.5 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              (item.id === 'POS' && activeTab === 'POS') ||
              (item.id === 'STAFF' && activeTab === 'STAFF') ||
              (item.id === 'INVENTORY' && activeTab === 'INVENTORY') ||
              (item.id === 'PMS_GRID' && activeTab === 'PMS_GRID') ||
              (item.id === 'HOUSEKEEPING' && activeTab === 'HOUSEKEEPING') ||
              (item.id === 'REPORTS' && activeTab === 'BLUEPRINT');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'POS') {
                    setActiveTab('POS');
                  } else if (item.id === 'STAFF') {
                    setActiveTab('STAFF');
                  } else if (item.id === 'PMS_GRID' || item.id === 'DASHBOARD' || item.id === 'RESERVATIONS' || item.id === 'GUESTS') {
                    setActiveTab('PMS_GRID');
                  } else if (item.id === 'INVENTORY' || item.id === 'PURCHASING') {
                    setActiveTab('INVENTORY');
                  } else if (item.id === 'HOUSEKEEPING') {
                    setActiveTab('HOUSEKEEPING');
                  } else if (item.id === 'REPORTS' || item.id === 'FINANCE') {
                    setActiveTab('BLUEPRINT');
                  } else {
                    setActiveTab('POS');
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white font-semibold shadow-md shadow-blue-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Outlet Switcher matching Cashier POS screenshot */}
      <div className="p-3 border-t border-slate-800/60 bg-[#080E21] shrink-0">
        <div className="flex items-center gap-2.5 mb-2 px-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">Aurelia Grand Hotel</div>
            <div className="text-[10px] text-slate-400 truncate">Dubai, UAE</div>
          </div>
        </div>

        {/* Luxury Hotel Building Thumbnail Image */}
        <div className="mb-2 relative rounded-lg overflow-hidden h-14 w-full border border-slate-700/60">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&auto=format&fit=crop&q=80"
            alt="Aurelia Grand Hotel Dubai"
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        <button
          onClick={() => addToast({ type: 'info', title: 'Outlet Switcher', message: 'Current POS Station: Main Restaurant (Terminal 01)' })}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-1.5">
            <Store className="w-3 h-3 text-slate-400" />
            <span>Switch Outlet</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </aside>
  );
};
