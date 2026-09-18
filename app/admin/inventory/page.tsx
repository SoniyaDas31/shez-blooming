'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Filter,
  RefreshCw,
  X,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalValuation, setTotalValuation] = useState<number>(0);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [filter, setFilter] = useState('all'); // all, low_stock
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItemForStock, setSelectedItemForStock] = useState<any | null>(null);

  // New Item State
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Consumables',
    unit: 'ml',
    openingQuantity: 100,
    minStockLevel: 20,
    purchasePrice: 200,
    supplier: '',
  });

  // Stock Transaction State
  const [stockTx, setStockTx] = useState({
    type: 'PURCHASE_STOCK_IN',
    quantity: 10,
    notes: '',
  });

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/inventory?filter=${filter}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
        setTotalValuation(data.totalValuation || 0);
        setLowStockCount(data.lowStockCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [filter]);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      });
      if (res.ok) {
        setShowItemModal(false);
        loadInventory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStockTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForStock) return;
    try {
      const res = await fetch('/api/inventory/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryItemId: selectedItemForStock.id,
          type: stockTx.type,
          quantity: Number(stockTx.quantity),
          notes: stockTx.notes,
        }),
      });
      if (res.ok) {
        setShowStockModal(false);
        loadInventory();
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
            Inventory & Consumables Control
          </h1>
          <p className="text-xs text-stone-500">
            Track salon supplies, oils, facial kits, stock adjustments, and material costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowItemModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-700 text-cream-50 hover:bg-forest-800 shadow"
          >
            <Plus className="w-3.5 h-3.5 text-gold-400" />
            <span>Add Inventory Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs font-bold uppercase text-stone-400 block">Total Catalog Items</span>
          <p className="text-2xl font-bold font-serif-brand text-forest-900 mt-1">{items.length} Products</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft">
          <span className="text-xs font-bold uppercase text-stone-400 block">Total Inventory Valuation</span>
          <p className="text-2xl font-bold font-serif-brand text-stone-900 mt-1">{formatCurrency(totalValuation)}</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-soft ${lowStockCount > 0 ? 'bg-rosewood-50 border-rosewood-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <span className="text-xs font-bold uppercase text-stone-600 block">Low Stock Alerts</span>
          <p className={`text-2xl font-bold font-serif-brand mt-1 ${lowStockCount > 0 ? 'text-rosewood-700' : 'text-emerald-800'}`}>
            {lowStockCount} Products Need Restock
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
              filter === 'all' ? 'bg-forest-700 text-cream-50' : 'bg-white text-stone-600 border border-sand-200'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter('low_stock')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              filter === 'low_stock' ? 'bg-rosewood-600 text-white' : 'bg-white text-rosewood-700 border border-rosewood-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock ({lowStockCount})</span>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            loadInventory();
          }}
          className="relative w-full sm:w-64"
        >
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product, supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-sand-300 rounded-full text-xs"
          />
        </form>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sand-100/70 text-forest-900 border-b border-sand-200">
              <tr>
                <th className="py-3 px-4 font-bold">Product Name</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Current Stock</th>
                <th className="py-3 px-4 font-bold">Min Threshold</th>
                <th className="py-3 px-4 font-bold">Cost / Unit</th>
                <th className="py-3 px-4 font-bold">Total Value</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {items.map((it) => {
                const isLow = it.currentQuantity <= it.minStockLevel;
                const itemVal = it.currentQuantity * (it.purchasePrice || 0);
                return (
                  <tr key={it.id} className={`hover:bg-sand-50/50 ${isLow ? 'bg-rosewood-50/30' : ''}`}>
                    <td className="py-3 px-4 font-semibold text-stone-900">{it.name}</td>
                    <td className="py-3 px-4 text-stone-500">{it.category}</td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${isLow ? 'text-rosewood-700' : 'text-stone-800'}`}>
                        {it.currentQuantity} {it.unit}
                      </span>
                      {isLow && (
                        <span className="ml-2 text-[10px] bg-rosewood-600 text-white font-bold px-1.5 py-0.2 rounded uppercase">
                          Low
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-500">{it.minStockLevel} {it.unit}</td>
                    <td className="py-3 px-4 text-stone-600">{formatCurrency(it.purchasePrice)}</td>
                    <td className="py-3 px-4 font-bold text-stone-900">{formatCurrency(itemVal)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedItemForStock(it);
                          setShowStockModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sand-100 hover:bg-forest-700 hover:text-cream-50 text-stone-700 transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showStockModal && selectedItemForStock && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-sand-200 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-sand-100">
              <h3 className="font-bold text-base font-serif-brand text-forest-900">
                Adjust Stock: {selectedItemForStock.name}
              </h3>
              <button onClick={() => setShowStockModal(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Current Available Quantity: <strong className="text-forest-900">{selectedItemForStock.currentQuantity} {selectedItemForStock.unit}</strong>
            </p>

            <form onSubmit={handleStockTransaction} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Adjustment Type</label>
                <select
                  value={stockTx.type}
                  onChange={(e) => setStockTx({ ...stockTx, type: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                >
                  <option value="PURCHASE_STOCK_IN">+ Purchase / Stock In</option>
                  <option value="MANUAL_ADJUSTMENT">Manual Stock Correction</option>
                  <option value="DAMAGED_WASTED">- Damaged / Wasted Product</option>
                  <option value="EXPIRED">- Expired Stock Removal</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Quantity ({selectedItemForStock.unit})</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={stockTx.quantity}
                  onChange={(e) => setStockTx({ ...stockTx, quantity: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Reason / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Bought from local supplier / spilled bottle"
                  value={stockTx.notes}
                  onChange={(e) => setStockTx({ ...stockTx, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow"
                >
                  Record Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-sand-200 animate-fadeIn">
            <div className="flex justify-between items-center pb-2 border-b border-sand-100">
              <h3 className="font-bold text-base font-serif-brand text-forest-900">
                Add New Inventory Consumable
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Product / Consumable Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavender Herbal Massage Oil"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Category</label>
                  <input
                    type="text"
                    value={newItemData.category}
                    onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Unit of Measurement</label>
                  <select
                    value={newItemData.unit}
                    onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  >
                    <option value="ml">ml (Milliliters)</option>
                    <option value="g">g (Grams)</option>
                    <option value="units">units (Pcs/Sheets)</option>
                    <option value="packs">packs</option>
                    <option value="kg">kg</option>
                    <option value="litre">litre</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Opening Stock</label>
                  <input
                    type="number"
                    value={newItemData.openingQuantity}
                    onChange={(e) => setNewItemData({ ...newItemData, openingQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={newItemData.minStockLevel}
                    onChange={(e) => setNewItemData({ ...newItemData, minStockLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newItemData.purchasePrice}
                    onChange={(e) => setNewItemData({ ...newItemData, purchasePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
