'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  X,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { format } from 'date-fns';

const EXPENSE_CATEGORIES = [
  { key: 'ALL', label: 'All Expenses' },
  { key: 'PRODUCT_PURCHASE', label: 'Product Purchases' },
  { key: 'TRAVEL', label: 'Travel & Conveyance' },
  { key: 'EQUIPMENT', label: 'Equipment & Tools' },
  { key: 'MARKETING', label: 'Marketing' },
  { key: 'PACKAGING', label: 'Packaging' },
  { key: 'TRAINING', label: 'Training' },
  { key: 'UTILITIES', label: 'Utilities' },
  { key: 'MOBILE_INTERNET', label: 'Mobile & Internet' },
  { key: 'MISCELLANEOUS', label: 'Miscellaneous' },
];

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'PRODUCT_PURCHASE',
    date: format(new Date(), 'yyyy-MM-dd'),
    paymentMethod: 'UPI',
  });

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/expenses?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
        setTotalAmount(data.totalAmount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [selectedCategory]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });
      if (res.ok) {
        setShowModal(false);
        setNewExpense({
          description: '',
          amount: '',
          category: 'PRODUCT_PURCHASE',
          date: format(new Date(), 'yyyy-MM-dd'),
          paymentMethod: 'UPI',
        });
        loadExpenses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) loadExpenses();
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
            Business Expense Tracker
          </h1>
          <p className="text-xs text-stone-500">
            Log product purchases, travel conveyance, tools, and operational overheads.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-700 text-cream-50 hover:bg-forest-800 shadow"
        >
          <Plus className="w-3.5 h-3.5 text-gold-400" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase text-stone-400 block">Total Expenses In Scope</span>
          <p className="text-2xl font-bold font-serif-brand text-rosewood-700 mt-0.5">
            {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="p-3 bg-rosewood-50 text-rosewood-700 rounded-2xl">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {EXPENSE_CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.key
                  ? 'bg-forest-700 text-cream-50'
                  : 'bg-white text-stone-600 border border-sand-200 hover:bg-sand-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadExpenses();
          }}
          className="relative w-full sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-sand-300 rounded-full text-xs focus:outline-none"
          />
        </form>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sand-100/70 text-forest-900 border-b border-sand-200">
              <tr>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Description</th>
                <th className="py-3 px-4 font-bold">Mode</th>
                <th className="py-3 px-4 font-bold text-right">Amount</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-sand-50/50">
                  <td className="py-3 px-4 text-stone-500 font-medium">{formatDate(exp.date)}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sand-200 text-stone-700 uppercase">
                      {exp.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-800">{exp.description}</td>
                  <td className="py-3 px-4 text-stone-500 text-xs">{exp.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-bold text-rosewood-700 font-serif-brand">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-stone-400 hover:text-rosewood-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-sand-200 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-sand-100">
              <h3 className="font-bold text-base font-serif-brand text-forest-900">
                Record Business Expense
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sleek Hot Wax + Detan kit purchase"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-semibold"
                  >
                    <option value="PRODUCT_PURCHASE">Product Purchase</option>
                    <option value="TRAVEL">Travel / Fuel</option>
                    <option value="EQUIPMENT">Equipment & Tools</option>
                    <option value="MARKETING">Marketing / Ads</option>
                    <option value="PACKAGING">Packaging</option>
                    <option value="TRAINING">Training</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="MOBILE_INTERNET">Mobile / Internet</option>
                    <option value="MISCELLANEOUS">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Payment Method</label>
                  <select
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-semibold"
                  >
                    <option value="UPI">UPI (GPay/PhonePe)</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
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
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
