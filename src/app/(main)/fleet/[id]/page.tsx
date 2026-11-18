'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { api } from '@/api';
import { Unit } from '@/types';
import {
  FleetGallery,
  FleetSpecsCard,
  FleetBookingCard,
} from '@/components/features/fleet';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';

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

  const galleryImages = [
    unit.gambar,
    ...(unit.galeri?.filter((g) => g !== unit.gambar) || []),
  ];

  const catalogPath = unit.jenis === 'motor' ? '/fleet/bikes' : '/fleet/cars';

  const handlePesanSekarang = () => {
    router.push(
      `/checkout?unitId=${unit.id}&mulai=${encodeURIComponent(
        tanggalMulai
      )}&selesai=${encodeURIComponent(tanggalSelesai)}`
    );
  };

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

      {/* Main Orchestrated Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Gallery & Specifications */}
        <div className="lg:col-span-2 space-y-6">
          <FleetGallery
            unitName={unit.nama}
            mainImage={unit.gambar}
            selectedImage={selectedImage}
            onSelectImage={setSelectedImage}
            galleryImages={galleryImages}
            unitLabel={unit.label}
            isOutOfStock={unit.stok <= 0}
          />

          <FleetSpecsCard unit={unit} />
        </div>

        {/* Right Column: Sticky Booking Calculator */}
        <div className="lg:col-span-1">
          <FleetBookingCard
            unit={unit}
            tanggalMulai={tanggalMulai}
            tanggalSelesai={tanggalSelesai}
            dateError={dateError}
            onTanggalMulaiChange={handleTanggalMulaiChange}
            onTanggalSelesaiChange={handleTanggalSelesaiChange}
            onPesanSekarang={handlePesanSekarang}
          />
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
