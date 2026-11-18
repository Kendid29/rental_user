'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Car,
  Bike,
  LayoutGrid,
  MapPin,
  Calendar,
  Search,
  ShieldCheck,
  Zap,
  BadgePercent,
  Clock,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '@/api';
import { JenisKendaraan, Unit } from '@/types';
import { FleetCard } from '@/components/features/fleet';
import { ReviewHighlight } from '@/components/features/reviews';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

function getTodayIsoString(): string {
  if (typeof window === 'undefined') return '2026-04-15';
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active filters derived from URL searchParams
  const activeKota = searchParams.get('kota') || 'Yogyakarta';
  const activeJenis = (searchParams.get('jenis') as JenisKendaraan | 'semua') || 'semua';
  const urlTanggal = searchParams.get('mulai') || '';

  // Form input states
  const [formKota, setFormKota] = useState<string>(activeKota);
  const [formJenis, setFormJenis] = useState<JenisKendaraan | 'semua'>(activeJenis);
  const [formTanggal, setFormTanggal] = useState<string>('');

  // Data states
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync date on mount
  useEffect(() => {
    const today = getTodayIsoString();
    setFormTanggal((prev) => (prev ? prev : (urlTanggal || today)));
  }, [urlTanggal]);

  // Sync state if URL changes
  useEffect(() => {
    setFormKota(activeKota);
    setFormJenis(activeJenis);
    if (urlTanggal) {
      setFormTanggal(urlTanggal);
    }
  }, [activeKota, activeJenis, urlTanggal]);

  // Fetch available cities
  useEffect(() => {
    let isMounted = true;
    api.kota
      .list()
      .then((cities) => {
        if (isMounted && cities && cities.length > 0) {
          setCityOptions(cities);
        }
      })
      .catch((err) => {
        console.warn('[HomePage] Gagal memuat daftar kota:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch units based on active filters
  const fetchUnits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.unit.list({
        kota: activeKota,
        jenis: activeJenis !== 'semua' ? activeJenis : undefined,
        tanggalMulai: urlTanggal || getTodayIsoString(),
        limit: 50,
      });
      setUnits(res.items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat armada kendaraan.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeKota, activeJenis, urlTanggal]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Handle hero search
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formKota) params.set('kota', formKota);
    if (formJenis && formJenis !== 'semua') params.set('jenis', formJenis);
    if (formTanggal) params.set('mulai', formTanggal);

    router.push(`/?${params.toString()}`);
  };

  const categories = [
    {
      id: 'city-car',
      name: 'City Car Hemat',
      desc: 'Brio, Agya, Yaris',
      href: '/fleet/cars?search=brio',
      icon: <Car className="w-5 h-5 text-secondary" />,
      tag: 'Paling Laris',
    },
    {
      id: 'mpv-keluarga',
      name: 'MPV Keluarga',
      desc: 'Avanza, Xpander, Innova',
      href: '/fleet/cars?kapasitas=7',
      icon: <Car className="w-5 h-5 text-sky-500" />,
      tag: '7 Penumpang',
    },
    {
      id: 'suv-premium',
      name: 'SUV Premium',
      desc: 'Fortuner, Pajero, HR-V',
      href: '/fleet/cars?transmisi=otomatis',
      icon: <Car className="w-5 h-5 text-indigo-500" />,
      tag: 'Executive',
    },
    {
      id: 'motor-matic',
      name: 'Motor Matic Praktis',
      desc: 'Beat, Scoopy, Vario',
      href: '/fleet/bikes?transmisi=otomatis',
      icon: <Bike className="w-5 h-5 text-emerald-500" />,
      tag: 'Hemat Bahan Bakar',
    },
    {
      id: 'maxi-scooter',
      name: 'Maxi Scooter & Tour',
      desc: 'NMAX, PCX, Aerox',
      href: '/fleet/bikes?search=nmax',
      icon: <Bike className="w-5 h-5 text-amber-500" />,
      tag: 'Nyaman Jauh',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-dark via-primary to-primary text-white pt-12 pb-24 sm:pt-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Lights */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold backdrop-blur-md text-emerald-300 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Platform Rental Terpadu Terpercaya #1 di Indonesia</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
          >
            Sewa Mobil & Motor <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-200">
              Langsung dari Mitra Resmi
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Pilihan armada lengkap, unit bersih terawat, tarif jujur tanpa biaya tersembunyi, dan proses konfirmasi cepat via WhatsApp admin resmi.
          </motion.p>

          {/* Search Box Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2 max-w-4xl mx-auto"
          >
            {/* Vehicle Type Switcher Tabs */}
            <div className="inline-flex p-1 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 mb-3 shadow-md">
              <button
                type="button"
                onClick={() => setFormJenis('semua')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                  formJenis === 'semua'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white/80 hover:text-white'
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Semua Armada</span>
              </button>

              <button
                type="button"
                onClick={() => setFormJenis('mobil')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                  formJenis === 'mobil'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white/80 hover:text-white'
                )}
              >
                <Car className="w-4 h-4" />
                <span>Sewa Mobil</span>
              </button>

              <button
                type="button"
                onClick={() => setFormJenis('motor')}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                  formJenis === 'motor'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white/80 hover:text-white'
                )}
              >
                <Bike className="w-4 h-4" />
                <span>Sewa Motor</span>
              </button>
            </div>

            {/* Search Input Card */}
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/30 text-text-main text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end"
            >
              {/* Kota */}
              <div>
                <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Kota Layanan</span>
                </label>
                <select
                  value={formKota}
                  onChange={(e) => setFormKota(e.target.value)}
                  className="w-full h-11.5 bg-slate-50 hover:bg-slate-100/70 border border-border rounded-xl px-3.5 text-xs sm:text-sm font-bold text-text-main focus:outline-none focus:ring-3 focus:ring-secondary/15 focus:border-secondary transition-all cursor-pointer"
                >
                  {(cityOptions.length > 0 ? cityOptions : [formKota]).map((kota) => (
                    <option key={kota} value={kota}>
                      {kota}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipe Kendaraan */}
              <div>
                <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-secondary" />
                  <span>Kategori Kendaraan</span>
                </label>
                <select
                  value={formJenis}
                  onChange={(e) => setFormJenis(e.target.value as JenisKendaraan | 'semua')}
                  className="w-full h-11.5 bg-slate-50 hover:bg-slate-100/70 border border-border rounded-xl px-3.5 text-xs sm:text-sm font-bold text-text-main focus:outline-none focus:ring-3 focus:ring-secondary/15 focus:border-secondary transition-all cursor-pointer"
                >
                  <option value="semua">Semua (Mobil & Motor)</option>
                  <option value="mobil">Mobil</option>
                  <option value="motor">Motor</option>
                </select>
              </div>

              {/* Tanggal Mulai */}
              <div>
                <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Tanggal Mulai</span>
                </label>
                <input
                  type="date"
                  value={formTanggal}
                  onChange={(e) => setFormTanggal(e.target.value)}
                  className="w-full h-11.5 bg-slate-50 hover:bg-slate-100/70 border border-border rounded-xl px-3.5 text-xs sm:text-sm font-bold text-text-main focus:outline-none focus:ring-3 focus:ring-secondary/15 focus:border-secondary transition-all cursor-pointer"
                />
              </div>

              {/* Submit CTA */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  className="h-11.5 shadow-lg shadow-blue-500/25"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Cari Armada
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Stats Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-center">
            <div>
              <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-white">
                500+
              </p>
              <p className="text-[11px] text-slate-300 font-medium">Unit Armada Terawat</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-white">
                50+
              </p>
              <p className="text-[11px] text-slate-300 font-medium">Mitra Terverifikasi</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-emerald-400">
                4.9 / 5.0
              </p>
              <p className="text-[11px] text-slate-300 font-medium">Rating Kepuasan</p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-cyan-300">
                100%
              </p>
              <p className="text-[11px] text-slate-300 font-medium">Harga Transparan</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Kategori Terfavorit
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary mt-1">
              Pilihan Armada Sesuai Kebutuhan
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Temukan kendaraan ideal untuk liburan keluarga, perjalanan dinas, atau jelajah kota.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group bg-white p-5 rounded-2xl border border-border/80 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-border/60 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-secondary transition-colors">
                    {cat.tag}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-muted mt-1">{cat.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-secondary">
                <span>Lihat Unit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Armada List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-5">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {activeKota}
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary mt-1">
              Armada Tersedia di {activeKota}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Pilihan mobil dan motor yang siap dipesan langsung untuk perjalanan Anda di {activeKota}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/fleet/cars?kota=${encodeURIComponent(activeKota)}`}>
              <Button variant="secondary" size="sm">
                Semua Mobil
              </Button>
            </Link>
            <Link href={`/fleet/bikes?kota=${encodeURIComponent(activeKota)}`}>
              <Button variant="secondary" size="sm">
                Semua Motor
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div
                key={idx}
                className="border border-border/80 rounded-3xl p-5 bg-white space-y-4"
              >
                <Skeleton className="aspect-[16/10] rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 rounded-xl" />
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            title="Gagal Memuat Armada"
            message={error}
            onRetry={fetchUnits}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && units.length === 0 && (
          <EmptyState
            title={`Belum Ada Armada di ${activeKota}`}
            description={
              activeJenis !== 'semua'
                ? `Tidak ditemukan unit "${activeJenis}" di ${activeKota}. Silakan ubah filter kategori atau coba kota lain.`
                : `Saat ini belum ada armada yang terdaftar di ${activeKota}. Silakan pilih kota terdekat seperti Yogyakarta atau Bandung.`
            }
            actionText="Lihat Armada Yogyakarta"
            onAction={() => {
              setFormKota('Yogyakarta');
              setFormJenis('semua');
              router.push('/?kota=Yogyakarta&jenis=semua');
            }}
          />
        )}

        {/* Units Grid */}
        {!isLoading && !error && units.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {units.map((unit) => (
              <FleetCard key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Why Choose Us / Value Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-y border-border/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Keunggulan Layanan
            </span>
            <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-primary mt-1.5 tracking-tight">
              Mengapa Sewa di RentalinAja?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
              Kami menyatukan standar keamanan, kenyamanan unit, dan kemudahan transaksi rental kendaraan di setiap kota.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary border border-blue-100 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-bold text-primary text-base">Mitra Terverifikasi</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Seluruh mitra rental melewati proses verifikasi fisik, kelengkapan surat resmi, serta kondisi armada yang prima.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold">
                <BadgePercent className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-primary text-base">Harga Jujur & Pasti</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Tanpa biaya tersembunyi saat serah terima. Apa yang tertera di rincian pesanan adalah tarif yang Anda bayarkan.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="font-bold text-primary text-base">Konfirmasi Kilat</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Setelah buat pesanan di web, Anda langsung terhubung dengan admin resmi via WhatsApp untuk koordinasi lokasi kunci.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-bold text-primary text-base">Layanan Siaga 24/7</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Tim support dan mitra standby mendampingi jika terjadi kendala teknis darurat selama masa sewa kendaraan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-Step Simple Guide Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-dark text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-10">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Cara Sewa Mudah
            </span>
            <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-extrabold text-white mt-1.5">
              Mulai Perjalanan Anda dalam 3 Langkah
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-cyan-300 font-extrabold text-lg flex items-center justify-center border border-white/20">
                1
              </div>
              <h4 className="font-bold text-base text-white">Pilih Kendaraan & Jadwal</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tentukan kota, jenis mobil/motor, dan rentang tanggal sewa yang sesuai dengan rencana Anda.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-cyan-300 font-extrabold text-lg flex items-center justify-center border border-white/20">
                2
              </div>
              <h4 className="font-bold text-base text-white">Isi Data & Konfirmasi WA</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lengkapi identitas penyewa dan lanjutkan ke WhatsApp resmi admin untuk verifikasi cepat.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-cyan-300 font-extrabold text-lg flex items-center justify-center border border-white/20">
                3
              </div>
              <h4 className="font-bold text-base text-white">Serah Terima Kunci</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kendaraan siap diantarkan ke stasiun, bandara, hotel, atau diambil di garasi mitra terdekat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimoni Highlights */}
      <ReviewHighlight />

      {/* 7. Need Help WhatsApp CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-secondary to-indigo-700 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold">
              Butuh Rekomendasi atau Sewa Khusus?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Konsultasikan rencana sewa rombongan, sewa bulanan, atau drop off luar kota langsung dengan customer care resmi RentalinAja.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="text-primary font-bold shadow-md hover:bg-white"
                leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
              >
                Chat WhatsApp Admin
              </Button>
            </a>

            <Link href="/fleet/cars">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="text-white border-white/60 hover:bg-white/15"
              >
                Lihat Semua Mobil
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
          <Skeleton className="h-72 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
