'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Car,
  Settings2,
  Users,
  Coins,
  X,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/api';
import { JenisKendaraan, Transmisi, Unit } from '@/types';
import { FleetCard } from './FleetCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface FleetCatalogProps {
  jenis?: JenisKendaraan | 'semua';
  title: string;
  subtitle: string;
}

export const FleetCatalog: React.FC<FleetCatalogProps> = ({
  jenis,
  title,
  subtitle,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL search params
  const kotaParam = searchParams.get('kota') || '';
  const transmisiParam = (searchParams.get('transmisi') as Transmisi) || '';
  const kapasitasParam = searchParams.get('kapasitas')
    ? Number(searchParams.get('kapasitas'))
    : undefined;
  const hargaMinParam = searchParams.get('hargaMin')
    ? Number(searchParams.get('hargaMin'))
    : undefined;
  const hargaMaxParam = searchParams.get('hargaMax')
    ? Number(searchParams.get('hargaMax'))
    : undefined;
  const sortParam = searchParams.get('sort') || 'harga';
  const orderParam = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const pageParam = Number(searchParams.get('page')) || 1;
  const searchParam = searchParams.get('search') || '';

  // Local filter states
  const [kota, setKota] = useState<string>(kotaParam);
  const [transmisi, setTransmisi] = useState<Transmisi | ''>(transmisiParam);
  const [kapasitas, setKapasitas] = useState<number | undefined>(kapasitasParam);
  const [hargaMin, setHargaMin] = useState<number | undefined>(hargaMinParam);
  const [hargaMax, setHargaMax] = useState<number | undefined>(hargaMaxParam);
  const [sort, setSort] = useState<string>(sortParam);
  const [order, setOrder] = useState<'asc' | 'desc'>(orderParam);
  const [search, setSearch] = useState<string>(searchParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data states
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available cities
  useEffect(() => {
    let isMounted = true;
    api.kota
      .list()
      .then((cities) => {
        if (isMounted && cities) setCityOptions(cities);
      })
      .catch((err) => {
        console.warn('Failed to load cities:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Update URL helper
  const updateUrl = useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([k, v]) => {
        if (v !== undefined && v !== '' && v !== null) {
          current.set(k, String(v));
        } else {
          current.delete(k);
        }
      });

      router.replace(`?${current.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Fetch Units
  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const targetJenis = jenis === 'semua' ? undefined : jenis;
      const res = await api.unit.list({
        jenis: targetJenis,
        kota: kota || undefined,
        transmisi: transmisi || undefined,
        kapasitas: kapasitas || undefined,
        hargaMin: hargaMin || undefined,
        hargaMax: hargaMax || undefined,
        sort: sort || 'harga',
        order: order || 'asc',
        page: currentPage,
        limit: 9,
      });

      let items = res.items || [];
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        items = items.filter(
          (u) =>
            u.nama.toLowerCase().includes(q) ||
            Boolean(u.mitra?.nama?.toLowerCase().includes(q))
        );
      }

      setUnits(items);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || items.length);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Gagal memuat katalog armada'
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    jenis,
    kota,
    transmisi,
    kapasitas,
    hargaMin,
    hargaMax,
    sort,
    order,
    currentPage,
    search,
  ]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Handlers
  const handleKotaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setKota(val);
    setCurrentPage(1);
    updateUrl({ kota: val, page: 1 });
  };

  const handleTransmisiChange = (val: Transmisi | '') => {
    setTransmisi(val);
    setCurrentPage(1);
    updateUrl({ transmisi: val, page: 1 });
  };

  const handleKapasitasChange = (val: number | undefined) => {
    setKapasitas(val);
    setCurrentPage(1);
    updateUrl({ kapasitas: val, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [s, o] = e.target.value.split(':');
    setSort(s);
    setOrder(o as 'asc' | 'desc');
    setCurrentPage(1);
    updateUrl({ sort: s, order: o, page: 1 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrl({ search: search.trim(), page: 1 });
  };

  const handleResetFilters = () => {
    setKota('');
    setTransmisi('');
    setKapasitas(undefined);
    setHargaMin(undefined);
    setHargaMax(undefined);
    setSearch('');
    setSort('harga');
    setOrder('asc');
    setCurrentPage(1);
    router.replace('?', { scroll: false });
  };

  const hasActiveFilters =
    Boolean(kota) ||
    Boolean(transmisi) ||
    Boolean(kapasitas) ||
    Boolean(hargaMin) ||
    Boolean(hargaMax) ||
    Boolean(search);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <Badge variant="primary" size="sm" className="bg-white/10 text-white border-white/20">
            Katalog Resmi RentalinAja
          </Badge>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-extrabold tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl border border-border/80 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari model unit atau mitra..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-border rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          />
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex-1 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-secondary" />
            )}
          </Button>

          {/* Sort Selector */}
          <div className="relative flex-1 md:flex-none">
            <select
              value={`${sort}:${order}`}
              onChange={handleSortChange}
              className="w-full appearance-none bg-slate-50 hover:bg-slate-100 border border-border rounded-xl pl-3 pr-8 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary cursor-pointer transition-colors shadow-2xs"
            >
              <option value="harga:asc">Harga: Terendah ke Tertinggi</option>
              <option value="harga:desc">Harga: Tertinggi ke Terendah</option>
              <option value="rating:desc">Rating Tertinggi</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Semua Filter"
              className="p-2.5 rounded-xl border border-border text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 bg-white rounded-3xl border border-border/80 p-6 space-y-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <Filter className="w-4 h-4 text-secondary" />
              <span>Filter Armada</span>
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-secondary hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Kota Layanan
            </label>
            <div className="relative">
              <select
                value={kota}
                onChange={handleKotaChange}
                className="w-full appearance-none bg-slate-50 border border-border rounded-xl pl-3 pr-8 py-2 text-xs font-medium text-primary focus:outline-none focus:border-secondary cursor-pointer"
              >
                <option value="">Semua Kota</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Transmisi
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleTransmisiChange('')}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                  transmisi === ''
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-slate-600 hover:text-primary'
                )}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => handleTransmisiChange('Manual')}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                  transmisi === 'Manual'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-slate-600 hover:text-primary'
                )}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => handleTransmisiChange('Matic')}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center',
                  transmisi === 'Matic'
                    ? 'bg-white text-primary shadow-xs'
                    : 'text-slate-600 hover:text-primary'
                )}
              >
                Matic
              </button>
            </div>
          </div>

          {/* Passenger Capacity */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">
              Kapasitas Penumpang
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[undefined, 2, 5, 7].map((cap, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleKapasitasChange(cap)}
                  className={cn(
                    'py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center',
                    kapasitas === cap
                      ? 'bg-secondary text-white border-secondary shadow-xs'
                      : 'bg-white border-border text-slate-700 hover:border-secondary/40'
                  )}
                >
                  {cap === undefined ? 'Semua' : `${cap} Kursi`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Vehicle Grid Content */}
        <div className="col-span-1 md:col-span-3 space-y-6">
          {/* Active summary */}
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>
              Menampilkan{' '}
              <strong className="text-primary font-bold">{units.length}</strong> dari{' '}
              <strong className="text-primary font-bold">{totalCount}</strong> armada
            </span>
          </div>

          {/* Grid Loading / Error / Empty / Success */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[16/10] rounded-3xl w-full" />
                  <Skeleton className="h-5 w-3/4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 rounded-lg" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : error ? (
            <ErrorState
              title="Gagal Memuat Armada"
              message={error}
              onRetry={fetchUnits}
            />
          ) : units.length === 0 ? (
            <EmptyState
              title="Tidak Ada Armada Ditemukan"
              description="Tidak ada armada yang sesuai dengan kriteria filter Anda saat ini. Silakan coba atur ulang filter pencarian."
              actionText="Reset Semua Filter"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <FleetCard key={unit.id} unit={unit} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      updateUrl({ page });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
