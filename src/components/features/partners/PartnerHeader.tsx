'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Star,
  ShieldCheck,
  Car,
  PhoneCall,
  ArrowLeft,
} from 'lucide-react';
import { Mitra } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export interface PartnerHeaderProps {
  mitra: Mitra;
  waUrl: string;
}

export function PartnerHeader({ mitra, waUrl }: PartnerHeaderProps) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-xl overflow-hidden border border-white/10">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-tertiary/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
        {/* Mitra Avatar & Main Info */}
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-tertiary" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-headline)]">
                {mitra.nama}
              </h1>
              {mitra.isSuperPartner && (
                <Badge variant="superPartner" size="sm">
                  ★ Super Partner
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Terverifikasi
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-secondary" />
                Kota {mitra.kota}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-amber-300">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {mitra.rating}
                <span className="text-slate-400 font-normal">
                  ({mitra.jumlahUlasan} ulasan)
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                <Car className="w-4 h-4 text-tertiary" />
                {mitra.unitTersedia} Unit Tersedia
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button
              variant="tertiary"
              size="md"
              className="w-full justify-center shadow-lg hover:shadow-tertiary/25"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Tanya Mitra via WhatsApp
            </Button>
          </a>

          <Link href="/" className="w-full">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Jelajahi Mitra Lain
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
