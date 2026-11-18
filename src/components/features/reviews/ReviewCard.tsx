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

export interface ReviewCardProps {
  testimoni: Testimoni;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
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
                  className="object-cover"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-black text-sm">
                  {getInitials(testimoni.nama)}
                </div>
              )}
            </div>

            {/* Name & Location */}
            <div className="min-w-0">
              <h4 className="font-bold text-sm sm:text-base text-primary truncate group-hover:text-secondary transition-colors">
                {testimoni.nama}
              </h4>
              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-secondary shrink-0" />
                <span>{testimoni.kota}</span>
              </p>
            </div>
          </div>

          {/* Rating Stars Badge */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-black text-amber-800">
              {testimoni.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Review Quote Body */}
        <div className="relative">
          <Quote className="absolute -top-1 -left-1 w-6 h-6 text-slate-200 -z-0 pointer-events-none rotate-180" />
          <p className="relative z-10 text-xs sm:text-sm text-slate-700 leading-relaxed italic pt-1 mb-4">
            &ldquo;{testimoni.komentar}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer Info: Vehicle rented & Verified Trust Badge */}
      <div className="pt-3.5 border-t border-border/80 flex items-center justify-between text-xs text-text-muted mt-auto">
        <div className="flex items-center gap-1.5 truncate max-w-[65%]">
          <Car className="w-3.5 h-3.5 text-secondary shrink-0" />
          <span className="font-semibold text-primary truncate">
            {testimoni.kendaraan}
          </span>
          {testimoni.layanan && (
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              • {testimoni.layanan}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px] shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Terverifikasi</span>
        </div>
      </div>
    </div>
  );
};
