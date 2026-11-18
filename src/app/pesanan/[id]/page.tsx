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
import { StatusPesananBadge } from '@/components/domain/StatusPesananBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

function DetailPesananContent({
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
            href="/pesanan"
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
          <StatusPesananBadge status={pesanan.status} />
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
        </div>
      )}

      {pesanan.status === 'terkonfirmasi' && (
        <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Pesanan Telah Terkonfirmasi</span>
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
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1 mt-2">
                <span className="text-[11px] font-bold text-secondary block">
                  Penerima Unit Berbeda (Pengemudi):
                </span>
                <p className="font-bold text-primary">
                  {pesanan.pemesanLain.nama}
                </p>
                <p className="text-text-muted font-mono">
                  {pesanan.pemesanLain.nomorWA}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Rincian Tarif Card */}
      <Card level={1} padding="md" className="rounded-3xl shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-secondary" />
          <span>Rincian Biaya Transaksi</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>
              Tarif Sewa ({pesanan.durasiHari} hari ×{' '}
              {formatRupiah(pesanan.unit?.hargaPerHari || 0)})
            </span>
            <span className="tnum font-bold text-text-main">
              {formatRupiah(pesanan.rincianBiaya.sewa)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Biaya Proteksi & Asuransi</span>
            </span>
            <span className="tnum font-bold text-text-main">
              {formatRupiah(pesanan.rincianBiaya.proteksi)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Pajak PPN (11%)</span>
            <span className="tnum font-bold text-text-main">
              {formatRupiah(pesanan.rincianBiaya.pajak)}
            </span>
          </div>

          <div className="pt-3.5 border-t border-border/80 flex justify-between items-baseline font-bold">
            <span className="text-sm text-primary">Total Pembayaran</span>
            <span className="tnum font-[family-name:var(--font-headline)] text-xl font-black text-secondary">
              {formatRupiah(pesanan.rincianBiaya.total)}
            </span>
          </div>
        </div>
      </Card>

      {/* WhatsApp Action Button */}
      <div className="pt-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<PhoneCall className="w-5 h-5 text-white" />}
            className="shadow-lg shadow-blue-500/20"
          >
            Hubungi WhatsApp Admin Resmi
          </Button>
        </a>
      </div>
    </div>
  );
}

export default function DetailPesananPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <RouteGuard>
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        }
      >
        <DetailPesananContent params={params} />
      </Suspense>
    </RouteGuard>
  );
}
