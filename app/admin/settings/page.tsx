'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Lock, Store, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    businessName: 'Shez Blooming',
    subTitle: 'Massage & Parlour',
    slogan: 'Relax • Rejuvenate • Renew',
    founderName: 'Subbulakshmi Das',
    mobile: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    address: 'Home Service & Parlour, Kerala',
    startHour: '08:00',
    endHour: '20:00',
    slotDurationMins: 30,
    invoicePrefix: 'SB-INV-',
    lowStockThreshold: 5,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; error: boolean } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) setSettings(data.settings);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', error: true });
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setPasswordMsg({ text: 'Password successfully updated!', error: false });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordMsg({ text: err.message, error: true });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-sand-200">
        <h1 className="text-xl font-bold font-serif-brand text-forest-900">
          Business & System Settings
        </h1>
        <p className="text-xs text-stone-500">
          Configure salon brand details, operating hours, slot timings, and administrator security.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Business settings saved successfully!</span>
        </div>
      )}

      {/* Business Profile Settings */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-sand-100 text-forest-900">
          <Store className="w-4 h-4 text-gold-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Business & Brand Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">Founder / Owner Name</label>
            <input
              type="text"
              value={settings.founderName}
              onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">Brand Slogan</label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">Official Mobile Number</label>
            <input
              type="text"
              value={settings.mobile}
              onChange={(e) => setSettings({ ...settings, mobile: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-stone-700 uppercase block mb-1">Service Base Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="pt-4 border-t border-sand-200">
          <div className="flex items-center gap-2 pb-2 text-forest-900 mb-3">
            <Clock className="w-4 h-4 text-gold-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Working Hours & Slots</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 uppercase block mb-1">Opening Time</label>
              <input
                type="time"
                value={settings.startHour}
                onChange={(e) => setSettings({ ...settings, startHour: e.target.value })}
                className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 uppercase block mb-1">Closing Time</label>
              <input
                type="time"
                value={settings.endHour}
                onChange={(e) => setSettings({ ...settings, endHour: e.target.value })}
                className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 uppercase block mb-1">Slot Duration (Mins)</label>
              <input
                type="number"
                value={settings.slotDurationMins}
                onChange={(e) => setSettings({ ...settings, slotDurationMins: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-bold text-xs text-cream-50 bg-forest-700 hover:bg-forest-800 shadow"
          >
            <Save className="w-4 h-4 text-gold-400" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-sand-200 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-sand-100 text-forest-900">
          <Lock className="w-4 h-4 text-gold-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Change Admin Password</h2>
        </div>

        {passwordMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            passwordMsg.error ? 'bg-rosewood-50 text-rosewood-700 border border-rosewood-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {passwordMsg.error ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">Current Password</label>
            <input
              type="password"
              required
              placeholder="Current password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="Min 6 characters"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>
          <div>
            <label className="font-bold text-stone-700 uppercase block mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="Repeat new password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl font-bold text-xs bg-sand-100 hover:bg-sand-200 text-stone-800 border border-sand-300"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
