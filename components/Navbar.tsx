'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';
import { Sparkles, Calendar, Phone, Lock, Menu, X, Gift, HeartHandshake } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Offers', href: '/offers' },
    { name: 'Book Appointment', href: '/book', highlight: true },
    { name: 'My Bookings', href: '/appointments' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-sand-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gold-500/30 active:scale-95"
                  >
                    <Calendar className="w-4 h-4 text-gold-400" />
                    {link.name}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-forest-700 font-semibold bg-sand-100'
                      : 'text-stone-600 hover:text-forest-700 hover:bg-sand-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Portal Link */}
            <Link
              href="/admin/login"
              className="ml-3 p-2 text-stone-400 hover:text-forest-700 rounded-full hover:bg-sand-100 transition-colors"
              title="Admin Business Login"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-cream-50 bg-forest-700 active:scale-95 shadow"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              Book
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-forest-700 hover:bg-sand-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50 border-b border-sand-200 px-4 pt-2 pb-6 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-forest-700 text-cream-50 font-semibold'
                    : 'text-stone-700 hover:bg-sand-100'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-sand-200 mt-2">
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:text-forest-700"
            >
              <Lock className="w-4 h-4" />
              Admin Management Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
