/**
 * Room Management Module
 * Full CRUD for hotel rooms (number, floor, category, price, status, capacity, bed config, amenities).
 * Integrates with /api/rooms backend routes and HotelContext state.
 */

import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  Room,
  RoomCategory,
  RoomStatus,
  CreateRoomInput,
  UpdateRoomInput,
  RoomStatusHistoryEntry
} from '../../types/index.ts';
import {
  KeyRound,
  Bed,
  Sparkles,
  Wrench,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  CheckCircle2 as CheckIcon,
  AlertTriangle,
  Loader2,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  List,
  Tag,
  User,
  Clock,
  Building2
} from 'lucide-react';

const STATUS_CONFIG: Record<RoomStatus, { label: string; bg: string; text: string; border: string; icon: any }> = {
  AVAILABLE: { label: 'Available', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-100', icon: KeyRound },
  OCCUPIED: { label: 'Occupied', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-100', icon: Bed },
  DIRTY: { label: 'Dirty', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-100', icon: Sparkles },
  MAINTENANCE: { label: 'Maintenance', bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-100', icon: Wrench },
  CHECKED_OUT: { label: 'Checked-Out', bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-100', icon: CheckIcon }
};

const CATEGORY_CONFIG: Record<RoomCategory, { label: string; color: string }> = {
  STANDARD: { label: 'Standard', color: 'bg-slate-50 text-slate-700 border-slate-100' },
  DELUXE: { label: 'Deluxe', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  SUITE: { label: 'Suite', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  PRESIDENTIAL: { label: 'Presidential', color: 'bg-gold-50 text-gold-700 border-gold-100' }
};

export const RoomManagement: React.FC = () => {
  const {
    rooms,
    bookings,
    isLoading,
    createRoom,
    updateRoom,
    deleteRoom,
    getRoomStatusHistory,
    isRoomModalOpen,
    setIsRoomModalOpen,
    editingRoom,
    setEditingRoom,
    addToast
  } = useHotel();

  const [searchQuery, setSearchQuery] = useState('');
  const [floorFilter, setFloorFilter] = useState<'ALL' | number>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RoomStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | RoomCategory>('ALL');
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [historyRoomId, setHistoryRoomId] = useState<string | null>(null);

  const floors = useMemo(() => {
    const set = new Set<number>();
    rooms.forEach(r => set.add(r.floor));
    return Array.from(set).sort((a, b) => a - b);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(r => {
      if (floorFilter !== 'ALL' && r.floor !== floorFilter) return false;
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return r.roomNumber.toLowerCase().includes(q) || (r.amenities || []).some(a => a.toLowerCase().includes(q));
      }
      return true;
    }).sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber));
  }, [rooms, floorFilter, statusFilter, categoryFilter, searchQuery]);

  const handleCreateRoom = async (data: CreateRoomInput) => {
    const ok = await createRoom(data);
    if (ok) setIsRoomModalOpen(false);
  };

  const handleUpdateRoom = async (data: UpdateRoomInput) => {
    if (!editingRoom) return;
    const ok = await updateRoom(editingRoom.id, data);
    if (ok) setIsRoomModalOpen(false);
  };

  const handleDeleteRoom = async (id: string) => {
    setDeletingRoomId(null);
    await deleteRoom(id);
  };

  const handleToggleHistory = (roomId: string) => {
    setHistoryRoomId(prev => (prev === roomId ? null : roomId));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        <p className="text-xs">Loading room data...</p>
      </div>
    );
  }

  const metrics = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'AVAILABLE').length,
    occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
    dirty: rooms.filter(r => r.status === 'DIRTY' || r.status === 'CHECKED_OUT').length,
    maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length
  };

  return (
    <div className="space-y-5">
      {/* Header + KPI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Room Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Create, update, and manage room details across all floors.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditingRoom(null); setIsRoomModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/25 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[['Total', metrics.total, 'text-slate-900'], ['Available', metrics.available, 'text-emerald-600'], ['Occupied', metrics.occupied, 'text-blue-600'], ['Dirty', metrics.dirty, 'text-amber-600'], ['Maintenance', metrics.maintenance, 'text-rose-600']].map(([label, value, color]) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
            <div className="text-2xl font-bold mt-1 {color}">{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room number or amenities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-48 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={floorFilter === 'ALL' ? 'ALL' : String(floorFilter)}
          onChange={e => setFloorFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Floors</option>
          {floors.map(f => <option key={f} value={String(f)}>Floor {f}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
                {(['AVAILABLE', 'OCCUPIED', 'DIRTY', 'MAINTENANCE', 'CHECKED_OUT'] as const).map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as any)}
          className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Categories</option>
          {(['STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL'] as const).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Rooms List */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-[10px] font-bold uppercase text-slate-400">Room</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase text-slate-400">Category</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase text-slate-400">Floor</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase text-slate-400">Status</th>
              <th className="text-right p-3 text-[10px] font-bold uppercase text-slate-400">Price/Night</th>
              <th className="text-center p-3 text-[10px] font-bold uppercase text-slate-400">Capacity</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase text-slate-400">Bed Config</th>
              <th className="text-left p-3 text-[10px] font-bold uppercase text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRooms.map(room => {
              const cfg = STATUS_CONFIG[room.status];
              const catCfg = CATEGORY_CONFIG[room.category];
              const booking = room.currentBookingId ? bookings.find(b => b.id === room.currentBookingId) : null;
              const isDeleting = deletingRoomId === room.id;

              return (
                <tr key={room.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-3">
                    <div className="font-bold text-slate-800">{room.roomNumber}</div>
                    {room.currentBookingId && booking && (
                      <div className="text-[10px] text-slate-500 mt-0.5">{booking.guest?.firstName} {booking.guest?.lastName}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${catCfg.color}`}>
                      {catCfg.label}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">Floor {room.floor}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-700 font-mono">AED {room.pricePerNight.toLocaleString()}</td>
                  <td className="p-3 text-center text-slate-700">{room.maxOccupancy}</td>
                  <td className="p-3 text-slate-700">{room.bedConfig}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditingRoom(room); setIsRoomModalOpen(true); }}
                        className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs"
                        title="Edit room"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleHistory(room.id)}
                        className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs"
                        title="Status history"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingRoomId(room.id)}
                        className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs"
                        title="Delete room"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {isDeleting && (
                      <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-100">
                        <p className="text-xs text-rose-800 mb-2">Delete room {room.roomNumber}?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingRoomId(null)}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredRooms.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  No rooms found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status History Drawer Section (inline below table) */}
      {historyRoomId && (
        <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900">Status History</h4>
            <button
              onClick={() => setHistoryRoomId(null)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {getRoomStatusHistory(historyRoomId).map((h: RoomStatusHistoryEntry, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-slate-400 mt-0.5">{h.fromStatus ?? '—'} →</span>
                <span className="font-medium">{h.toStatus}</span>
                <span className="ml-auto text-slate-400">{new Date(h.changedAt).toLocaleString()}</span>
              </div>
            ))}
            {getRoomStatusHistory(historyRoomId).length === 0 && (
              <p className="text-xs text-slate-400 italic">No status history recorded.</p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Building2 className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">No rooms defined. Add your first room.</p>
        </div>
      )}

      {/* ================= ROOM FORM MODAL ================= */}
      {isRoomModalOpen && (
        <RoomModal
          open={isRoomModalOpen}
          onClose={() => setIsRoomModalOpen(false)}
          initialRoom={editingRoom}
          onSave={async (data: any) => {
            if (editingRoom) {
              await updateRoom(editingRoom.id, data);
            } else {
              await handleCreateRoom(data);
            }
          }}
        />
      )}
    </div>
  );
};

/**
 * Room Create/Edit Modal
 */
interface RoomModalProps {
  open: boolean;
  onClose: () => void;
  initialRoom: Room | null;
  onSave: (data: any) => Promise<void>;
}

function RoomModal({ open, onClose, initialRoom, onSave }: RoomModalProps) {
  const isEdit = !!initialRoom;
  const [form, setForm] = useState({
    roomNumber: initialRoom?.roomNumber || '',
    floor: initialRoom?.floor?.toString() || '5',
    category: (initialRoom?.category as RoomCategory) || 'STANDARD',
    pricePerNight: initialRoom?.pricePerNight?.toString() || '',
    status: (initialRoom?.status as RoomStatus) || 'AVAILABLE',
    maxOccupancy: initialRoom?.maxOccupancy?.toString() || '2',
    bedConfig: initialRoom?.bedConfig || '',
    amenities: (initialRoom?.amenities || []).join(', ')
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        roomNumber: form.roomNumber,
        floor: Number(form.floor),
        category: form.category as RoomCategory,
        pricePerNight: Number(form.pricePerNight),
        status: form.status as RoomStatus,
        maxOccupancy: Number(form.maxOccupancy),
        bedConfig: form.bedConfig,
        amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean),
        ...(isEdit && initialRoom ? { id: initialRoom.id } : {})
      };
      await onSave(data);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-slate-200 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Room' : 'Add New Room'}</h3>
          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Room Number</label>
              <input
                type="text"
                value={form.roomNumber}
                onChange={e => setForm({ ...form, roomNumber: e.target.value })}
                placeholder="e.g. 501"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Floor</label>
              <input
                type="number"
                value={form.floor}
                onChange={e => setForm({ ...form, floor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value as RoomCategory })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                {(['STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL'] as const).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as RoomStatus })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
          {(['AVAILABLE', 'OCCUPIED', 'DIRTY', 'MAINTENANCE', 'CHECKED_OUT'] as const).map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Price Per Night</label>
              <div className="flex items-center">
                <span className="px-2 py-2 bg-slate-200 rounded-l-lg text-slate-600 text-xs">AED</span>
                <input
                  type="number"
                  step="0.01"
                  value={form.pricePerNight}
                  onChange={e => setForm({ ...form, pricePerNight: e.target.value })}
                  className="flex-1 bg-white border-l-0 border-r border-t border-b border-slate-200 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Max Occupancy</label>
              <input
                type="number"
                value={form.maxOccupancy}
                onChange={e => setForm({ ...form, maxOccupancy: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Bed Configuration</label>
            <input
              type="text"
              value={form.bedConfig}
              onChange={e => setForm({ ...form, bedConfig: e.target.value })}
              placeholder="e.g. 1 King Bed + Living Area"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Amenities (comma-separated)</label>
            <input
              type="text"
              value={form.amenities}
              onChange={e => setForm({ ...form, amenities: e.target.value })}
              placeholder="e.g. Wi-Fi, Smart TV, Mini Bar, Ocean View"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Enter amenities separated by commas.</p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 disabled:opacity-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !form.roomNumber.trim() ||
                !form.floor ||
                !form.pricePerNight ||
                !form.maxOccupancy ||
                !form.bedConfig.trim() ||
                saving
              }
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : isEdit ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
