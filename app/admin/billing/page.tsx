'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ReceiptText,
  Search,
  UserPlus,
  Plus,
  Trash2,
  CheckCircle2,
  DollarSign,
  Printer,
  Sparkles,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import PDFInvoice, { InvoiceData } from '@/components/PDFInvoice';

function BillingContent() {
  const searchParams = useSearchParams();
  const initialCustomerId = searchParams.get('customerId');
  const initialAppointmentId = searchParams.get('appointmentId');

  const [allServices, setAllServices] = useState<any[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    address: '',
    landmark: '',
  });

  // Billing Line Items
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [travelCharge, setTravelCharge] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<string>('PAID');
  const [notes, setNotes] = useState<string>('');

  // Generated Invoice state
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Fetch initial catalog
  useEffect(() => {
    async function loadData() {
      try {
        const [srvRes, pkgRes, custRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/packages'),
          fetch('/api/customers'),
        ]);

        if (srvRes.ok) {
          const s = await srvRes.json();
          setAllServices(s.services || []);
        }
        if (pkgRes.ok) {
          const p = await pkgRes.json();
          setAllPackages(p.packages || []);
        }
        if (custRes.ok) {
          const c = await custRes.json();
          const custList = c.customers || [];
          setCustomers(custList);

          if (initialCustomerId) {
            const found = custList.find((x: any) => x.id === initialCustomerId);
            if (found) setSelectedCustomer(found);
          }
        }

        // If from an appointment, load appointment items
        if (initialAppointmentId) {
          const apptRes = await fetch(`/api/appointments/${initialAppointmentId}`);
          if (apptRes.ok) {
            const aData = await apptRes.json();
            if (aData.appointment) {
              if (!initialCustomerId && aData.appointment.customer) {
                setSelectedCustomer(aData.appointment.customer);
              }
              const items = aData.appointment.items?.map((it: any) => ({
                serviceId: it.serviceId,
                packageId: it.packageId,
                description: it.itemTitle,
                quantity: 1,
                unitPrice: it.price,
                totalPrice: it.price,
              })) || [];
              setLineItems(items);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load billing catalog:', e);
      }
    }
    loadData();
  }, [initialCustomerId, initialAppointmentId]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.mobile.includes(customerSearch)
  );

  const addServiceItem = (service: any) => {
    const existingIndex = lineItems.findIndex((it) => it.serviceId === service.id);
    if (existingIndex > -1) {
      const updated = [...lineItems];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
      setLineItems(updated);
    } else {
      setLineItems([
        ...lineItems,
        {
          serviceId: service.id,
          description: service.name,
          quantity: 1,
          unitPrice: service.price,
          totalPrice: service.price,
        },
      ]);
    }
  };

  const addPackageItem = (pkg: any) => {
    setLineItems([
      ...lineItems,
      {
        packageId: pkg.id,
        description: pkg.title,
        quantity: 1,
        unitPrice: pkg.price,
        totalPrice: pkg.price,
      },
    ]);
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setLineItems(lineItems.filter((_, i) => i !== index));
      return;
    }
    const updated = [...lineItems];
    updated[index].quantity = newQty;
    updated[index].totalPrice = newQty * updated[index].unitPrice;
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce((sum, it) => sum + (it.totalPrice || 0), 0);
  const totalAmount = Math.max(0, subtotal - Number(discountAmount || 0) + Number(travelCharge || 0));

  const handleGenerateInvoice = async () => {
    setErrorMsg('');
    if (!selectedCustomer && !isAddingNewCustomer) {
      setErrorMsg('Please select an existing customer or create a new customer profile.');
      return;
    }

    if (isAddingNewCustomer && (!newCustomer.name || !newCustomer.mobile)) {
      setErrorMsg('Please enter customer name and mobile number.');
      return;
    }

    if (lineItems.length === 0) {
      setErrorMsg('Please add at least one service or package to the bill.');
      return;
    }

    setIsGenerating(true);
    try {
      const payload: any = {
        appointmentId: initialAppointmentId || undefined,
        items: lineItems,
        discountAmount: Number(discountAmount || 0),
        travelCharge: Number(travelCharge || 0),
        paymentMethod,
        paymentStatus,
        notes,
      };

      if (selectedCustomer) {
        payload.customerId = selectedCustomer.id;
      } else {
        payload.customerData = newCustomer;
      }

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate invoice');
      }

      setGeneratedInvoice(data.invoice);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setGeneratedInvoice(null);
    setSelectedCustomer(null);
    setIsAddingNewCustomer(false);
    setNewCustomer({ name: '', mobile: '', whatsapp: '', address: '', landmark: '' });
    setLineItems([]);
    setDiscountAmount(0);
    setTravelCharge(0);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200">
        <div>
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-gold-600" />
            <h1 className="text-xl font-bold font-serif-brand text-forest-900">
              Fast 30-Second Billing Engine
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Rapid customer lookup, service selection, travel charges, discounts, and auto-inventory deduction.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rosewood-50 border border-rosewood-200 text-rosewood-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer Selector Card */}
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
                1. Select / Add Customer
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNewCustomer(!isAddingNewCustomer);
                  setSelectedCustomer(null);
                }}
                className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isAddingNewCustomer ? 'Search Existing Customer' : '+ Add New Customer'}</span>
              </button>
            </div>

            {isAddingNewCustomer ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sand-50 p-4 rounded-xl border border-sand-200">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={newCustomer.mobile}
                    onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Address / Landmark</label>
                  <input
                    type="text"
                    placeholder="Address for home service"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            ) : selectedCustomer ? (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-forest-50 border border-forest-200">
                <div>
                  <p className="font-bold text-sm text-forest-900">{selectedCustomer.name}</p>
                  <p className="text-xs text-stone-500">
                    Ph: {selectedCustomer.mobile} • {selectedCustomer.visitCount || 0} visits ({formatCurrency(selectedCustomer.totalSpent || 0)} spent)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-stone-400 hover:text-rosewood-600 underline"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name or mobile number..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs"
                  />
                </div>

                {customerSearch && (
                  <div className="max-h-40 overflow-y-auto border border-sand-200 rounded-xl divide-y divide-sand-100 bg-white">
                    {filteredCustomers.length === 0 ? (
                      <p className="p-3 text-xs text-stone-400 italic">No matching customer found.</p>
                    ) : (
                      filteredCustomers.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedCustomer(c);
                            setCustomerSearch('');
                          }}
                          className="p-2.5 text-xs hover:bg-sand-50 cursor-pointer flex justify-between items-center"
                        >
                          <div>
                            <span className="font-bold text-stone-800">{c.name}</span>
                            <span className="text-stone-400 ml-2">({c.mobile})</span>
                          </div>
                          <span className="text-[10px] text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                            Select
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. Service & Package Catalog Selector */}
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
              2. Add Services & Bundles
            </span>

            {allPackages.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-gold-700 uppercase mb-2 flex items-center gap-1">
                  <Gift className="w-3 h-3" /> Special Bundles
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allPackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => addPackageItem(pkg)}
                      className="p-2.5 rounded-xl border border-gold-300 bg-gold-50/50 hover:bg-gold-100 text-left flex justify-between items-center transition-colors"
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-xs text-stone-800 truncate">{pkg.title}</p>
                        <p className="text-[10px] text-stone-500">{formatCurrency(pkg.price)}</p>
                      </div>
                      <Plus className="w-4 h-4 text-forest-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[11px] font-bold text-forest-800 uppercase mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Services
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allServices.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => addServiceItem(srv)}
                    className="p-2.5 rounded-xl border border-sand-200 bg-sand-50 hover:bg-sand-100 text-left flex justify-between items-center transition-colors group"
                  >
                    <div className="truncate pr-1">
                      <p className="font-semibold text-xs text-stone-800 truncate group-hover:text-forest-700">
                        {srv.name}
                      </p>
                      <p className="text-[10px] font-bold text-forest-700">
                        {formatCurrency(srv.price)}
                      </p>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-stone-400 group-hover:text-forest-700 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5">
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-4 sticky top-20">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900 block pb-2 border-b border-sand-100">
              3. Invoice Summary & Payment
            </span>

            {lineItems.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center italic">
                No items added yet. Click services on the left to add.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {lineItems.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 rounded-xl bg-sand-50 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-semibold text-stone-800 truncate">{it.description}</p>
                      <p className="text-[10px] text-stone-500">
                        {it.quantity} × {formatCurrency(it.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-stone-900">
                        {formatCurrency(it.totalPrice)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, it.quantity - 1)}
                          className="w-5 h-5 rounded bg-sand-200 text-stone-600 font-bold flex items-center justify-center hover:bg-sand-300"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold px-1">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, it.quantity + 1)}
                          className="w-5 h-5 rounded bg-sand-200 text-stone-600 font-bold flex items-center justify-center hover:bg-sand-300"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLineItem(idx)}
                          className="text-stone-400 hover:text-rosewood-600 ml-1 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-sand-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Discount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount || ''}
                  placeholder="0"
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Travel / Home Service (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={travelCharge || ''}
                  placeholder="0"
                  onChange={(e) => setTravelCharge(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs font-semibold"
                >
                  <option value="UPI">UPI (GPay/PhonePe)</option>
                  <option value="CASH">Cash</option>
                  <option value="CARD">Card</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-sand-50 border border-sand-300 rounded-lg text-xs font-semibold"
                >
                  <option value="PAID">Paid (Full)</option>
                  <option value="PARTIALLY_PAID">Partially Paid</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-sand-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              {travelCharge > 0 && (
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>Travel / Conveyance:</span>
                  <span>+{formatCurrency(travelCharge)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-forest-900 pt-1">
                <span>Grand Total:</span>
                <span className="text-forest-700">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating || lineItems.length === 0}
              onClick={handleGenerateInvoice}
              className="w-full py-3 rounded-xl font-bold text-sm bg-forest-700 hover:bg-forest-800 text-cream-50 shadow-luxury transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <span>Generating Invoice...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Generate Bill & Auto-Deduct Stock</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {generatedInvoice && (
        <PDFInvoice
          invoice={generatedInvoice}
          onClose={resetForm}
        />
      )}
    </div>
  );
}

export default function AdminBillingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-400">Loading fast billing engine...</div>}>
      <BillingContent />
    </Suspense>
  );
}
