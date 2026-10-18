import React, { useState, useEffect } from 'react';
import { useHotel } from '../../context/HotelContext.tsx';
import { GuestFolio } from '../../types/index.ts';
import { apiService } from '../../services/api.ts';
import {
  X,
  Printer,
  Download,
  Building,
  CheckCircle2,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';

export const FolioInvoiceModal: React.FC = () => {
  const {
    isFolioModalOpen,
    setIsFolioModalOpen,
    folioModalBooking
  } = useHotel();

  const [folio, setFolio] = useState<GuestFolio | null>(null);

  useEffect(() => {
    if (folioModalBooking) {
      apiService.getFolio(folioModalBooking.id)
        .then(res => setFolio(res.folio))
        .catch(err => console.error('Error loading folio', err));
    }
  }, [folioModalBooking]);

  if (!isFolioModalOpen || !folioModalBooking) return null;

  const guest = folioModalBooking.guest;
  const room = folioModalBooking.room;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Tax Invoice & Guest Folio</span>
            <span className="text-xs text-slate-400 font-mono">({folioModalBooking.bookingReference})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setIsFolioModalOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white text-slate-900 print:p-0 print:overflow-visible">
          
          {/* Hotel Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Aurelia Grand Hotel
              </div>
              <div className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
                Hospitality Cloud & Luxury Suites
              </div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Marina Promenade, Tower 3, Dubai, UAE<br />
                Concierge & Front Desk: +971 4 555 8900<br />
                TRN / Tax ID: 100293847500003
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Folio Statement #
              </span>
              <div className="text-xl font-mono font-black text-slate-900 mt-0.5">
                INV-{folioModalBooking.bookingReference.replace('#', '')}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Issued: 14 Oct 2025
              </div>
              <div className="inline-block mt-2 px-2.5 py-0.5 rounded font-mono text-[11px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                Status: {folio?.status || 'OPEN'}
              </div>
            </div>
          </div>

          {/* Guest & Reservation Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Guest Information
              </span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {guest ? `${guest.firstName} ${guest.lastName}` : 'John Smith'}
              </div>
              <div className="text-slate-600 mt-0.5">{guest?.email}</div>
              <div className="text-slate-600">{guest?.phone}</div>
              <div className="text-slate-500 font-mono mt-1">
                Passport: {guest?.idNumber || 'PA948201'}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Reservation Details
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Room:</span>
                <span className="font-mono font-bold text-slate-900">Room {room?.roomNumber || '502'} ({room?.category || 'Deluxe'})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Arrival:</span>
                <span className="font-mono text-slate-700">{folioModalBooking.checkInDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Departure:</span>
                <span className="font-mono text-slate-700">{folioModalBooking.checkOutDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Length of Stay:</span>
                <span className="font-mono font-semibold text-slate-700">{folioModalBooking.totalNights} Night(s)</span>
              </div>
            </div>
          </div>

          {/* Itemized Folio Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Itemized Folio Transactions & Room Charges
            </h4>

            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Posted By</th>
                  <th className="py-2.5 px-3 text-right">Amount (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {folio?.items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{item.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 border border-slate-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px] font-mono">{item.postedBy}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      AED {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Accounting Summary Grid */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
            <div className="w-full sm:w-1/2 space-y-2 text-xs">
              <h5 className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">
                Payments & Credits
              </h5>
              <div className="text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-200">
                Settlement due at checkout via credit card or bank transfer.
              </div>
            </div>

            <div className="w-full sm:w-5/12 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Room Charges:</span>
                <span className="font-mono text-slate-800">AED {folio?.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>VAT (5%):</span>
                <span className="font-mono text-slate-800">AED {folio?.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Total Folio Amount:</span>
                <span className="font-mono">AED {folio?.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-base text-blue-600 pt-2 border-t-2 border-slate-300">
                <span>Balance Due:</span>
                <span className="font-mono">AED {folio?.balanceDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
