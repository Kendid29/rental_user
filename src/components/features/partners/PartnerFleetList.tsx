'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Bike } from 'lucide-react';
import { Unit } from '@/types';
import { FleetCard } from '@/components/features/fleet';
import { Button } from '@/components/ui/Button';

export interface PartnerFleetListProps {
  partnerName: string;
  partnerCity: string;
  units: Unit[];
  activeFilter: 'semua' | 'mobil' | 'motor';
  onFilterChange: (filter: 'semua' | 'mobil' | 'motor') => void;
  filteredUnits: Unit[];
}

export function PartnerFleetList({
  partnerName,
  partnerCity,
  units,
  activeFilter,
  onFilterChange,
  filteredUnits,
}: PartnerFleetListProps) {
  const mobilCount = units.filter((u) => u.jenis === 'mobil').length;
  const motorCount = units.filter((u) => u.jenis === 'motor').length;

  return (
    <div className="space-y-6 pt-4">
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary font-[family-name:var(--font-headline)]">
            Daftar Armada dari {partnerName}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Pilih kendaraan terbaik sesuai kebutuhan mobilitas Anda di {partnerCity}.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 self-start sm:self-auto border border-border">
          <button
            type="button"
            onClick={() => onFilterChange('semua')}
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
              onClick={() => onFilterChange('mobil')}
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
              onClick={() => onFilterChange('motor')}
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
  );
}
