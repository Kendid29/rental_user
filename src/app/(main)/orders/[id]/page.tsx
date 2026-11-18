'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  PhoneCall,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  Building2,
  User,
  CreditCard,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/api';
import { Pesanan } from '@/types';
import { RouteGuard } from '@/hooks/useSesi';
import { formatRupiah, formatTanggalIndo } from '@/lib/pricing';
import { buildWaAdminLink } from '@/lib/whatsapp';
import { OrderStatusBadge } from '@/components/features/orders';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

function DetailOrderContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [pesanan, setPesanan] = useState<Pesanan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-8 w-64" />
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
      {/* Back Link & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1.5">
          <Link
            href="/orders"
            className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Pesanan Saya</span>
          </Link>

          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary">
            Pesanan #{pesanan.id}
          </h1>

          <p className="text-xs text-text-muted">
            Dibuat pada {formatTanggalIndo(pesanan.createdAt)}
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <OrderStatusBadge status={pesanan.status} />
        </div>
      </div>

      {/* Verification Notice Banner */}
      {pesanan.status === 'menunggu_pembayaran' && (
        <div className="p-5 rounded-3xl bg-amber-50/90 border border-amber-200/90 text-amber-900 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Menunggu Konfirmasi Pembayaran</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-800/90">
            Pesanan Anda telah tercatat. Silakan hubungi admin resmi RentalinAja melalui WhatsApp untuk mengirimkan bukti pembayaran atau memverifikasi ketersediaan armada.
          </p>
          <div className="pt-2">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
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

      {/* Grid: Unit Info & Driver Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Info Card */}
        <Card level={1} padding="md" className="space-y-4 rounded-3xl shadow-xs">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            <span>Kendaraan & Jadwal Sewa</span>
          </h3>

          <div className="flex gap-4 items-center">
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
              <h4 className="font-bold text-base text-primary">
                {pesanan.unit?.nama}
              </h4>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span>
                  {pesanan.mitra?.nama} ({pesanan.mitra?.kota})
                </span>
              </p>
              <div className="flex gap-2 text-[11px] text-text-muted mt-1">
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                  {pesanan.unit?.transmisi}
                </span>
                <span>•</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                  {pesanan.unit?.kapasitas} Kursi
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-border/80 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Tanggal Mulai:</span>
              <span className="font-bold text-primary">
                {formatTanggalIndo(pesanan.tanggalMulai)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Tanggal Selesai:</span>
              <span className="font-bold text-primary">
                {formatTanggalIndo(pesanan.tanggalSelesai)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/70">
              <span className="text-text-muted font-medium">Durasi Sewa:</span>
              <span className="font-extrabold text-secondary">
                {pesanan.durasiHari} Hari
              </span>
            </div>
          </div>
        </Card>

        {/* Penyewa Data Card */}
        <Card level={1} padding="md" className="space-y-4 rounded-3xl shadow-xs">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-secondary" />
            <span>Data Identitas Penyewa</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-text-muted block">Nama Pemesan:</span>
              <span className="font-bold text-primary text-sm">
                {pesanan.namaPenyewa}
              </span>
            </div>

            <div>
              <span className="text-text-muted block">Nomor WhatsApp:</span>
              <span className="font-bold text-primary font-mono">
                {pesanan.nomorWAPenyewa}
              </span>
            </div>

            <div>
              <span className="text-text-muted block">Metode Pembayaran:</span>
              <span className="font-bold text-primary uppercase">
                {pesanan.metodePembayaran}
              </span>
            </div>

            {pesanan.pesanUntukOrangLain && pesanan.pemesanLain && (
              <div className="pt-2 border-t border-border/70 space-y-1">
                <span className="text-[10px] font-bold text-secondary uppercase block">
                  Penerima Unit / Driver:
                </span>
                <p className="font-bold text-primary">
                  {pesanan.pemesanLain.nama} ({pesanan.pemesanLain.nomorWA})
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Itemized Cost Breakdown Card */}
      <Card level={1} padding="md" className="space-y-4 rounded-3xl shadow-xs">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-secondary" />
          <span>Rincian Pembayaran</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>
              Tarif Sewa Pokok ({pesanan.durasiHari} Hari ×{' '}
              {formatRupiah(pesanan.unit?.hargaPerHari || 0)})
            </span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(pesanan.rincianBiaya.sewa)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
              Proteksi Sewa & Asuransi
            </span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(pesanan.rincianBiaya.proteksi)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Pajak Transaksi (PPN 11%)</span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(pesanan.rincianBiaya.pajak)}
            </span>
          </div>

          <div className="pt-3 border-t border-border flex justify-between items-baseline font-black">
            <div>
              <span className="text-sm text-primary block">
                Total Nilai Transaksi
              </span>
              <span className="text-[10px] text-text-muted">
                Status: {pesanan.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <span className="font-[family-name:var(--font-headline)] text-2xl text-secondary tnum">
              {formatRupiah(pesanan.rincianBiaya.total)}
            </span>
          </div>
        </div>
      </Card>

      {/* Admin WhatsApp Assistance CTA */}
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
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 rounded-3xl w-full" />
          </div>
        }
      >
        <DetailOrderContent params={params} />
      </Suspense>
    </RouteGuard>
  );
}
