'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Star,
  CheckCircle2,
  MapPin,
  Car,
  Quote,
} from 'lucide-react';
import { Testimoni } from '@/types';
import { cn } from '@/lib/utils';

export interface CardTestimoniProps {
  testimoni: Testimoni;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const CardTestimoni: React.FC<CardTestimoniProps> = ({
  testimoni,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-border/80 p-5 sm:p-6 flex flex-col justify-between shadow-xs',
        'hover:border-secondary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group h-full relative',
        className
      )}
    >
      <div>
        {/* Header: Avatar, Name, Kota, and Verified Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Profile Avatar */}
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs shrink-0">
              {!imageError && testimoni.foto ? (
                <Image
                  src={testimoni.foto}
                  alt={testimoni.nama}
                  fill
                  sizes="48px"
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-xs flex items-center justify-center tracking-wider">
                  {getInitials(testimoni.nama)}
                </div>
              )}
            </div>

            {/* Customer Name & City */}
            <div className="min-w-0">
              <h3 className="font-bold text-primary text-sm sm:text-base leading-snug truncate group-hover:text-secondary transition-colors">
                {testimoni.nama}
              </h3>
              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="truncate">{testimoni.kota}</span>
              </p>
            </div>
          </div>

          {/* Verified Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full shrink-0 select-none">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xs:inline">Terverifikasi</span>
          </span>
        </div>

        {/* Rating and Date */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < testimoni.rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  )}
                />
              ))}
            </div>

            <span className="text-xs font-bold text-slate-700 ml-0.5">
              {testimoni.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-[11px] text-text-muted font-medium">
            {testimoni.tanggal}
          </span>
        </div>

        {/* Customer Comment */}
        <div className="relative mb-4">
          <Quote className="w-5 h-5 text-blue-200 mb-1" />
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
            &ldquo;{testimoni.komentar}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="pt-3.5 border-t border-border/80 mt-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Car className="w-4 h-4 text-secondary shrink-0" />
            <span
              className="font-bold text-primary truncate"
              title={testimoni.kendaraan}
            >
              {testimoni.kendaraan}
            </span>
          </div>

          {(testimoni.layanan || testimoni.kotaRental) && (
            <span className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-border/70 shrink-0 font-semibold">
              {[testimoni.layanan, testimoni.kotaRental].filter(Boolean).join(' • ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
