'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Testimoni } from '@/types';

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
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border border-border p-5 sm:p-6 flex flex-col justify-between elevation-1 hover:elevation-2 hover:border-secondary/40 transition-all duration-300 group h-full relative ${className}`}
    >
      <div>
        {/* Header: Avatar, Name, Kota, and Verified Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Profile Avatar with fallback */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-sm shrink-0">
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
                <div className="w-full h-full bg-gradient-to-tr from-primary to-secondary text-white font-bold text-xs flex items-center justify-center tracking-wider">
                  {getInitials(testimoni.nama)}
                </div>
              )}
            </div>

            {/* Customer Name & Origin City */}
            <div className="min-w-0">
              <h3 className="font-bold text-primary text-sm sm:text-base leading-snug truncate group-hover:text-secondary transition-colors">
                {testimoni.nama}
              </h3>
              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5 truncate">
                <svg
                  className="w-3.5 h-3.5 text-secondary shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <span className="truncate">{testimoni.kota}</span>
              </p>
            </div>
          </div>

          {/* Verified Badge */}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00875A] bg-[#E6F9F3] border border-[#00C48C]/30 px-2 py-0.5 rounded-full shrink-0 select-none">
            <svg
              className="w-3 h-3 text-[#00875A]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="hidden xs:inline">Terverifikasi</span>
          </span>
        </div>

        {/* Rating and Date */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1">
            <div className="flex text-[#FFB800]">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimoni.rating ? 'fill-[#FFB800]' : 'fill-slate-200'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 ml-1">
              {testimoni.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-[11px] text-text-muted">{testimoni.tanggal}</span>
        </div>

        {/* Customer Comment */}
        <div className="relative mb-4">
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
            &ldquo;{testimoni.komentar}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer: Rented Vehicle & Service Details */}
      <div className="pt-3 border-t border-border mt-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <svg
              className="w-4 h-4 text-secondary shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.948c0-.621-.504-1.125-1.125-1.125H4.125C3.504 5.5 3 6.004 3 6.625v7.5"
              />
            </svg>
            <span className="font-semibold text-primary truncate" title={testimoni.kendaraan}>
              {testimoni.kendaraan}
            </span>
          </div>

          {(testimoni.layanan || testimoni.kotaRental) && (
            <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-border shrink-0 font-medium">
              {[testimoni.layanan, testimoni.kotaRental].filter(Boolean).join(' • ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

