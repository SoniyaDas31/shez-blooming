'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ReceiptText,
  CalendarDays,
  Wallet,
  Boxes,
  FileBarChart,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminFloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={trayRef} className="fixed bottom-20 lg:bottom-8 right-5 sm:right-8 z-50">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Floating Action Tray Popup */}
      <div
        className={`absolute bottom-16 right-0 z-50 transition-all duration-300 transform origin-bottom-right ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto'
            : 'scale-90 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-sand-300 shadow-2xl space-y-3 min-w-[280px] max-w-xs">
          <div className="flex items-center justify-between px-1 pb-1 border-b border-sand-200 text-xs font-bold text-forest-900">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-stone-500">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              Quick Actions
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Esc to close</span>
          </div>

          {/* Tray Buttons Styled Exactly Like User Mockup */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* 1. Quick Bill (30s) - Warm Golden Button */}
            <Link
              href="/admin/billing"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#D4AF37] hover:bg-[#C29D29] text-[#133124] shadow-sm transition-transform active:scale-95 border border-[#B89326]"
            >
              <ReceiptText className="w-4 h-4 text-[#133124]" />
              <span>Quick Bill (30s)</span>
            </Link>

            {/* 2. New Appt - Deep Green Button */}
            <Link
              href="/admin/appointments"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#1B4332] hover:bg-[#133124] text-white shadow-sm transition-transform active:scale-95 border border-[#133124]"
            >
              <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
              <span>New Appt</span>
            </Link>

            {/* 3. Add Expense - Soft Cream Pill */}
            <Link
              href="/admin/expenses"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#F3ECE2] hover:bg-[#E5D7C5] text-[#1B4332] shadow-sm transition-transform active:scale-95 border border-[#E5D7C5]"
            >
              <Wallet className="w-4 h-4 text-[#1B4332]" />
              <span>Add Expense</span>
            </Link>

            {/* 4. Stock In - Soft Cream Pill */}
            <Link
              href="/admin/inventory"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#F3ECE2] hover:bg-[#E5D7C5] text-[#1B4332] shadow-sm transition-transform active:scale-95 border border-[#E5D7C5]"
            >
              <Boxes className="w-4 h-4 text-[#1B4332]" />
              <span>Stock In</span>
            </Link>

            {/* 5. Reports - Soft Cream Pill */}
            <Link
              href="/admin/reports"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#F3ECE2] hover:bg-[#E5D7C5] text-[#1B4332] shadow-sm transition-transform active:scale-95 border border-[#E5D7C5]"
            >
              <FileBarChart className="w-4 h-4 text-[#1B4332]" />
              <span>Reports</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Trigger Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Quick Actions Tray"
        className={`relative z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-luxury border-2 transition-all duration-300 active:scale-95 ${
          isOpen
            ? 'bg-forest-900 text-gold-400 border-gold-500 rotate-90'
            : 'bg-forest-700 hover:bg-forest-800 text-cream-50 border-gold-400 hover:scale-105'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gold-400 transition-transform" />
        ) : (
          <div className="relative flex items-center justify-center">
            <Plus className="w-6 h-6 text-gold-400 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
          </div>
        )}
      </button>
    </div>
  );
}
