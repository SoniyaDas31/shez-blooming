'use client';

import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  DollarSign,
  Boxes,
  Users,
  Wallet,
  ReceiptText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import PLReportPDF, { PLReportData } from '@/components/PLReportPDF';

export default function AdminReportsPage() {
  const [salesReport, setSalesReport] = useState<any>(null);
  const [inventoryReport, setInventoryReport] = useState<any>(null);
  const [financeReport, setFinanceReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPLModal, setShowPLModal] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        const [finRes, invRes, srvRes] = await Promise.all([
          fetch('/api/finance?range=this_year'),
          fetch('/api/inventory'),
          fetch('/api/invoices'),
        ]);

        if (finRes.ok) setFinanceReport(await finRes.json());
        if (invRes.ok) setInventoryReport(await invRes.json());
        if (srvRes.ok) setSalesReport(await srvRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div>
          <h1 className="text-xl font-bold font-serif-brand text-forest-900">
            Business Reports & PDF Exports
          </h1>
          <p className="text-xs text-stone-500">
            Generate printable, branded financial and operational reports for Shez Blooming.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* P&L Statement Report */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-all">
          <div className="space-y-2">
            <div className="p-3 w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <FileBarChart className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-900 font-serif-brand">
              Profit & Loss Statement (P&L)
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Complete breakdown of gross service revenue, consumable costs, operating overheads, and net profit margins.
            </p>
          </div>

          <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">
              {financeReport ? formatCurrency(financeReport.netProfit) : 'Loading...'} Net
            </span>
            <button
              onClick={() => setShowPLModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-600 text-forest-950 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Sales & Invoices Report */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-all">
          <div className="space-y-2">
            <div className="p-3 w-12 h-12 rounded-2xl bg-gold-50 text-gold-700 flex items-center justify-center">
              <ReceiptText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-900 font-serif-brand">
              Sales & Invoice Log
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Historical bill registers with payment method breakdown (UPI, Cash, Card) and discount tracking.
            </p>
          </div>

          <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">
              {salesReport?.invoices?.length || 0} Total Invoices
            </span>
            <button
              onClick={() => setShowPLModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-stone-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Summary</span>
            </button>
          </div>
        </div>

        {/* Inventory Valuation Report */}
        <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-all">
          <div className="space-y-2">
            <div className="p-3 w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <Boxes className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-900 font-serif-brand">
              Inventory & Valuation Report
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Stock on hand, unit cost values, re-order thresholds, and material usage logs.
            </p>
          </div>

          <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">
              Valuation: {inventoryReport ? formatCurrency(inventoryReport.totalValuation) : '-'}
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-stone-700"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPLModal && financeReport && (
        <PLReportPDF
          data={financeReport}
          onClose={() => setShowPLModal(false)}
        />
      )}
    </div>
  );
}
