'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  Percent,
  Wallet,
  Boxes,
  ReceiptText,
  Printer,
  FileBarChart,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import PLReportPDF, { PLReportData } from '@/components/PLReportPDF';

export default function AdminFinancePage() {
  const [range, setRange] = useState('this_month'); // today, this_week, this_month, prev_month, this_year, all, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<PLReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      let url = `/api/finance?range=${range}`;
      if (range === 'custom' && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, [range]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div>
          <h1 className="text-xl font-bold font-serif-brand text-forest-900">
            Financial Health & P&L Statement
          </h1>
          <p className="text-xs text-stone-500">
            Understand gross margins, material consumption costs, operating expenses, and net profit.
          </p>
        </div>

        {reportData && (
          <button
            onClick={() => setShowPDFModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-600 text-forest-950 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate P&L PDF</span>
          </button>
        )}
      </div>

      {/* Date Range Selector */}
      <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { key: 'today', label: 'Today' },
            { key: 'this_week', label: 'This Week' },
            { key: 'this_month', label: 'This Month' },
            { key: 'prev_month', label: 'Prev Month' },
            { key: 'this_year', label: '2026 Full Year' },
            { key: 'all', label: 'All Historical' },
          ].map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                range === r.key
                  ? 'bg-forest-700 text-cream-50'
                  : 'bg-sand-50 text-stone-600 border border-sand-200 hover:bg-sand-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Period: <strong className="text-stone-800">{reportData?.periodTitle || 'Loading...'}</strong>
        </div>
      </div>

      {loading || !reportData ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-32 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive KPI summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
              <span className="text-xs font-bold uppercase text-stone-400 block">Gross Revenue</span>
              <p className="text-2xl font-bold font-serif-brand text-stone-900 mt-1">
                {formatCurrency(reportData.grossRevenue)}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">{reportData.totalBills} Bills generated</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
              <span className="text-xs font-bold uppercase text-stone-400 block">Material Cost</span>
              <p className="text-2xl font-bold font-serif-brand text-stone-700 mt-1">
                {formatCurrency(reportData.materialCost)}
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">Service consumables used</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
              <span className="text-xs font-bold uppercase text-stone-400 block">Gross Profit</span>
              <p className="text-2xl font-bold font-serif-brand text-emerald-800 mt-1">
                {formatCurrency(reportData.grossProfit)}
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                {reportData.grossMarginPercent.toFixed(1)}% gross margin
              </p>
            </div>

            <div className={`p-5 rounded-2xl border shadow-soft ${
              reportData.netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rosewood-50 border-rosewood-200'
            }`}>
              <span className="text-xs font-bold uppercase text-stone-600 block">Net Business Profit</span>
              <p className={`text-2xl font-bold font-serif-brand mt-1 ${
                reportData.netProfit >= 0 ? 'text-emerald-800' : 'text-rosewood-700'
              }`}>
                {formatCurrency(reportData.netProfit)}
              </p>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {reportData.netMarginPercent.toFixed(1)}% net margin
              </p>
            </div>
          </div>

          {/* Formal P&L Statement Table */}
          <div className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-4">
            <h3 className="text-sm font-bold font-serif-brand text-forest-900 uppercase tracking-wider">
              Profit & Loss Financial Statement ({reportData.periodTitle})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <tbody className="divide-y divide-sand-200 border-t border-b border-sand-200">
                  <tr className="bg-sand-50/80 font-bold text-stone-900">
                    <td className="py-3 px-4">Gross Revenue (Service Invoices)</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(reportData.grossRevenue)}</td>
                  </tr>
                  <tr className="text-stone-600">
                    <td className="py-2.5 px-4 pl-8">Less: Cost of Service Materials Consumed</td>
                    <td className="py-2.5 px-4 text-right text-stone-600">({formatCurrency(reportData.materialCost)})</td>
                  </tr>
                  <tr className="bg-sand-100/70 font-bold text-forest-900">
                    <td className="py-3 px-4">= Gross Profit</td>
                    <td className="py-3 px-4 text-right font-serif-brand text-base">{formatCurrency(reportData.grossProfit)}</td>
                  </tr>
                  <tr className="text-stone-600">
                    <td className="py-2.5 px-4 pl-8">Less: Total Operating Expenses</td>
                    <td className="py-2.5 px-4 text-right text-rosewood-600">({formatCurrency(reportData.operatingExpenses)})</td>
                  </tr>
                  <tr className={`font-bold text-base ${
                    reportData.netProfit >= 0 ? 'bg-emerald-100/80 text-emerald-950' : 'bg-rosewood-100 text-rosewood-950'
                  }`}>
                    <td className="py-3.5 px-4">= Net Profit (Bottom Line)</td>
                    <td className="py-3.5 px-4 text-right font-serif-brand">{formatCurrency(reportData.netProfit)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Breakdown grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expense breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-3">
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                Operating Expenses by Category
              </h4>
              <div className="space-y-2">
                {reportData.expenseBreakdown.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-sand-100 last:border-none">
                    <span className="font-medium text-stone-700 capitalize">{exp.category.replace(/_/g, ' ').toLowerCase()}</span>
                    <span className="font-bold text-stone-900">{formatCurrency(exp.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sales breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-3">
              <h4 className="text-xs font-bold uppercase text-stone-400 tracking-wider">
                Top Service Revenue Drivers
              </h4>
              <div className="space-y-2">
                {reportData.salesBreakdown.slice(0, 5).map((srv, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-sand-100 last:border-none">
                    <span className="font-medium text-stone-700">{srv.name} ({srv.count} sessions)</span>
                    <span className="font-bold text-forest-800">{formatCurrency(srv.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Report Modal */}
      {showPDFModal && reportData && (
        <PLReportPDF
          data={reportData}
          onClose={() => setShowPDFModal(false)}
        />
      )}
    </div>
  );
}
