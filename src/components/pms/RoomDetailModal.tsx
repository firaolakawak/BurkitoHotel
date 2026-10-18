import React from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import {
  X,
  Bed,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Sparkles,
  Wrench,
  Boxes,
  CreditCard,
  PlusCircle,
  LogOut
} from 'lucide-react';

export const RoomDetailModal: React.FC = () => {
  const {
    selectedRoom,
    setSelectedRoom,
    bookings,
    openBookingWizardForRoom,
    openCheckOutModal,
    openFolioModal,
    openMaintenanceModal,
    consumptionLogs
  } = useHotel();

  if (!selectedRoom) return null;

  const currentBooking = selectedRoom.currentBookingId
    ? bookings.find(b => b.id === selectedRoom.currentBookingId)
    : null;
  const guest = currentBooking?.guest;

  // Filter consumption logs for this room
  const roomConsumptions = consumptionLogs.filter(c => c.roomId === selectedRoom.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black font-mono text-amber-400">
              {selectedRoom.roomNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{selectedRoom.category} Room</h3>
                <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  Floor {selectedRoom.floor}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                  {selectedRoom.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">${selectedRoom.pricePerNight} / night • {selectedRoom.bedConfig}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRoom(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active Guest Info if Occupied */}
          {currentBooking && guest ? (
            <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Current Guest In Residence
                </span>
                <span className="text-xs font-mono text-indigo-200">{currentBooking.bookingReference}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Guest Name:</span>
                  <div className="font-bold text-white">{guest.firstName} {guest.lastName}</div>
                </div>
                <div>
                  <span className="text-slate-400">Contact:</span>
                  <div className="text-slate-300 truncate">{guest.email}</div>
                </div>
                <div>
                  <span className="text-slate-400">Dates:</span>
                  <div className="font-mono text-slate-300">{currentBooking.checkInDate} → {currentBooking.checkOutDate}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-indigo-500/20">
                <button
                  onClick={() => openFolioModal(currentBooking)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <CreditCard className="w-3.5 h-3.5" /> View / Post to Folio
                </button>
                <button
                  onClick={() => openCheckOutModal(currentBooking)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Check-Out Guest
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-800/40 border border-slate-700/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Room Availability:</span>
                <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                  {selectedRoom.status === 'AVAILABLE' ? 'Ready for New Guest Check-In' : `Room status is currently ${selectedRoom.status}`}
                </div>
              </div>
              {selectedRoom.status === 'AVAILABLE' && (
                <button
                  onClick={() => {
                    setSelectedRoom(null);
                    openBookingWizardForRoom(selectedRoom.id);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Book This Room
                </button>
              )}
            </div>
          )}

          {/* Room Specs & Amenities */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Room Specifications & Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRoom.amenities.map(amenity => (
                <span
                  key={amenity}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Inventory Usage Linked to this room */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-amber-400" /> Integrated Inventory Consumption History
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">{roomConsumptions.length} event(s) logged</span>
            </div>

            {roomConsumptions.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {roomConsumptions.map(con => (
                  <div
                    key={con.id}
                    className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{con.itemName}</div>
                      <div className="text-[10px] text-slate-400">
                        Trigger: {con.trigger} • Source: {con.locationId}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-amber-400">-{con.quantity} unit(s)</div>
                      <div className="text-[10px] text-slate-500">{new Date(con.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-800/30 rounded-lg">
                Standard luxury linen and amenities package will automatically deduct from the Floor Closet upon next check-in.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedRoom(null);
                openMaintenanceModal(selectedRoom);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" /> Report Maintenance / Lock Room
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
