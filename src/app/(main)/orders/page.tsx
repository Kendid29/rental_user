'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Plus } from 'lucide-react';
import { api } from '@/api';
import { _updatePesananStatus } from '@/mocks/endpoints';
import { Pesanan, StatusPesanan } from '@/types';
import { RouteGuard } from '@/hooks/useSesi';
import {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pesanans, setPesanans] = useState<Pesanan[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPesanans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.pesanan.list({
        status: selectedStatus === 'semua' ? undefined : selectedStatus,
        page: currentPage,
        limit: 5,
      });

      setPesanans(res.items);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat riwayat pesanan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, currentPage]);

  useEffect(() => {
    fetchPesanans();
  }, [fetchPesanans]);

  const handleSimulateStatus = async (
    id: string,
    newStatus: StatusPesanan
  ) => {
    try {
      _updatePesananStatus(id, newStatus);
      fetchPesanans();
    } catch (e) {
      console.error('Failed to simulate status:', e);
    }
  };

  const handleStatusChange = (status: StatusPesanan | 'semua') => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Riwayat Transaksi</span>
          </div>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
            Pesanan Saya
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
            Pantau status ketersediaan armada, jadwal sewa, dan konfirmasi pembayaran Anda.
          </p>
        </div>

        <Link href="/fleet">
          <Button variant="primary" size="md" rightIcon={<Plus className="w-4 h-4" />}>
            Sewa Unit Baru
          </Button>
        </Link>
      </div>

      {/* Filter Status Tabs */}
      <OrderStatusTabs
        selectedStatus={selectedStatus}
        onSelectStatus={handleStatusChange}
      />

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-border/80 rounded-3xl p-5 bg-white space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-24 h-20 rounded-2xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Gagal Memuat Pesanan"
          message={error}
          onRetry={fetchPesanans}
        />
      )}

      {/* Empty State */}
      {!isLoading && !error && pesanans.length === 0 && (
        <EmptyState
          title="Belum Ada Pesanan"
          description="Anda belum memiliki transaksi sewa kendaraan dengan status ini."
          actionText="Jelajahi Armada Sekarang"
          onAction={() => router.push('/fleet')}
        />
      )}

      {/* List of Order Cards */}
      {!isLoading && !error && pesanans.length > 0 && (
        <div className="space-y-4">
          {pesanans.map((pesanan) => (
            <OrderCard
              key={pesanan.id}
              pesanan={pesanan}
              onSimulateStatus={handleSimulateStatus}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4">
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
