'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ReceiptText,
  CalendarDays,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Boxes,
  Wallet,
  Clock,
  CheckCircle2,
  DollarSign,
  FileBarChart,
  Percent,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [todayStats, setTodayStats] = useState<any>(null);
  const [monthStats, setMonthStats] = useState<any>(null);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [todayRes, monthRes, invRes, apptRes, invcRes] = await Promise.all([
          fetch('/api/finance?range=today'),
          fetch('/api/finance?range=this_month'),
          fetch('/api/inventory?filter=low_stock'),
          fetch('/api/appointments?view=upcoming'),
          fetch('/api/invoices'),
        ]);

        if (todayRes.ok) setTodayStats(await todayRes.json());
        if (monthRes.ok) setMonthStats(await monthRes.json());
        if (invRes.ok) {
          const invData = await invRes.json();
          setInventoryAlerts(invData.items || []);
        }
        if (apptRes.ok) {
          const aData = await apptRes.json();
          setPendingAppointments(aData.appointments?.slice(0, 5) || []);
        }
        if (invcRes.ok) {
          const iData = await invcRes.json();
          setRecentInvoices(iData.invoices?.slice(0, 5) || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Quick Actions Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sand-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold font-serif-brand text-forest-900">
            Welcome back, Subbulakshmi!
          </h2>
          <p className="text-xs text-stone-500">
            Here is what's happening at Shez Blooming today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/billing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-600 text-forest-950 shadow-md transition-all active:scale-95"
          >
            <ReceiptText className="w-3.5 h-3.5 text-forest-950" />
            <span>Quick Bill (30s)</span>
          </Link>
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-forest-700 hover:bg-forest-800 text-cream-50 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5 text-gold-400" />
            <span>New Appt</span>
          </Link>
          <Link
            href="/admin/expenses"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-stone-700 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-forest-700" />
            <span>Add Expense</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-stone-700 transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-forest-700" />
            <span>Stock In</span>
          </Link>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-stone-700 transition-colors"
          >
            <FileBarChart className="w-3.5 h-3.5 text-forest-700" />
            <span>Reports</span>
          </Link>
        </div>
      </div>

      {/* 2. Today & Month Snapshot KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif-brand text-stone-900">
            {formatCurrency(todayStats?.grossRevenue || 0)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            {todayStats?.totalBills || 0} bills completed today
          </p>
        </div>

        {/* This Month's Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">This Month Revenue</span>
            <div className="p-2 rounded-lg bg-forest-50 text-forest-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif-brand text-forest-900">
            {formatCurrency(monthStats?.grossRevenue || 0)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            {monthStats?.totalBills || 0} total monthly invoices
          </p>
        </div>

        {/* This Month's Net Profit */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Month Net Profit</span>
            <div className="p-2 rounded-lg bg-gold-50 text-gold-700">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-bold font-serif-brand ${
            (monthStats?.netProfit || 0) >= 0 ? 'text-emerald-800' : 'text-rosewood-700'
          }`}>
            {formatCurrency(monthStats?.netProfit || 0)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            {(monthStats?.netMarginPercent || 0).toFixed(1)}% profit margin
          </p>
        </div>

        {/* Month Material & Operating Costs */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Monthly Expenses</span>
            <div className="p-2 rounded-lg bg-rosewood-50 text-rosewood-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif-brand text-stone-800">
            {formatCurrency(monthStats?.operatingExpenses || 0)}
          </p>
          <p className="text-[11px] text-stone-400 mt-1">
            Materials: {formatCurrency(monthStats?.materialCost || 0)}
          </p>
        </div>
      </div>

      {/* 3. Alerts & Real-time Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sand-100">
            <div className="flex items-center gap-2 text-rosewood-700">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</h3>
            </div>
            <Link href="/admin/inventory?filter=low_stock" className="text-xs text-forest-700 hover:underline">
              View All ({inventoryAlerts.length})
            </Link>
          </div>

          {inventoryAlerts.length === 0 ? (
            <div className="text-center py-6 text-xs text-emerald-700 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All inventory products are well-stocked!</span>
            </div>
          ) : (
            <div className="space-y-2">
              {inventoryAlerts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2.5 rounded-xl bg-rosewood-50/70 border border-rosewood-100 text-xs"
                >
                  <div>
                    <p className="font-semibold text-stone-800">{item.name}</p>
                    <p className="text-[10px] text-stone-500">Min threshold: {item.minStockLevel} {item.unit}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rosewood-600 text-white font-bold text-[10px]">
                    {item.currentQuantity} {item.unit} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-sand-100">
            <div className="flex items-center gap-2 text-forest-800">
              <CalendarDays className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Upcoming Appointments</h3>
            </div>
            <Link href="/admin/appointments" className="text-xs text-forest-700 hover:underline">
              Manage All
            </Link>
          </div>

          {pendingAppointments.length === 0 ? (
            <div className="text-center py-6 text-xs text-stone-400">
              No upcoming appointments scheduled.
            </div>
          ) : (
            <div className="space-y-2">
              {pendingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-sand-50/70 border border-sand-200 text-xs gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{appt.customer?.name}</span>
                      <span className="font-mono text-[10px] text-stone-400">({appt.bookingRef})</span>
                    </div>
                    <p className="text-stone-500">
                      {formatDate(appt.date)} at <strong className="text-forest-800">{appt.timeSlot}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-bold text-stone-900 font-serif-brand">
                      {formatCurrency(appt.estimatedAmount)}
                    </span>
                    <Link
                      href={`/admin/billing?appointmentId=${appt.id}&customerId=${appt.customerId}`}
                      className="px-3 py-1 rounded-lg bg-gold-500 text-forest-950 font-bold text-[11px] hover:bg-gold-600 transition-colors"
                    >
                      Convert to Bill
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Completed Invoices */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-sand-100">
          <div className="flex items-center gap-2 text-forest-900">
            <ReceiptText className="w-4 h-4 text-gold-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Recent Invoices Generated</h3>
          </div>
          <Link href="/admin/reports" className="text-xs text-forest-700 hover:underline">
            View All Sales
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-stone-400 border-b border-sand-200 text-[11px] uppercase">
                <th className="pb-2 font-bold">Invoice #</th>
                <th className="pb-2 font-bold">Date</th>
                <th className="pb-2 font-bold">Customer</th>
                <th className="pb-2 font-bold">Payment</th>
                <th className="pb-2 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-sand-50/50">
                  <td className="py-2.5 font-mono font-semibold text-forest-800">{inv.invoiceNumber}</td>
                  <td className="py-2.5 text-stone-500">{formatDateTime(inv.date)}</td>
                  <td className="py-2.5 font-medium text-stone-800">{inv.customer?.name}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-stone-900">{formatCurrency(inv.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
