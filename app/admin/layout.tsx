'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminHeader from '@/components/AdminHeader';
import AdminBottomNav from '@/components/AdminBottomNav';
import AdminFloatingMenu from '@/components/AdminFloatingMenu';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // If on login page, skip check
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    // Verify authentication via API
    async function verifyAdminAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        router.replace('/admin/login');
      }
    }

    verifyAdminAuth();
  }, [pathname, router]);

  // Login page gets its own full screen canvas
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading while verifying admin session
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-forest-700 border-t-gold-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-forest-900 font-serif-brand">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-sand-50">
      {/* Top Header Navigation (Left nav is hidden/removed as requested) */}
      <AdminHeader />

      {/* Main Full-Width Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12">
        {children}
      </main>

      {/* Floating Action Menu Button (Quick Bill, New Appt, Add Expense, Stock In, Reports) */}
      <AdminFloatingMenu />

      {/* Mobile Admin Bottom Nav */}
      <AdminBottomNav />
    </div>
  );
}
