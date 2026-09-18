'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Plus, Edit2, Trash2, CheckCircle2, Tag, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 999,
    originalPrice: 1200,
    savings: 201,
    badgeText: 'Special Offer',
    serviceIds: [] as string[],
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgRes, srvRes] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/services'),
      ]);

      if (pkgRes.ok) setPackages((await pkgRes.json()).packages || []);
      if (srvRes.ok) setServices((await srvRes.json()).services || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      price: 999,
      originalPrice: 1200,
      savings: 201,
      badgeText: 'Special Offer',
      serviceIds: [],
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/packages/${editingId}` : '/api/packages';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleServiceInPackage = (serviceId: string) => {
    const exists = formData.serviceIds.includes(serviceId);
    if (exists) {
      setFormData({
        ...formData,
        serviceIds: formData.serviceIds.filter((id) => id !== serviceId),
      });
    } else {
      setFormData({
        ...formData,
        serviceIds: [...formData.serviceIds, serviceId],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div>
          <h1 className="text-xl font-bold font-serif-brand text-forest-900">
            Packages & Festive Offers Manager
          </h1>
          <p className="text-xs text-stone-500">
            Create promotional bundled deals (e.g. Onam Adipoli Offer, Triple Dhamaka) to boost bookings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-700 text-cream-50 hover:bg-forest-800 shadow"
        >
          <Plus className="w-3.5 h-3.5 text-gold-400" />
          <span>Create New Offer</span>
        </button>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2.5 py-0.5 rounded">
                  {pkg.badgeText || 'Bundle'}
                </span>
                {pkg.savings && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Save {formatCurrency(pkg.savings)}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg text-forest-900 font-serif-brand">{pkg.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{pkg.description}</p>

              {/* Included items */}
              {pkg.items && pkg.items.length > 0 && (
                <div className="bg-sand-50 p-3 rounded-xl border border-sand-200 text-xs">
                  <span className="font-bold text-[10px] uppercase text-stone-400 block mb-1">
                    Included Services ({pkg.items.length}):
                  </span>
                  <ul className="space-y-1 text-stone-700">
                    {pkg.items.map((it: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                        <span>{it.service?.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-sand-100 flex items-center justify-between">
              <div>
                {pkg.originalPrice && (
                  <span className="text-xs text-stone-400 line-through block">
                    {formatCurrency(pkg.originalPrice)}
                  </span>
                )}
                <span className="text-2xl font-bold text-forest-900 font-serif-brand">
                  {formatCurrency(pkg.price)}
                </span>
              </div>

              <span className="text-xs font-bold text-forest-800 bg-sand-100 px-3 py-1 rounded-full">
                Active Offer
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-sand-200 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-sand-100">
              <h2 className="text-base font-bold font-serif-brand text-forest-900">
                Create Promotional Package
              </h2>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Triple Dhamaka Offer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Badge / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Most Popular / Festive Special"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Offer Price *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Original Price</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Savings</label>
                  <input
                    type="number"
                    value={formData.savings}
                    onChange={(e) => setFormData({ ...formData, savings: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Select Included Services</label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-sand-200 p-2 rounded-xl bg-sand-50">
                  {services.map((srv) => {
                    const isChecked = formData.serviceIds.includes(srv.id);
                    return (
                      <label key={srv.id} className="flex items-center gap-2 cursor-pointer text-xs p-1 hover:bg-sand-100 rounded">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleServiceInPackage(srv.id)}
                          className="accent-forest-700"
                        />
                        <span className="font-medium text-stone-800">{srv.name} ({formatCurrency(srv.price)})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
