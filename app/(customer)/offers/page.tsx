'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gift, Sparkles, CheckCircle2, Calendar, ArrowRight, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function OffersPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch('/api/packages');
        if (res.ok) {
          const data = await res.json();
          setPackages(data.packages || []);
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold">
          <Gift className="w-3.5 h-3.5 text-gold-600" />
          <span>Exclusive Beauty Packages</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-brand text-forest-900">
          Special Festive & Combo Offers
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Save more with our bundled head-to-toe beauty and massage rituals.
        </p>
      </div>

      {/* Offers Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-soft hover:shadow-luxury hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-sand-100 overflow-hidden">
                  <img
                    src={
                      pkg.imageUrl ||
                      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-wider shadow">
                      {pkg.badgeText || 'Special Offer'}
                    </span>
                  </div>

                  {pkg.savings && (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                      Save {formatCurrency(pkg.savings)}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-2xl font-bold font-serif-brand leading-tight">
                      {pkg.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Included items */}
                  {pkg.items && pkg.items.length > 0 && (
                    <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200">
                      <p className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-2.5 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-gold-600" />
                        <span>Included Services In This Bundle:</span>
                      </p>
                      <ul className="space-y-2 text-xs text-stone-700">
                        {pkg.items.map((it: any, idx: number) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                              <span>{it.service?.name}</span>
                            </span>
                            {it.service?.price && (
                              <span className="text-stone-400 text-[11px]">
                                {formatCurrency(it.service.price)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Price & Booking footer */}
              <div className="p-6 pt-4 border-t border-sand-200 bg-sand-50/50 flex items-center justify-between">
                <div>
                  {pkg.originalPrice && (
                    <span className="text-xs text-stone-400 line-through block">
                      Valued at {formatCurrency(pkg.originalPrice)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-forest-900 font-serif-brand">
                    {formatCurrency(pkg.price)}
                  </span>
                </div>
                <Link
                  href={`/book?packageId=${pkg.id}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow-luxury transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span>Book Package</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
