'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  Calendar,
  DollarSign,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // all, repeat, new, high_value
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', mobile: '', whatsapp: '', address: '', landmark: '', notes: '' });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/customers?filter=${filter}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filter]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCust),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCust({ name: '', mobile: '', whatsapp: '', address: '', landmark: '', notes: '' });
        fetchCustomers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div>
          <h1 className="text-xl font-bold font-serif-brand text-forest-900">
            Customer Relationship Management (CRM)
          </h1>
          <p className="text-xs text-stone-500">
            Lifetime visit histories, total spend analytics, and personalized client preferences.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-700 text-cream-50 hover:bg-forest-800 shadow"
        >
          <UserPlus className="w-3.5 h-3.5 text-gold-400" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { key: 'all', label: 'All Customers' },
            { key: 'repeat', label: 'Repeat Clients' },
            { key: 'new', label: 'New Clients' },
            { key: 'high_value', label: 'High-Value Clients' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-forest-700 text-cream-50'
                  : 'bg-white text-stone-600 border border-sand-200 hover:bg-sand-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCustomers();
          }}
          className="relative w-full sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-sand-300 rounded-full text-xs focus:outline-none focus:border-forest-700"
          />
        </form>
      </div>

      {/* Customer List Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-44 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-sand-200 p-6">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">No customers found</p>
          <p className="text-xs text-stone-400 mt-1">Try adjusting your search query or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <Link
              key={c.id}
              href={`/admin/customers/${c.id}`}
              className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft hover:shadow-luxury hover:border-gold-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-forest-700 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>{c.mobile}</span>
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.visitCount > 1
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-sand-100 text-stone-600'
                  }`}>
                    {c.visitCount > 1 ? `${c.visitCount} Visits` : '1st Visit'}
                  </span>
                </div>

                {c.address && (
                  <p className="text-xs text-stone-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-sand-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Lifetime Spend</span>
                  <span className="font-bold text-forest-900 font-serif-brand text-sm">
                    {formatCurrency(c.totalSpent || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-forest-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>History</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-sand-200 animate-fadeIn">
            <h2 className="text-lg font-bold font-serif-brand text-forest-900">
              Add New Customer
            </h2>
            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Customer name"
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={newCust.mobile}
                  onChange={(e) => setNewCust({ ...newCust, mobile: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">WhatsApp (Optional)</label>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                  value={newCust.whatsapp}
                  onChange={(e) => setNewCust({ ...newCust, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Home Service Address</label>
                <input
                  type="text"
                  placeholder="Address, Area, City"
                  value={newCust.address}
                  onChange={(e) => setNewCust({ ...newCust, address: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Notes / Preferences</label>
                <input
                  type="text"
                  placeholder="e.g. Likes gentle pressure, herbal oil preference"
                  value={newCust.notes}
                  onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
