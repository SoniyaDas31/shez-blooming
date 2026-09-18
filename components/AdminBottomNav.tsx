'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  CalendarDays,
  Users,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';

export default function AdminBottomNav() {
  const pathname = usePathname();

  const items = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Billing', href: '/admin/billing', icon: ReceiptText, highlight: true },
    { name: 'Appts', href: '/admin/appointments', icon: CalendarDays },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Finance', href: '/admin/finance', icon: TrendingUp },
    { name: 'Reports', href: '/admin/reports', icon: MoreHorizontal },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-forest-900/95 backdrop-blur-md border-t border-forest-800 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center -mt-4 relative group"
              >
                <div className="w-12 h-12 p-3 rounded-full bg-gold-500 text-forest-900 shadow-luxury border-2 border-forest-900 group-active:scale-95 transition-transform flex items-center justify-center">
                  <Icon className="w-5 h-5 text-forest-900 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-semibold text-gold-400 mt-0.5">Bill</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-colors ${
                isActive ? 'text-gold-400 font-semibold' : 'text-sand-300 hover:text-cream-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gold-400 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
