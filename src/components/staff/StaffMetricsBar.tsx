import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  Users,
  UserCheck,
  Clock,
  UserPlus,
  Award,
  Sparkles
} from 'lucide-react';

export const StaffMetricsBar: React.FC = () => {
  const { employees } = useHotel();

  const totalStaff = 126;
  const onDutyToday = 92;
  const onLeave = 8;
  const openPositions = 6;
  const trainingDue = 14;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      
      {/* 1. Total Staff */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500">Total Staff</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{totalStaff}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +5%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Across all departments</div>
        </div>
      </div>

      {/* 2. On Duty Today */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500">On Duty Today</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{onDutyToday}</span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              73%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Currently working</div>
        </div>
      </div>

      {/* 3. On Leave */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500">On Leave</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-rose-600 tracking-tight">{onLeave}</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              6%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Approved leave</div>
        </div>
      </div>

      {/* 4. Open Positions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
          <UserPlus className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500">Open Positions</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-rose-600 tracking-tight">{openPositions}</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              -25%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Awaiting recruitment</div>
        </div>
      </div>

      {/* 5. Training Due */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-slate-500">Training Due</div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{trainingDue}</span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              12%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">Need attention</div>
        </div>
      </div>

    </div>
  );
};
