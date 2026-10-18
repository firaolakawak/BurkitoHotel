import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { GuestFolio } from '../../types/index.ts';
import { apiService } from '../../services/api.ts';
import {
  X,
  CreditCard,
  Banknote,
  Building,
  CheckCircle2,
  Printer,
  Sparkles,
  Receipt,
  User
} from 'lucide-react';

export const CheckOutModal: React.FC = () => {
  const {
    isCheckOutModalOpen,
    setIsCheckOutModalOpen,
    checkOutBooking,
    checkOutGuest,
    openFolioModal
  } = useHotel();

  const [folio, setFolio] = useState<GuestFolio | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'CASH' | 'BANK_TRANSFER'>('CREDIT_CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (checkOutBooking) {
      apiService.getFolio(checkOutBooking.id)
        .then(res => setFolio(res.folio))
        .catch(err => console.error('Failed to load folio', err));
    }
  }, [checkOutBooking]);

  if (!isCheckOutModalOpen || !checkOutBooking) return null;

  const guest = checkOutBooking.guest;
  const balanceDue = folio ? folio.balanceDue : 0;

  const handleFinalizeCheckOut = async () => {
    setIsProcessing(true);
    const success = await checkOutGuest(checkOutBooking.id, paymentMethod);
    setIsProcessing(false);
    if (success) {
      setIsCheckOutModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Guest Checkout & Folio Settlement</h2>
              <p className="text-xs text-slate-500">Room departure & housekeeping turnover routing</p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckOutModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Guest and Room banner */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Guest Departure</span>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <User className="w-4 h-4 text-blue-600" />
                {guest ? `${guest.firstName} ${guest.lastName}` : 'Guest'}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{checkOutBooking.bookingReference}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Room Assigned</span>
              <div className="text-xl font-black font-mono text-blue-600">
                Room {checkOutBooking.room?.roomNumber || '502'}
              </div>
            </div>
          </div>

          {/* Folio itemized summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Folio Charges Summary</h4>
              <button
                type="button"
                onClick={() => openFolioModal(checkOutBooking)}
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Printer className="w-3.5 h-3.5" /> Full Printable Invoice
              </button>
            </div>

            {folio && (
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Room Charges Subtotal:</span>
                  <span className="font-mono">AED {folio.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes (5% VAT):</span>
                  <span className="font-mono">AED {folio.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Outstanding Balance:</span>
                  <span className="font-mono text-blue-600">
                    AED {balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          {balanceDue > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Settlement Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                  { id: 'CASH', label: 'Cash / AED', icon: Banknote },
                  { id: 'BANK_TRANSFER', label: 'Transfer', icon: Building }
                ].map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-semibold ${
                        paymentMethod === opt.id
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Room status routing notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Housekeeping Turnover:</strong> Room {checkOutBooking.room?.roomNumber || '502'} will be routed to Housekeeping with a departure cleaning task.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsCheckOutModalOpen(false)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleFinalizeCheckOut}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isProcessing ? 'Processing Departure...' : `Finalize Check-Out (AED ${balanceDue.toLocaleString()})`}
          </button>
        </div>

      </div>
    </div>
  );
};
