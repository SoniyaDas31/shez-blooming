import React from 'react';
import { Phone, MessageSquare, MapPin, Clock, Mail, Heart, Sparkles } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Get in Touch</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-brand text-forest-900">
          Contact Shez Blooming
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Have questions about our home service, packages, or custom treatments? We are here to help!
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct Phone */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-forest-900 font-serif-brand">Phone Booking & Inquiry</h3>
              <p className="text-xs text-stone-500 mt-1">
                Speak directly with Subbulakshmi Das for instant scheduling.
              </p>
            </div>
            <p className="text-lg font-bold text-forest-800 font-mono">+91 98765 43210</p>
          </div>
          <div className="pt-6">
            <a
              href="tel:+919876543210"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs sm:text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow transition-all active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>
        </div>

        {/* WhatsApp Instant Booking */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-soft flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-forest-900 font-serif-brand">WhatsApp Quick Support</h3>
              <p className="text-xs text-stone-500 mt-1">
                Send us a message for quick quotes, photos, and location coordinates.
              </p>
            </div>
            <p className="text-lg font-bold text-emerald-800 font-mono">+91 98765 43210</p>
          </div>
          <div className="pt-6">
            <a
              href="https://wa.me/919876543210?text=Hello%20Shez%20Blooming,%20I%20would%20like%20to%20book%20an%20appointment"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Hours & Location banner */}
      <div className="bg-forest-900 text-cream-50 p-8 rounded-3xl border border-forest-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gold-400">
            <Clock className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Business & Service Hours</h4>
          </div>
          <p className="text-xs text-sand-200 leading-relaxed">
            Monday through Sunday: <strong className="text-cream-50">08:00 AM – 08:00 PM</strong>
          </p>
          <p className="text-xs text-stone-400">
            Advance bookings are recommended for evening slots and weekend appointments.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gold-400">
            <MapPin className="w-5 h-5" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Service Coverage Area</h4>
          </div>
          <p className="text-xs text-sand-200 leading-relaxed">
            Full home-service across Kerala. Our beauticians travel to your residence with all necessary sanitized equipment and products.
          </p>
          <p className="text-xs text-stone-400">
            Travel & nominal conveyance charges apply based on kilometer distance.
          </p>
        </div>
      </div>
    </div>
  );
}
