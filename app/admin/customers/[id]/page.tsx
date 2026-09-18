'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  MapPin,
  CalendarDays,
  ReceiptText,
  Clock,
  Sparkles,
  DollarSign,
  Plus,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import PDFInvoice from '@/components/PDFInvoice';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await fetch(`/api/customers/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCustomer(data.customer);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCustomer();
  }, [params.id]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-stone-400">Loading client history...</div>;
  }

  if (!customer) {
    return <div className="p-8 text-center text-xs text-rosewood-600">Customer not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-forest-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </Link>

        <Link
          href={`/admin/billing?customerId=${customer.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-600 text-forest-950 shadow"
        >
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Create New Bill</span>
        </Link>
      </div>

      {/* Customer Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif-brand text-forest-900">
                {customer.name}
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800">
                {customer.visitCount} Lifetime Visits
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-3">
              <span>Ph: {customer.mobile}</span>
              {customer.whatsapp && <span>WA: {customer.whatsapp}</span>}
            </p>
          </div>

          <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-right">
            <span className="text-[10px] text-stone-400 block uppercase font-bold">Lifetime Spend</span>
            <span className="text-2xl font-bold text-forest-900 font-serif-brand">
              {formatCurrency(customer.totalSpent || 0)}
            </span>
          </div>
        </div>

        {customer.address && (
          <div className="pt-3 border-t border-sand-100 text-xs text-stone-600 flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>{customer.address} {customer.landmark ? `(Near: ${customer.landmark})` : ''}</span>
          </div>
        )}

        {customer.notes && (
          <div className="bg-sand-50 p-3 rounded-xl text-xs text-stone-600">
            <strong className="text-forest-800">Preferences / Notes: </strong>
            {customer.notes}
          </div>
        )}
      </div>

      {/* Two Columns: Visit Invoices & Appointment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoices List */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-sand-100 text-forest-900">
            <ReceiptText className="w-4 h-4 text-gold-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider">Billing & Invoice History</h2>
          </div>

          {customer.invoices?.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4">No completed bills yet.</p>
          ) : (
            <div className="space-y-2">
              {customer.invoices?.map((inv: any) => (
                <div
                  key={inv.id}
                  onClick={() => setActiveInvoice(inv)}
                  className="p-3 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors cursor-pointer border border-sand-200 flex justify-between items-center text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-forest-800">{inv.invoiceNumber}</span>
                    <p className="text-stone-500 text-[11px]">{formatDate(inv.date)} • {inv.paymentMethod}</p>
                    <p className="text-[11px] text-stone-700 mt-0.5 truncate max-w-xs">
                      {inv.items?.map((it: any) => it.description).join(', ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-stone-900 block">{formatCurrency(inv.totalAmount)}</span>
                    <span className="text-[10px] text-forest-700 underline">View PDF</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments List */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-sand-100 text-forest-900">
            <CalendarDays className="w-4 h-4 text-gold-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider">Appointments Log</h2>
          </div>

          {customer.appointments?.length === 0 ? (
            <p className="text-xs text-stone-400 italic py-4">No booked appointments recorded.</p>
          ) : (
            <div className="space-y-2">
              {customer.appointments?.map((appt: any) => (
                <div
                  key={appt.id}
                  className="p-3 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-stone-500 font-medium">{appt.bookingRef}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-forest-100 text-forest-800 uppercase">
                      {appt.status}
                    </span>
                  </div>
                  <p className="font-semibold text-stone-800">
                    {formatDate(appt.date)} at {appt.timeSlot}
                  </p>
                  <p className="text-stone-500 text-[11px]">
                    Services: {appt.items?.map((it: any) => it.itemTitle).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice PDF Modal */}
      {activeInvoice && (
        <PDFInvoice
          invoice={{
            invoiceNumber: activeInvoice.invoiceNumber,
            date: activeInvoice.date,
            customer: {
              name: customer.name,
              mobile: customer.mobile,
              address: customer.address,
              landmark: customer.landmark,
            },
            items: activeInvoice.items || [],
            subtotal: activeInvoice.subtotal,
            discountAmount: activeInvoice.discountAmount,
            travelCharge: activeInvoice.travelCharge,
            totalAmount: activeInvoice.totalAmount,
            paidAmount: activeInvoice.paidAmount,
            paymentMethod: activeInvoice.paymentMethod,
            paymentStatus: activeInvoice.paymentStatus,
            notes: activeInvoice.notes,
          }}
          onClose={() => setActiveInvoice(null)}
        />
      )}
    </div>
  );
}
