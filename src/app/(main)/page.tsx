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

  const handleResetKota = () => {
    setFormKota('Yogyakarta');
    setFormJenis('semua');
    router.push('/?kota=Yogyakarta&jenis=semua');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero & Search Widget */}
      <HomeHero
        formKota={formKota}
        setFormKota={setFormKota}
        formJenis={formJenis}
        setFormJenis={setFormJenis}
        formTanggal={formTanggal}
        setFormTanggal={setFormTanggal}
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
