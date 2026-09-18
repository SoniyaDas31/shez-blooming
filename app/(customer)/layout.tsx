import React from 'react';
import Navbar from '@/components/Navbar';
import CustomerBottomNav from '@/components/CustomerBottomNav';
import BrandLogo from '@/components/BrandLogo';
import Link from 'next/link';
import { Phone, MessageSquare, MapPin, Clock, Heart } from 'lucide-react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-10">{children}</main>
      
      {/* Public Footer */}
      <footer className="bg-forest-900 text-cream-50 border-t border-forest-800 pt-12 pb-24 md:pb-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-1">
              <BrandLogo variant="light" size="md" />
              <p className="text-sand-200 text-xs italic font-serif-brand">
                Relax • Rejuvenate • Renew
              </p>
              <p className="text-stone-300 text-xs leading-relaxed">
                Kerala's premier doorstep beauty and therapeutic massage service. Personalized wellness and beauty care delivered in the comfort of your home.
              </p>
              <p className="text-gold-400 text-xs font-semibold">
                Founder: Subbulakshmi Das
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs text-sand-200">
                <li><Link href="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
                <li><Link href="/services" className="hover:text-gold-400 transition-colors">All Services</Link></li>
                <li><Link href="/offers" className="hover:text-gold-400 transition-colors">Special Offers & Packages</Link></li>
                <li><Link href="/book" className="hover:text-gold-400 transition-colors">Book Appointment</Link></li>
                <li><Link href="/appointments" className="hover:text-gold-400 transition-colors">Track My Booking</Link></li>
                <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-3">
                Popular Services
              </h3>
              <ul className="space-y-2 text-xs text-sand-200">
                <li><Link href="/services?category=massage" className="hover:text-gold-400">Ayurvedic Body Massage</Link></li>
                <li><Link href="/services?category=facial" className="hover:text-gold-400">Basic Glow Facial</Link></li>
                <li><Link href="/services?category=other" className="hover:text-gold-400">Traditional Saree Draping</Link></li>
                <li><Link href="/services?category=makeup" className="hover:text-gold-400">Light Party Makeup</Link></li>
                <li><Link href="/services?category=waxing" className="hover:text-gold-400">Hot Waxing & Detan</Link></li>
              </ul>
            </div>

            {/* Contact & Hours */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-3">
                Connect With Us
              </h3>
              <ul className="space-y-2.5 text-xs text-sand-200">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <a
                    href="https://wa.me/919876543210?text=Hello%20Shez%20Blooming,%20I%20would%20like%20to%20inquire%20about%20booking"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gold-400 transition-colors underline"
                  >
                    WhatsApp Booking
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>Home Service Across Kerala</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Mon – Sun: 08:00 AM – 08:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-forest-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-300/80 gap-3">
            <p>© {new Date().getFullYear()} Shez Blooming Massage & Parlour. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/admin/login" className="text-sand-300 hover:text-gold-400 transition-colors">
                Admin Business Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Customer Bottom Navigation */}
      <CustomerBottomNav />
    </div>
  );
}
