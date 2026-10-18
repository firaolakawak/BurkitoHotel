import React from 'react';
import {
  Bed,
  Users,
  Sparkles,
  Wrench,
  Clock,
  CalendarDays
} from 'lucide-react';

export const MetricsBar: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {/* 1. Total Rooms */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
          <Bed className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Total Rooms</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">120</div>
        </div>
      </div>

      {/* 2. Occupied */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Occupied</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-slate-900 tracking-tight">78</span>
            <span className="text-[11px] font-medium text-slate-400">65%</span>
          </div>
        </div>
      </div>

      {/* 3. Available */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <Bed className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Available</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-600 tracking-tight">32</span>
            <span className="text-[11px] font-medium text-slate-400">27%</span>
          </div>
        </div>
      </div>

      {/* 4. Dirty */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Dirty</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-amber-600 tracking-tight">6</span>
            <span className="text-[11px] font-medium text-slate-400">5%</span>
          </div>
        </div>
      </div>

      {/* 5. Maintenance */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Maintenance</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-rose-600 tracking-tight">4</span>
            <span className="text-[11px] font-medium text-slate-400">3%</span>
          </div>
        </div>
      </div>

      {/* 6. Arrivals Today */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Arrivals Today</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">12</div>
        </div>
      </div>

      {/* 7. Departures Today */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3.5 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
          <CalendarDays className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-500">Departures Today</div>
          <div className="text-xl font-bold text-slate-900 tracking-tight">15</div>
        </div>
      </div>
    </div>
  );
};
