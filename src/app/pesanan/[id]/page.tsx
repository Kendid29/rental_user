'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

function DetailPesananContent({ params }: { params: Promise<{ id: string }> }) {
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
        const msg = err instanceof Error ? err.message : 'Gagal memuat detail pesanan';
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
        <Skeleton className="h-48 rounded-2xl w-full" />
        <Skeleton className="h-48 rounded-2xl w-full" />
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
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/pesanan" className="text-xs text-secondary hover:underline">
              ← Kembali ke Pesanan Saya
            </Link>
          </div>
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary mt-1">
            Pesanan #{pesanan.id}
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Dibuat pada {formatTanggalIndo(pesanan.createdAt)}
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <StatusPesananBadge status={pesanan.status} />
        </div>
      </div>

      {/* Verification Notice Banner */}
      {pesanan.status === 'menunggu_pembayaran' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
            <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Menunggu Konfirmasi Admin</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-800/90">
            Pesanan Anda telah dicatat di sistem. Admin RentaKu sedang memverifikasi rincian pesanan dan pembayaran. Anda dapat menghubungi admin secara langsung melalui tombol WhatsApp di bawah.
          </p>
        </div>
      )}

      {pesanan.status === 'terkonfirmasi' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Pesanan Terkonfirmasi</span>
          </div>
          <p className="text-xs leading-relaxed text-emerald-800/90">
            Pembayaran telah diverifikasi oleh Admin. Unit kendaraan telah dialokasikan untuk Anda pada jadwal yang ditentukan.
          </p>
        </div>
      )}

      {/* Grid: Unit Info & Driver Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Info */}
        <Card level={1} padding="md" className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Kendaraan & Mitra
          </h3>

          <div className="flex gap-4 items-center">
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
            <div>
              <h4 className="font-bold text-base text-primary">
                {pesanan.unit?.nama}
              </h4>
              <p className="text-xs text-text-muted">
                {pesanan.mitra?.nama} ({pesanan.mitra?.kota})
              </p>
              <div className="flex gap-2 text-[11px] text-text-muted mt-1">
                <span>{pesanan.unit?.transmisi}</span>
                <span>•</span>
                <span>{pesanan.unit?.kapasitas} Kursi</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-border text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-text-muted">Tanggal Mulai:</span>
              <span className="font-semibold text-primary">{formatTanggalIndo(pesanan.tanggalMulai)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Tanggal Selesai:</span>
              <span className="font-semibold text-primary">{formatTanggalIndo(pesanan.tanggalSelesai)}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-border">
              <span className="text-text-muted">Durasi:</span>
              <span className="font-bold text-secondary">{pesanan.durasiHari} Hari</span>
            </div>
          </div>
        </Card>

        {/* Data Penyewa */}
        <Card level={1} padding="md" className="space-y-4">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Data Penyewa & Penerima
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-text-muted block">Nama Pemesan:</span>
              <span className="font-bold text-primary text-sm">{pesanan.namaPenyewa}</span>
            </div>

            <div>
              <span className="text-text-muted block">Nomor WhatsApp:</span>
              <span className="font-bold text-primary">{pesanan.nomorWAPenyewa}</span>
            </div>

            {pesanan.pesanUntukOrangLain && pesanan.pemesanLain && (
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1 mt-2">
                <span className="text-[11px] font-bold text-secondary block">
                  Penerima Unit Berbeda:
                </span>
                <p className="font-bold text-primary">{pesanan.pemesanLain.nama}</p>
                <p className="text-text-muted">{pesanan.pemesanLain.nomorWA}</p>
              </div>
            )}

            <div>
              <span className="text-text-muted block">Metode Pembayaran:</span>
              <span className="font-bold text-primary uppercase">
                {pesanan.metodePembayaran}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Rincian Biaya Pembayaran */}
      <Card level={1} padding="md" className="space-y-3">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
          Rincian Pembayaran
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>Sewa Kendaraan</span>
            <span className="tnum font-medium text-text-main">
              {formatRupiah(pesanan.rincianBiaya.sewa)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Biaya Proteksi & Asuransi</span>
            <span className="tnum font-medium text-text-main">
              {formatRupiah(pesanan.rincianBiaya.proteksi)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Pajak (PPN 11%)</span>
            <span className="tnum font-medium text-text-main">
              {formatRupiah(pesanan.rincianBiaya.pajak)}
            </span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between items-baseline font-bold">
            <span className="text-primary text-sm">Total Pembayaran</span>
            <span className="tnum font-[family-name:var(--font-headline)] text-xl text-secondary">
              {formatRupiah(pesanan.rincianBiaya.total)}
            </span>
          </div>
        </div>
      </Card>

      {/* CTA Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.948 2.801.948 3.178 0 5.767-2.587 5.767-5.766.001-3.182-2.586-5.769-5.772-5.769zm3.364 8.163c-.144.405-.837.774-1.17.822-.312.043-.68.077-2.12-.519-1.841-.762-3.031-2.617-3.123-2.738-.093-.122-.746-.992-.746-1.893 0-.901.47-1.344.636-1.528.167-.184.364-.23.486-.23.122 0 .243.001.348.006.111.005.259-.042.404.307.151.365.516 1.258.561 1.35.046.092.077.2.015.323-.061.123-.092.2-.183.307-.091.107-.193.24-.275.322-.093.092-.19.192-.082.378.107.185.476.786 1.022 1.272.705.628 1.3.822 1.484.914.185.092.293.077.401-.046.108-.123.462-.538.585-.722.123-.184.246-.154.415-.092.17.061 1.077.507 1.262.599.185.092.308.138.354.215.046.077.046.446-.098.851z" />
              </svg>
            }
          >
            Hubungi Admin WhatsApp
          </Button>
        </a>

        <Link href="/pesanan" className="sm:w-auto">
          <Button variant="secondary" size="lg" fullWidth>
            Kembali ke Daftar Pesanan
          </Button>
        </Link>
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
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat detail pesanan...</div>}>
        <DetailPesananContent params={params} />
      </Suspense>
    </RouteGuard>
  );
}
