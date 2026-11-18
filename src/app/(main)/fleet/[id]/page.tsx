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

function DetailFleetContent({ params }: { params: Promise<{ id: string }> }) {
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

  const catalogPath = unit.jenis === 'motor' ? '/fleet/bikes' : '/fleet/cars';

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
          href={catalogPath}
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
          {/* Main Hero Image */}
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 border border-border/80 shadow-md">
            <Image
              src={selectedImage || unit.gambar}
              alt={unit.nama}
              fill
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

          {/* Unit Title, Rating & Specs Card */}
          <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
                    {unit.nama}
                  </h1>
                  <Badge variant="neutral" size="sm" className="capitalize">
                    {unit.jenis}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-amber-900">
                    {unit.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-amber-700">
                    ({unit.jumlahUlasan} ulasan)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
                <span className="flex items-center gap-1 font-medium text-primary">
                  <Building2 className="w-4 h-4 text-secondary" />
                  {unit.mitra?.nama || 'Mitra Resmi'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {unit.mitra?.kota || 'Indonesia'}
                </span>
              </div>
            </div>

            {/* Core Specs Grid */}
            <div className="pt-2 border-t border-border/80">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                Spesifikasi Utama
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
                  <span className="text-[10px] text-text-muted font-semibold block uppercase">
                    Jenis Armada
                  </span>
                  <span className="text-sm font-bold text-primary flex items-center gap-1.5 capitalize">
                    <Car className="w-4 h-4 text-secondary" />
                    {unit.jenis}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
                  <span className="text-[10px] text-text-muted font-semibold block uppercase">
                    Transmisi
                  </span>
                  <span className="text-sm font-bold text-primary flex items-center gap-1.5 capitalize">
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

            {/* Partner Details Card */}
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
                  href={`/partners/${unit.mitra.id}`}
                  className="text-xs font-bold text-secondary hover:text-secondary-hover inline-flex items-center gap-1 shrink-0"
                >
                  <span>Lihat Profil Mitra Resmi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Box */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card
              level={2}
              padding="lg"
              className="rounded-3xl border-border/80 shadow-lg space-y-6"
            >
              <div>
                <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">
                  Tarif Sewa Harian
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-[family-name:var(--font-headline)] text-3xl font-extrabold text-primary tnum">
                    {formatRupiah(unit.hargaPerHari)}
                  </span>
                  <span className="text-xs text-text-muted">/ hari</span>
                </div>
              </div>

              {/* Rental Schedule Selectors */}
              <div className="space-y-3.5 pt-4 border-t border-border/80">
                <div>
                  <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>Mulai Sewa</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalMulai}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleTanggalMulaiChange(e.target.value)}
                    className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>Selesai Sewa</span>
                  </label>
                  <input
                    type="date"
                    value={tanggalSelesai}
                    min={tanggalMulai || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleTanggalSelesaiChange(e.target.value)}
                    className="w-full bg-slate-50 border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all cursor-pointer"
                  />
                </div>

                {dateError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{dateError}</span>
                  </p>
                )}

                {/* Duration Badge */}
                <div className="flex items-center justify-between text-xs font-bold py-2 px-3 bg-blue-50/70 rounded-xl text-secondary border border-blue-200/50">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Durasi Sewa:
                  </span>
                  <span>{durasiHari} Hari</span>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="space-y-2 pt-4 border-t border-border/80 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>
                    Sewa ({durasiHari} Hari × {formatRupiah(unit.hargaPerHari)})
                  </span>
                  <span className="font-semibold text-primary tnum">
                    {formatRupiah(rincian.sewa)}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
                    Proteksi Asuransi
                  </span>
                  <span className="font-semibold text-primary tnum">
                    {formatRupiah(rincian.proteksi)}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Pajak Transaksi (PPN 11%)</span>
                  <span className="font-semibold text-primary tnum">
                    {formatRupiah(rincian.pajak)}
                  </span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between items-baseline font-black">
                  <span className="text-sm text-primary">Estimasi Total</span>
                  <span className="text-xl text-secondary font-[family-name:var(--font-headline)] tnum">
                    {formatRupiah(rincian.total)}
                  </span>
                </div>
              </div>

              {/* Booking CTAs */}
              <div className="space-y-2.5 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isPesanDisabled}
                  onClick={handlePesanSekarang}
                  className="shadow-lg hover:shadow-primary/25"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isOutOfStock ? 'Unit Sedang Habis' : 'Lanjut ke Pemesanan'}
                </Button>

                <a
                  href={waTanyaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
                  >
                    Tanya Ketersediaan via WhatsApp
                  </Button>
                </a>
              </div>
            </Card>

            {/* Trust Assurance Pill */}
            <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-2 text-xs text-text-muted">
              <div className="flex items-center gap-2 font-bold text-primary">
                <ShieldCheck className="w-4 h-4 text-tertiary" />
                <span>Jaminan Transaksi Resmi</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Tanpa perantara liar. Pembayaran diverifikasi langsung dengan invoice sah dan kwitansi mitra resmi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailFleetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-[16/10] rounded-3xl w-full" />
              <Skeleton className="h-8 w-64" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 rounded-3xl w-full" />
            </div>
          </div>
        </div>
      }
    >
      <DetailFleetContent params={params} />
    </Suspense>
  );
}
