'use client';

import React, {
  use,
  Suspense,
  useEffect,
  useState,
  useMemo,
} from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Car,
  Bike,
  PhoneCall,
  CheckCircle2,
  Clock,
  Wrench,
  HelpCircle,
  Award,
} from 'lucide-react';
import { api } from '@/api';
import { Mitra, Unit } from '@/types';
import { nomorWaAdmin } from '@/config/env';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { FleetCard } from '@/components/features/fleet';

interface DetailPartnerProps {
  params: Promise<{ id: string }>;
}

function DetailPartnerContent({ params }: DetailPartnerProps) {
  const { id } = use(params);
  const [mitra, setMitra] = useState<Mitra | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'semua' | 'mobil' | 'motor'>('semua');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);
      try {
        const [mitraData, unitRes] = await Promise.all([
          api.mitra.getById(id),
          api.unit.list({ limit: 50 }),
        ]);

        setMitra(mitraData);
        const mitraUnits = (unitRes.items || []).filter(
          (u) => u.mitraId === id
        );
        setUnits(mitraUnits);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Informasi mitra tidak dapat ditemukan'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const filteredUnits = useMemo(() => {
    if (activeFilter === 'semua') return units;
    return units.filter((u) => u.jenis === activeFilter);
  }, [units, activeFilter]);

  const waUrl = useMemo(() => {
    if (!mitra) return '#';
    const cleanPhone = nomorWaAdmin.replace(/\D/g, '');
    const text = `Halo Admin RentalinAja, saya tertarik dengan layanan dari mitra *${mitra.nama}* di *${mitra.kota}*. Mohon informasi ketersediaan unit terbaru.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }, [mitra]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-64 sm:h-72 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !mitra) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-headline)]">
          Mitra Tidak Ditemukan
        </h1>
        <p className="text-sm text-text-muted leading-relaxed">
          {error || 'Data profil mitra rental yang Anda cari mungkin telah diperbarui atau dinonaktifkan sementara.'}
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const mobilCount = units.filter((u) => u.jenis === 'mobil').length;
  const motorCount = units.filter((u) => u.jenis === 'motor').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
        <Link href="/" className="hover:text-secondary transition-colors font-medium">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text-muted">Mitra Resmi</span>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-primary font-bold truncate max-w-[200px] sm:max-w-none">
          {mitra.nama}
        </span>
      </nav>

      {/* Profile Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-tertiary/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          {/* Mitra Avatar & Main Info */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-tertiary" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-headline)]">
                  {mitra.nama}
                </h1>
                {mitra.isSuperPartner && (
                  <Badge variant="superPartner" size="sm">
                    ★ Super Partner
                  </Badge>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Terverifikasi
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-secondary" />
                  Kota {mitra.kota}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-amber-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {mitra.rating}
                  <span className="text-slate-400 font-normal">
                    ({mitra.jumlahUlasan} ulasan)
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                  <Car className="w-4 h-4 text-tertiary" />
                  {mitra.unitTersedia} Unit Tersedia
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                variant="tertiary"
                size="md"
                className="w-full justify-center shadow-lg hover:shadow-tertiary/25"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Tanya Mitra via WhatsApp
              </Button>
            </a>

            <Link href="/" className="w-full">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Jelajahi Mitra Lain
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mitra Services / Keunggulan */}
      {mitra.layanan && mitra.layanan.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-secondary" />
            Keunggulan & Fasilitas Layanan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {mitra.layanan.map((layanan, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-border shadow-xs hover:border-secondary/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-primary">
                  {layanan}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Fleets Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-primary font-[family-name:var(--font-headline)]">
              Daftar Armada dari {mitra.nama}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Pilih kendaraan terbaik sesuai kebutuhan mobilitas Anda di {mitra.kota}.
            </p>
          </div>

          {/* Type Filter Pills */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 self-start sm:self-auto border border-border">
            <button
              type="button"
              onClick={() => setActiveFilter('semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'semua'
                  ? 'bg-secondary text-white shadow-xs'
                  : 'text-slate-600 hover:text-primary hover:bg-slate-200/60'
              }`}
            >
              Semua ({units.length})
            </button>
            {mobilCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('mobil')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'mobil'
                    ? 'bg-secondary text-white shadow-xs'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-200/60'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Mobil ({mobilCount})</span>
              </button>
            )}
            {motorCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('motor')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'motor'
                    ? 'bg-secondary text-white shadow-xs'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-200/60'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Motor ({motorCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Units Grid */}
        {filteredUnits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUnits.map((unit) => (
              <FleetCard key={unit.id} unit={unit} />
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-3xl bg-white border border-border text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Car className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-primary text-base">
              Belum Ada Armada Ditampilkan
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Saat ini mitra belum menambahkan unit untuk kategori yang dipilih, atau seluruh armada sedang dalam status tersewa.
            </p>
            <div className="pt-2">
              <Link href="/fleet">
                <Button variant="secondary" size="sm">
                  Cari Unit Mitra Lainnya
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Rental Standards Banner */}
      <div className="rounded-3xl bg-slate-50 border border-border p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-primary text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          Standar Operasional RentalinAja
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-text-muted">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-secondary flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-primary">Konfirmasi Instan</p>
              <p className="text-xs mt-0.5">Pesanan langsung diteruskan ke staf mitra untuk verifikasi cepat tanpa antre.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-tertiary flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-primary">Kondisi Prima & Higienis</p>
              <p className="text-xs mt-0.5">Unit diservis berkala dan dibersihkan secara menyeluruh sebelum diserahterimakan.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100/60 text-purple-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-primary">Dukungan Darurat 24/7</p>
              <p className="text-xs mt-0.5">Layanan bantuan darurat dan penggantian unit apabila terjadi kendala teknis di jalan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailPartnerPage({ params }: DetailPartnerProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-64 sm:h-72 w-full rounded-3xl" />
        </div>
      }
    >
      <DetailPartnerContent params={params} />
    </Suspense>
  );
}
