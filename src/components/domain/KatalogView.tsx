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
import { CardUnit } from './CardUnit';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Pagination } from '../ui/Pagination';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '@/lib/utils';

export interface KatalogViewProps {
  jenis: JenisKendaraan;
  title: string;
  subtitle: string;
}

export const KatalogView: React.FC<KatalogViewProps> = ({
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

      router.push(`?${current.toString()}`);
    },
    [router, searchParams]
  );

  // Fetch units
  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.unit.list({
        jenis,
        kota: kota || undefined,
        transmisi: transmisi || undefined,
        kapasitas: kapasitas || undefined,
        hargaMin: hargaMin || undefined,
        hargaMax: hargaMax || undefined,
        sort,
        order,
        page: currentPage,
        limit: 12,
        search: search || undefined,
      });

      setUnits(res.items);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat katalog kendaraan.';
      setError(msg);
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

  // Handle apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    setMobileFilterOpen(false);
    updateUrl({
      kota,
      transmisi,
      kapasitas,
      hargaMin,
      hargaMax,
      sort,
      order,
      search,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setKota('');
    setTransmisi('');
    setKapasitas(undefined);
    setHargaMin(undefined);
    setHargaMax(undefined);
    setSort('harga');
    setOrder('asc');
    setSearch('');
    setCurrentPage(1);
    setMobileFilterOpen(false);
    router.push(window.location.pathname);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    let newSort = 'harga';
    let newOrder: 'asc' | 'desc' = 'asc';

    if (value === 'harga_asc') {
      newSort = 'harga';
      newOrder = 'asc';
    } else if (value === 'harga_desc') {
      newSort = 'harga';
      newOrder = 'desc';
    } else if (value === 'rating_desc') {
      newSort = 'rating';
      newOrder = 'desc';
    }

    setSort(newSort);
    setOrder(newOrder);
    updateUrl({ sort: newSort, order: newOrder, page: 1 });
  };

  const activeFiltersCount = [
    kota,
    transmisi,
    kapasitas,
    hargaMin,
    hargaMax,
    search,
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header Bar */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-cyan-300">
              {jenis === 'mobil' ? (
                <Car className="w-3.5 h-3.5" />
              ) : (
                <Settings2 className="w-3.5 h-3.5" />
              )}
              <span>Katalog {jenis === 'mobil' ? 'Mobil' : 'Motor'}</span>
            </span>

            <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-white tracking-tight">
              {title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl shrink-0">
            <div>
              <p className="text-xl sm:text-2xl font-black text-cyan-300">
                {totalCount}
              </p>
              <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                Unit Tersedia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => setMobileFilterOpen(true)}
            leftIcon={<Filter className="w-4 h-4 text-secondary" />}
            rightIcon={
              activeFiltersCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              ) : undefined
            }
          >
            Filter & Pencarian
          </Button>

          {/* Mobile Sort Dropdown */}
          <div className="shrink-0">
            <select
              value={sort === 'rating' ? 'rating_desc' : `${sort}_${order}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-11 bg-white border border-border rounded-xl px-3 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary shadow-2xs"
            >
              <option value="harga_asc">Harga Terendah</option>
              <option value="harga_desc">Harga Tertinggi</option>
              <option value="rating_desc">Rating Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Sidebar Filter Container (Desktop & Mobile Drawer) */}
        <aside
          className={cn(
            'lg:col-span-1 space-y-6',
            mobileFilterOpen
              ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto block'
              : 'hidden lg:block'
          )}
        >
          {/* Mobile Drawer Header */}
          {mobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" />
                <span>Filter Armada</span>
              </h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded-xl text-text-muted hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-border/80 p-5 sm:p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-secondary" />
                <span>Filter Pencarian</span>
              </h3>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label
                htmlFor="katalog-search"
                className="text-xs font-bold text-primary block"
              >
                Nama Armada
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-text-muted pointer-events-none" />
                <input
                  id="katalog-search"
                  type="text"
                  placeholder="Cari cth: Brio, NMAX..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full h-11 bg-slate-50 border border-border rounded-xl pl-10 pr-3 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>

            {/* Kota Selector */}
            <div className="space-y-1.5">
              <label
                htmlFor="katalog-kota"
                className="text-xs font-bold text-primary block flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span>Kota Layanan</span>
              </label>
              <select
                id="katalog-kota"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all cursor-pointer"
              >
                <option value="">Semua Kota</option>
                {cityOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmisi */}
            <div className="space-y-1.5">
              <label
                htmlFor="katalog-transmisi"
                className="text-xs font-bold text-primary block flex items-center gap-1"
              >
                <Settings2 className="w-3.5 h-3.5 text-secondary" />
                <span>Transmisi</span>
              </label>
              <select
                id="katalog-transmisi"
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value as Transmisi)}
                className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all cursor-pointer"
              >
                <option value="">Semua Transmisi</option>
                <option value="Matic">Matic (Otomatis)</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Kapasitas Penumpang */}
            <div className="space-y-1.5">
              <label
                htmlFor="katalog-kapasitas"
                className="text-xs font-bold text-primary block flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5 text-secondary" />
                <span>Kapasitas Kursi Minimal</span>
              </label>
              <select
                id="katalog-kapasitas"
                value={kapasitas || ''}
                onChange={(e) =>
                  setKapasitas(e.target.value ? Number(e.target.value) : undefined)
                }
                className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all cursor-pointer"
              >
                <option value="">Semua Kapasitas</option>
                {jenis === 'mobil' ? (
                  <>
                    <option value="4">Minimal 4 Kursi (City Car)</option>
                    <option value="7">Minimal 7 Kursi (Keluarga)</option>
                  </>
                ) : (
                  <>
                    <option value="2">2 Penumpang</option>
                  </>
                )}
              </select>
            </div>

            {/* Rentang Tarif */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary block flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-secondary" />
                <span>Tarif Sewa / Hari (Rp)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={hargaMin || ''}
                  onChange={(e) =>
                    setHargaMin(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full h-10.5 bg-slate-50 border border-border rounded-xl px-3 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={hargaMax || ''}
                  onChange={(e) =>
                    setHargaMax(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full h-10.5 bg-slate-50 border border-border rounded-xl px-3 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>
            </div>

            {/* Apply Button */}
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={applyFilters}
              className="mt-2"
            >
              Terapkan Filter
            </Button>
          </div>
        </aside>

        {/* Content Area (Units Grid + Pagination) */}
        <main className="lg:col-span-3 space-y-6">
          {/* Desktop Filter Summary Bar */}
          <div className="hidden lg:flex items-center justify-between text-xs text-text-muted bg-white p-4 rounded-2xl border border-border/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span>
                Menampilkan{' '}
                <strong className="text-primary font-bold">{units.length}</strong> dari{' '}
                <strong className="text-primary font-bold">{totalCount}</strong> armada
              </span>

              {kota && (
                <Badge variant="info" size="sm">
                  Kota: {kota}
                </Badge>
              )}
              {transmisi && (
                <Badge variant="neutral" size="sm">
                  Transmisi: {transmisi}
                </Badge>
              )}
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="katalog-sort-desktop"
                className="font-semibold text-text-muted whitespace-nowrap"
              >
                Urutkan:
              </label>
              <select
                id="katalog-sort-desktop"
                value={sort === 'rating' ? 'rating_desc' : `${sort}_${order}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="h-10 bg-slate-50 hover:bg-slate-100 border border-border rounded-xl px-3 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary cursor-pointer"
              >
                <option value="harga_asc">Tarif Terendah</option>
                <option value="harga_desc">Tarif Tertinggi</option>
                <option value="rating_desc">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-5 bg-white rounded-3xl border border-border space-y-4"
                >
                  <Skeleton className="aspect-[16/10] rounded-2xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 rounded-xl" />
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-9 w-20 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <ErrorState
              title="Gagal Memuat Armada"
              message={error}
              onRetry={fetchUnits}
            />
          )}

          {/* Empty State */}
          {!isLoading && !error && units.length === 0 && (
            <EmptyState
              title="Tidak Ada Armada yang Sesuai"
              description="Tidak ditemukan kendaraan dengan kombinasi filter yang Anda pilih. Silakan sesuaikan kriteria filter atau reset untuk melihat semua unit."
              actionText="Reset Filter"
              onAction={handleResetFilters}
            />
          )}

          {/* Units Grid */}
          {!isLoading && !error && units.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <CardUnit key={unit.id} unit={unit} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="pt-6"
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};
