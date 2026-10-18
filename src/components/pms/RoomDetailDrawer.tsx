import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Room } from '../../types/index.ts';
import { GUEST_PROFILES_DATA, getGuestProfileEnrichment } from '../../data/guestData.ts';
import {
  MapPin,
  X,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  User,
  Bed,
  FileText,
  Clock,
  Sparkles,
  Wrench,
  CreditCard,
  History,
  Calendar,
  DollarSign,
  Heart,
  SlidersHorizontal,
  ShieldCheck,
  Coffee,
  Wind,
  BedDouble,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';

interface Props {
  room: Room;
  onClose: () => void;
}

export const RoomDetailDrawer: React.FC<Props> = ({ room, onClose }) => {
  const { bookings, openCheckOutModal, openBookingWizardForRoom, openFolioModal, openMaintenanceModal, addToast } = useHotel();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GUEST' | 'GUEST_HISTORY' | 'FOLIO'>('OVERVIEW');

  const activeBooking = room.currentBookingId ? bookings.find(b => b.id === room.currentBookingId) : null;
  const guest = activeBooking?.guest;

  const isOccupied = room.status === 'OCCUPIED';

  // Selected guest for the Guest History tab (defaults to current guest if occupied, or first known guest)
  const defaultGuestName = guest ? `${guest.firstName} ${guest.lastName}` : 'John Smith';
  const [selectedGuestName, setSelectedGuestName] = useState<string>(defaultGuestName);

  // Available guest names for selection
  const availableGuestNames = useMemo(() => {
    const names = Object.keys(GUEST_PROFILES_DATA);
    if (guest && !names.includes(`${guest.firstName} ${guest.lastName}`)) {
      names.unshift(`${guest.firstName} ${guest.lastName}`);
    }
    return names;
  }, [guest]);

  // Enriched profile of the selected guest
  const selectedProfile = useMemo(() => {
    return getGuestProfileEnrichment(selectedGuestName, room.category, room.pricePerNight);
  }, [selectedGuestName, room.category, room.pricePerNight]);

  // Fallback guest initials
  const initials = guest ? `${guest.firstName[0]}${guest.lastName[0]}`.toUpperCase() : 'JS';
  const selectedInitials = selectedGuestName
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Expanded past stay folio breakdown
  const [expandedStayId, setExpandedStayId] = useState<string | null>(null);

  const handleApplyPreferences = () => {
    addToast({
      type: 'success',
      title: 'Preferences Applied to Room',
      message: `Room ${room.roomNumber} set to ${selectedProfile.roomPreferences.temperaturePreference}, housekeeping notified for ${selectedProfile.roomPreferences.bedAndPillow}.`
    });
  };

  const getVipBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'PLATINUM':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'GOLD':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SILVER':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <aside className="w-80 lg:w-96 bg-white border-l border-slate-200/90 flex flex-col shrink-0 h-full overflow-y-auto select-none shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Room {room.roomNumber}</h3>
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            isOccupied
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : room.status === 'AVAILABLE'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : room.status === 'DIRTY'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isOccupied ? 'bg-blue-600' : room.status === 'AVAILABLE' ? 'bg-emerald-600' : room.status === 'DIRTY' ? 'bg-amber-600' : 'bg-rose-600'
            }`} />
            <span>{isOccupied ? 'Occupied' : room.status === 'AVAILABLE' ? 'Available' : room.status === 'DIRTY' ? 'Dirty' : 'Maintenance'}</span>
          </span>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Room Photo Container */}
      <div className="p-4 pb-0">
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#927863] via-[#C8B8A6] to-[#EAE4DC] flex items-center justify-center">
            <div className="absolute inset-0 opacity-80 mix-blend-multiply bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/50 via-slate-800/40 to-slate-950/80" />
            <div className="relative z-10 text-center p-4">
              <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mx-auto mb-2 text-white shadow-lg">
                <Bed className="w-5 h-5 text-white" />
              </div>
              <div className="text-white font-bold text-sm tracking-wide drop-shadow-md">
                {room.category === 'SUITE' ? 'Grand Deluxe King Suite' : room.category === 'DELUXE' ? 'Deluxe Horizon Room' : 'Standard Executive Room'}
              </div>
              <div className="text-amber-100 text-[11px] font-medium drop-shadow-sm">
                Floor {room.floor} • City & Marina Horizon
              </div>
            </div>
          </div>
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono">
            AED {room.pricePerNight} / night
          </span>
        </div>
      </div>

      {/* Room Title & Floor info */}
      <div className="px-5 pt-3 pb-1">
        <h4 className="text-base font-bold text-slate-900 tracking-tight">Room {room.roomNumber}</h4>
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
          <Bed className="w-3.5 h-3.5 text-slate-400" />
          <span>{room.category === 'SUITE' ? 'Suite' : room.category === 'DELUXE' ? 'Deluxe Room' : 'Standard Room'} · Floor {room.floor}</span>
        </div>
      </div>

      {/* Navigation Tabs - Includes Guest History */}
      <div className="px-5 border-b border-slate-200 flex space-x-5 text-xs overflow-x-auto scrollbar-none">
        {(
          [
            { key: 'OVERVIEW', label: 'Overview' },
            { key: 'GUEST', label: 'Guest' },
            { key: 'GUEST_HISTORY', label: 'Guest History' },
            { key: 'FOLIO', label: 'Folio' }
          ] as const
        ).map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key === 'GUEST_HISTORY' && guest) {
                setSelectedGuestName(`${guest.firstName} ${guest.lastName}`);
              }
            }}
            className={`py-2.5 font-semibold transition-all relative whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="p-5 space-y-4 flex-1">
        {/* OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <>
            {isOccupied && activeBooking ? (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Checked In</div>
                  <div className="text-[11px] text-slate-500">
                    {activeBooking.totalNights} nights · Departs {activeBooking.checkOutDate}
                  </div>
                </div>
              </div>
            ) : room.status === 'AVAILABLE' ? (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Available for Check-In</div>
                  <div className="text-[11px] text-slate-500">Cleaned & Inspected</div>
                </div>
              </div>
            ) : room.status === 'DIRTY' ? (
              <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Needs Cleaning</div>
                  <div className="text-[11px] text-slate-500">Assigned to Housekeeping Team</div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-50/70 border border-rose-200/90 rounded-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Room Out of Order</div>
                  <div className="text-[11px] text-slate-500">Maintenance in progress</div>
                </div>
              </div>
            )}

            {/* Guest Info Card if Occupied - Click switches to Guest History */}
            {isOccupied && guest && (
              <div
                onClick={() => {
                  setSelectedGuestName(`${guest.firstName} ${guest.lastName}`);
                  setActiveTab('GUEST_HISTORY');
                }}
                className="p-3.5 bg-slate-50 hover:bg-blue-50/60 hover:border-blue-200 transition-colors border border-slate-200/80 rounded-xl flex items-center justify-between cursor-pointer group"
                title="Click to view full Guest History & Preferences"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{guest.firstName} {guest.lastName}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-100 text-amber-800">
                        {guest.vipTier || (guest.vipStatus ? 'VIP' : 'Member')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">{guest.email}</div>
                    <div className="text-[11px] text-blue-600 font-medium group-hover:underline flex items-center gap-1 mt-0.5">
                      <span>View Guest History & Preferences</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            )}

            {/* Reservation Summary Details */}
            {isOccupied && activeBooking ? (
              <div className="space-y-2.5 text-xs pt-1">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Reservation</span>
                  <span className="font-semibold text-slate-900">{activeBooking.bookingReference}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Check-in</span>
                  <span className="font-semibold text-slate-900">{activeBooking.checkInDate}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Check-out</span>
                  <span className="font-semibold text-slate-900">{activeBooking.checkOutDate}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Room rate</span>
                  <span className="font-semibold text-slate-900">AED {room.pricePerNight} / night</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 font-semibold">
                  <span className="text-slate-700">Total stay</span>
                  <span className="text-slate-900 font-bold">
                    {activeBooking.totalNights} nights · AED {(activeBooking.totalNights * room.pricePerNight).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="font-semibold text-slate-900 mb-1">Room Amenities:</div>
                <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                  <li>King Luxury Plush Bedding</li>
                  <li>Rain Shower & Botanical Spa Toiletries</li>
                  <li>Complimentary Espresso & Artesian Water</li>
                  <li>Smart Climate Control (HVAC)</li>
                </ul>
              </div>
            )}
          </>
        )}

        {/* GUEST TAB */}
        {activeTab === 'GUEST' && (
          <div className="space-y-3.5 text-xs">
            {guest ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-slate-900">{guest.firstName} {guest.lastName}</div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVipBadgeStyle(guest.vipTier || 'GOLD')}`}>
                      {guest.vipTier || 'GOLD VIP'}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-slate-600 text-[11px]">
                    <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Passport Number</span>
                      <span className="font-mono font-medium text-slate-800">{guest.idNumber}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-medium text-slate-800">{guest.phone}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                      <span className="text-slate-500">Email</span>
                      <span className="font-medium text-slate-800">{guest.email}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500">Nationality</span>
                      <span className="font-medium text-slate-800">{guest.nationality}</span>
                    </div>
                  </div>
                </div>

                {/* Direct CTA to Guest History */}
                <button
                  onClick={() => {
                    setSelectedGuestName(`${guest.firstName} ${guest.lastName}`);
                    setActiveTab('GUEST_HISTORY');
                  }}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-blue-200 transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Full Guest History & Room Preferences</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-700">No Active Guest in Room {room.roomNumber}</div>
                <div className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  You can browse registered guest profiles in the Guest History tab.
                </div>
                <button
                  onClick={() => setActiveTab('GUEST_HISTORY')}
                  className="mt-3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Open Guest History Directory
                </button>
              </div>
            )}
          </div>
        )}

        {/* GUEST HISTORY TAB (Requested feature) */}
        {activeTab === 'GUEST_HISTORY' && (
          <div className="space-y-4 text-xs">
            {/* Guest Selector Dropdown / Header */}
            <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-blue-600" />
                  Selected Guest
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getVipBadgeStyle(selectedProfile.vipTier)}`}>
                  {selectedProfile.vipTier} VIP
                </span>
              </div>

              {/* Guest Selector */}
              <div className="relative">
                <select
                  value={selectedGuestName}
                  onChange={e => setSelectedGuestName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-7 cursor-pointer"
                >
                  {availableGuestNames.map(name => (
                    <option key={name} value={name}>
                      {name} {name === defaultGuestName && isOccupied ? `(Current · Room ${room.roomNumber})` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-0.5">
                <span>Member since {selectedProfile.memberSince}</span>
                <span className="font-medium text-blue-600">Loyalty #GZ-{selectedGuestName.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase()}-98</span>
              </div>
            </div>

            {/* Total Spend & Lifetime Metrics KPI Bar */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guest Financials & Total Spend</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Total Spend KPI */}
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/90 rounded-xl">
                  <div className="text-[10px] font-medium text-emerald-800 uppercase tracking-wider">Total Lifetime Spend</div>
                  <div className="text-sm font-extrabold text-emerald-950 font-mono mt-0.5">
                    AED {selectedProfile.lifetimeSpend.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-0.5 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Top 5% Spender</span>
                  </div>
                </div>

                {/* Stays KPI */}
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/90 rounded-xl">
                  <div className="text-[10px] font-medium text-blue-800 uppercase tracking-wider">Total Stays & Nights</div>
                  <div className="text-sm font-extrabold text-blue-950 font-mono mt-0.5">
                    {selectedProfile.totalStaysCount} Stays <span className="text-xs text-blue-700">({selectedProfile.totalNightsCount} Nights)</span>
                  </div>
                  <div className="text-[10px] text-blue-700 mt-0.5">
                    Avg. AED {Math.round(selectedProfile.lifetimeSpend / Math.max(1, selectedProfile.totalNightsCount)).toLocaleString()}/night
                  </div>
                </div>
              </div>
            </div>

            {/* Room Preferences & Personalization Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Room Preferences & Setup</span>
                </div>
                <button
                  onClick={handleApplyPreferences}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                  title="Apply these preferences to the current room setup"
                >
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  <span>Apply to Room</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 space-y-2.5">
                {/* Room Category & Floor */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BedDouble className="w-3 h-3 text-slate-400" />
                    Preferred Room & Location
                  </span>
                  <div className="text-xs font-semibold text-slate-800">
                    {selectedProfile.roomPreferences.preferredRoomCategory}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {selectedProfile.roomPreferences.floorPreference}
                  </div>
                </div>

                {/* Bed & Pillows */}
                <div className="pt-2 border-t border-slate-200/70 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bed & Pillow Type</span>
                  <div className="text-xs text-slate-800 font-medium">
                    {selectedProfile.roomPreferences.bedAndPillow}
                  </div>
                </div>

                {/* Climate & Temperature */}
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Wind className="w-3 h-3 text-slate-400" />
                      HVAC Temperature
                    </span>
                    <div className="text-xs text-slate-800 font-semibold mt-0.5">
                      {selectedProfile.roomPreferences.temperaturePreference}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    Auto-Set
                  </span>
                </div>

                {/* Minibar & Dining Preferences */}
                {selectedProfile.roomPreferences.minibarAndDining && selectedProfile.roomPreferences.minibarAndDining.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Coffee className="w-3 h-3 text-slate-400" />
                      Favorite Minibar & Refreshments
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProfile.roomPreferences.minibarAndDining.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Requests & Concierge Notes */}
                {selectedProfile.roomPreferences.specialRequests && selectedProfile.roomPreferences.specialRequests.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Special Requests</span>
                    <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                      {selectedProfile.roomPreferences.specialRequests.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Concierge Notes */}
                {selectedProfile.roomPreferences.notes && (
                  <div className="pt-2 border-t border-slate-200/70 p-2 bg-amber-50/80 rounded-lg border border-amber-200/80 text-[11px] text-amber-900">
                    <span className="font-bold">Staff Alert: </span>
                    {selectedProfile.roomPreferences.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Past Booking Dates & History List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Past Booking Dates & Stays ({selectedProfile.pastStays.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sorted by date</span>
              </div>

              <div className="space-y-2">
                {selectedProfile.pastStays.map(stay => {
                  const isExpanded = expandedStayId === stay.id;
                  const isCurrent = stay.status === 'CHECKED_IN';

                  return (
                    <div
                      key={stay.id}
                      className={`p-3 rounded-xl border transition-all text-xs ${
                        isCurrent
                          ? 'bg-blue-50/40 border-blue-200'
                          : 'bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                    >
                      {/* Stay Card Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{stay.bookingReference}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                isCurrent
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isCurrent ? 'Current Stay' : 'Completed'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            Room {stay.roomNumber} ({stay.roomCategory}) · {stay.nights} nights
                          </div>
                        </div>

                        {/* Stay Total Spend */}
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900 font-mono">
                            AED {stay.totalSpend.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">Total spend</div>
                        </div>
                      </div>

                      {/* Dates row */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{stay.checkInDate} → {stay.checkOutDate}</span>
                        </div>

                        {stay.chargesSummary && stay.chargesSummary.length > 0 && (
                          <button
                            onClick={() => setExpandedStayId(isExpanded ? null : stay.id)}
                            className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5 text-[10px]"
                          >
                            <span>{isExpanded ? 'Hide breakdown' : 'View receipt'}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Expandable charges breakdown */}
                      {isExpanded && stay.chargesSummary && (
                        <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 space-y-1 bg-slate-50/80 p-2 rounded-lg text-[11px]">
                          <div className="font-bold text-slate-700 text-[10px] uppercase tracking-wider mb-1">
                            Itemized Folio Charges
                          </div>
                          {stay.chargesSummary.map((item, cIdx) => (
                            <div key={cIdx} className="flex justify-between text-slate-600">
                              <span>{item.description}</span>
                              <span className="font-mono font-medium text-slate-900">AED {item.amount.toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 mt-1">
                            <span>Total Billed:</span>
                            <span className="font-mono text-blue-700">AED {stay.totalSpend.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FOLIO TAB */}
        {activeTab === 'FOLIO' && (
          <div className="space-y-3 text-xs">
            {activeBooking ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Open Folio Ledger</span>
                  <button
                    onClick={() => openFolioModal(activeBooking)}
                    className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Print Full Invoice</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Room Charges ({activeBooking.totalNights} nights):</span>
                    <span className="font-bold text-slate-900">AED {(activeBooking.totalNights * room.pricePerNight).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxes & Tourism Dirham:</span>
                    <span className="font-mono">AED 0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Balance Due:</span>
                    <span className="text-blue-600 font-mono">AED {(activeBooking.totalNights * room.pricePerNight).toLocaleString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-slate-400">
                No active folio for Room {room.roomNumber}.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2 sticky bottom-0 z-10">
        {isOccupied && activeBooking ? (
          <>
            <button
              onClick={() => openCheckOutModal(activeBooking)}
              className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
            >
              Check Out
            </button>
            <button
              onClick={() => openFolioModal(activeBooking)}
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </>
        ) : room.status === 'AVAILABLE' ? (
          <button
            onClick={() => openBookingWizardForRoom(room.id)}
            className="flex-1 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            Assign / Check-In Guest
          </button>
        ) : room.status === 'DIRTY' ? (
          <button
            onClick={() => {
              room.status = 'AVAILABLE';
              addToast({
                type: 'success',
                title: 'Room Cleaned',
                message: `Room ${room.roomNumber} has been inspected and marked Available.`
              });
            }}
            className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            Mark Cleaned & Inspected
          </button>
        ) : (
          <button
            onClick={() => openMaintenanceModal(room)}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
          >
            Resolve Maintenance Ticket
          </button>
        )}
      </div>
    </aside>
  );
};
