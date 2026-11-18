'use client';

import React from 'react';
import Link from 'next/link';
import {
  Car,
  Star,
  Users,
  Settings2,
  CheckCircle2,
  Building2,
  MapPin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Unit } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export interface FleetSpecsCardProps {
  unit: Unit;
}

export function FleetSpecsCard({ unit }: FleetSpecsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-border/80 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Title & Rating */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
              {unit.nama}
            </h1>
            <Badge variant="neutral" size="sm" className="capitalize">
              {unit.jenis}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-amber-900">
              {unit.rating.toFixed(1)}
            </span>
            <span className="text-xs text-amber-700">
              ({unit.jumlahUlasan} ulasan)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted">
          <span className="flex items-center gap-1 font-medium text-primary">
            <Building2 className="w-4 h-4 text-secondary" />
            {unit.mitra?.nama || 'Mitra Resmi'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            {unit.mitra?.kota || 'Indonesia'}
          </span>
        </div>
      </div>

      {/* Core Specs Grid */}
      <div className="pt-2 border-t border-border/80">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
          Spesifikasi Utama
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Jenis */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
            <span className="text-[10px] text-text-muted font-semibold block uppercase">
              Jenis Armada
            </span>
            <span className="text-sm font-bold text-primary flex items-center gap-1.5 capitalize">
              <Car className="w-4 h-4 text-secondary" />
              {unit.jenis}
            </span>
          </div>

          {/* Transmisi */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
            <span className="text-[10px] text-text-muted font-semibold block uppercase">
              Transmisi
            </span>
            <span className="text-sm font-bold text-primary flex items-center gap-1.5 capitalize">
              <Settings2 className="w-4 h-4 text-secondary" />
              {unit.transmisi}
            </span>
          </div>

          {/* Kapasitas */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
            <span className="text-[10px] text-text-muted font-semibold block uppercase">
              Kapasitas
            </span>
            <span className="text-sm font-bold text-primary flex items-center gap-1.5">
              <Users className="w-4 h-4 text-secondary" />
              {unit.kapasitas} Kursi
            </span>
          </div>

          {/* Status Stok */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-border/70 space-y-1">
            <span className="text-[10px] text-text-muted font-semibold block uppercase">
              Status Stok
            </span>
            <span
              className={cn(
                'text-sm font-bold flex items-center gap-1.5',
                unit.stok > 0 ? 'text-emerald-700' : 'text-rose-600'
              )}
            >
              <ShieldCheck className="w-4 h-4" />
              {unit.stok > 0 ? `Tersedia (${unit.stok})` : 'Habis'}
            </span>
          </div>
        </div>
      </div>

      {/* Features & Amenities List */}
      {unit.fitur && unit.fitur.length > 0 && (
        <div className="pt-2 border-t border-border/80">
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Kelengkapan & Fasilitas Unit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {unit.fitur.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-xs text-text-main bg-slate-50/70 p-2.5 rounded-xl border border-border/60"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner Card Pill */}
      {unit.mitra && (
        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/50 p-4.5 rounded-2xl border border-blue-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary">
                {unit.mitra.nama}
              </span>
              {unit.mitra.isSuperPartner && (
                <Badge variant="superPartner" size="sm">
                  Super Partner
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              {unit.mitra.layanan.join(' • ')}
            </p>
          </div>

          <Link
            href={`/partners/${unit.mitra.id}`}
            className="text-xs font-bold text-secondary hover:text-secondary-hover inline-flex items-center gap-1 shrink-0"
          >
            <span>Lihat Profil Mitra Resmi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
