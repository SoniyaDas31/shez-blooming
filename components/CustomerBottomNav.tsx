'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Calendar, CalendarCheck, MoreHorizontal } from 'lucide-react';

export default function CustomerBottomNav() {
  const pathname = usePathname();

  // Don't show on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Services', href: '/services', icon: Sparkles },
    { name: 'Book', href: '/book', icon: Calendar, highlight: true },
    { name: 'Appts', href: '/appointments', icon: CalendarCheck },
    { name: 'Contact', href: '/contact', icon: MoreHorizontal },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream-50/95 backdrop-blur-lg border-t border-sand-300/80 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center -mt-5 relative group"
              >
                <div className="w-13 h-13 p-3.5 rounded-full bg-forest-700 text-cream-50 shadow-luxury border-2 border-gold-400 group-active:scale-95 transition-transform flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gold-400" />
                </div>
                <span className="text-[11px] font-semibold text-forest-700 mt-1">Book</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-1.5 px-3 rounded-lg transition-colors ${
                isActive ? 'text-forest-700 font-semibold' : 'text-stone-500 hover:text-forest-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-forest-700 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
