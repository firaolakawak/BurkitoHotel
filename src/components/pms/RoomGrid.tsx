import React, { useState, useMemo } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { Room, RoomCategory, RoomStatus } from '../../types/index.ts';
import {
  KeyRound,
  User,
  Sparkles,
  Wrench,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Bed
} from 'lucide-react';

export const RoomGrid: React.FC = () => {
  const {
    rooms,
    bookings,
    selectedRoom,
    setSelectedRoom,
    openBookingWizardForRoom,
    openCheckOutModal
  } = useHotel();

  // Floor selection
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>(5);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [subTab, setSubTab] = useState<'ROOM_GRID' | 'FLOOR_PLAN' | 'AVAILABILITY' | 'ARRIVALS' | 'DEPARTURES' | 'IN_HOUSE'>('ROOM_GRID');
  const [roomTypeFilter, setRoomTypeFilter] = useState<'ALL' | 'STANDARD' | 'DELUXE' | 'SUITE'>('ALL');

  const floorList = [
    { id: 'ALL', name: 'All Floors', desc: '120 rooms', count: 120 },
    { id: 5, name: 'Floor 5', desc: 'Deluxe & Suites', count: 24 },
    { id: 4, name: 'Floor 4', desc: 'Standard', count: 24 },
    { id: 3, name: 'Floor 3', desc: 'Standard', count: 24 },
    { id: 2, name: 'Floor 2', desc: 'Deluxe', count: 24 },
    { id: 1, name: 'Floor 1', desc: 'Suites', count: 24 },
    { id: 0, name: 'Basement', desc: 'Service Area', count: 6 },
  ];

  // Filtered rooms for the grid
  const displayedRooms = useMemo(() => {
    return rooms.filter(r => {
      if (selectedFloor !== 'ALL' && r.floor !== selectedFloor) return false;
      if (roomTypeFilter !== 'ALL' && r.category !== roomTypeFilter) return false;
      return true;
    }).sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber));
  }, [rooms, selectedFloor, roomTypeFilter]);

  // Status styling per card matching the screenshot:
  const getCardStyle = (room: Room) => {
    switch (room.status) {
      case 'AVAILABLE':
        return {
          container: 'bg-[#F0FDF4] border-[#BBF7D0] hover:border-emerald-400',
          badgeBg: 'bg-[#DCFCE7] text-[#15803D]',
          badgeText: 'Available',
          badgeIcon: KeyRound,
          topIcon: KeyRound,
          topIconColor: 'text-[#16A34A]'
        };
      case 'OCCUPIED':
        return {
          container: 'bg-[#EFF6FF] border-[#BFDBFE] hover:border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-800',
          badgeText: 'Occupied',
          badgeIcon: Bed,
          topIcon: Bed,
          topIconColor: 'text-[#2563EB]'
        };
      case 'DIRTY':
        return {
          container: 'bg-[#FFFBEB] border-[#FDE68A] hover:border-amber-400',
          badgeBg: 'bg-[#FEF3C7] text-[#B45309]',
          badgeText: 'Dirty',
          badgeIcon: Sparkles,
          topIcon: Sparkles,
          topIconColor: 'text-[#D97706]'
        };
      case 'MAINTENANCE':
        return {
          container: 'bg-[#FEF2F2] border-[#FECDD3] hover:border-rose-400',
          badgeBg: 'bg-[#FEE2E2] text-[#B91C1C]',
          badgeText: 'Maintenance',
          badgeIcon: Wrench,
          topIcon: Wrench,
          topIconColor: 'text-[#DC2626]'
        };
      case 'CHECKED_OUT':
      default:
        return {
          container: 'bg-white border-slate-200 hover:border-slate-300',
          badgeBg: 'bg-slate-100 text-slate-700',
          badgeText: 'Checked-Out',
          badgeIcon: CheckCircle2,
          topIcon: CheckCircle2,
          topIconColor: 'text-slate-400'
        };
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Sub Tabs and Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-6 text-xs font-semibold overflow-x-auto scrollbar-none">
          {[
            { id: 'ROOM_GRID', label: 'Room Grid' },
            { id: 'FLOOR_PLAN', label: 'Floor Plan' },
            { id: 'AVAILABILITY', label: 'Availability' },
            { id: 'ARRIVALS', label: 'Arrivals' },
            { id: 'DEPARTURES', label: 'Departures' },
            { id: 'IN_HOUSE', label: 'In-House' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`py-3 transition-colors relative whitespace-nowrap ${
                subTab === tab.id
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
              {subTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* View mode toggle + All room types filter + sliders icon */}
        <div className="flex items-center gap-2.5 pb-2 sm:pb-0">
          
          {/* Grid / List segmented toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'GRID'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'LIST'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>List</span>
            </button>
          </div>

          {/* Room type filter */}
          <div className="relative">
            <select
              value={roomTypeFilter}
              onChange={e => setRoomTypeFilter(e.target.value as any)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Room Types</option>
              <option value="STANDARD">Standard</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Filter icon button */}
          <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Main Floor Selector + Room Grid Matrix Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        
        {/* Left Floor Selector (2 columns on md) */}
        <div className="md:col-span-2 space-y-1.5">
          {floorList.map(fl => {
            const isSelected = selectedFloor === fl.id;
            return (
              <button
                key={fl.id}
                onClick={() => setSelectedFloor(fl.id as any)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500/80 shadow-xs ring-1 ring-blue-500/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                  {fl.name}
                </div>
                {fl.id !== 'ALL' && (
                  <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-700' : 'text-slate-400'}`}>
                    {fl.desc}
                  </div>
                )}
                {fl.id !== 'ALL' && (
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                    {fl.count} rooms
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Center Room Grid Matrix (10 columns on md) */}
        <div className="md:col-span-10 space-y-3">
          
          {/* Floor Header & Occupancy Bar */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedFloor === 'ALL' ? 'All Hotel Floors' : `Floor ${selectedFloor}`}
              </h3>
              <span className="text-xs text-slate-500">
                {selectedFloor === 5 ? 'Deluxe & Suites' : selectedFloor === 0 ? 'Service Area' : 'Standard & Deluxe'}
              </span>
            </div>

            {/* Occupancy Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                24 rooms · Occupancy <strong className="text-slate-800">79%</strong>
              </span>
              <div className="w-24 h-2 rounded-full bg-blue-100 overflow-hidden flex">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '79%' }} />
              </div>
            </div>
          </div>

          {/* 6-Column Room Card Grid matching Screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {displayedRooms.map(room => {
              const card = getCardStyle(room);
              const activeBooking = room.currentBookingId
                ? bookings.find(b => b.id === room.currentBookingId)
                : null;
              const guest = activeBooking?.guest;
              const isSelected = selectedRoom?.id === room.id;
              const TopIcon = card.topIcon;

              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`relative p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between min-h-[118px] ${card.container} ${
                    isSelected ? 'ring-2 ring-blue-600 shadow-md scale-[1.02]' : 'shadow-2xs'
                  }`}
                >
                  {/* Top: Room Number & Category + Status Icon */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900 leading-none">
                          {room.roomNumber}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 capitalize">
                          {room.category.toLowerCase()}
                        </div>
                      </div>

                      <TopIcon className={`w-3.5 h-3.5 ${card.topIconColor} shrink-0`} />
                    </div>

                    {/* Middle: Status Badge or Guest Name */}
                    <div className="mt-2.5">
                      {room.status === 'OCCUPIED' && guest ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-900 font-semibold truncate">
                          <User className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{guest.firstName} {guest.lastName}</span>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${card.badgeBg}`}>
                          <span>{card.badgeText}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Price in AED */}
                  <div className="mt-2.5 pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span>AED {room.pricePerNight.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
