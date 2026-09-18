'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  CalendarDays,
  Users,
  Sparkles,
  Gift,
  Boxes,
  Wallet,
  TrendingUp,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Billing', href: '/admin/billing', icon: ReceiptText, highlight: true },
  { name: 'Appointments', href: '/admin/appointments', icon: CalendarDays },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Services', href: '/admin/services', icon: Sparkles },
  { name: 'Packages', href: '/admin/packages', icon: Gift },
  { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { name: 'Expenses', href: '/admin/expenses', icon: Wallet },
  { name: 'Finance (P&L)', href: '/admin/finance', icon: TrendingUp },
  { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't show admin navigation
  if (pathname === '/admin/login') {
    return null;
  }

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
    <header className="bg-forest-900 text-cream-50 border-b border-forest-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo variant="light" size="sm" />
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
              Admin Suite
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {ADMIN_LINKS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              if (item.highlight) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gold-500 text-forest-950 shadow'
                        : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 border border-gold-500/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-700 text-cream-50 font-bold border-b-2 border-gold-400'
                      : 'text-sand-200/80 hover:text-cream-50 hover:bg-forest-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-400' : 'text-stone-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forest-800 text-sand-200 text-xs hover:text-cream-50 hover:bg-forest-700 transition-colors"
              title="Open Public Customer Site"
            >
              <span>Live Site</span>
              <ArrowUpRight className="w-3 h-3 text-gold-400" />
            </Link>

            <div className="hidden sm:flex flex-col text-right pr-1">
              <span className="text-xs font-semibold text-cream-50">Subbulakshmi Das</span>
              <span className="text-[10px] text-sand-300">8693068321</span>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-xl text-sand-300 hover:text-rosewood-200 hover:bg-forest-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-sand-200 hover:text-white hover:bg-forest-800"
              aria-label="Toggle Admin Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Admin Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-forest-950 border-t border-forest-800 px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-1.5 pb-3">
            {ADMIN_LINKS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-700 text-cream-50 border-l-4 border-gold-400'
                      : 'text-sand-200 hover:bg-forest-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-forest-800 flex items-center justify-between text-xs text-sand-300">
            <Link
              href="/"
              target="_blank"
              className="text-gold-400 hover:underline flex items-center gap-1"
            >
              <span>View Customer Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-rosewood-300 hover:text-rosewood-200 flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
