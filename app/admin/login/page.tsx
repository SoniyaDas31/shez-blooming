'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { Lock, Phone, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('8693068321');
  const [password, setPassword] = useState('Soniya@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('sb_admin_user', JSON.stringify(data.user));
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 lotus-gradient-bg py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-sand-200 shadow-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <BrandLogo size="md" />
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-[11px] font-bold uppercase tracking-wider mt-2">
              Business Owner Portal
            </span>
            <h2 className="text-xl font-bold font-serif-brand text-forest-900 mt-2">
              Admin Login
            </h2>
            <p className="text-xs text-stone-500">
              Enter your registered mobile number and password.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rosewood-50 border border-rosewood-200 text-rosewood-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-stone-400">Default: Soniya@123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow-luxury transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-sand-200 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>Secure 256-bit Encrypted Session</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Founder: Subbulakshmi Das • Shez Blooming
          </p>
        </div>
      </div>
    </div>
  );
}
