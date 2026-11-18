'use client';

import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
} from 'lucide-react';
import { Unit } from '@/types';
import {
  formatRupiah,
  formatTanggalIndo,
  hitungRincianBiaya,
} from '@/lib/pricing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface OrderSummaryProps {
  unit: Unit;
  tanggalMulai: string;
  tanggalSelesai: string;
  onSubmitClick?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  unit,
  tanggalMulai,
  tanggalSelesai,
  onSubmitClick,
  submitButtonText = 'Bayar & Konfirmasi via WhatsApp',
  isLoading = false,
  disabled = false,
  className,
}) => {
  const { durasiHari, rincian } = hitungRincianBiaya(
    unit.hargaPerHari,
    tanggalMulai,
    tanggalSelesai
  );

  return (
    <Card
      level={2}
      padding="none"
      className={cn('overflow-hidden rounded-3xl border-border/80 shadow-md', className)}
    >
      {/* Header Bar */}
      <div className="p-5 border-b border-border/80 bg-slate-50/80">
        <h3 className="font-[family-name:var(--font-headline)] text-base sm:text-lg font-bold text-primary">
          Ringkasan Pesanan
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Periksa detail kendaraan dan rincian tarif sewa
        </p>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Unit Info Card */}
        <div className="flex gap-3.5 items-center bg-slate-50/70 p-3 rounded-2xl border border-border/60">
          <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-border/80">
            <Image
              src={unit.gambar}
              alt={unit.nama}
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-primary truncate">
              {unit.nama}
            </h4>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {unit.mitra?.nama} ({unit.mitra?.kota})
            </p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-text-muted">
              <span className="bg-white px-2 py-0.5 rounded-md text-primary font-semibold border border-border/60">
                {unit.transmisi}
              </span>
              <span>•</span>
              <span className="bg-white px-2 py-0.5 rounded-md text-primary font-semibold border border-border/60">
                {unit.kapasitas} Kursi
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Info Box */}
        <div className="bg-slate-50/90 rounded-2xl p-4 border border-border/70 text-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              Mulai Sewa:
            </span>
            <span className="font-bold text-primary">
              {tanggalMulai ? formatTanggalIndo(tanggalMulai) : '-'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              Selesai Sewa:
            </span>
            <span className="font-bold text-primary">
              {tanggalSelesai ? formatTanggalIndo(tanggalSelesai) : '-'}
            </span>
          </div>

          <div className="pt-2 border-t border-border/70 flex justify-between items-center font-bold">
            <span className="text-primary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              Total Durasi:
            </span>
            <span className="text-secondary bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200/50">
              {durasiHari} Hari
            </span>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>
              Tarif Sewa ({durasiHari} Hari × {formatRupiah(unit.hargaPerHari)})
            </span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(rincian.sewa)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
              Proteksi Sewa & Asuransi
            </span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(rincian.proteksi)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Pajak Transaksi (PPN 11%)</span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(rincian.pajak)}
            </span>
          </div>

          <div className="pt-3 border-t border-border flex justify-between items-baseline">
            <div>
              <span className="font-black text-sm text-primary block">
                Total Pembayaran
              </span>
              <span className="text-[11px] text-text-muted">
                Sudah termasuk pajak & proteksi
              </span>
            </div>
            <span className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-secondary tnum">
              {formatRupiah(rincian.total)}
            </span>
          </div>
        </div>

        {/* Value Proposition Micro Badges */}
        <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl text-[11px] text-emerald-800 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garansi Unit Bersih & Prima</span>
          </div>
          <p className="text-[10px] text-emerald-700 leading-relaxed pl-5">
            Unit disinfeksi penuh dan siap pakai tepat waktu di lokasi mitra.
          </p>
        </div>

        {/* Action Button */}
        {onSubmitClick && (
          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-center shadow-lg hover:shadow-secondary/25"
            onClick={onSubmitClick}
            isLoading={isLoading}
            disabled={disabled || isLoading}
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            {submitButtonText}
          </Button>
        )}
      </div>
    </Card>
  );
};
