'use client';

import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Phone, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function MyAppointmentsPage() {
  const [mobileOrRef, setMobileOrRef] = useState('');
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileOrRef.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const cleanInput = mobileOrRef.trim();
      let url = '/api/appointments?';
      if (cleanInput.startsWith('SB-')) {
        url += `ref=${cleanInput}`;
      } else {
        url += `mobile=${cleanInput.replace(/\D/g, '')}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Confirmed</span>;
      case 'IN_PROGRESS':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">In Progress</span>;
      case 'COMPLETED':
        return <span className="bg-sand-200 text-forest-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Completed</span>;
      case 'CANCELLED':
        return <span className="bg-rosewood-100 text-rosewood-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Cancelled</span>;
      case 'PENDING':
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pending Review</span>;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5 text-gold-600" />
          <span>Booking Status</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-forest-900">
          Track Your Appointments
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Enter your 10-digit mobile number or booking reference code (e.g. SB-2609-XYZ) to view your status.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Mobile number or Ref Code"
            value={mobileOrRef}
            onChange={(e) => setMobileOrRef(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-full text-xs sm:text-sm focus:outline-none focus:border-forest-700"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 shadow transition-all active:scale-95"
        >
          {loading ? 'Searching...' : 'Find'}
        </button>
      </form>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          {appointments && appointments.length > 0 ? (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Booking Ref</span>
                    <p className="text-sm font-bold text-forest-900 font-mono">{appt.bookingRef}</p>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-sand-100">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Calendar className="w-3.5 h-3.5 text-forest-700" />
                    <span>{formatDate(appt.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-forest-700" />
                    <span>{appt.timeSlot}</span>
                  </div>
                </div>

                {/* Services list */}
                <div className="bg-sand-50 p-3 rounded-xl border border-sand-200 text-xs">
                  <p className="text-[10px] font-bold uppercase text-stone-400 mb-1">Services</p>
                  {appt.items?.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between text-stone-800 py-0.5">
                      <span>• {it.itemTitle}</span>
                      <span className="font-semibold">{formatCurrency(it.price)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-sand-200 flex justify-between font-bold text-forest-900">
                    <span>Estimated Total:</span>
                    <span>{formatCurrency(appt.estimatedAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Customer: {appt.customer?.name}</span>
                  <a
                    href="tel:+919876543210"
                    className="text-forest-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Need Help? Call Us
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-sand-200 p-6">
              <AlertCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-stone-700">No appointments found</p>
              <p className="text-xs text-stone-500 mt-0.5">
                Please check the mobile number or reference code and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
