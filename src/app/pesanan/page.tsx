'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/api';
import { useMock } from '@/config/env';
import { _updatePesananStatus } from '@/mocks/endpoints';
import { Pesanan, StatusPesanan } from '@/types';
import { RouteGuard } from '@/hooks/useSesi';
import { formatRupiah, formatTanggalIndo } from '@/lib/pricing';
import { StatusPesananBadge } from '@/components/domain/StatusPesananBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Pagination } from '@/components/ui/Pagination';

const STATUS_TABS: { label: string; value: StatusPesanan | 'semua' }[] = [
  { label: 'Semua Status', value: 'semua' },
  { label: 'Menunggu Konfirmasi', value: 'menunggu_pembayaran' },
  { label: 'Terkonfirmasi', value: 'terkonfirmasi' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

function PesananSayaContent() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<StatusPesanan | 'semua'>('semua');
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
        limit: 10,
      });
      setPesanans(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat daftar pesanan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, currentPage]);

  useEffect(() => {
    fetchPesanans();
  }, [fetchPesanans]);

  // Dev-only helper to simulate admin changing order status
  const handleSimulateStatusChange = (id: string, newStatus: StatusPesanan) => {
    if (!useMock) return;
    _updatePesananStatus(id, newStatus);
    fetchPesanans(); // Re-read from API
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
            Pesanan Saya
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Pantau status verifikasi dan jadwal sewa kendaraan Anda
          </p>
        </div>

        <Link href="/katalog/mobil">
          <Button variant="primary" size="sm">
            + Sewa Kendaraan Baru
          </Button>
        </Link>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const isSelected = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setSelectedStatus(tab.value);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-white text-text-muted border border-border hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List Content */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-border space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-24 h-20 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !isLoading && (
        <ErrorState
          title="Gagal Memuat Pesanan"
          message={error}
          onRetry={fetchPesanans}
        />
      )}

      {!isLoading && !error && pesanans.length === 0 && (
        <EmptyState
          title="Belum Ada Pesanan"
          description="Anda belum memiliki transaksi sewa kendaraan dengan status ini."
          actionText="Jelajahi Armada Sekarang"
          onAction={() => router.push('/katalog/mobil')}
        />
      )}

      {!isLoading && !error && pesanans.length > 0 && (
        <div className="space-y-4">
          {pesanans.map((pesanan) => (
            <Card key={pesanan.id} level={1} padding="md" className="space-y-4 hover:border-secondary/30 transition-all">
              {/* Header Card */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{pesanan.id}</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">
                    Dibuat: {formatTanggalIndo(pesanan.createdAt)}
                  </span>
                </div>
                <StatusPesananBadge status={pesanan.status} />
              </div>

              {/* Body Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {pesanan.unit && (
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-border">
                      <Image
                        src={pesanan.unit.gambar}
                        alt={pesanan.unit.nama}
                        fill
                        sizes="96px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-primary">
                      {pesanan.unit?.nama || 'Unit Kendaraan'}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {pesanan.mitra?.nama} ({pesanan.mitra?.kota})
                    </p>
                    <p className="text-xs text-slate-700">
                      Jadwal: <span className="font-semibold">{formatTanggalIndo(pesanan.tanggalMulai)}</span> s/d{' '}
                      <span className="font-semibold">{formatTanggalIndo(pesanan.tanggalSelesai)}</span> ({pesanan.durasiHari} Hari)
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <span className="text-[11px] text-text-muted">Total Pembayaran</span>
                  <span className="tnum font-[family-name:var(--font-headline)] text-lg font-bold text-secondary">
                    {formatRupiah(pesanan.rincianBiaya.total)}
                  </span>
                </div>
              </div>

              {/* Actions & Mock Simulation Tools */}
              <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
                {/* Dev Mock Simulator */}
                {useMock && (
                  <div className="flex items-center gap-1.5 text-[11px] bg-slate-50 border border-border px-2.5 py-1 rounded-lg">
                    <span className="font-bold text-text-muted">Simulasi Admin (Mock):</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateStatusChange(pesanan.id, 'terkonfirmasi')}
                      className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      Terkonfirmasi
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateStatusChange(pesanan.id, 'selesai')}
                      className="text-blue-700 hover:underline font-semibold cursor-pointer"
                    >
                      Selesai
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateStatusChange(pesanan.id, 'dibatalkan')}
                      className="text-red-700 hover:underline font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}

                <div className="ml-auto">
                  <Link href={`/pesanan/${pesanan.id}`}>
                    <Button variant="secondary" size="sm">
                      Lihat Detail Pesanan →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => setCurrentPage(p)}
          />
        </div>
      )}
    </div>
  );
}

export default function PesananPage() {
  return (
    <RouteGuard>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat pesanan...</div>}>
        <PesananSayaContent />
      </Suspense>
    </RouteGuard>
  );
}
