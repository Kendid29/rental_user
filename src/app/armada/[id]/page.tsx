'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/api';
import { Unit } from '@/types';
import { formatRupiah, hitungRincianBiaya } from '@/lib/pricing';
import { buildWaTanyaUnitLink } from '@/lib/whatsapp';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

function DetailArmadaContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [unit, setUnit] = useState<Unit | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Rental schedule dates
  const [tanggalMulai, setTanggalMulai] = useState<string>('');
  const [tanggalSelesai, setTanggalSelesai] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

  useEffect(() => {
    const d1 = new Date();
    d1.setDate(d1.getDate() + 1);
    setTanggalMulai(d1.toISOString().split('T')[0]);

    const d2 = new Date();
    d2.setDate(d2.getDate() + 3);
    setTanggalSelesai(d2.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    async function loadUnit() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.unit.getById(id);
        setUnit(data);
        setSelectedImage(data.gambar);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memuat detail armada';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    loadUnit();
  }, [id]);

  // Handle date changes with validation
  const handleTanggalMulaiChange = (val: string) => {
    setTanggalMulai(val);
    if (tanggalSelesai && val > tanggalSelesai) {
      setDateError('Tanggal selesai tidak boleh sebelum tanggal mulai');
    } else {
      setDateError(null);
    }
  };

  const handleTanggalSelesaiChange = (val: string) => {
    setTanggalSelesai(val);
    if (tanggalMulai && val < tanggalMulai) {
      setDateError('Tanggal selesai tidak boleh sebelum tanggal mulai');
    } else {
      setDateError(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-[16/10] rounded-2xl w-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        {error ? (
          <ErrorState
            title="Armada Tidak Ditemukan"
            message={error}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <EmptyState
            title="Kendaraan Tidak Ditemukan"
            description="Armada yang Anda cari tidak tersedia atau tautan salah."
            actionText="Kembali ke Beranda"
            onAction={() => router.push('/')}
          />
        )}
      </div>
    );
  }

  const { durasiHari, rincian } = hitungRincianBiaya(
    unit.hargaPerHari,
    tanggalMulai,
    tanggalSelesai
  );

  const isOutOfStock = unit.stok <= 0;
  const isDateInvalid = Boolean(dateError) || !tanggalMulai || !tanggalSelesai;
  const isPesanDisabled = isOutOfStock || isDateInvalid;

  const handlePesanSekarang = () => {
    if (isPesanDisabled) return;
    router.push(
      `/checkout?unitId=${unit.id}&mulai=${encodeURIComponent(tanggalMulai)}&selesai=${encodeURIComponent(tanggalSelesai)}`
    );
  };

  const galleryImages = [
    unit.gambar,
    ...(unit.galeri?.filter((g) => g !== unit.gambar) || []),
  ];

  const waTanyaLink = buildWaTanyaUnitLink(
    unit.nama,
    unit.mitra?.nama || '-',
    unit.mitra?.kota || '-'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link
          href={`/katalog/${unit.jenis}`}
          className="hover:text-primary transition-colors capitalize"
        >
          Sewa {unit.jenis}
        </Link>
        <span>/</span>
        <span className="text-primary font-semibold truncate">{unit.nama}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Visuals & Specifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image Viewport */}
          <div className="relative bg-white rounded-3xl overflow-hidden border border-border elevation-1 aspect-[16/10]">
            <Image
              src={selectedImage || unit.gambar}
              alt={unit.nama}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              unoptimized
            />
            {unit.label && (
              <span className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                {unit.label}
              </span>
            )}
            {isOutOfStock && (
              <span className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center text-white text-base font-bold uppercase tracking-wider">
                Stok Tidak Tersedia
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    selectedImage === img
                      ? 'border-secondary ring-2 ring-secondary/20 scale-102'
                      : 'border-border hover:border-slate-400'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${unit.nama} thumbnail ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}

          {/* Unit Title & Mitra Anchor */}
          <div className="bg-white rounded-2xl border border-border p-6 elevation-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
                  {unit.nama}
                </h1>
                <p className="text-xs sm:text-sm text-text-muted mt-1 flex items-center gap-2">
                  <span>Mitra Penyedia:</span>
                  <span className="font-bold text-primary">{unit.mitra?.nama}</span>
                  <span>•</span>
                  <span>{unit.mitra?.kota}</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-xl self-start sm:self-auto">
                <svg className="w-4 h-4 fill-[#FFB800]" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-amber-800">
                  {unit.rating} ({unit.jumlahUlasan} Ulasan)
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-border">
                <span className="text-[11px] text-text-muted block">Jenis</span>
                <span className="text-xs font-bold text-primary capitalize">{unit.jenis}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-border">
                <span className="text-[11px] text-text-muted block">Transmisi</span>
                <span className="text-xs font-bold text-primary">{unit.transmisi}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-border">
                <span className="text-[11px] text-text-muted block">Kapasitas</span>
                <span className="text-xs font-bold text-primary">{unit.kapasitas} Orang</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-border">
                <span className="text-[11px] text-text-muted block">Ketersediaan</span>
                <span
                  className={`text-xs font-bold ${
                    unit.stok > 0 ? 'text-emerald-700' : 'text-urgency'
                  }`}
                >
                  {unit.stok > 0 ? `Tersedia (${unit.stok} Unit)` : 'Habis'}
                </span>
              </div>
            </div>

            {/* Features List */}
            <div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2.5">
                Fitur & Fasilitas Unit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {unit.fitur.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-text-main">
                    <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitra Details Card */}
            {unit.mitra && (
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/40 p-4 rounded-xl border border-blue-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{unit.mitra.nama}</span>
                    {unit.mitra.isSuperPartner && (
                      <Badge variant="superPartner" size="sm">
                        Super Partner
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {unit.mitra.layanan.join(' • ')}
                  </p>
                </div>
                <Link
                  href={`/katalog/${unit.jenis}?kota=${encodeURIComponent(unit.mitra.kota)}`}
                  className="text-xs font-bold text-secondary hover:underline shrink-0"
                >
                  Lihat Profil Mitra →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Reservation & Pricing Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card level={2} padding="md" className="space-y-4">
              <div>
                <span className="text-[11px] text-text-muted block">Tarif Sewa Harian</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="tnum font-[family-name:var(--font-headline)] text-2xl font-extrabold text-secondary">
                    {formatRupiah(unit.hargaPerHari)}
                  </span>
                  <span className="text-xs text-text-muted">/ hari</span>
                </div>
              </div>

              {/* Schedule Input Form */}
              <div className="pt-3 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-primary">Jadwal Penggunaan</h4>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted block mb-1">
                      Tanggal Mulai Sewa
                    </label>
                    <input
                      type="date"
                      value={tanggalMulai}
                      onChange={(e) => handleTanggalMulaiChange(e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-border rounded-xl px-3 text-xs font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-text-muted block mb-1">
                      Tanggal Selesai Sewa
                    </label>
                    <input
                      type="date"
                      value={tanggalSelesai}
                      onChange={(e) => handleTanggalSelesaiChange(e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-border rounded-xl px-3 text-xs font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                    />
                  </div>
                </div>

                {dateError && (
                  <p className="text-xs text-urgency font-medium">{dateError}</p>
                )}

                <div className="p-2.5 rounded-xl bg-slate-50 border border-border flex justify-between items-center text-xs">
                  <span className="text-text-muted">Durasi Terhitung:</span>
                  <span className="font-bold text-secondary">{durasiHari} Hari</span>
                </div>
              </div>

              {/* Live Price Estimation */}
              <div className="pt-2 border-t border-border space-y-1.5 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Sewa ({durasiHari} Hari)</span>
                  <span className="tnum font-medium text-text-main">{formatRupiah(rincian.sewa)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Proteksi All-Risk</span>
                  <span className="tnum font-medium text-text-main">{formatRupiah(rincian.proteksi)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Pajak PPN (11%)</span>
                  <span className="tnum font-medium text-text-main">{formatRupiah(rincian.pajak)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-baseline font-bold">
                  <span className="text-primary">Estimasi Total</span>
                  <span className="tnum font-[family-name:var(--font-headline)] text-lg text-secondary">
                    {formatRupiah(rincian.total)}
                  </span>
                </div>
              </div>

              {/* Out of stock warning banner */}
              {isOutOfStock && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-urgency font-medium">
                  Maaf, seluruh armada {unit.nama} pada mitra ini sedang tersewa untuk jadwal yang dipilih.
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isPesanDisabled}
                  onClick={handlePesanSekarang}
                >
                  Pesan Sekarang
                </Button>

                <a
                  href={waTanyaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    leftIcon={
                      <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.948 2.801.948 3.178 0 5.767-2.587 5.767-5.766.001-3.182-2.586-5.769-5.772-5.769zm3.364 8.163c-.144.405-.837.774-1.17.822-.312.043-.68.077-2.12-.519-1.841-.762-3.031-2.617-3.123-2.738-.093-.122-.746-.992-.746-1.893 0-.901.47-1.344.636-1.528.167-.184.364-.23.486-.23.122 0 .243.001.348.006.111.005.259-.042.404.307.151.365.516 1.258.561 1.35.046.092.077.2.015.323-.061.123-.092.2-.183.307-.091.107-.193.24-.275.322-.093.092-.19.192-.082.378.107.185.476.786 1.022 1.272.705.628 1.3.822 1.484.914.185.092.293.077.401-.046.108-.123.462-.538.585-.722.123-.184.246-.154.415-.092.17.061 1.077.507 1.262.599.185.092.308.138.354.215.046.077.046.446-.098.851z" />
                      </svg>
                    }
                  >
                    Tanya Dulu via WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* Guarantee note */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-border text-xs text-text-muted space-y-1">
              <p className="font-bold text-primary flex items-center gap-1.5">
                <span className="text-tertiary-dark">✓</span> Garansi RentaKu
              </p>
              <p className="text-[11px] leading-relaxed">
                Unit dijamin bersih, BBM awal sesuai kesepakatan, dan serah terima tepat waktu di lokasi mitra.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailArmadaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat detail armada...</div>}>
      <DetailArmadaContent params={params} />
    </Suspense>
  );
}
