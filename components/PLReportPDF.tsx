'use client';

import React, { useRef, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Download, X, TrendingUp, TrendingDown, DollarSign, ImageIcon, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PLReportData {
  periodTitle: string;
  startDate: string | Date;
  endDate: string | Date;
  grossRevenue: number;
  materialCost: number;
  grossProfit: number;
  grossMarginPercent: number;
  operatingExpenses: number;
  netProfit: number;
  netMarginPercent: number;
  expenseBreakdown: { category: string; amount: number }[];
  salesBreakdown: { name: string; count: number; revenue: number }[];
  totalBills: number;
  totalAppointments: number;
}

interface PLReportPDFProps {
  data: PLReportData;
  onClose?: () => void;
}

export default function PLReportPDF({ data, onClose }: PLReportPDFProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ShezBlooming_PL_Report_${data.periodTitle.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try the Print or Image option.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!reportRef.current) return;
    setIsGeneratingImage(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ShezBlooming_PL_Report_${data.periodTitle.replace(/\s+/g, '_')}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Image Generation Error:', err);
      alert('Failed to generate report image.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-sand-200 flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none">
        {/* Top bar (Hidden in print) */}
        <div className="bg-forest-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between text-cream-50 print:hidden shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gold-400" />
            <span className="font-semibold text-xs sm:text-sm">P&L Report: {data.periodTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              title="Download Statement as Image (PNG)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold-400 hover:bg-gold-500 text-forest-950 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-forest-900" />
              )}
              <span>Image</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              title="Download Statement as PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forest-700 hover:bg-forest-600 text-cream-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-gold-400" />
              )}
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print Statement"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-forest-800 hover:bg-forest-700 text-cream-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-forest-800 text-sand-300 hover:text-white transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Printable Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white print:p-0" ref={reportRef}>
          {/* Header */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-forest-900/20">
            <div>
              <h1 className="text-2xl font-bold font-serif-brand text-forest-900">
                Shez <span className="text-gold-600 italic">Blooming</span>
              </h1>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500">
                Massage & Parlour
              </p>
              <p className="text-xs text-forest-700 font-serif-brand italic mt-0.5">
                Relax • Rejuvenate • Renew
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-1">
                P&L Statement
              </span>
              <p className="text-sm font-bold text-stone-800">{data.periodTitle}</p>
              <p className="text-xs text-stone-500">
                Period: {formatDate(data.startDate)} — {formatDate(data.endDate)}
              </p>
            </div>
          </div>

          {/* Key Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="bg-sand-50 p-3.5 rounded-xl border border-sand-200">
              <p className="text-[11px] font-semibold text-stone-500 uppercase">Gross Revenue</p>
              <p className="text-lg font-bold text-stone-900 mt-1">{formatCurrency(data.grossRevenue)}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">{data.totalBills} Bills generated</p>
            </div>
            <div className="bg-sand-50 p-3.5 rounded-xl border border-sand-200">
              <p className="text-[11px] font-semibold text-stone-500 uppercase">Material Cost</p>
              <p className="text-lg font-bold text-stone-700 mt-1">{formatCurrency(data.materialCost)}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Service consumables</p>
            </div>
            <div className="bg-sand-50 p-3.5 rounded-xl border border-sand-200">
              <p className="text-[11px] font-semibold text-stone-500 uppercase">Gross Profit</p>
              <p className="text-lg font-bold text-emerald-800 mt-1">{formatCurrency(data.grossProfit)}</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">{data.grossMarginPercent.toFixed(1)}% margin</p>
            </div>
            <div className={`p-3.5 rounded-xl border ${data.netProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rosewood-50 border-rosewood-200'}`}>
              <p className="text-[11px] font-semibold uppercase text-stone-600">Net Profit</p>
              <p className={`text-lg font-bold mt-1 ${data.netProfit >= 0 ? 'text-emerald-800' : 'text-rosewood-700'}`}>
                {formatCurrency(data.netProfit)}
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">{data.netMarginPercent.toFixed(1)}% net margin</p>
            </div>
          </div>

          {/* P&L Breakdown Table */}
          <div className="my-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-3">
              Financial Calculations & Statement
            </h3>
            <table className="w-full text-xs sm:text-sm">
              <tbody className="divide-y divide-sand-200 border-t border-b border-sand-300">
                <tr className="bg-sand-50/70 font-bold text-stone-900">
                  <td className="py-2.5 px-3">Gross Service Revenue</td>
                  <td className="py-2.5 px-3 text-right">{formatCurrency(data.grossRevenue)}</td>
                </tr>
                <tr className="text-stone-600">
                  <td className="py-2.5 px-3 pl-6">Less: Cost of Service Materials Consumed</td>
                  <td className="py-2.5 px-3 text-right text-stone-600">({formatCurrency(data.materialCost)})</td>
                </tr>
                <tr className="bg-sand-100/70 font-bold text-forest-900">
                  <td className="py-2.5 px-3">= Gross Profit</td>
                  <td className="py-2.5 px-3 text-right">{formatCurrency(data.grossProfit)}</td>
                </tr>
                <tr className="text-stone-600">
                  <td className="py-2.5 px-3 pl-6">Less: Total Operating Expenses (Purchases, Travel, Utilities, Misc)</td>
                  <td className="py-2.5 px-3 text-right text-rosewood-600">({formatCurrency(data.operatingExpenses)})</td>
                </tr>
                <tr className={`font-bold text-base ${data.netProfit >= 0 ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rosewood-100/70 text-rosewood-900'}`}>
                  <td className="py-3 px-3">= Net Business Profit</td>
                  <td className="py-3 px-3 text-right">{formatCurrency(data.netProfit)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Expense & Service Summaries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
            <div>
              <h4 className="text-xs font-bold uppercase text-stone-600 tracking-wider mb-2">
                Expense Breakdown
              </h4>
              <div className="space-y-1.5 text-xs bg-sand-50 p-3.5 rounded-xl border border-sand-200">
                {data.expenseBreakdown.length > 0 ? (
                  data.expenseBreakdown.map((exp, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-sand-200/50 last:border-none">
                      <span className="text-stone-700 font-medium capitalize">{exp.category.replace(/_/g, ' ').toLowerCase()}</span>
                      <span className="font-semibold text-stone-900">{formatCurrency(exp.amount)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-400 italic">No recorded expenses in this period.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-stone-600 tracking-wider mb-2">
                Top Services Performed
              </h4>
              <div className="space-y-1.5 text-xs bg-sand-50 p-3.5 rounded-xl border border-sand-200">
                {data.salesBreakdown.length > 0 ? (
                  data.salesBreakdown.slice(0, 5).map((srv, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-sand-200/50 last:border-none">
                      <span className="text-stone-700 font-medium truncate pr-2">{srv.name} ({srv.count}x)</span>
                      <span className="font-semibold text-stone-900 shrink-0">{formatCurrency(srv.revenue)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-stone-400 italic">No service records in this period.</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-8 pt-4 border-t border-dashed border-sand-300 flex justify-between items-center text-xs text-stone-500">
            <div>
              <p className="font-semibold text-forest-800">Shez Blooming Financial Reporting</p>
              <p className="text-[10px]">Generated on {formatDate(new Date())} for internal business records.</p>
            </div>
            <div className="text-right">
              <span className="font-serif-brand font-bold text-forest-800 text-sm italic">
                Subbulakshmi Das
              </span>
              <p className="text-[10px] text-stone-400 uppercase">Business Owner</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
