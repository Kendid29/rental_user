import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Unit } from '@/types';
import { formatRupiah } from '@/lib/pricing';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface CardUnitProps {
  unit: Unit;
  onBookClick?: (unit: Unit) => void;
  className?: string;
}

export const CardUnit: React.FC<CardUnitProps> = ({
  unit,
  onBookClick,
  className = '',
}) => {
  const isOutOfStock = unit.stok <= 0;

  return (
    <div
      className={`border border-border rounded-2xl p-4 flex flex-col justify-between hover:border-secondary/40 hover:elevation-2 transition-all group bg-white ${className}`}
    >
      <div>
        {/* Thumbnail & Badges */}
        <div className="relative bg-slate-100 rounded-xl overflow-hidden aspect-[4/3] mb-3">
          <Image
            src={unit.gambar}
            alt={unit.nama}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
          {unit.label && (
            <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              {unit.label}
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider">
              Tidak Tersedia
            </span>
          )}
        </div>

        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link
            href={`/armada/${unit.id}`}
            className="text-sm sm:text-base font-bold text-primary leading-tight hover:text-secondary transition-colors"
          >
            {unit.nama}
          </Link>
          <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-0.5 flex-shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {unit.rating}
          </span>
        </div>

        {/* Mitra & Kota */}
        {unit.mitra && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2.5">
            <svg className="w-3.5 h-3.5 text-secondary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <Link
              href={`/mitra/${unit.mitra.id}`}
              className="font-medium text-primary hover:text-secondary hover:underline truncate"
              title={`Mitra: ${unit.mitra.nama}`}
            >
              {unit.mitra.nama}
            </Link>
            {unit.mitra.kota && (
              <span className="text-[11px] text-text-muted">· {unit.mitra.kota}</span>
            )}
          </div>
        )}

        {/* Specs Chips */}
        <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-2 flex-wrap">
          <span className="capitalize bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80 font-medium text-text-main">
            {unit.jenis}
          </span>
          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80 font-medium text-text-main">
            {unit.transmisi}
          </span>
          <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80 font-medium text-text-main">
            {unit.kapasitas} Kursi
          </span>
        </div>

        {/* Fitur Highlights */}
        {unit.fitur && unit.fitur.length > 0 && (
          <p className="text-[11px] text-text-muted line-clamp-1 mb-3">
            {unit.fitur.slice(0, 3).join(' • ')}
          </p>
        )}
      </div>

      {/* Pricing, Stock & CTA */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="tnum text-sm sm:text-base font-bold text-secondary">
              {formatRupiah(unit.hargaPerHari)}
            </span>
            <span className="text-[10px] text-text-muted">/hari</span>
          </div>
          <div className="text-[10px] mt-0.5">
            {isOutOfStock ? (
              <span className="text-urgency font-semibold">Stok Habis</span>
            ) : (
              <span className="text-emerald-600 font-medium">Tersedia {unit.stok} unit</span>
            )}
          </div>
        </div>

        {isOutOfStock ? (
          <div className="flex flex-col items-end gap-1">
            <Badge variant="urgency" size="sm">
              Tidak Tersedia
            </Badge>
            <Button variant="outline" size="sm" disabled className="opacity-50 cursor-not-allowed text-xs h-8 px-2.5">
              Pesan Nonaktif
            </Button>
          </div>
        ) : onBookClick ? (
          <Button variant="primary" size="sm" onClick={() => onBookClick(unit)}>
            Sewa Unit
          </Button>
        ) : (
          <Link href={`/armada/${unit.id}`}>
            <Button variant="primary" size="sm">
              Sewa Unit
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
