'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Car,
  Star,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { MitraWithUnits } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { FleetCard } from '@/components/features/fleet/FleetCard';
import { cn } from '@/lib/utils';

export interface PartnerCardProps {
  mitra: MitraWithUnits;
  className?: string;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({
  mitra,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-3xl border border-border/80 shadow-xs overflow-hidden',
        'hover:shadow-md hover:border-secondary/30 transition-all duration-200',
        className
      )}
    >
      {/* Partner Header Bar */}
      <div className="p-5 sm:p-6 border-b border-border/80 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
              <Building2 className="w-5 h-5 text-secondary" />
              <span>{mitra.nama}</span>
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

          <div className="text-xs text-text-muted flex items-center gap-2 mb-2.5">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              {mitra.kota}
            </span>
            <span>•</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {mitra.unitTersedia} Unit Tersedia
            </span>
          </div>

          {/* Service Tags */}
          <div className="flex flex-wrap gap-1.5">
            {mitra.layanan.map((layanan, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold text-slate-600 bg-white border border-border/80 px-2.5 py-0.5 rounded-lg"
              >
                {layanan}
              </span>
            ))}
          </div>
        </div>

        {/* View All Units Action */}
        <div className="shrink-0 flex items-center gap-2">
          <Link
            href={`/partners/${mitra.id}`}
            className="text-xs font-bold text-secondary hover:text-secondary-hover inline-flex items-center gap-1.5 bg-blue-50/80 px-3 py-1.5 rounded-xl border border-blue-200/50 hover:bg-blue-100/60 transition-colors"
          >
            <span>Profil Mitra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Featured Units Grid */}
      <div className="p-5 sm:p-6">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <Car className="w-4 h-4 text-secondary" />
          <span>Armada Unggulan</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mitra.units.map((unit) => (
            <FleetCard key={unit.id} unit={unit} />
          ))}
        </div>
      </div>
    </div>
  );
};
