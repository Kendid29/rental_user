'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Settings2,
  Building2,
  Star,
  MapPin,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Unit } from '@/types';
import { formatRupiah } from '@/lib/pricing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface FleetCardProps {
  unit: Unit;
  onBookClick?: (unit: Unit) => void;
  className?: string;
}

export const FleetCard: React.FC<FleetCardProps> = ({
  unit,
  onBookClick,
  className,
}) => {
  const isOutOfStock = unit.stok <= 0;

  return (
    <div
      className={cn(
        'group bg-white rounded-3xl border border-border/80 shadow-xs hover:shadow-lg hover:border-secondary/30 transition-all duration-300 flex flex-col justify-between overflow-hidden',
        isOutOfStock && 'opacity-75 grayscale-[20%]',
        className
      )}
    >
      <div>
        {/* Aspect Ratio 16:10 Container */}
        <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
          <Image
            src={unit.gambar}
            alt={unit.nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            unoptimized
          />

          {/* Floating Pill Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            {unit.label && (
              <span className="bg-primary-dark/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide uppercase shadow-sm">
                {unit.label}
              </span>
            )}
            {unit.rating >= 4.8 && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3" />
                Populer
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-primary-dark/70 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black uppercase tracking-widest z-20">
              Unit Habis
            </div>
          )}
        </div>

        {/* Title & Rating */}
        <div className="p-5 pb-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Link
              href={`/fleet/${unit.id}`}
              className="text-base sm:text-lg font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1"
            >
              {unit.nama}
            </Link>

            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-black text-amber-700">
                {unit.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Partner & City Information */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
            <span className="flex items-center gap-1 font-semibold text-primary truncate">
              <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
              {unit.mitra?.nama || 'Mitra Resmi'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {unit.mitra?.kota || 'Indonesia'}
            </span>
          </div>

          {/* Specs Chips with Lucide Icons */}
          <div className="grid grid-cols-2 gap-2 py-3 border-y border-border/80 text-xs text-text-muted">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>{unit.kapasitas} Penumpang</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Settings2 className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="capitalize">{unit.transmisi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Price & CTA */}
      <div className="p-5 pt-4 flex items-center justify-between gap-3 bg-slate-50/50 mt-4 border-t border-border/60">
        <div>
          <span className="text-[10px] text-text-muted uppercase tracking-wider block font-bold">
            Mulai dari
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-[family-name:var(--font-headline)] text-lg sm:text-xl font-extrabold text-primary tnum">
              {formatRupiah(unit.hargaPerHari)}
            </span>
            <span className="text-xs text-text-muted">/hari</span>
          </div>
        </div>

        {isOutOfStock ? (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="opacity-50 cursor-not-allowed"
          >
            Habis
          </Button>
        ) : onBookClick ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onBookClick(unit)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Sewa
          </Button>
        ) : (
          <Link href={`/fleet/${unit.id}`}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Sewa
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
