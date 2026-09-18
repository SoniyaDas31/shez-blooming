'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';
import {
  LayoutDashboard,
  CalendarDays,
  ReceiptText,
  Users,
  Sparkles,
  Gift,
  Boxes,
  Wallet,
  TrendingUp,
  FileBarChart,
  Settings,
  LogOut,
  ArrowUpRight,
} from 'lucide-react';

const ADMIN_MENU = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Billing (30s)', href: '/admin/billing', icon: ReceiptText, highlight: true },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarDays },
  { name: 'Customers CRM', href: '/admin/customers', icon: Users },
  { name: 'Services & Menu', href: '/admin/services', icon: Sparkles },
  { name: 'Packages & Offers', href: '/admin/packages', icon: Gift },
  { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
  { name: 'Expenses', href: '/admin/expenses', icon: Wallet },
  { name: 'Finance (P&L)', href: '/admin/finance', icon: TrendingUp },
  { name: 'Reports & PDF', href: '/admin/reports', icon: FileBarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('sb_admin_user');
    window.location.href = '/admin/login';
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-forest-900 text-cream-50 border-r border-forest-800 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-forest-800 flex items-center justify-between">
        <BrandLogo variant="light" size="sm" />
      </div>

      {/* Quick Public Site Link */}
      <div className="px-4 pt-3 pb-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-forest-800/80 text-sand-200 text-xs hover:text-cream-50 hover:bg-forest-800 transition-colors"
        >
          <span>View Live Customer Site</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {ADMIN_MENU.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 my-2 ${
                  isActive
                    ? 'bg-gold-500 text-forest-900 shadow-md'
                    : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 border border-gold-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] bg-gold-600/30 px-1.5 py-0.5 rounded text-white uppercase tracking-wider">
                  Fast
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-forest-700 text-cream-50 font-semibold shadow-sm border-l-4 border-gold-400 pl-2.5'
                  : 'text-sand-200/80 hover:text-cream-50 hover:bg-forest-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-stone-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-forest-800 bg-forest-900/90">
        <div className="flex items-center justify-between">
          <div className="flex flex-col truncate pr-2">
            <span className="text-xs font-semibold text-cream-50 truncate">Subbulakshmi Das</span>
            <span className="text-[10px] text-sand-300 truncate">Owner & Administrator</span>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-lg text-sand-300 hover:text-rosewood-200 hover:bg-forest-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
