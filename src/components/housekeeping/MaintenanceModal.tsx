import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  X,
  Wrench,
  CheckCircle2
} from 'lucide-react';

export const MaintenanceModal: React.FC = () => {
  const {
    isMaintenanceModalOpen,
    setIsMaintenanceModalOpen,
    maintenanceRoom,
    rooms,
    createMaintenanceTicket
  } = useHotel();

  const [roomId, setRoomId] = useState<string>('');
  const [category, setCategory] = useState<'HVAC' | 'PLUMBING' | 'ELECTRICAL' | 'FURNITURE' | 'KEYCARD' | 'OTHER'>('HVAC');
  const [description, setDescription] = useState('HVAC unit not cooling to desired temperature.');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [assignedTo, setAssignedTo] = useState('Marcus Vance (Senior MEP Tech)');
  const [locksRoom, setLocksRoom] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (maintenanceRoom) {
      setRoomId(maintenanceRoom.id);
    } else if (rooms.length > 0) {
      setRoomId(rooms[0].id);
    }
  }, [maintenanceRoom, rooms, isMaintenanceModalOpen]);

  if (!isMaintenanceModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !description) {
      alert('Please fill in required fields.');
      return;
    }

    setIsSubmitting(true);
    const success = await createMaintenanceTicket({
      roomId,
      category,
      description,
      priority,
      assignedTo,
      locksRoom
    });
    setIsSubmitting(false);

    if (success) {
      setIsMaintenanceModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Maintenance Work Order</h2>
              <p className="text-xs text-slate-500">Lock room out of booking inventory</p>
            </div>
          </div>
          <button
            onClick={() => setIsMaintenanceModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Room</label>
            <select
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber} - {r.category} ({r.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
              >
                <option value="HVAC">HVAC</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="KEYCARD">Keycard Reader</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-bold"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lockRoomToggleLight"
                checked={locksRoom}
                onChange={e => setLocksRoom(e.target.checked)}
                className="rounded text-rose-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="lockRoomToggleLight" className="font-semibold text-rose-800 cursor-pointer">
                Temporarily lock room out of available PMS inventory
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsMaintenanceModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Logging Ticket...' : 'Dispatch Ticket'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
