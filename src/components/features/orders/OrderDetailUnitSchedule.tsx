'use client';

import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  Building2,
  Clock,
  Users,
  Settings2,
} from 'lucide-react';
import { Pesanan } from '@/types';
import { formatTanggalIndo } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';

export interface OrderDetailUnitScheduleProps {
  pesanan: Pesanan;
}

export function OrderDetailUnitSchedule({
  pesanan,
}: OrderDetailUnitScheduleProps) {
  return (
    <Card
      level={1}
      padding="lg"
      className="space-y-5 rounded-3xl shadow-xs border-border/80 bg-white"
    >
      <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-secondary" />
          <span>Kendaraan & Jadwal Sewa</span>
        </h3>
        <span className="text-xs font-bold text-secondary bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
          {pesanan.durasiHari} Hari Sewa
        </span>
      </div>

      {/* Vehicle Info */}
      <div className="flex items-start gap-4">
        {pesanan.unit && (
          <div className="relative w-28 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-border/80 shadow-2xs">
            <Image
              src={pesanan.unit.gambar}
              alt={pesanan.unit.nama}
              fill
              sizes="112px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="space-y-1.5 flex-1 min-w-0">
          <h4 className="font-[family-name:var(--font-headline)] font-bold text-base text-primary truncate">
            {pesanan.unit?.nama || 'Armada Rental'}
          </h4>

          <p className="text-xs text-text-muted flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span className="font-semibold text-slate-700 truncate">
              {pesanan.mitra?.nama}
            </span>
            <span className="text-slate-400">•</span>
            <span className="truncate">{pesanan.mitra?.kota}</span>
          </p>

          {/* Quick Specs */}
          {pesanan.unit && (
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-1">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                <Settings2 className="w-3 h-3 text-slate-400" />
                {pesanan.unit.transmisi}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                <Users className="w-3 h-3 text-slate-400" />
                {pesanan.unit.kapasitas} Kursi
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Detail Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-border/80 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-border/70">
          <div>
            <span className="text-text-muted text-[11px] block">
              Tanggal Mulai (Pick-up):
            </span>
            <span className="font-bold text-primary text-sm">
              {formatTanggalIndo(pesanan.tanggalMulai)}
            </span>
          </div>

          <div>
            <span className="text-text-muted text-[11px] block">
              Tanggal Selesai (Return):
            </span>
            <span className="font-bold text-primary text-sm">
              {formatTanggalIndo(pesanan.tanggalSelesai)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <span className="text-text-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span>Waktu Operasional:</span>
          </span>
          <span className="font-semibold text-slate-700">
            08:00 - 20:00 WIB (Sesuai Mitra)
          </span>
        </div>
      </div>
    </Card>
  );
}
