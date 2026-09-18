'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Play,
  CheckCheck,
  UserX,
  ReceiptText,
  Phone,
  MapPin,
  Plus,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [viewTab, setViewTab] = useState('all'); // all, today, upcoming, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/appointments?view=${viewTab}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [viewTab]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (e) {
      console.error(e);
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
      case 'NO_SHOW':
        return <span className="bg-stone-200 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">No Show</span>;
      case 'PENDING':
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div>
          <h1 className="text-xl font-bold font-serif-brand text-forest-900">
            Appointments Pipeline
          </h1>
          <p className="text-xs text-stone-500">
            Manage customer bookings, schedule updates, and convert completed sessions to invoices.
          </p>
        </div>

        <Link
          href="/book"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-700 text-cream-50 hover:bg-forest-800 shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Customer Appointment</span>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'today', label: 'Today' },
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setViewTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                viewTab === tab.key
                  ? 'bg-forest-700 text-cream-50'
                  : 'bg-white text-stone-600 border border-sand-200 hover:bg-sand-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAppointments();
          }}
          className="relative w-full sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ref, customer, mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-sand-300 rounded-full text-xs focus:outline-none focus:border-forest-700"
          />
        </form>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-28 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-sand-200 p-6">
          <CalendarDays className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">No appointments found</p>
          <p className="text-xs text-stone-400 mt-1">There are no appointments matching the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-sand-200 shadow-soft hover:border-gold-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-forest-800 bg-sand-100 px-2 py-0.5 rounded">
                    {appt.bookingRef}
                  </span>
                  {getStatusBadge(appt.status)}
                  {appt.isHomeService && (
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                      Doorstep Home Service
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-stone-900">{appt.customer?.name}</h3>
                  <a
                    href={`tel:${appt.customer?.mobile}`}
                    className="text-xs text-forest-700 flex items-center gap-1 font-medium hover:underline"
                  >
                    <Phone className="w-3 h-3" /> {appt.customer?.mobile}
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-forest-700" />
                    <span>{formatDate(appt.date)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-forest-800">
                    <Clock className="w-3.5 h-3.5 text-forest-700" />
                    <span>{appt.timeSlot}</span>
                  </div>
                  {appt.address && (
                    <div className="flex items-center gap-1 text-stone-500 truncate max-w-xs">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{appt.address}</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="text-xs text-stone-700 pt-1">
                  <span className="font-medium">Services: </span>
                  {appt.items?.map((it: any) => it.itemTitle).join(', ')}
                </div>
              </div>

              {/* Right Price & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-sand-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Estimated Total</span>
                  <p className="text-lg font-bold text-forest-900 font-serif-brand">
                    {formatCurrency(appt.estimatedAmount)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {appt.status === 'PENDING' && (
                    <button
                      onClick={() => updateStatus(appt.id, 'CONFIRMED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  )}

                  {appt.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateStatus(appt.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Session</span>
                    </button>
                  )}

                  {(appt.status === 'IN_PROGRESS' || appt.status === 'CONFIRMED') && (
                    <button
                      onClick={() => updateStatus(appt.id, 'COMPLETED')}
                      className="px-2.5 py-1 rounded-lg bg-forest-700 text-cream-50 font-semibold text-xs hover:bg-forest-800 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </button>
                  )}

                  {appt.status !== 'CANCELLED' && appt.status !== 'NO_SHOW' && (
                    <Link
                      href={`/admin/billing?appointmentId=${appt.id}&customerId=${appt.customerId}`}
                      className="px-3 py-1 rounded-lg bg-gold-500 text-forest-950 font-bold text-xs hover:bg-gold-600 flex items-center gap-1 shadow-sm"
                    >
                      <ReceiptText className="w-3.5 h-3.5" />
                      <span>Bill</span>
                    </Link>
                  )}

                  {appt.status === 'PENDING' && (
                    <button
                      onClick={() => updateStatus(appt.id, 'CANCELLED')}
                      className="p-1 rounded-lg text-stone-400 hover:text-rosewood-600 hover:bg-rosewood-50"
                      title="Cancel Appointment"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
