import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { RoomCategory } from '../../types/index.ts';
import {
  X,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Bed,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const BookingWizardModal: React.FC = () => {
  const {
    isBookingWizardOpen,
    setIsBookingWizardOpen,
    bookingWizardInitialRoomId,
    rooms,
    createBooking
  } = useHotel();

  // Step state
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [checkInDate, setCheckInDate] = useState<string>('2025-10-14');
  const [checkOutDate, setCheckOutDate] = useState<string>('2025-10-16');
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory | 'ANY'>('ANY');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(2);

  // Guest fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idType, setIdType] = useState<'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID'>('PASSPORT');
  const [idNumber, setIdNumber] = useState('');
  const [nationality, setNationality] = useState('United Arab Emirates');
  const [vipStatus, setVipStatus] = useState(false);
  const [specialRequests, setSpecialRequests] = useState('');
  const [autoCheckIn, setAutoCheckIn] = useState(true);

  useEffect(() => {
    if (bookingWizardInitialRoomId) {
      setSelectedRoomId(bookingWizardInitialRoomId);
      const r = rooms.find(rm => rm.id === bookingWizardInitialRoomId);
      if (r) {
        setSelectedCategory(r.category);
      }
    } else {
      const firstAvailable = rooms.find(r => r.status === 'AVAILABLE');
      if (firstAvailable) {
        setSelectedRoomId(firstAvailable.id);
      }
    }
    setStep(1);
  }, [bookingWizardInitialRoomId, isBookingWizardOpen, rooms]);

  if (!isBookingWizardOpen) return null;

  const availableRooms = rooms.filter(r => {
    if (r.status !== 'AVAILABLE' && r.id !== bookingWizardInitialRoomId) return false;
    if (selectedCategory !== 'ANY' && r.category !== selectedCategory) return false;
    return true;
  });

  const assignedRoom = rooms.find(r => r.id === selectedRoomId);

  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diffTime = Math.max(1, end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const pricePerNight = assignedRoom ? assignedRoom.pricePerNight : 850;
  const roomSubtotal = pricePerNight * nights;
  const lodgingTax = Number((roomSubtotal * 0.05).toFixed(2)); // 5% VAT in UAE
  const estimatedTotal = Number((roomSubtotal + lodgingTax).toFixed(2));

  const handleNext = () => {
    if (step === 1) {
      if (!selectedRoomId) {
        alert('Please select an available room');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!firstName || !lastName || !email || !idNumber) {
        alert('Please fill in all required guest information and ID/passport number.');
        return;
      }
      setStep(3);
    }
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    const success = await createBooking({
      guestData: {
        firstName,
        lastName,
        email,
        phone,
        idType,
        idNumber,
        nationality,
        vipStatus
      },
      roomId: selectedRoomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
      autoCheckIn
    });
    setIsSubmitting(false);

    if (success) {
      setIsBookingWizardOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New Guest Booking & Registration</h2>
              <p className="text-xs text-slate-500">Aurelia Grand Hotel front desk reservation workflow</p>
            </div>
          </div>
          <button
            onClick={() => setIsBookingWizardOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>
              1
            </span>
            <span>Room & Dates</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>
              2
            </span>
            <span>Guest & Passport Info</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-600'}`}>
              3
            </span>
            <span>Folio & Confirmation</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={e => setCheckInDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={e => setCheckOutDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guests</label>
                  <select
                    value={numberOfGuests}
                    onChange={e => setNumberOfGuests(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Category Filter</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['ANY', 'STANDARD', 'DELUXE', 'SUITE'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Room ({availableRooms.length} available)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {availableRooms.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRoomId(r.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedRoomId === r.id
                          ? 'bg-blue-50 border-blue-600 shadow-xs ring-1 ring-blue-600'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">Room {r.roomNumber}</span>
                        <span className="text-[10px] font-semibold text-blue-700 uppercase">{r.category}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">AED {r.pricePerNight} / night</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mansoor"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="tariq@company.ae"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+971 50 999 1234"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Identity Document Registration
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">ID Type</label>
                    <select
                      value={idType}
                      onChange={e => setIdType(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    >
                      <option value="PASSPORT">Passport</option>
                      <option value="NATIONAL_ID">Emirates / National ID</option>
                      <option value="DRIVERS_LICENSE">Driver's License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Document # *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. P7729104"
                      value={idNumber}
                      onChange={e => setIdNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={e => setNationality(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preferences or Special Requests</label>
                <textarea
                  rows={2}
                  placeholder="High floor, sea view, late check-in..."
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Guest:</span>
                  <span className="font-bold text-slate-900">{firstName} {lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Assigned:</span>
                  <span className="font-bold text-blue-700">Room {assignedRoom?.roomNumber} ({assignedRoom?.category})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stay Duration:</span>
                  <span className="font-semibold text-slate-800">{nights} night(s) · {checkInDate} to {checkOutDate}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Amount Due:</span>
                  <span className="text-blue-600 font-mono">AED {estimatedTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
                <input
                  type="checkbox"
                  id="autoCheckInLight"
                  checked={autoCheckIn}
                  onChange={e => setAutoCheckIn(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="autoCheckInLight" className="cursor-pointer leading-relaxed">
                  <strong>Mark as Checked-In Immediately:</strong> Set room to <strong>Occupied</strong> and auto-deduct botanical guest amenities package from floor linen storage.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Next Step <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmReservation}
              className="flex items-center gap-2 px-6 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Registering...' : 'Confirm & Complete Booking'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
