'use client';

import React from 'react';
import { MapPin, Car, Bike, LayoutGrid } from 'lucide-react';
import { JenisKendaraan, Unit } from '@/types';
import { FleetCard } from '@/components/features/fleet';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils';

export interface HomeFleetSectionProps {
  activeKota: string;
  activeJenis: string;
  units: Unit[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onResetKota: () => void;
  onJenisChange?: (jenis: JenisKendaraan | 'semua') => void;
}

export function HomeFleetSection({
  activeKota,
  activeJenis,
  units,
  isLoading,
  error,
  onRetry,
  onResetKota,
  onJenisChange,
}: HomeFleetSectionProps) {
  return (
    <section id="armada" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-border/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kota Layanan: {activeKota}</span>
          </div>

          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
            Armada Siap Pakai di {activeKota}
          </h2>

          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl">
            Pilih unit mobil atau motor terawat dari mitra resmi kami. Kondisi siap jalan, AC dingin, dan bebas ribet.
          </p>
        </div>

        {/* Filter Switcher Tabs */}
        {onJenisChange && (
          <div className="w-full md:w-auto p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-3 md:flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onJenisChange('semua')}
              className={cn(
                'py-2.5 px-3 md:px-4 md:py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                activeJenis === 'semua'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-text-muted hover:text-primary'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>Semua</span>
            </button>

            <button
              type="button"
              onClick={() => onJenisChange('mobil')}
              className={cn(
                'py-2.5 px-3 md:px-4 md:py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                activeJenis === 'mobil'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-text-muted hover:text-primary'
              )}
            >
              <Car className="w-3.5 h-3.5 shrink-0" />
              <span>Mobil</span>
            </button>

            <button
              type="button"
              onClick={() => onJenisChange('motor')}
              className={cn(
                'py-2.5 px-3 md:px-4 md:py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                activeJenis === 'motor'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-text-muted hover:text-primary'
              )}
            >
              <Bike className="w-3.5 h-3.5 shrink-0" />
              <span>Motor</span>
            </button>
          </div>
        )}
      </div>

      {/* Initial Loading Skeletons when there are no units yet */}
      {isLoading && units.length === 0 && (
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
              ? `Tidak ditemukan armada "${activeJenis}" di ${activeKota}. Silakan ubah filter kategori atau coba jenis armada lain.`
              : `Saat ini belum ada armada yang terdaftar di ${activeKota}. Silakan pilih kota terdekat seperti Yogyakarta atau Bandung.`
          }
          actionText="Lihat Semua Armada Yogyakarta"
          onAction={onResetKota}
        />
      )}

      {/* Units Grid with Smooth Transition during Filter Switching */}
      {!error && units.length > 0 && (
        <div className="space-y-8 relative">
          {/* Subtle loading indicator overlay when switching filters so layout does not jump */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-3xl transition-opacity">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-lg border border-border text-xs font-bold text-primary">
                <span className="w-3.5 h-3.5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                <span>Memperbarui armada...</span>
              </div>
            </div>
          )}

          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200',
              isLoading && 'opacity-60 pointer-events-none'
            )}
          >
            {units.map((unit) => (
              <FleetCard key={unit.id} unit={unit} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
