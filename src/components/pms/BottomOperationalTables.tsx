import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';

export const BottomOperationalTables: React.FC = () => {
  const { setSelectedRoom, rooms, setActiveTab } = useHotel();

  const handleRoomClick = (roomNumber: string) => {
    const r = rooms.find(rm => rm.roomNumber === roomNumber);
    if (r) {
      setSelectedRoom(r);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Today's Arrivals (12) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900">Today's Arrivals (12)</h4>
          <button
            onClick={() => setActiveTab('PMS_GRID')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 font-medium border-b border-slate-100">
              <tr>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Guest</th>
                <th className="pb-2 font-medium">Room</th>
                <th className="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">02:00 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Anna Taylor</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('601')} className="font-mono text-blue-600 hover:underline">
                    601
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                    Expected
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">03:15 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Michael Brown</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('503')} className="font-mono text-blue-600 hover:underline">
                    503
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                    Arriving
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">04:00 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Fatima Al Mansoori</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('517')} className="font-mono text-blue-600 hover:underline">
                    517
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                    Expected
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">06:30 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Luca Rossi</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('522')} className="font-mono text-blue-600 hover:underline">
                    522
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                    Expected
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">08:00 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Chen Wei</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('505')} className="font-mono text-blue-600 hover:underline">
                    505
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
                    Expected
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Today's Departures (15) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900">Today's Departures (15)</h4>
          <button
            onClick={() => setActiveTab('PMS_GRID')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 font-medium border-b border-slate-100">
              <tr>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Guest</th>
                <th className="pb-2 font-medium">Room</th>
                <th className="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">10:00 AM</td>
                <td className="py-2.5 font-semibold text-slate-900">James Wilson</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('415')} className="font-mono text-blue-600 hover:underline">
                    415
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Checked Out
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">11:00 AM</td>
                <td className="py-2.5 font-semibold text-slate-900">Olivia Davis</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('312')} className="font-mono text-blue-600 hover:underline">
                    312
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Checking Out
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">12:00 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Rajesh Kumar</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('508')} className="font-mono text-blue-600 hover:underline">
                    508
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Due
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">01:00 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Maria Garcia</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('510')} className="font-mono text-blue-600 hover:underline">
                    510
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Due
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-medium text-slate-500">02:00 PM</td>
                <td className="py-2.5 font-semibold text-slate-900">Ahmed Ali</td>
                <td className="py-2.5">
                  <button onClick={() => handleRoomClick('520')} className="font-mono text-blue-600 hover:underline">
                    520
                  </button>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Due
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Housekeeping Tasks (6) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-slate-900">Housekeeping Tasks (6)</h4>
          <button
            onClick={() => setActiveTab('HOUSEKEEPING')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            View all
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] text-slate-400 font-medium border-b border-slate-100">
              <tr>
                <th className="pb-2 font-medium">Room</th>
                <th className="pb-2 font-medium">Task</th>
                <th className="pb-2 font-medium">Priority</th>
                <th className="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-mono font-semibold text-slate-900">
                  <button onClick={() => handleRoomClick('503')} className="text-blue-600 hover:underline">503</button>
                </td>
                <td className="py-2.5 text-slate-800">Make up room</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700">
                    High
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                    Pending
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-mono font-semibold text-slate-900">
                  <button onClick={() => handleRoomClick('509')} className="text-blue-600 hover:underline">509</button>
                </td>
                <td className="py-2.5 text-slate-800">Make up room</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700">
                    High
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                    Pending
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-mono font-semibold text-slate-900">
                  <button onClick={() => handleRoomClick('516')} className="text-blue-600 hover:underline">516</button>
                </td>
                <td className="py-2.5 text-slate-800">Deep clean</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                    Medium
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                    Pending
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-mono font-semibold text-slate-900">
                  <button onClick={() => handleRoomClick('521')} className="text-blue-600 hover:underline">521</button>
                </td>
                <td className="py-2.5 text-slate-800">Inspection</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700">
                    High
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                    In Progress
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-2.5 font-mono font-semibold text-slate-900">
                  <button onClick={() => handleRoomClick('415')} className="text-blue-600 hover:underline">415</button>
                </td>
                <td className="py-2.5 text-slate-800">Make up room</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700">
                    Medium
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
