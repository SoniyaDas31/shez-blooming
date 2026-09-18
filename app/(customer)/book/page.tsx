'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Plus,
  Home as HomeIcon,
  Phone,
  MessageSquare,
  Sparkles,
  MapPin,
  Share2,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { format, addDays } from 'date-fns';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedPackageId = searchParams.get('packageId');

  const [currentStep, setCurrentStep] = useState(1);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [allPackages, setAllPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Booking State
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [availableSlots, setAvailableSlots] = useState<{ time: string; isAvailable: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [isHomeService, setIsHomeService] = useState(true);

  // Customer State
  const [customerData, setCustomerData] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    address: '',
    landmark: '',
    notes: '',
  });
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Confirmation / Success State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Initial Data Fetch
  useEffect(() => {
    async function loadCatalog() {
      try {
        const [srvRes, pkgRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/packages'),
        ]);

        let servicesList: any[] = [];
        let packagesList: any[] = [];

        if (srvRes.ok) {
          const sData = await srvRes.json();
          servicesList = sData.services || [];
          setAllServices(servicesList);
        }

        if (pkgRes.ok) {
          const pData = await pkgRes.json();
          packagesList = pData.packages || [];
          setAllPackages(packagesList);
        }

        // Handle URL pre-selection
        if (preselectedServiceId) {
          const match = servicesList.find((s) => s.id === preselectedServiceId);
          if (match) {
            setSelectedItems([{
              serviceId: match.id,
              itemTitle: match.name,
              price: match.price,
              durationMins: match.durationMins,
            }]);
          }
        } else if (preselectedPackageId) {
          const matchPkg = packagesList.find((p) => p.id === preselectedPackageId);
          if (matchPkg) {
            setSelectedItems([{
              packageId: matchPkg.id,
              itemTitle: matchPkg.title,
              price: matchPkg.price,
              durationMins: 90,
            }]);
          }
        }
      } catch (e) {
        console.error('Failed to load booking catalog:', e);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, [preselectedServiceId, preselectedPackageId]);

  // 2. Fetch Availability Slots on Date change
  useEffect(() => {
    async function fetchSlots() {
      if (!selectedDate) return;
      setIsSlotsLoading(true);
      setSelectedSlot('');
      try {
        const res = await fetch(`/api/appointments/availability?date=${selectedDate}`);
        if (res.ok) {
          const data = await res.json();
          setAvailableSlots(data.slots || []);
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setIsSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);

  // 3. Customer Mobile Auto-lookup
  const handleMobileLookup = async (mobileNum: string) => {
    const clean = mobileNum.replace(/\D/g, '');
    if (clean.length >= 10) {
      setIsLookingUp(true);
      try {
        const res = await fetch(`/api/customers?mobile=${clean}`);
        if (res.ok) {
          const data = await res.json();
          if (data.customer) {
            setCustomerData((prev) => ({
              ...prev,
              name: data.customer.name || prev.name,
              whatsapp: data.customer.whatsapp || prev.whatsapp,
              address: data.customer.address || prev.address,
              landmark: data.customer.landmark || prev.landmark,
            }));
            setIsExistingCustomer(true);
          } else {
            setIsExistingCustomer(false);
          }
        }
      } catch (e) {
        // ignore
      } finally {
        setIsLookingUp(false);
      }
    }
  };

  const addService = (srv: any) => {
    if (selectedItems.some((it) => it.serviceId === srv.id)) return;
    setSelectedItems((prev) => [
      ...prev,
      {
        serviceId: srv.id,
        itemTitle: srv.name,
        price: srv.price,
        durationMins: srv.durationMins,
      },
    ]);
  };

  const addPackage = (pkg: any) => {
    if (selectedItems.some((it) => it.packageId === pkg.id)) return;
    setSelectedItems((prev) => [
      ...prev,
      {
        packageId: pkg.id,
        itemTitle: pkg.title,
        price: pkg.price,
        durationMins: 90,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const totalDuration = selectedItems.reduce((sum, item) => sum + Number(item.durationMins || 30), 0);

  const handleConfirmBooking = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerData,
          date: selectedDate,
          timeSlot: selectedSlot,
          items: selectedItems,
          isHomeService,
          notes: customerData.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit appointment');
      }

      setBookingResult(data.appointment);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (bookingResult) {
    const shareText = `🌸 *SHEZ BLOOMING APPOINTMENT CONFIRMATION*\n*Booking Ref:* ${bookingResult.bookingRef}\n*Name:* ${bookingResult.customer?.name}\n*Date:* ${formatDate(bookingResult.date)}\n*Time:* ${bookingResult.timeSlot}\n*Services:* ${bookingResult.items?.map((it: any) => it.itemTitle).join(', ')}\n*Estimated Total:* ${formatCurrency(bookingResult.estimatedAmount)}\n\nSubbulakshmi Das will be in touch shortly. Thank you!`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-forest-100 border-2 border-forest-600 text-forest-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9 text-forest-700" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold-600">
              Booking Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-forest-900 mt-1">
              Your Appointment is Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              We look forward to giving you a rejuvenating beauty experience.
            </p>
          </div>

          <div className="bg-sand-50 p-5 rounded-2xl border border-sand-200 text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-sand-200">
              <span className="text-xs text-stone-400 font-medium">Booking Reference</span>
              <span className="text-sm font-bold text-forest-800 bg-sand-200 px-3 py-1 rounded-md">
                {bookingResult.bookingRef}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-stone-400 block">Date & Time:</span>
                <span className="font-semibold text-stone-800">
                  {formatDate(bookingResult.date)} at {bookingResult.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Customer:</span>
                <span className="font-semibold text-stone-800">{bookingResult.customer?.name}</span>
              </div>
            </div>

            <div>
              <span className="text-stone-400 text-xs block">Selected Services:</span>
              <ul className="mt-1 space-y-1">
                {bookingResult.items?.map((it: any, i: number) => (
                  <li key={i} className="text-xs text-stone-800 font-medium flex justify-between">
                    <span>• {it.itemTitle}</span>
                    <span>{formatCurrency(it.price)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-sand-200 flex justify-between items-center text-sm font-bold text-forest-900">
              <span>Estimated Total:</span>
              <span className="text-forest-700">{formatCurrency(bookingResult.estimatedAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white shadow transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Booking on WhatsApp</span>
            </a>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-sand-100 hover:bg-sand-200 text-stone-800 border border-sand-300 transition-colors"
            >
              <Phone className="w-4 h-4 text-forest-700" />
              <span>Call Salon</span>
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={() => router.push('/appointments')}
              className="text-xs font-semibold text-forest-700 hover:underline"
            >
              View My Booking Status →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Step Indicator Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-brand text-forest-900">
          Book Your Appointment
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Complete relaxation at your doorstep in just 4 simple steps.
        </p>

        <div className="flex items-center justify-center max-w-md mx-auto mt-6">
          {[
            { num: 1, label: 'Services' },
            { num: 2, label: 'Date & Time' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Confirm' },
          ].map((st, i) => (
            <React.Fragment key={st.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    currentStep === st.num
                      ? 'bg-forest-700 text-cream-50 ring-4 ring-forest-100'
                      : currentStep > st.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-sand-200 text-stone-500'
                  }`}
                >
                  {currentStep > st.num ? <CheckCircle2 className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium ${
                    currentStep === st.num ? 'text-forest-900 font-bold' : 'text-stone-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`h-0.5 w-12 sm:w-16 mx-1 mb-4 ${
                    currentStep > st.num ? 'bg-emerald-600' : 'bg-sand-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rosewood-50 border border-rosewood-200 text-rosewood-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1 */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {selectedItems.length > 0 ? (
            <div className="bg-forest-900 text-cream-50 p-4 sm:p-6 rounded-2xl border border-forest-800 shadow-md">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-gold-400 font-serif-brand">
                  Selected Treatments ({selectedItems.length})
                </h3>
                <span className="text-xs text-sand-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Approx {totalDuration} mins
                </span>
              </div>
              <div className="space-y-2">
                {selectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-forest-800/80 px-3 py-2 rounded-xl text-xs"
                  >
                    <span className="font-medium text-cream-50">{item.itemTitle}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gold-400">{formatCurrency(item.price)}</span>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-stone-400 hover:text-rosewood-200 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-forest-700 flex justify-between items-center text-sm font-bold">
                <span>Estimated Total:</span>
                <span className="text-gold-400 text-base">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-sand-100/70 rounded-2xl border border-dashed border-sand-300 text-xs text-stone-500">
              Please choose at least one service or offer below to continue.
            </div>
          )}

          {allPackages.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-forest-900 mb-3 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-gold-600" />
                <span>Popular Package Offers</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allPackages.map((pkg) => {
                  const isSelected = selectedItems.some((it) => it.packageId === pkg.id);
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => (isSelected ? null : addPackage(pkg))}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                        isSelected
                          ? 'bg-forest-50 border-forest-600 shadow-sm'
                          : 'bg-white border-sand-200 hover:border-gold-500'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-gold-700 uppercase bg-gold-50 px-2 py-0.5 rounded">
                          {pkg.badgeText || 'Special Offer'}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 mt-1">
                          {pkg.title}
                        </h4>
                        <span className="text-xs font-bold text-forest-700">
                          {formatCurrency(pkg.price)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`p-2 rounded-full text-xs font-semibold ${
                          isSelected ? 'bg-forest-700 text-white' : 'bg-sand-100 text-forest-800'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-900 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span>Individual Services</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allServices.map((srv) => {
                const isSelected = selectedItems.some((it) => it.serviceId === srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => (isSelected ? null : addService(srv))}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      isSelected
                        ? 'bg-forest-50 border-forest-600 shadow-sm'
                        : 'bg-white border-sand-200 hover:border-gold-500'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-medium">
                        {srv.category?.name} • {srv.durationMins}m
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                        {srv.name}
                      </h4>
                      <span className="text-xs font-bold text-forest-700">
                        {formatCurrency(srv.price)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`p-2 rounded-full text-xs font-semibold ${
                        isSelected ? 'bg-forest-700 text-white' : 'bg-sand-100 text-forest-800'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={selectedItems.length === 0}
              onClick={() => setCurrentStep(2)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-luxury transition-all active:scale-95"
            >
              <span>Next: Select Date & Time</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-sand-200 shadow-soft animate-fadeIn">
          <div>
            <h3 className="text-base font-bold font-serif-brand text-forest-900">
              Select Preferred Date & Available Slot
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Appointments are available between 08:00 AM and 08:00 PM.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-64 px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Available Time Slots ({formatDate(selectedDate)})
            </label>

            {isSlotsLoading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="h-11 bg-sand-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No available slots on this date.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableSlots.map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                      !slot.isAvailable
                        ? 'bg-stone-100 text-stone-300 border-stone-200 cursor-not-allowed line-through'
                        : selectedSlot === slot.time
                        ? 'bg-forest-700 text-cream-50 border-forest-800 shadow-md ring-2 ring-gold-400'
                        : 'bg-sand-50 hover:bg-sand-100 text-stone-700 border-sand-300'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-sand-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all active:scale-95"
            >
              <span>Next: Customer Details</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <div className="space-y-6 bg-white p-6 rounded-3xl border border-sand-200 shadow-soft animate-fadeIn">
          <div>
            <h3 className="text-base font-bold font-serif-brand text-forest-900">
              Customer Information & Location
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter your mobile number — if you are an existing customer, we'll automatically fetch your address!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={customerData.mobile}
                  onChange={(e) => {
                    setCustomerData({ ...customerData, mobile: e.target.value });
                    handleMobileLookup(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
                  required
                />
                {isLookingUp && (
                  <span className="absolute right-3 top-2.5 text-[10px] text-stone-400 animate-pulse">
                    Checking...
                  </span>
                )}
              </div>
              {isExistingCustomer && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Welcome back! Your details have been pre-filled.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                WhatsApp Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="For booking updates"
                value={customerData.whatsapp}
                onChange={(e) => setCustomerData({ ...customerData, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Landmark / Nearby (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Temple, Behind School"
                value={customerData.landmark}
                onChange={(e) => setCustomerData({ ...customerData, landmark: e.target.value })}
                className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Home Service Address *
              </label>
              <textarea
                rows={2}
                placeholder="House / Flat name, Street, Area, City"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                className="w-full px-4 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Special Requests or Skin/Health Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sensitive skin, focused shoulder pressure, etc."
                value={customerData.notes}
                onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                className="w-full px-4 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-forest-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-sand-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={!customerData.name || !customerData.mobile}
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all active:scale-95"
            >
              <span>Next: Review & Confirm</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-sand-200 shadow-luxury animate-fadeIn">
          <div>
            <span className="text-xs font-bold uppercase text-gold-600 tracking-wider">Final Step</span>
            <h3 className="text-xl font-bold font-serif-brand text-forest-900">
              Review Appointment Summary
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Please double-check your appointment details before finalizing.
            </p>
          </div>

          <div className="bg-sand-50 p-5 rounded-2xl border border-sand-200 space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-sand-200">
              <div>
                <p className="text-[11px] font-bold text-stone-400 uppercase">Customer Information</p>
                <p className="font-bold text-stone-900 mt-0.5">{customerData.name}</p>
                <p className="text-stone-600">Phone: {customerData.mobile}</p>
                {customerData.address && (
                  <p className="text-stone-600 mt-1 leading-relaxed">
                    Address: {customerData.address} {customerData.landmark ? `(Near ${customerData.landmark})` : ''}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-bold text-stone-400 uppercase">Schedule & Service Mode</p>
                <p className="font-bold text-forest-800 mt-0.5">
                  {formatDate(selectedDate)} at {selectedSlot}
                </p>
                <p className="text-stone-600 mt-1">Mode: Home Service (Doorstep)</p>
                <p className="text-stone-500 text-xs">Status: Pending Verification</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-stone-400 uppercase mb-2">Booked Services</p>
              <div className="space-y-1.5">
                {selectedItems.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-800">• {it.itemTitle}</span>
                    <span className="font-semibold text-stone-900">{formatCurrency(it.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-sand-200 flex justify-between items-center font-bold text-base text-forest-900">
              <span>Estimated Total:</span>
              <span className="text-forest-700">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-sand-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Details</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow-luxury transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-400">Loading booking portal...</div>}>
      <BookingContent />
    </Suspense>
  );
}
