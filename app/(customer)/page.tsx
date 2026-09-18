'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
  Home as HomeIcon,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Gift,
  Phone,
  MessageSquare,
  Star,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, packagesRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/packages'),
        ]);

        if (servicesRes.ok) {
          const sData = await servicesRes.json();
          setFeaturedServices(sData.services?.slice(0, 6) || []);
        }

        if (packagesRes.ok) {
          const pData = await packagesRes.json();
          setPackages(pData.packages || []);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden lotus-gradient-bg py-12 sm:py-20 lg:py-24 border-b border-sand-200/60">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-forest-700/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>Kerala's Premium Home-Service Beauty & Parlour</span>
              </div>

              {/* Title & Slogan */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-brand text-forest-900 tracking-tight leading-[1.15]">
                  Your Relaxation, <br />
                  <span className="text-gold-600 italic">Our Priority</span>
                </h1>
                <p className="text-base sm:text-lg text-forest-700 font-serif-brand italic font-medium pt-1">
                  Relax • Rejuvenate • Renew
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Indulge in authentic Ayurvedic massages, rejuvenating glow facials, expert saree draping, and professional beauty parlour services — right at your doorstep.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/book"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-base font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow-luxury hover:shadow-xl transition-all duration-200 border border-gold-500/30 active:scale-95 group"
                >
                  <Calendar className="w-5 h-5 text-gold-400 group-hover:rotate-12 transition-transform" />
                  <span>Book Appointment</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-gold-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-forest-800 bg-sand-100/90 hover:bg-sand-200/90 border border-sand-300/80 transition-colors"
                >
                  <span>Explore Services</span>
                </Link>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>No login required to book</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>Verified 100% Herbal & Quality Products</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-sand-100 aspect-[4/5] sm:aspect-[3/3]">
                  <img
                    src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80"
                    alt="Kerala Ayurvedic Massage and Beauty Service"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-sand-200 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-forest-900 font-serif-brand">Shez Blooming Home Care</p>
                        <p className="text-[11px] text-stone-500">Subbulakshmi Das • Master Beautician</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 text-amber-800 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Decorative Gold Lotus badge */}
                <div className="hidden sm:flex absolute -top-4 -left-4 bg-forest-800 text-gold-400 p-3 rounded-2xl shadow-xl border border-gold-500/40 items-center gap-2 animate-bounce duration-1000">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  <div className="text-left">
                    <p className="text-[10px] text-sand-200 uppercase font-bold tracking-wider">Festival Special</p>
                    <p className="text-xs font-bold text-cream-50">Onam & Dhamaka Offers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust & Value Points */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-soft hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700 mb-4 group-hover:scale-110 transition-transform">
              <HomeIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-900 text-sm sm:text-base mb-1">At Your Doorstep</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Relax in your personal haven while we bring all equipment, hygienic mats, and spa kits to you.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-soft hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-900 text-sm sm:text-base mb-1">Quality Products</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We exclusively use authentic Ayurvedic oils, single-use sanitised kits, and trusted salon brands.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-soft hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-forest-50 flex items-center justify-center text-forest-700 mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-900 text-sm sm:text-base mb-1">Flexible Timings</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Morning to evening slots (8 AM – 8 PM) tailored to fit smoothly into your busy lifestyle.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-soft hover:border-gold-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600 mb-4 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-forest-900 text-sm sm:text-base mb-1">Personal Care</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Dedicated 1-on-1 attention with customized pressure and beauty solutions for your skin and body.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Featured Promotional Packages / Offers */}
      {packages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-cream-50 relative overflow-hidden shadow-2xl border border-gold-500/30">
            {/* Lotus background motif */}
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
              <Sparkles className="w-96 h-96 text-gold-400" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-semibold mb-2">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Special Value Bundles</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold font-serif-brand">
                    Festival & Combo Offers
                  </h2>
                  <p className="text-sand-300 text-xs sm:text-sm mt-1">
                    Carefully curated beauty packages designed to give you maximum rejuvenation with great savings.
                  </p>
                </div>
                <Link
                  href="/offers"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                >
                  <span>View All Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-forest-800/80 backdrop-blur-md rounded-2xl p-6 border border-gold-500/30 shadow-lg flex flex-col justify-between hover:border-gold-400 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-gold-500 text-forest-950 font-bold text-xs uppercase tracking-wider">
                          {pkg.badgeText || 'Special Offer'}
                        </span>
                        {pkg.savings && (
                          <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            Save {formatCurrency(pkg.savings)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-serif-brand text-cream-50 mt-1">
                        {pkg.title}
                      </h3>
                      <p className="text-xs text-sand-300 mt-1.5 leading-relaxed">
                        {pkg.description}
                      </p>

                      {pkg.items && pkg.items.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-forest-700/60">
                          <p className="text-[11px] font-semibold text-gold-400 uppercase tracking-wider mb-2">
                            Included Services:
                          </p>
                          <ul className="space-y-1 text-xs text-sand-200">
                            {pkg.items.map((it: any, idx: number) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                                <span>{it.service?.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-forest-700 flex items-center justify-between">
                      <div>
                        {pkg.originalPrice && (
                          <span className="text-xs text-stone-400 line-through mr-2">
                            {formatCurrency(pkg.originalPrice)}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-gold-400 font-serif-brand">
                          {formatCurrency(pkg.price)}
                        </span>
                      </div>
                      <Link
                        href={`/book?packageId=${pkg.id}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold text-forest-950 bg-gold-400 hover:bg-gold-300 shadow transition-all active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Package</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Popular Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100 text-forest-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Signature Treatments</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-brand text-forest-900">
            Popular Beauty & Massage Services
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Handcrafted treatments tailored for stress relief, radiant skin, and special occasion styling.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-sand-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-soft hover:shadow-luxury hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Service Image */}
                  <div className="relative h-48 w-full bg-sand-100 overflow-hidden">
                    <img
                      src={
                        service.imageUrl ||
                        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
                      }
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-forest-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-cream-50 text-[11px] font-semibold border border-gold-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-400" />
                      <span>{service.durationMins} mins</span>
                    </div>
                    {service.isHomeService && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-forest-800 text-[10px] font-bold shadow-sm">
                        Home Service
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded">
                      {service.category?.name || 'Service'}
                    </span>
                    <h3 className="font-bold text-base text-forest-900 mt-2 line-clamp-1 group-hover:text-forest-700">
                      {service.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="px-5 pb-5 pt-2 border-t border-sand-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-medium">Price</span>
                    <span className="text-lg font-bold text-forest-900 font-serif-brand">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <Link
                    href={`/book?serviceId=${service.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-cream-50 bg-forest-700 hover:bg-forest-800 active:scale-95 shadow transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    <span>Book Now</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-forest-800 bg-sand-100 hover:bg-sand-200 border border-sand-300 transition-colors"
          >
            <span>Explore Complete Service Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. How It Works (4-Step Flow) */}
      <section className="bg-sand-100/60 py-12 sm:py-16 border-y border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-forest-900">
              Effortless Booking In 4 Easy Steps
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              No complicated logins or pre-payments required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Select Services',
                desc: 'Browse our extensive menu or festive combo offers and choose what you need.',
              },
              {
                step: '02',
                title: 'Choose Date & Slot',
                desc: 'Select your preferred day and available time slot with zero double-booking.',
              },
              {
                step: '03',
                title: 'Enter Contact & Address',
                desc: 'Provide your mobile number to pre-fill saved details or create a new profile.',
              },
              {
                step: '04',
                title: 'Instant Confirmation',
                desc: 'Receive your unique booking reference and direct WhatsApp contact for your beautician.',
              },
            ].map((st, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm relative">
                <span className="text-3xl font-bold font-serif-brand text-gold-500/40 absolute top-4 right-4">
                  {st.step}
                </span>
                <div className="w-8 h-8 rounded-full bg-forest-700 text-gold-400 font-bold text-xs flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-forest-900 text-sm mb-1">{st.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Founder Subbulakshmi Das Note & Direct Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-600">
              Personalized Touch
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-brand text-forest-900">
              A Warm Note from Subbulakshmi Das
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed italic font-serif-brand">
              "At Shez Blooming, beauty is more than a routine — it is a sanctuary of comfort and rejuvenation. Whether you need a soothing Ayurvedic back massage after a long week or traditional styling for a festive celebration, I personally ensure the highest quality of hygiene, relaxation, and care right at your home."
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-forest-900 border border-sand-300 transition-colors"
              >
                <Phone className="w-4 h-4 text-forest-700" />
                <span>Call Subbulakshmi (+91 98765 43210)</span>
              </a>
              <a
                href="https://wa.me/919876543210?text=Hello%20Subbulakshmi,%20I%20would%20like%20to%20inquire%20about%20a%20home%20service%20booking"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white shadow transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 text-center lg:text-right">
            <div className="inline-block p-6 rounded-2xl bg-forest-50 border border-forest-100">
              <p className="text-2xl font-bold text-forest-900 font-serif-brand">Shez Blooming</p>
              <p className="text-xs text-gold-600 font-medium">Massage & Parlour</p>
              <div className="my-3 border-t border-forest-200/60" />
              <p className="text-xs text-stone-600 font-medium">100% Home-Service Guaranteed</p>
              <p className="text-[11px] text-stone-400 mt-1">Kerala & Surrounding Regions</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
