'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Home as HomeIcon,
  Boxes,
  X,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    benefits: '',
    durationMins: 45,
    price: 499,
    isHomeService: true,
    imageUrl: '',
    materials: [] as { inventoryItemId: string; quantityRequired: number; unit: string }[],
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [srvRes, catRes, invRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/categories'),
        fetch('/api/inventory'),
      ]);

      if (srvRes.ok) {
        const s = await srvRes.json();
        setServices(s.services || []);
      }
      if (catRes.ok) {
        const c = await catRes.json();
        setCategories(c.categories || []);
      }
      if (invRes.ok) {
        const i = await invRes.json();
        setInventoryItems(i.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openCreateModal = () => {
    setEditingServiceId(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      benefits: '',
      durationMins: 45,
      price: 499,
      isHomeService: true,
      imageUrl: '',
      materials: [],
    });
    setShowServiceModal(true);
  };

  const openEditModal = (service: any) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      categoryId: service.categoryId,
      description: service.description || '',
      benefits: service.benefits || '',
      durationMins: service.durationMins,
      price: service.price,
      isHomeService: service.isHomeService,
      imageUrl: service.imageUrl || '',
      materials: service.materials?.map((m: any) => ({
        inventoryItemId: m.inventoryItemId,
        quantityRequired: m.quantityRequired,
        unit: m.unit,
      })) || [],
    });
    setShowServiceModal(true);
  };

  const addMaterialRow = () => {
    if (inventoryItems.length === 0) return;
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        {
          inventoryItemId: inventoryItems[0].id,
          quantityRequired: 1,
          unit: inventoryItems[0].unit,
        },
      ],
    });
  };

  const removeMaterialRow = (idx: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== idx),
    });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingServiceId ? `/api/services/${editingServiceId}` : '/api/services';
      const method = editingServiceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowServiceModal(false);
        loadAll();
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
            Services Catalog & Material Config
          </h1>
          <p className="text-xs text-stone-500">
            Define beauty treatments, pricing, duration, and link automated consumable deduction formulas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-forest-700 text-cream-50 hover:bg-forest-800 shadow"
        >
          <Plus className="w-3.5 h-3.5 text-gold-400" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl p-5 border border-sand-200 shadow-soft flex flex-col justify-between space-y-3 hover:border-gold-500/40 transition-all"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-2 py-0.5 rounded">
                  {srv.category?.name}
                </span>
                <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" /> {srv.durationMins}m
                </span>
              </div>

              <h3 className="font-bold text-base text-stone-900">{srv.name}</h3>
              <p className="text-xs text-stone-500 line-clamp-2">{srv.description}</p>

              {/* Material Linkages */}
              {srv.materials && srv.materials.length > 0 && (
                <div className="pt-2 border-t border-sand-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1 mb-1">
                    <Boxes className="w-3 h-3 text-forest-700" /> Consumes Per Session:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {srv.materials.map((m: any, idx: number) => (
                      <span key={idx} className="bg-sand-100 text-stone-700 text-[10px] px-2 py-0.5 rounded">
                        {m.inventoryItem?.name} ({m.quantityRequired} {m.unit})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-sand-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Price</span>
                <span className="text-lg font-bold text-forest-900 font-serif-brand">
                  {formatCurrency(srv.price)}
                </span>
              </div>
              <button
                onClick={() => openEditModal(srv)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sand-100 hover:bg-sand-200 text-stone-700"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-sand-200 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-sand-100">
              <h2 className="text-base font-bold font-serif-brand text-forest-900">
                {editingServiceId ? 'Edit Beauty Service' : 'Create New Beauty Service'}
              </h2>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 uppercase block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 uppercase block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={formData.durationMins}
                    onChange={(e) => setFormData({ ...formData, durationMins: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                    <input
                      type="checkbox"
                      checked={formData.isHomeService}
                      onChange={(e) => setFormData({ ...formData, isHomeService: e.target.checked })}
                      className="accent-forest-700"
                    />
                    <span>Available as Home Service</span>
                  </label>
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
                <label className="font-bold text-stone-700 uppercase block mb-1">Benefits / Notes</label>
                <input
                  type="text"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="w-full px-3 py-1.5 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                />
              </div>

              {/* Material Consumption Configuration */}
              <div className="pt-2 border-t border-sand-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold text-forest-900 uppercase block">
                    Material Consumption (Auto-Deduction)
                  </label>
                  <button
                    type="button"
                    onClick={addMaterialRow}
                    className="text-[11px] text-forest-700 font-bold hover:underline"
                  >
                    + Add Consumable
                  </button>
                </div>

                {formData.materials.map((mat, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <select
                      value={mat.inventoryItemId}
                      onChange={(e) => {
                        const sel = inventoryItems.find((x) => x.id === e.target.value);
                        const updated = [...formData.materials];
                        updated[idx].inventoryItemId = e.target.value;
                        if (sel) updated[idx].unit = sel.unit;
                        setFormData({ ...formData, materials: updated });
                      }}
                      className="flex-1 px-2 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs"
                    >
                      {inventoryItems.map((inv) => (
                        <option key={inv.id} value={inv.id}>{inv.name} ({inv.unit})</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="any"
                      placeholder="Qty"
                      value={mat.quantityRequired}
                      onChange={(e) => {
                        const updated = [...formData.materials];
                        updated[idx].quantityRequired = Number(e.target.value);
                        setFormData({ ...formData, materials: updated });
                      }}
                      className="w-16 px-2 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs"
                    />
                    <span className="text-[10px] text-stone-400 w-10">{mat.unit}</span>
                    <button
                      type="button"
                      onClick={() => removeMaterialRow(idx)}
                      className="text-rosewood-600 hover:text-rosewood-800 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-sand-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
