'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  PhoneCall,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/api';
import { Pesanan } from '@/types';
import { RouteGuard } from '@/hooks/useSesi';
import { formatTanggalIndo } from '@/lib/pricing';
import { buildWaAdminLink } from '@/lib/whatsapp';
import {
  OrderStatusBadge,
  OrderTimeline,
  OrderDetailUnitSchedule,
  OrderDetailCustomer,
  OrderDetailPayment,
} from '@/components/features/orders';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import toast from 'react-hot-toast';

function DetailOrderContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPesanan() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.pesanan.getById(id);
        setPesanan(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Gagal memuat detail pesanan';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    loadPesanan();
  }, [id]);

  const handleCopyId = () => {
    if (!pesanan) return;
    navigator.clipboard.writeText(pesanan.id);
    setCopied(true);
    toast.success(`ID pesanan #${pesanan.id} disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-32 rounded-3xl w-full" />
        <Skeleton className="h-48 rounded-3xl w-full" />
        <Skeleton className="h-48 rounded-3xl w-full" />
      </div>
    );
  }

  if (error || !pesanan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Pesanan Tidak Ditemukan"
          message={error || 'Pesanan yang Anda cari tidak ditemukan.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const waLink = buildWaAdminLink(pesanan);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* 1. Breadcrumb & Header Bar */}
      <div className="space-y-3 border-b border-border/80 pb-6">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <Link
            href="/orders"
            className="hover:text-secondary font-semibold transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Pesanan Saya</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-mono text-slate-500 font-bold">
            #{pesanan.id}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary">
                Pesanan #{pesanan.id}
              </h1>
              <button
                type="button"
                onClick={handleCopyId}
                className="p-1 rounded-lg text-slate-400 hover:text-secondary hover:bg-slate-100 transition-colors cursor-pointer"
                title="Salin ID Pesanan"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-text-muted">
              Dibuat pada {formatTanggalIndo(pesanan.createdAt)}
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <OrderStatusBadge status={pesanan.status} />
          </div>
        </div>
      </div>

      {/* 2. Visual Progress Timeline Stepper */}
      <OrderTimeline
        status={pesanan.status}
        createdAt={pesanan.createdAt}
        tanggalMulai={pesanan.tanggalMulai}
        tanggalSelesai={pesanan.tanggalSelesai}
      />

      {/* 3. Verification Notice Banner */}
      {pesanan.status === 'menunggu_pembayaran' && (
        <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200/90 text-amber-900 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Menunggu Konfirmasi Pembayaran</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-800/90">
            Pesanan Anda telah tercatat. Silakan hubungi admin resmi RentalinAja melalui WhatsApp untuk mengirimkan bukti transfer atau mengonfirmasi pengambilan kunci.
          </p>
          <div className="pt-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
                className="bg-white hover:bg-slate-50 text-emerald-800 border-emerald-300 rounded-xl"
              >
                Konfirmasi Sekarang via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}

      {pesanan.status === 'terkonfirmasi' && (
        <div className="p-5 rounded-3xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Pesanan Terkonfirmasi & Siap Digunakan</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-800/90">
            Pembayaran telah diverifikasi oleh Admin. Unit armada telah dialokasikan dan siap untuk proses serah terima kunci pada tanggal sewa.
          </p>
        </div>
      )}

      {/* 4. Grid: Unit Info & Renter Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderDetailUnitSchedule pesanan={pesanan} />
        <OrderDetailCustomer pesanan={pesanan} />
      </div>

      {/* 5. Itemized Cost Breakdown Card */}
      <OrderDetailPayment pesanan={pesanan} />

      {/* 6. Admin WhatsApp Assistance CTA */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm">
            Butuh Bantuan Terkait Pesanan Ini?
          </h4>
          <p className="text-xs text-slate-300">
            Hubungi Customer Care RentalinAja langsung dengan mencantumkan ID pesanan #{pesanan.id}.
          </p>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Button
            variant="tertiary"
            size="md"
            leftIcon={<PhoneCall className="w-4 h-4" />}
            className="rounded-xl shadow-xs"
          >
            Chat Admin via WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function DetailOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <RouteGuard>
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-48 rounded-3xl w-full" />
          </div>
        }
      >
        <DetailOrderContent params={params} />
      </Suspense>
    </RouteGuard>
  );
}
