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
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { api } from '@/api';
import { Mitra, Unit } from '@/types';
import { nomorWaAdmin } from '@/config/env';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  PartnerHeader,
  PartnerServices,
  PartnerFleetList,
  PartnerTrustBanner,
} from '@/components/features/partners';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs Navigation */}
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

      {/* 1. Profile Header Banner */}
      <PartnerHeader mitra={mitra} waUrl={waUrl} />

      {/* 2. Services & Value Offerings */}
      {mitra.layanan && <PartnerServices layanan={mitra.layanan} />}

      {/* 3. Partner Fleets Grid */}
      <PartnerFleetList
        partnerName={mitra.nama}
        partnerCity={mitra.kota}
        units={units}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filteredUnits={filteredUnits}
      />

      {/* 4. Operational Trust & Safety Banner */}
      <PartnerTrustBanner />
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
