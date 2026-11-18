'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  PhoneCall,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

const STATUS_TABS: { label: string; value: StatusPesanan | 'semua' }[] = [
  { label: 'Semua Status', value: 'semua' },
  { label: 'Menunggu Konfirmasi', value: 'menunggu_pembayaran' },
  { label: 'Terkonfirmasi', value: 'terkonfirmasi' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

function PesananSayaContent() {
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
        limit: 10,
      });
      setPesanans(res.items);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memuat daftar pesanan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, currentPage]);

  useEffect(() => {
    fetchPesanans();
  }, [fetchPesanans]);

  // Dev simulation helper in mock mode
  const handleSimulateStatusChange = (id: string, newStatus: StatusPesanan) => {
    if (!useMock) return;
    _updatePesananStatus(id, newStatus);
    fetchPesanans();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Riwayat Transaksi</span>
          </span>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary mt-1">
            Pesanan Saya
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
            Pantau status verifikasi mitra, jadwal pemakaian, serta rincian biaya sewa kendaraan Anda.
          </p>
        </div>

        <Link href="/katalog/mobil" className="shrink-0">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Sewa Armada Baru
          </Button>
        </Link>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
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
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap select-none',
                isSelected
                  ? 'bg-secondary text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-text-muted border border-border/80 hover:bg-slate-50 hover:text-primary'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-3xl border border-border space-y-4 shadow-2xs"
            >
              <div className="flex justify-between">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-6 w-28 rounded-full" />
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
          onAction={() => router.push('/katalog/mobil')}
        />
      )}

      {/* List of Orders */}
      {!isLoading && !error && pesanans.length > 0 && (
        <div className="space-y-4">
          {pesanans.map((pesanan) => (
            <Card
              key={pesanan.id}
              level={1}
              padding="md"
              className="space-y-4 hover:border-secondary/35 hover:shadow-md transition-all rounded-3xl"
            >
              {/* Header Box */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg border border-border/80">
                    {pesanan.id}
                  </span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted font-medium">
                    Dibuat: {formatTanggalIndo(pesanan.createdAt)}
                  </span>
                </div>

                <StatusPesananBadge status={pesanan.status} />
              </div>

              {/* Body Content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  {pesanan.unit && (
                    <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-border/80 shadow-2xs">
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
                    <p className="text-xs text-text-muted flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-secondary" />
                      <span>
                        {pesanan.mitra?.nama} ({pesanan.mitra?.kota})
                      </span>
                    </p>
                    <p className="text-xs text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-secondary" />
                      <span>
                        {formatTanggalIndo(pesanan.tanggalMulai)} -{' '}
                        {formatTanggalIndo(pesanan.tanggalSelesai)} ({pesanan.durasiHari} Hari)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border/80">
                  <span className="text-[11px] text-text-muted font-medium">
                    Total Tarif
                  </span>
                  <span className="tnum font-[family-name:var(--font-headline)] text-lg sm:text-xl font-black text-secondary">
                    {formatRupiah(pesanan.rincianBiaya.total)}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3.5 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Link href={`/pesanan/${pesanan.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Detail Pesanan
                    </Button>
                  </Link>

                  {pesanan.status === 'menunggu_pembayaran' && (
                    <a
                      href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                        `Halo Admin RentalinAja, saya ingin konfirmasi pesanan dengan ID: ${pesanan.id}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                        }
                      >
                        Konfirmasi WA
                      </Button>
                    </a>
                  )}
                </div>

                {/* Mock Simulator Pills (Dev Only) */}
                {useMock && (
                  <div className="flex items-center gap-1.5 text-[11px] bg-slate-50 px-2.5 py-1 rounded-xl border border-border/80">
                    <span className="text-text-muted font-semibold">
                      [Simulasi Status]:
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSimulateStatusChange(pesanan.id, 'terkonfirmasi')
                      }
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      Konfirmasi
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSimulateStatusChange(pesanan.id, 'selesai')
                      }
                      className="text-slate-700 hover:underline font-bold"
                    >
                      Selesai
                    </button>
                    <span>|</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleSimulateStatusChange(pesanan.id, 'dibatalkan')
                      }
                      className="text-rose-600 hover:underline font-bold"
                    >
                      Batal
                    </button>
                  </div>
                )}
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

export default function PesananSayaPage() {
  return (
    <RouteGuard>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        }
      >
        <PesananSayaContent />
      </Suspense>
    </RouteGuard>
  );
}
