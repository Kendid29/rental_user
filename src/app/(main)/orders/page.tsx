'use client';

import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Plus, SearchX } from 'lucide-react';
import { api } from '@/api';
import { Pesanan, StatusPesanan } from '@/types';
import { RouteGuard } from '@/hooks/useSesi';
import {
  OrderStatsHeader,
  OrderStatusTabs,
  OrderCard,
} from '@/components/features/orders';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

function OrdersListContent() {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState<StatusPesanan | 'semua'>(
    'semua'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPesanans, setAllPesanans] = useState<Pesanan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all orders to compute stats and support instant search & filtering
  const fetchPesanans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.pesanan.list({
        limit: 100,
      });
      setAllPesanans(res.items);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat riwayat pesanan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPesanans();
  }, [fetchPesanans]);

  // Status counts calculation
  const statusCounts = useMemo(() => {
    return {
      semua: allPesanans.length,
      menunggu_pembayaran: allPesanans.filter(
        (p) => p.status === 'menunggu_pembayaran'
      ).length,
      terkonfirmasi: allPesanans.filter(
        (p) => p.status === 'terkonfirmasi'
      ).length,
      selesai: allPesanans.filter(
        (p) => p.status === 'selesai'
      ).length,
      dibatalkan: allPesanans.filter(
        (p) => p.status === 'dibatalkan'
      ).length,
    };
  }, [allPesanans]);

  // Filtering by status and search query
  const filteredPesanans = useMemo(() => {
    let list = allPesanans;

    if (selectedStatus !== 'semua') {
      list = list.filter((p) => p.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.unit?.nama.toLowerCase().includes(q) ||
          p.mitra?.nama.toLowerCase().includes(q) ||
          p.mitra?.kota.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allPesanans, selectedStatus, searchQuery]);

  // Local pagination
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filteredPesanans.length / ITEMS_PER_PAGE));
  const paginatedPesanans = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPesanans.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPesanans, currentPage]);

  const handleStatusChange = (status: StatusPesanan | 'semua') => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8 min-w-0 overflow-x-hidden">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6 min-w-0">
        <div className="space-y-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Riwayat Transaksi Rental</span>
          </div>

          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary">
            Pesanan Saya
          </h1>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Pantau status ketersediaan armada, jadwal sewa, dan konfirmasi pembayaran Anda.
          </p>
        </div>

        <Link href="/fleet" className="shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            fullWidth
            rightIcon={<Plus className="w-4 h-4" />}
            className="rounded-2xl shadow-sm sm:w-auto justify-center"
          >
            Sewa Unit Baru
          </Button>
        </Link>
      </div>

      {/* 2. Interactive KPI Stats Header */}
      <OrderStatsHeader
        pesanans={allPesanans}
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusChange}
      />

      {/* 3. Filter Tabs & Search Bar */}
      <OrderStatusTabs
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusChange}
        counts={statusCounts}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* 4. Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white space-y-4 shadow-2xs w-full"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28 sm:w-32 rounded-lg" />
                <Skeleton className="h-6 w-24 sm:w-28 rounded-full" />
              </div>
              <div className="flex gap-3 sm:gap-4 items-center">
                <Skeleton className="w-20 h-20 sm:w-28 sm:h-24 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 rounded-lg" />
                  <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-32 rounded-lg" />
                  <Skeleton className="h-3.5 sm:h-4 w-44 sm:w-56 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Gagal Memuat Pesanan"
          message={error}
          onRetry={fetchPesanans}
        />
      )}

      {/* 6. Empty State - No match for search */}
      {!isLoading && !error && filteredPesanans.length === 0 && searchQuery && (
        <div className="p-8 sm:p-10 rounded-2xl sm:rounded-3xl bg-white border border-border/80 text-center space-y-4 shadow-2xs w-full">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <SearchX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-primary">
              Pesanan Tidak Ditemukan
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Tidak ada riwayat pesanan yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="rounded-xl"
          >
            Hapus Pencarian
          </Button>
        </div>
      )}

      {/* 7. Empty State - No orders at all for selected status */}
      {!isLoading && !error && filteredPesanans.length === 0 && !searchQuery && (
        <EmptyState
          title="Belum Ada Pesanan"
          description={
            selectedStatus === 'semua'
              ? 'Anda belum pernah memesan armada sewa di RentalinAja. Temukan mobil atau motor impian Anda sekarang!'
              : `Tidak ada pesanan dengan status "${selectedStatus.replace('_', ' ')}".`
          }
          actionText="Jelajahi Katalog Armada"
          onAction={() => router.push('/fleet')}
        />
      )}

      {/* 8. Order Cards List */}
      {!isLoading && !error && filteredPesanans.length > 0 && (
        <div className="space-y-4 sm:space-y-5 w-full min-w-0">
          {paginatedPesanans.map((pesanan) => (
            <OrderCard
              key={pesanan.id}
              pesanan={pesanan}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RouteGuard>
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
            Memuat pesanan Anda...
          </div>
        }
      >
        <OrdersListContent />
      </Suspense>
    </RouteGuard>
  );
}
