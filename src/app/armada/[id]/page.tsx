'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  Users,
  Settings2,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
        const msg =
          err instanceof Error ? err.message : 'Gagal memuat detail armada';
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
            <Skeleton className="aspect-[16/10] rounded-3xl w-full" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 rounded-3xl w-full" />
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
            description="Armada yang Anda cari tidak tersedia atau tautan sudah usang."
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
      `/checkout?unitId=${unit.id}&mulai=${encodeURIComponent(
        tanggalMulai
      )}&selesai=${encodeURIComponent(tanggalSelesai)}`
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
      {/* Breadcrumbs Navigation */}
      <nav
        className="flex items-center gap-2 text-xs text-text-muted"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={`/katalog/${unit.jenis}`}
          className="hover:text-primary transition-colors capitalize font-semibold"
        >
          Sewa {unit.jenis}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-bold truncate">{unit.nama}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Specifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Hero Gallery Viewport */}
          <div className="relative bg-white rounded-3xl overflow-hidden border border-border/80 shadow-md aspect-[16/10]">
            <Image
              src={selectedImage || unit.gambar}
              alt={unit.nama}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-all duration-300"
              unoptimized
            />

            {unit.label && (
              <span className="absolute top-4 left-4 bg-primary-dark/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm tracking-wide">
                {unit.label}
              </span>
            )}

            {isOutOfStock && (
              <div className="absolute inset-0 bg-primary-dark/75 backdrop-blur-xs flex items-center justify-center text-white text-base font-black uppercase tracking-widest z-20">
                Stok Tidak Tersedia
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1.5">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    'relative w-20 h-16 sm:w-24 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0',
                    selectedImage === img
                      ? 'border-secondary ring-2 ring-secondary/20 scale-102 shadow-xs'
                      : 'border-border/80 hover:border-slate-400 opacity-75 hover:opacity-100'
                  )}
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

          {/* Unit Details Card */}
          <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-6">
              <div>
                <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                  {unit.nama}
                </h1>

                <div className="text-xs sm:text-sm text-text-muted mt-1.5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-secondary shrink-0" />
                  <span>Mitra:</span>
                  <strong className="text-primary font-bold">
                    {unit.mitra?.nama}
                  </strong>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {unit.mitra?.kota}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/90 px-3 py-1.5 rounded-xl self-start sm:self-auto shrink-0">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-amber-800">
                  {unit.rating.toFixed(1)} ({unit.jumlahUlasan} Ulasan)
                </span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div>
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                Spesifikasi Utama
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
                  <span className="text-[10px] text-text-muted font-semibold block uppercase">
                    Kategori
                  </span>
                  <span className="text-sm font-bold text-primary capitalize flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-secondary" />
                    {unit.jenis}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
                  <span className="text-[10px] text-text-muted font-semibold block uppercase">
                    Transmisi
                  </span>
                  <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-secondary" />
                    {unit.transmisi}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
                  <span className="text-[10px] text-text-muted font-semibold block uppercase">
                    Kapasitas
                  </span>
                  <span className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-secondary" />
                    {unit.kapasitas} Kursi
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
                  <span className="text-[10px] text-text-muted font-semibold block uppercase">
                    Status Stok
                  </span>
                  <span
                    className={cn(
                      'text-sm font-bold flex items-center gap-1.5',
                      unit.stok > 0 ? 'text-emerald-700' : 'text-rose-600'
                    )}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {unit.stok > 0 ? `Tersedia (${unit.stok})` : 'Habis'}
                  </span>
                </div>
              </div>
            </div>

            {/* Features & Amenities List */}
            {unit.fitur && unit.fitur.length > 0 && (
              <div className="pt-2 border-t border-border/80">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                  Kelengkapan & Fasilitas Unit
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {unit.fitur.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-xs text-text-main bg-slate-50/70 p-2.5 rounded-xl border border-border/60"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mitra Details Card */}
            {unit.mitra && (
              <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/50 p-4.5 rounded-2xl border border-blue-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      {unit.mitra.nama}
                    </span>
                    {unit.mitra.isSuperPartner && (
                      <Badge variant="superPartner" size="sm">
                        Super Partner
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted">
                    {unit.mitra.layanan.join(' • ')}
                  </p>
                </div>

                <Link
                  href={`/katalog/${unit.jenis}?kota=${encodeURIComponent(
                    unit.mitra.kota
                  )}`}
                  className="text-xs font-bold text-secondary hover:text-secondary-hover inline-flex items-center gap-1 shrink-0"
                >
                  <span>Lihat Unit Lain dari Mitra Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Reservation Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card level={2} padding="md" className="space-y-5 rounded-3xl shadow-lg border-border/80">
              <div>
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                  Tarif Sewa Harian
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="tnum font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-secondary">
                    {formatRupiah(unit.hargaPerHari)}
                  </span>
                  <span className="text-xs text-text-muted font-medium">/ hari</span>
                </div>
              </div>

              {/* Schedule Input Form */}
              <div className="pt-4 border-t border-border/80 space-y-3.5">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Jadwal Penggunaan</span>
                </h4>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted block mb-1">
                      Tanggal Mulai Sewa
                    </label>
                    <input
                      type="date"
                      value={tanggalMulai}
                      onChange={(e) => handleTanggalMulaiChange(e.target.value)}
                      className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3.5 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
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
                      className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3.5 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                {dateError && (
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{dateError}</span>
                  </p>
                )}

                <div className="p-3 rounded-xl bg-slate-50 border border-border/80 flex justify-between items-center text-xs">
                  <span className="text-text-muted font-medium">Durasi Sewa:</span>
                  <span className="font-extrabold text-secondary text-sm">
                    {durasiHari} Hari
                  </span>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="pt-3 border-t border-border/80 space-y-2 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Sewa ({durasiHari} Hari)</span>
                  <span className="tnum font-bold text-text-main">
                    {formatRupiah(rincian.sewa)}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Proteksi All-Risk</span>
                  <span className="tnum font-bold text-text-main">
                    {formatRupiah(rincian.proteksi)}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Pajak PPN (11%)</span>
                  <span className="tnum font-bold text-text-main">
                    {formatRupiah(rincian.pajak)}
                  </span>
                </div>

                <div className="pt-3 border-t border-border/80 flex justify-between items-baseline font-bold">
                  <span className="text-primary text-sm">Estimasi Total</span>
                  <span className="tnum font-[family-name:var(--font-headline)] text-xl font-black text-secondary">
                    {formatRupiah(rincian.total)}
                  </span>
                </div>
              </div>

              {/* Out of Stock Warning */}
              {isOutOfStock && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
                  Maaf, unit {unit.nama} saat ini sedang habis tersewa untuk jadwal yang Anda tentukan.
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isPesanDisabled}
                  onClick={handlePesanSekarang}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shadow-md shadow-blue-500/20"
                >
                  Lanjut Pesan Unit
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
                    leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
                  >
                    Tanya Dulu via WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* Guarantee Box */}
            <div className="p-4 rounded-2xl bg-white border border-border/80 text-xs text-text-muted space-y-1.5 shadow-2xs">
              <p className="font-bold text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Jaminan Kualitas RentalinAja</span>
              </p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Unit selalu dibersihkan sebelum serah terima, kondisi mesin telah dicek teknis, dan dukungan darurat 24 jam.
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
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 aspect-[16/10] rounded-3xl" />
            <Skeleton className="h-96 rounded-3xl" />
          </div>
        </div>
      }
    >
      <DetailArmadaContent params={params} />
    </Suspense>
  );
}
