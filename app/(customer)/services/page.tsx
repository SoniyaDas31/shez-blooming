'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Clock,
  Home as HomeIcon,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Info,
  ChevronRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function ServicesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [homeOnly, setHomeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeModalService, setActiveModalService] = useState<any | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, srvRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/services'),
        ]);

        if (catRes.ok) {
          const cData = await catRes.json();
          setCategories(cData.categories || []);
        }

        if (srvRes.ok) {
          const sData = await srvRes.json();
          setServices(sData.services || []);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredServices = services.filter((srv) => {
    const matchesCategory =
      selectedCategory === 'all' || srv.category?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (srv.description && srv.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesHome = !homeOnly || srv.isHomeService;

    return matchesCategory && matchesSearch && matchesHome;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Complete Treatment Menu</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-brand text-forest-900">
          Our Beauty & Wellness Services
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Professional treatments performed with natural ingredients and unmatched hygienic care.
        </p>
      </div>

      {/* Search & Filters Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search massages, facials, styling..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-sand-300 rounded-full text-xs sm:text-sm focus:outline-none focus:border-forest-700 focus:ring-1 focus:ring-forest-700 transition-colors"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700 self-start sm:self-auto bg-white px-4 py-2 rounded-full border border-sand-300">
            <input
              type="checkbox"
              checked={homeOnly}
              onChange={(e) => setHomeOnly(e.target.checked)}
              className="rounded text-forest-700 focus:ring-forest-700 accent-forest-700"
            />
            <HomeIcon className="w-3.5 h-3.5 text-forest-700" />
            <span>Home Service Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-forest-700 text-cream-50 shadow-md'
                : 'bg-white text-stone-600 border border-sand-300 hover:bg-sand-100'
            }`}
          >
            All Services ({services.length})
          </button>
          {categories.map((cat) => {
            const count = services.filter((s) => s.category?.slug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest-700 text-cream-50 shadow-md'
                    : 'bg-white text-stone-600 border border-sand-300 hover:bg-sand-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-forest-800 text-gold-400' : 'bg-sand-200 text-stone-600'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-72 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-sand-200 p-8">
          <Info className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="font-bold text-stone-700 text-base">No services found</h3>
          <p className="text-xs text-stone-500 mt-1">Try selecting another category or adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-soft hover:shadow-luxury hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div
                  className="relative h-44 w-full bg-sand-100 overflow-hidden cursor-pointer"
                  onClick={() => setActiveModalService(service)}
                >
                  <img
                    src={
                      service.imageUrl ||
                      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-forest-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-cream-50 text-[11px] font-semibold border border-gold-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-400" />
                    <span>{service.durationMins} mins</span>
                  </div>
                  {service.isHomeService && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-forest-800 text-[10px] font-bold shadow-sm">
                      Home Service
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-2 py-0.5 rounded">
                      {service.category?.name}
                    </span>
                    <button
                      onClick={() => setActiveModalService(service)}
                      className="text-[11px] text-stone-400 hover:text-forest-700 flex items-center gap-0.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <h3
                    onClick={() => setActiveModalService(service)}
                    className="font-bold text-base text-forest-900 cursor-pointer hover:text-forest-700 transition-colors line-clamp-1"
                  >
                    {service.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-sand-100 flex items-center justify-between bg-sand-50/40">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-semibold">Service Price</span>
                  <span className="text-lg font-bold text-forest-900 font-serif-brand">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                <Link
                  href={`/book?serviceId=${service.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow transition-all active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>Book</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-sand-200 animate-fadeIn">
            <div className="relative h-48 w-full bg-sand-100">
              <img
                src={
                  activeModalService.imageUrl ||
                  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
                }
                alt={activeModalService.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalService(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-gold-600 bg-gold-50 px-2.5 py-1 rounded">
                  {activeModalService.category?.name}
                </span>
                <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-forest-700" />
                  {activeModalService.durationMins} minutes
                </span>
              </div>

              <h2 className="text-xl font-bold font-serif-brand text-forest-900">
                {activeModalService.name}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {activeModalService.description}
              </p>

              {activeModalService.benefits && (
                <div className="bg-sand-50 p-4 rounded-xl border border-sand-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 mb-1.5">
                    Key Treatment Benefits:
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {activeModalService.benefits}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-sand-200">
                <div>
                  <span className="text-xs text-stone-400 block">Total Investment</span>
                  <span className="text-2xl font-bold font-serif-brand text-forest-900">
                    {formatCurrency(activeModalService.price)}
                  </span>
                </div>
                <Link
                  href={`/book?serviceId=${activeModalService.id}`}
                  onClick={() => setActiveModalService(null)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-cream-50 bg-forest-700 hover:bg-forest-800 shadow-luxury transition-all"
                >
                  <Calendar className="w-4 h-4 text-gold-400" />
                  <span>Book This Service</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-400">Loading services menu...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
