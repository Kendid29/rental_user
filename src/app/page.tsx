'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/api';
import { JenisKendaraan, Unit } from '@/types';
import { CardUnit } from '@/components/domain/CardUnit';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

function getTodayIsoString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active filter derived from URL searchParams (with defaults)
  const activeKota = searchParams.get('kota') || 'Yogyakarta';
  const activeJenis = (searchParams.get('jenis') as JenisKendaraan | 'semua') || 'semua';
  const urlTanggal = searchParams.get('mulai') || '';

  // Form input states (independent until "Cari Kendaraan" is clicked)
  const [formKota, setFormKota] = useState<string>(activeKota);
  const [formJenis, setFormJenis] = useState<JenisKendaraan | 'semua'>(activeJenis);
  const [formTanggal, setFormTanggal] = useState<string>('');

  // Kota list from API
  const [cityOptions, setCityOptions] = useState<string[]>([]);

  // Units list state
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize today's date safely on client mount
  useEffect(() => {
    const today = getTodayIsoString();
    setFormTanggal((prev) => (prev ? prev : (urlTanggal || today)));
  }, [urlTanggal]);

  // Sync form inputs when URL searchParams change (e.g. browser back/forward)
  useEffect(() => {
    setFormKota(activeKota);
    setFormJenis(activeJenis);
    if (urlTanggal) {
      setFormTanggal(urlTanggal);
    }
  }, [activeKota, activeJenis, urlTanggal]);

  // Fetch available cities from API layer
  useEffect(() => {
    let isMounted = true;
    api.kota.list()
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

  // Fetch units based strictly on active filters from URL
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

  // Hero search form submission: applies filter and updates URL query params
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formKota) params.set('kota', formKota);
    if (formJenis && formJenis !== 'semua') params.set('jenis', formJenis);
    if (formTanggal) params.set('mulai', formTanggal);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#000f2b] to-[#102447] text-white pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-sm text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Satu Aplikasi untuk Seluruh Rental Terpercaya di Kota Anda
          </div>

          <h1 className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white">
            Sewa Mobil & Motor <br className="hidden sm:inline" />
            <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Langsung dari Mitra Resmi
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pilihan armada terlengkap, tarif jujur tanpa biaya tersembunyi, unit terawat, dan konfirmasi instan via WhatsApp resmi.
          </p>

          {/* Search Box Card */}
          <div className="pt-4">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/20 text-text-main text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end max-w-4xl mx-auto"
            >
              {/* Lokasi / Kota */}
              <div>
                <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Kota Layanan
                </label>
                <select
                  value={formKota}
                  onChange={(e) => setFormKota(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3 text-xs sm:text-sm font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
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
                <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.948c0-.621-.504-1.125-1.125-1.125H4.125C3.504 5.5 3 6.004 3 6.625v7.5" />
                  </svg>
                  Tipe Kendaraan
                </label>
                <select
                  value={formJenis}
                  onChange={(e) => setFormJenis(e.target.value as JenisKendaraan | 'semua')}
                  className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3 text-xs sm:text-sm font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                >
                  <option value="semua">Semua (Mobil & Motor)</option>
                  <option value="mobil">Sewa Mobil</option>
                  <option value="motor">Sewa Motor</option>
                </select>
              </div>

              {/* Tanggal Sewa */}
              <div>
                <label className="text-xs font-bold text-primary block mb-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={formTanggal}
                  onChange={(e) => setFormTanggal(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-border rounded-xl px-3 text-xs font-semibold text-text-main focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  className="h-11 shadow-md"
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  }
                >
                  Cari Kendaraan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Armada List Section (Flat Grid, No City Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Armada Terverifikasi
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary mt-1">
              Armada Tersedia di {activeKota}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Semua unit mobil dan motor dirawat berkala dan disediakan langsung oleh mitra rental terverifikasi di {activeKota}
            </p>
          </div>
        </div>

        {/* Loading State: Skeleton Cards Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div key={idx} className="border border-border rounded-2xl p-4 bg-white space-y-3">
                <Skeleton className="aspect-[4/3] rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State: Retry Button */}
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
                ? `Tidak ditemukan unit dengan tipe "${activeJenis}" di ${activeKota}. Silakan ubah tipe kendaraan atau pilih kota lain di form pencarian.`
                : `Saat ini belum ada armada yang tersedia di ${activeKota}. Silakan coba pilih kota lain seperti Yogyakarta atau Bandung pada form pencarian di atas.`
            }
            actionText="Lihat Armada Yogyakarta"
            onAction={() => {
              setFormKota('Yogyakarta');
              setFormJenis('semua');
              router.push('/?kota=Yogyakarta&jenis=semua');
            }}
          />
        )}

        {/* Success State: Flat Grid of Units */}
        {!isLoading && !error && units.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {units.map((unit) => (
              <CardUnit key={unit.id} unit={unit} />
            ))}
          </div>
        )}
      </section>

      {/* Keunggulan Rentaku Section */}
      <section className="bg-white border-y border-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-[family-name:var(--font-headline)] text-2xl font-bold text-primary">
              Mengapa Memilih RentaKu?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-1.5">
              Standar keunggulan transaksi sewa kendaraan tanpa rasa cemas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-secondary flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <h4 className="font-bold text-primary text-base">Mitra Terverifikasi</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Seluruh mitra rental diperiksa legalitasnya, kondisi armada dicek berkala, dan memiliki ulasan transparan dari pelanggan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                🛡
              </div>
              <h4 className="font-bold text-primary text-base">Asuransi & Proteksi Lengkap</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Perjalanan tenang dengan opsi proteksi risiko perjalanan dan jaminan unit pengganti jika terjadi kendala teknis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                💬
              </div>
              <h4 className="font-bold text-primary text-base">Konfirmasi Cepat via WhatsApp</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Tanpa verifikasi berbelit. Pesan di web, langsung terhubung dengan admin resmi untuk koordinasi titik serah terima kunci.
              </p>
            </div>
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
          <Skeleton className="h-64 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
