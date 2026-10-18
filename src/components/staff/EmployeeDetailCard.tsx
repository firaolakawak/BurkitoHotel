import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Employee } from '../../types/index.ts';
import {
  X,
  Mail,
  Phone,
  Users,
  Briefcase,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  MoreHorizontal,
  UserCheck,
  CheckCircle2,
  CalendarDays,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface Props {
  employee: Employee;
  onClose?: () => void;
}

export const EmployeeDetailCard: React.FC<Props> = ({ employee, onClose }) => {
  const { addToast, updateEmployeeStatus } = useHotel();
  const [profileTab, setProfileTab] = useState<'OVERVIEW' | 'EMPLOYMENT' | 'ATTENDANCE' | 'PERFORMANCE'>('OVERVIEW');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'On Leave':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Suspended':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="w-full lg:w-[350px] xl:w-[370px] bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col shrink-0 select-none">
      
      {/* 1. Header with Close Button */}
      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 shrink-0">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 leading-tight">{employee.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(employee.status)}`}>
                {employee.status}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-medium mt-0.5">{employee.position}</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">{employee.employeeId}</div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Contact Pill Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <a
          href={`mailto:${employee.email}`}
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(employee.email);
            addToast({ type: 'info', title: 'Email Copied', message: `${employee.email} copied to clipboard.` });
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] text-slate-700 font-medium truncate transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{employee.email}</span>
        </a>

        <a
          href={`tel:${employee.phone}`}
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(employee.phone);
            addToast({ type: 'info', title: 'Phone Copied', message: `${employee.phone} copied to clipboard.` });
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] text-slate-700 font-medium truncate transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{employee.phone}</span>
        </a>
      </div>

      {/* 3. Sub Tabs */}
      <div className="border-b border-slate-200 mt-4 flex space-x-5 text-xs font-semibold">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'EMPLOYMENT', label: 'Employment' },
          { id: 'ATTENDANCE', label: 'Attendance' },
          { id: 'PERFORMANCE', label: 'Performance' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setProfileTab(tab.id as any)}
            className={`py-2 transition-colors relative ${
              profileTab === tab.id
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {profileTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 4. Tab Body Content */}
      <div className="mt-4 flex-1 space-y-4">
        {profileTab === 'OVERVIEW' && (
          <>
            {/* 2x2 Info Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* Department */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium">Department</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{employee.department}</div>
                </div>
              </div>

              {/* Work Type */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium">Work Type</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{employee.workType}</div>
                </div>
              </div>

              {/* Hire Date */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium">Hire Date</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{employee.joinDate}</div>
                  <div className="text-[10px] text-slate-400">{employee.tenure}</div>
                </div>
              </div>

              {/* Manager */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={employee.managerAvatar}
                    alt={employee.managerName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400 font-medium">Manager</div>
                  <div className="text-xs font-bold text-slate-900 truncate">{employee.managerName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{employee.managerPosition}</div>
                </div>
              </div>

            </div>

            {/* Recent Activity Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold text-slate-900">Recent Activity</h4>
                <button
                  onClick={() => addToast({ type: 'info', title: 'Activity Log', message: `Full audit history for ${employee.name}` })}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View all
                </button>
              </div>

              <div className="space-y-3 pl-1">
                {employee.activities.map((act) => {
                  const dotColor =
                    act.type === 'checkin'
                      ? 'bg-emerald-500 ring-emerald-100'
                      : act.type === 'schedule'
                      ? 'bg-blue-500 ring-blue-100'
                      : act.type === 'training'
                      ? 'bg-purple-500 ring-purple-100'
                      : 'bg-amber-500 ring-amber-100';

                  return (
                    <div key={act.id} className="flex items-start gap-2.5 text-xs">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ring-4 ${dotColor} shrink-0`} />
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-slate-800">{act.title}</span>
                          <span className="text-[11px] text-slate-400">{act.time}</span>
                        </div>
                        {act.details && (
                          <div className="text-[11px] text-slate-500 mt-0.5">{act.details}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {profileTab === 'EMPLOYMENT' && (
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="text-slate-400 text-[10px]">Employment Agreement</div>
              <div className="font-semibold text-slate-900">Standard Hotel Executive Contract</div>
              <div className="text-slate-500 text-[11px]">Probation completed: Yes • Net-30 payroll direct deposit</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="text-slate-400 text-[10px]">Work Location</div>
              <div className="font-semibold text-slate-900">Aurelia Grand Hotel Dubai, UAE</div>
              <div className="text-slate-500 text-[11px]">Front Office & Management Suites, Floor 1</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="text-slate-400 text-[10px]">Assigned Shift</div>
              <div className="font-semibold text-slate-900">{employee.shift || 'Morning (07:00 - 15:30)'}</div>
              <div className="text-slate-500 text-[11px]">5 Days / Week • 2 Floating Rest Days</div>
            </div>
          </div>
        )}

        {profileTab === 'ATTENDANCE' && (
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
              <div className="flex items-center justify-between font-bold">
                <span>Today's Status</span>
                <span className="text-emerald-700">{employee.todayAttendance?.status || 'Checked In'}</span>
              </div>
              <div className="text-[11px] text-emerald-800">
                Clocked in at {employee.todayAttendance?.time || '08:02 AM'} via RFID Keycard Turnstile
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="font-bold text-slate-700">Monthly Attendance Record</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 text-[10px]">On-Time</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">98%</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Leaves Used</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">4 / 28</div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <div className="text-slate-400 text-[10px]">Overtime</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">12 hrs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {profileTab === 'PERFORMANCE' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <div className="flex items-center justify-between font-bold">
                <span>Annual Review Rating</span>
                <span className="text-blue-700 text-sm">4.9 / 5.0 ★</span>
              </div>
              <div className="text-[11px] text-blue-800">
                Top 5% Executive Performance: Guest satisfaction score 96%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Leadership & Delegation</span>
                <span className="font-bold text-slate-900">5.0</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-full" />
              </div>

              <div className="flex items-center justify-between text-slate-600 pt-1">
                <span>Guest Incident Resolution</span>
                <span className="font-bold text-slate-900">4.8</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[96%]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom 6 Quick Action Buttons (3 cols x 2 rows) matching screenshot */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 mt-4 text-center">
        
        {/* Edit Profile */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Edit Profile', message: `Editing profile details for ${employee.name}` })}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-semibold">Edit Profile</span>
        </button>

        {/* Schedule */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Roster / Schedule', message: `Opening shift planner for ${employee.name}` })}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <CalendarDays className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-semibold">Schedule</span>
        </button>

        {/* Assign Training */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Training Module', message: `Assigned Luxury Guest Hospitality module to ${employee.name}` })}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-semibold">Assign Training</span>
        </button>

        {/* Add Leave */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Leave Application', message: `New leave request form opened for ${employee.name}` })}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-semibold">Add Leave</span>
        </button>

        {/* View Performance */}
        <button
          onClick={() => addToast({ type: 'info', title: 'Performance Metrics', message: `Loading scorecard for ${employee.name}` })}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-[10px] font-semibold">Performance</span>
        </button>

        {/* More Actions */}
        <button
          onClick={() => {
            const nextStatus = employee.status === 'Active' ? 'On Leave' : employee.status === 'On Leave' ? 'Suspended' : 'Active';
            updateEmployeeStatus(employee.id, nextStatus as any);
          }}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 flex flex-col items-center justify-center gap-1 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] font-semibold">Toggle Status</span>
        </button>

      </div>

    </div>
  );
};
