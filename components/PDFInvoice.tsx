'use client';

import React, { useRef, useState } from 'react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { Printer, Download, Share2, X, CheckCircle2, ImageIcon, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface InvoiceData {
  id?: string;
  invoiceNumber: string;
  date: string | Date;
  customer: {
    name: string;
    mobile: string;
    address?: string | null;
    landmark?: string | null;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discountAmount: number;
  travelCharge: number;
  taxAmount?: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  notes?: string | null;
}

interface PDFInvoiceProps {
  invoice: InvoiceData;
  onClose?: () => void;
}

export default function PDFInvoice({ invoice, onClose }: PDFInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const element = invoiceRef.current;
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
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF. Please try the Print or Image option.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!invoiceRef.current) return;
    setIsGeneratingImage(true);
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5, // High resolution for crystal clear image quality
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Invoice-${invoice.invoiceNumber}.png`;
      link.href = imgData;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Image Generation Error:', err);
      alert('Failed to generate image. Please try downloading as PDF.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🌸 *SHEZ BLOOMING INVOICE*\n*Invoice No:* ${invoice.invoiceNumber}\n*Customer:* ${invoice.customer.name}\n*Total:* ${formatCurrency(invoice.totalAmount)}\n*Status:* ${invoice.paymentStatus} via ${invoice.paymentMethod}\n\nThank you for choosing Shez Blooming Massage & Parlour!\n_Relax • Rejuvenate • Renew_`;
    const cleanMobile = invoice.customer.mobile.replace(/\D/g, '');
    const url = cleanMobile
      ? `https://wa.me/91${cleanMobile.slice(-10)}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-sand-200 flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none">
        {/* Action Header (Hidden in Print) */}
        <div className="bg-forest-900 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between text-cream-50 print:hidden shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-gold-400" />
            <span className="font-semibold text-xs sm:text-sm">Invoice: {invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Download Image Button */}
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              title="Download Invoice as Image (PNG)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold-400 hover:bg-gold-500 text-forest-950 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5 text-forest-900" />
              )}
              <span>Image</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              title="Download Invoice as PDF"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forest-700 hover:bg-forest-600 text-cream-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-gold-400" />
              )}
              <span>PDF</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              title="Print Invoice"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-forest-800 hover:bg-forest-700 text-cream-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* WhatsApp Button */}
            <button
              onClick={handleShareWhatsApp}
              title="Share via WhatsApp"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
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

        {/* Invoice Printable Document Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white print:p-0" ref={invoiceRef}>
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-forest-900/20 gap-4">
            <div>
              <img
                src="/images/logo.png"
                alt="Shez Blooming Massage & Parlour"
                className="h-16 w-auto object-contain mb-1"
              />
              <p className="text-xs text-stone-500 mt-1">
                Founder: Subbulakshmi Das | Ph: +91 98765 43210
              </p>
            </div>

            <div className="sm:text-right bg-sand-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto border sm:border-0 border-sand-200">
              <span className="inline-block px-2.5 py-1 rounded bg-forest-100 text-forest-800 text-xs font-bold tracking-wider uppercase mb-1">
                TAX INVOICE
              </span>
              <p className="text-sm font-bold text-stone-800">
                <span className="text-stone-500 font-normal">Invoice No: </span>
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-stone-500">
                Date: {formatDateTime(invoice.date)}
              </p>
            </div>
          </div>

          {/* Customer Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 bg-sand-50/70 p-4 rounded-xl border border-sand-200">
            <div>
              <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Billed To Customer</p>
              <p className="text-base font-bold text-forest-900 mt-0.5">{invoice.customer.name}</p>
              <p className="text-xs text-stone-600 mt-0.5">Phone: {invoice.customer.mobile}</p>
              {invoice.customer.address && (
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Address: {invoice.customer.address} {invoice.customer.landmark ? `(Near: ${invoice.customer.landmark})` : ''}
                </p>
              )}
            </div>
            <div className="sm:text-right flex flex-col justify-center sm:items-end">
              <p className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Payment Details</p>
              <div className="flex items-center gap-1.5 mt-1 sm:justify-end">
                <span className="text-xs font-semibold text-stone-700">Mode:</span>
                <span className="text-xs font-bold text-forest-800 bg-sand-200 px-2 py-0.5 rounded uppercase">
                  {invoice.paymentMethod}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 sm:justify-end">
                <span className="text-xs font-semibold text-stone-700">Status:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                  invoice.paymentStatus === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {invoice.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Service Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-forest-800 text-forest-900 bg-sand-100/80">
                  <th className="py-2.5 px-3 font-bold">#</th>
                  <th className="py-2.5 px-3 font-bold">Service / Package Description</th>
                  <th className="py-2.5 px-3 text-center font-bold">Qty</th>
                  <th className="py-2.5 px-3 text-right font-bold">Rate</th>
                  <th className="py-2.5 px-3 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-sand-50/50">
                    <td className="py-2.5 px-3 text-stone-400 font-medium">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">{item.description}</td>
                    <td className="py-2.5 px-3 text-center text-stone-600">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-stone-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-stone-900">{formatCurrency(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t border-sand-200">
            <div className="text-xs text-stone-500 max-w-xs">
              {invoice.notes && (
                <div className="mb-2">
                  <span className="font-semibold text-stone-700">Notes: </span>
                  <span>{invoice.notes}</span>
                </div>
              )}
              <p className="font-semibold text-forest-800">Shez Blooming Home-Service & Parlour</p>
              <p>We look forward to serving your beauty and relaxation needs again soon!</p>
            </div>

            <div className="w-full sm:w-64 space-y-2 bg-sand-50 p-4 rounded-xl border border-sand-200">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-800">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold">-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              {invoice.travelCharge > 0 && (
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Home Service / Travel:</span>
                  <span className="font-semibold text-stone-800">+{formatCurrency(invoice.travelCharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-forest-900 pt-2 border-t border-sand-300">
                <span>Grand Total:</span>
                <span className="text-forest-700">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-stone-600 pt-1">
                <span>Amount Paid:</span>
                <span className="text-emerald-800">{formatCurrency(invoice.paidAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Signoff */}
          <div className="mt-8 pt-4 border-t border-dashed border-sand-300 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2">
            <div className="text-[11px] text-stone-500">
              <p className="font-serif-brand italic font-semibold text-forest-800">
                Thank you for blooming with us!
              </p>
              <p>Computer generated invoice, no physical signature required.</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="h-8 flex items-end justify-center sm:justify-end">
                <span className="font-serif-brand font-bold text-forest-700 text-sm italic">
                  Subbulakshmi Das
                </span>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold border-t border-stone-300 pt-0.5">
                Authorized Signatory
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Quick Action Bar (Hidden in Print) */}
        <div className="bg-sand-50 border-t border-sand-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
          <p className="text-[11px] text-stone-500 hidden sm:block">
            Choose an export format to save or send to the client.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gold-500 hover:bg-gold-600 text-forest-950 shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4 text-forest-900" />
              )}
              <span>Download Image</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-forest-800 hover:bg-forest-700 text-cream-50 shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-gold-400" />
              )}
              <span>Download PDF</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-sand-200 transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
