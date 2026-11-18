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
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export interface CardUnitProps {
  unit: Unit;
  onBookClick?: (unit: Unit) => void;
  className?: string;
}

export const CardUnit: React.FC<CardUnitProps> = ({
  unit,
  onBookClick,
  className,
}) => {
  const isOutOfStock = unit.stok <= 0;

  return (
    <div
      className={cn(
        'group relative bg-white rounded-3xl border border-border/80 p-4.5 sm:p-5 flex flex-col justify-between',
        'hover:border-secondary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300',
        className
      )}
    >
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-4 shadow-2xs">
          <Image
            src={unit.gambar}
            alt={unit.nama}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
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
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            href={`/armada/${unit.id}`}
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

        {/* Mitra & Lokasi */}
        {unit.mitra && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3.5">
            <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
            <Link
              href={`/mitra/${unit.mitra.id}`}
              className="font-semibold text-primary hover:text-secondary hover:underline truncate"
              title={unit.mitra.nama}
            >
              {unit.mitra.nama}
            </Link>
            {unit.mitra.kota && (
              <span className="text-[11px] text-text-muted flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                {unit.mitra.kota}
              </span>
            )}
          </div>
        )}

        {/* Specs Highlights */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-slate-50/90 border border-border/60 mb-3 text-xs text-text-main">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-text-muted font-medium">Tipe</span>
            <span className="font-bold capitalize truncate max-w-full">
              {unit.jenis}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center border-x border-border/80 px-1">
            <span className="text-[10px] text-text-muted font-medium">Transmisi</span>
            <span className="font-bold capitalize truncate max-w-full">
              {unit.transmisi}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-text-muted font-medium">Kapasitas</span>
            <span className="font-bold truncate max-w-full">
              {unit.kapasitas} Kursi
            </span>
          </div>
        </div>

        {/* Included Features */}
        {unit.fitur && unit.fitur.length > 0 && (
          <p className="text-[11px] text-text-muted line-clamp-1 mb-4">
            {unit.fitur.slice(0, 3).join(' • ')}
          </p>
        )}
      </div>

      {/* Pricing & CTA Action */}
      <div className="pt-3.5 border-t border-border/80 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="tnum text-base sm:text-lg font-extrabold text-secondary">
              {formatRupiah(unit.hargaPerHari)}
            </span>
            <span className="text-[11px] text-text-muted font-medium">/hari</span>
          </div>

          <div className="text-[11px] mt-0.5">
            {isOutOfStock ? (
              <span className="text-urgency font-bold">Stok Habis</span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Sisa {unit.stok} unit
              </span>
            )}
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
          <Link href={`/armada/${unit.id}`}>
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
