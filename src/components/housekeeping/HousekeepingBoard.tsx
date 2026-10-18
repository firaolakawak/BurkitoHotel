import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  Sparkles,
  Wrench,
  CheckCircle2,
  User,
  PlusCircle
} from 'lucide-react';

export const HousekeepingBoard: React.FC = () => {
  const {
    housekeepingTasks,
    maintenanceTickets,
    rooms,
    updateHousekeepingTask,
    resolveMaintenanceTicket,
    openMaintenanceModal
  } = useHotel();

  const [boardTab, setBoardTab] = useState<'HOUSEKEEPING' | 'MAINTENANCE'>('HOUSEKEEPING');
  const [hkFilter, setHkFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filteredTasks = housekeepingTasks.filter(t => {
    if (hkFilter === 'ALL') return true;
    return t.status === hkFilter;
  });

  return (
    <div className="space-y-4">
      {/* Tab Switcher & Quick Action */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBoardTab('HOUSEKEEPING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              boardTab === 'HOUSEKEEPING'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Housekeeping Tasks ({housekeepingTasks.filter(t => t.status !== 'COMPLETED').length} Active)</span>
          </button>

          <button
            onClick={() => setBoardTab('MAINTENANCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              boardTab === 'MAINTENANCE'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-rose-600" />
            <span>Maintenance Tickets ({maintenanceTickets.filter(t => t.status !== 'RESOLVED').length} Active)</span>
          </button>
        </div>

        <button
          onClick={() => openMaintenanceModal()}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Housekeeping Tasks */}
      {boardTab === 'HOUSEKEEPING' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter:</span>
            {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setHkFilter(f)}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  hkFilter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTasks.map(task => {
              const room = rooms.find(r => r.id === task.roomId);
              return (
                <div
                  key={task.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">Room {task.roomNumber}</span>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                          {room?.category || 'STANDARD'}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        task.priority === 'HIGH' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs">
                      <div className="text-slate-800 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> {task.taskType.replace('_', ' ')}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> Assigned: <strong>{task.assignedStaff}</strong>
                      </div>
                      {task.notes && (
                        <p className="text-slate-600 bg-slate-50 p-2 rounded-lg text-[11px] mt-1 border border-slate-100">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-500">
                      Status: <strong className="text-slate-800">{task.status}</strong>
                    </span>

                    {task.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => updateHousekeepingTask(task.id, 'COMPLETED', 'Cleaned & inspected')}
                        className="px-2.5 py-1 bg-[#2563EB] hover:bg-blue-700 text-white rounded-md text-xs font-semibold"
                      >
                        Complete
                      </button>
                    ) : (
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Inspected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Maintenance Tickets */}
      {boardTab === 'MAINTENANCE' && (
        <div className="space-y-3">
          {maintenanceTickets.map(ticket => (
            <div
              key={ticket.id}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{ticket.ticketNumber}</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-blue-50 text-blue-700">
                    Room {ticket.roomNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">
                    {ticket.priority} PRIORITY
                  </span>
                </div>
                <p className="text-slate-700 mt-1">{ticket.description}</p>
                <div className="text-[11px] text-slate-400 mt-0.5">Assigned to: {ticket.assignedTo}</div>
              </div>

              {ticket.status !== 'RESOLVED' ? (
                <button
                  onClick={() => resolveMaintenanceTicket(ticket.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                >
                  Resolve & Unlock
                </button>
              ) : (
                <span className="text-emerald-600 font-semibold">Resolved</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
