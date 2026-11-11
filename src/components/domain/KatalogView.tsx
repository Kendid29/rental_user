'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/api';
import { JenisKendaraan, Transmisi, Unit } from '@/types';
import { CardUnit } from './CardUnit';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Pagination } from '../ui/Pagination';
import { Button } from '../ui/Button';

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

  // Read params from URL
  const kotaParam = searchParams.get('kota') || '';
  const transmisiParam = (searchParams.get('transmisi') as Transmisi) || '';
  const kapasitasParam = searchParams.get('kapasitas') ? Number(searchParams.get('kapasitas')) : undefined;
  const hargaMinParam = searchParams.get('hargaMin') ? Number(searchParams.get('hargaMin')) : undefined;
  const hargaMaxParam = searchParams.get('hargaMax') ? Number(searchParams.get('hargaMax')) : undefined;
  const sortParam = searchParams.get('sort') || 'harga';
  const orderParam = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const pageParam = Number(searchParams.get('page')) || 1;
  const searchParam = searchParams.get('search') || '';

  // Local state for filters
  const [kota, setKota] = useState<string>(kotaParam);
  const [transmisi, setTransmisi] = useState<Transmisi | ''>(transmisiParam);
  const [kapasitas, setKapasitas] = useState<number | undefined>(kapasitasParam);
  const [hargaMin, setHargaMin] = useState<number | undefined>(hargaMinParam);
  const [hargaMax, setHargaMax] = useState<number | undefined>(hargaMaxParam);
  const [sort, setSort] = useState<string>(sortParam);
  const [order, setOrder] = useState<'asc' | 'desc'>(orderParam);
  const [search, setSearch] = useState<string>(searchParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);

  // Data state
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cities for filter dropdown
  useEffect(() => {
    let isMounted = true;
    api.kota.list()
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

  // Update URL search params
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
      const msg = err instanceof Error ? err.message : 'Gagal memuat katalog kendaraan.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [jenis, kota, transmisi, kapasitas, hargaMin, hargaMax, sort, order, currentPage, search]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Handle filter submission
  const applyFilters = () => {
    setCurrentPage(1);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-extrabold text-primary">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1.5">{subtitle}</p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label htmlFor="katalog-sort" className="text-xs font-semibold text-text-muted whitespace-nowrap">
            Urutkan:
          </label>
          <select
            id="katalog-sort"
            value={sort === 'rating' ? 'rating_desc' : `${sort}_${order}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-10 bg-white border border-border rounded-xl px-3 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
          >
            <option value="harga_asc">Harga Terendah</option>
            <option value="harga_desc">Harga Tertinggi</option>
            <option value="rating_desc">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-5 space-y-5 elevation-1">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                </svg>
                Filter Armada
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-secondary hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Pencarian Kata Kunci */}
            <div className="space-y-1.5">
              <label htmlFor="katalog-search" className="text-xs font-semibold text-primary block">Cari Nama Armada</label>
              <input
                id="katalog-search"
                type="text"
                placeholder="cth: Innova, NMAX..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full h-10 bg-slate-50 border border-border rounded-xl px-3 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              />
            </div>

            {/* Kota */}
            <div className="space-y-1.5">
              <label htmlFor="katalog-kota" className="text-xs font-semibold text-primary block">Kota Layanan</label>
              <select
                id="katalog-kota"
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                className="w-full h-10 bg-slate-50 border border-border rounded-xl px-3 text-xs font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
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
              <label htmlFor="katalog-transmisi" className="text-xs font-semibold text-primary block">Transmisi</label>
              <select
                id="katalog-transmisi"
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value as Transmisi)}
                className="w-full h-10 bg-slate-50 border border-border rounded-xl px-3 text-xs font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                <option value="">Semua Transmisi</option>
                <option value="Matic">Matic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Kapasitas Penumpang */}
            <div className="space-y-1.5">
              <label htmlFor="katalog-kapasitas" className="text-xs font-semibold text-primary block">Kapasitas Kursi Min.</label>
              <select
                id="katalog-kapasitas"
                value={kapasitas || ''}
                onChange={(e) => setKapasitas(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full h-10 bg-slate-50 border border-border rounded-xl px-3 text-xs font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
              >
                <option value="">Semua Kapasitas</option>
                {jenis === 'mobil' ? (
                  <>
                    <option value="4">Minimal 4 Kursi</option>
                    <option value="7">Minimal 7 Kursi</option>
                  </>
                ) : (
                  <>
                    <option value="2">2 Penumpang</option>
                  </>
                )}
              </select>
            </div>

            {/* Rentang Harga */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-primary block">Rentang Tarif / Hari (Rp)</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={hargaMin || ''}
                  onChange={(e) => setHargaMin(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 bg-slate-50 border border-border rounded-xl px-2.5 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={hargaMax || ''}
                  onChange={(e) => setHargaMax(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full h-10 bg-slate-50 border border-border rounded-xl px-2.5 text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>
            </div>

            <Button variant="primary" size="md" fullWidth onClick={applyFilters}>
              Terapkan Filter
            </Button>
          </div>
        </div>

        {/* Units Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>
              Menampilkan <span className="font-bold text-primary">{units.length}</span> dari{' '}
              <span className="font-bold text-primary">{totalCount}</span> unit tersedia
            </span>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-3 bg-white rounded-2xl border border-border space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {error && !isLoading && (
            <ErrorState
              title="Gagal Memuat Armada"
              message={error}
              onRetry={fetchUnits}
            />
          )}

          {!isLoading && !error && units.length === 0 && (
            <EmptyState
              title="Tidak Ada Unit yang Cocok"
              description="Tidak ditemukan kendaraan dengan kombinasi filter yang Anda pilih. Coba sesuaikan filter atau reset pencarian."
              actionText="Reset Semua Filter"
              onAction={handleResetFilters}
            />
          )}

          {!isLoading && !error && units.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        </div>
      </div>
    </div>
  );
};
