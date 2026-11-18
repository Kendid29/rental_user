'use client';

import React from 'react';
import Image from 'next/image';
import { Calendar, Building2 } from 'lucide-react';
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
    <Card level={1} padding="md" className="space-y-4 rounded-3xl shadow-xs">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-secondary" />
        <span>Kendaraan & Jadwal Sewa</span>
      </h3>

      <div className="flex gap-4 items-center">
        {pesanan.unit && (
          <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-border/80 shadow-2xs">
            <Image
              src={pesanan.unit.gambar}
              alt={pesanan.unit.nama}
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <div className="space-y-1">
          <h4 className="font-bold text-base text-primary">
            {pesanan.unit?.nama}
          </h4>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>
              {pesanan.mitra?.nama} ({pesanan.mitra?.kota})
            </span>
          </p>
          <div className="flex gap-2 text-[11px] text-text-muted mt-1">
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
              {pesanan.unit?.transmisi}
            </span>
            <span>•</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
              {pesanan.unit?.kapasitas} Kursi
            </span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-50 border border-border/80 text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-text-muted">Tanggal Mulai:</span>
          <span className="font-bold text-primary">
            {formatTanggalIndo(pesanan.tanggalMulai)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Tanggal Selesai:</span>
          <span className="font-bold text-primary">
            {formatTanggalIndo(pesanan.tanggalSelesai)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border/70">
          <span className="text-text-muted font-medium">Durasi Sewa:</span>
          <span className="font-extrabold text-secondary">
            {pesanan.durasiHari} Hari
          </span>
        </div>
      </div>
    </Card>
  );
}
