import React from 'react';
import Link from 'next/link';
import { MitraWithUnits } from '@/types';
import { Badge } from '../ui/Badge';
import { CardUnit } from './CardUnit';

export interface CardMitraProps {
  mitra: MitraWithUnits;
  className?: string;
}

export const CardMitra: React.FC<CardMitraProps> = ({
  mitra,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-border elevation-1 overflow-hidden hover:elevation-2 transition-all ${className}`}
    >
      {/* Mitra Header Bar */}
      <div className="p-4 sm:p-6 border-b border-border bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-primary">
              {mitra.nama}
            </h3>
            {mitra.isSuperPartner && (
              <Badge variant="superPartner" size="sm">
                Super Partner
              </Badge>
            )}
            <Badge variant="rating" size="sm">
              {mitra.rating} ({mitra.jumlahUlasan} ulasan)
            </Badge>
          </div>

          <p className="text-xs text-text-muted flex items-center gap-1.5 mb-2">
            <svg className="w-3.5 h-3.5 text-secondary shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{mitra.kota}</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">
              {mitra.unitTersedia} Unit Tersedia
            </span>
          </p>

          {/* Layanan Badges */}
          <div className="flex flex-wrap gap-1.5">
            {mitra.layanan.map((layanan, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-white border border-slate-200/90 px-2 py-0.5 rounded-full"
              >
                {layanan}
              </span>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="shrink-0">
          <Link
            href={`/katalog/mobil?kota=${encodeURIComponent(mitra.kota)}`}
            className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
          >
            Lihat Semua Unit
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Featured Units Grid (Max 2 Units per Mitra) */}
      <div className="p-4 sm:p-6">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
          Armada Unggulan
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mitra.units.map((unit) => (
            <CardUnit key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </div>
  );
};
