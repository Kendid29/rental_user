'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/api';
import { JenisKendaraan, Unit } from '@/types';
import {
  HomeHero,
  HomeCategories,
  HomeFleetSection,
  HomeWhyUs,
  HomeHowItWorks,
  HomeCtaBanner,
} from '@/components/features/home';
import { ReviewHighlight } from '@/components/features/reviews';
import { Skeleton } from '@/components/ui/Skeleton';

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
  const urlKota = searchParams.get('kota') || 'Yogyakarta';
  const urlJenis = (searchParams.get('jenis') as JenisKendaraan | 'semua') || 'semua';
  const urlTanggal = searchParams.get('mulai') || '';

  // Local active state to allow in-place reactive filtering without router navigation scroll jumps
  const [activeKota, setActiveKota] = useState<string>(urlKota);
  const [activeJenis, setActiveJenis] = useState<JenisKendaraan | 'semua'>(urlJenis);
  const [activeTanggal, setActiveTanggal] = useState<string>(urlTanggal);

  // Form input states (for Hero search)
  const [formKota, setFormKota] = useState<string>(urlKota);
  const [formJenis, setFormJenis] = useState<JenisKendaraan | 'semua'>(urlJenis);
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

  // Sync state if URL searchParams changes externally (e.g. browser back/forward or navigation)
  useEffect(() => {
    const qKota = searchParams.get('kota') || 'Yogyakarta';
    const qJenis = (searchParams.get('jenis') as JenisKendaraan | 'semua') || 'semua';
    const qTanggal = searchParams.get('mulai') || '';

    setActiveKota(qKota);
    setActiveJenis(qJenis);
    setActiveTanggal(qTanggal);
    setFormKota(qKota);
    setFormJenis(qJenis);
    if (qTanggal) {
      setFormTanggal(qTanggal);
    }
  }, [searchParams]);

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
        tanggalMulai: activeTanggal || urlTanggal || getTodayIsoString(),
        limit: 50,
      });
      setUnits(res.items);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat armada kendaraan.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [activeKota, activeJenis, activeTanggal, urlTanggal]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Handle changing city from hero dropdown or popular city shortcuts
  const handleKotaChange = (kota: string) => {
    setFormKota(kota);
    setActiveKota(kota);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('kota', kota);
      const newQuery = `?${params.toString()}`;
      window.history.replaceState(null, '', newQuery);
    }
  };

  // Handle changing vehicle category from hero tabs or fleet section tabs
  const handleJenisChange = (jenis: JenisKendaraan | 'semua') => {
    setFormJenis(jenis);
    setActiveJenis(jenis);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (jenis === 'semua') {
        params.delete('jenis');
      } else {
        params.set('jenis', jenis);
      }
      const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newQuery);
    }
  };

  // Handle changing date
  const handleTanggalChange = (tgl: string) => {
    setFormTanggal(tgl);
    setActiveTanggal(tgl);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (tgl) {
        params.set('mulai', tgl);
      } else {
        params.delete('mulai');
      }
      const newQuery = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.replaceState(null, '', newQuery);
    }
  };

  // Handle hero search button click
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleKotaChange(formKota);
    handleJenisChange(formJenis);
    handleTanggalChange(formTanggal);

    // Smooth scroll down to the armada section
    const armadaEl = document.getElementById('armada');
    if (armadaEl) {
      armadaEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleResetKota = () => {
    handleKotaChange('Yogyakarta');
    handleJenisChange('semua');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero & Search Widget */}
      <HomeHero
        formKota={formKota}
        setFormKota={handleKotaChange}
        formJenis={formJenis}
        setFormJenis={handleJenisChange}
        formTanggal={formTanggal}
        setFormTanggal={handleTanggalChange}
        cityOptions={cityOptions}
        onSearch={handleHeroSearch}
      />

      {/* 2. Popular Vehicle Categories */}
      <HomeCategories />

      {/* 3. Available Fleets Section */}
      <HomeFleetSection
        activeKota={activeKota}
        activeJenis={activeJenis}
        units={units}
        isLoading={isLoading}
        error={error}
        onRetry={fetchUnits}
        onResetKota={handleResetKota}
        onJenisChange={handleJenisChange}
      />

      {/* 4. Why Choose Us / Service Value Pillars */}
      <HomeWhyUs />

      {/* 5. 3-Step Simple Guide */}
      <HomeHowItWorks />

      {/* 6. Testimonial Highlights */}
      <ReviewHighlight />

      {/* 7. Need Help WhatsApp CTA Banner */}
      <HomeCtaBanner />
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
