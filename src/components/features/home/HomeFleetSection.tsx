'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Unit } from '@/types';
import { FleetCard } from '@/components/features/fleet';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export interface HomeFleetSectionProps {
  activeKota: string;
  activeJenis: string;
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetKota: () => void;
}

export function HomeFleetSection({
  activeKota,
  activeJenis,
  units,
  isLoading,
  error,
  onRetry,
  onResetKota,
}: HomeFleetSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header with City & Filter Buttons */}
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
          onRetry={onRetry}
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
          onAction={onResetKota}
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
  );
}
