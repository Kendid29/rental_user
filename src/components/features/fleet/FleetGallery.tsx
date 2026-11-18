'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface FleetGalleryProps {
  unitName: string;
  mainImage: string;
  selectedImage: string;
  onSelectImage: (img: string) => void;
  galleryImages: string[];
  unitLabel?: string;
  isOutOfStock: boolean;
}

export function FleetGallery({
  unitName,
  mainImage,
  selectedImage,
  onSelectImage,
  galleryImages,
  unitLabel,
  isOutOfStock,
}: FleetGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-100 border border-border/80 shadow-md">
        <Image
          src={selectedImage || mainImage}
          alt={unitName}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-all duration-300"
          unoptimized
        />

        {/* Highlight Tag */}
        {unitLabel && (
          <span className="absolute top-4 left-4 bg-primary-dark/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm tracking-wide">
            {unitLabel}
          </span>
        )}

        {/* Out-of-stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-primary-dark/75 backdrop-blur-xs flex items-center justify-center text-white text-base font-black uppercase tracking-widest z-20">
            Stok Tidak Tersedia
          </div>
        )}
      </div>

      {/* Gallery Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1.5">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectImage(img)}
              className={cn(
                'relative w-20 h-16 sm:w-24 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0',
                selectedImage === img
                  ? 'border-secondary ring-2 ring-secondary/20 scale-102 shadow-xs'
                  : 'border-border/80 hover:border-slate-400 opacity-75 hover:opacity-100'
              )}
            >
              <Image
                src={img}
                alt={`${unitName} thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
