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
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export interface RingkasanPesananProps {
  unit: Unit;
  tanggalMulai: string;
  tanggalSelesai: string;
  onSubmitClick?: () => void;
  submitButtonText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RingkasanPesanan: React.FC<RingkasanPesananProps> = ({
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
              <span>Mulai Sewa:</span>
            </span>
            <span className="font-bold text-primary">
              {formatTanggalIndo(tanggalMulai)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              <span>Selesai Sewa:</span>
            </span>
            <span className="font-bold text-primary">
              {formatTanggalIndo(tanggalSelesai)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-border/80">
            <span className="text-text-muted font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>Durasi Sewa:</span>
            </span>
            <span className="font-extrabold text-secondary text-sm">
              {durasiHari} Hari
            </span>
          </div>
        </div>

        {/* Itemized Cost Breakdown */}
        <div className="space-y-2.5 text-xs pt-1">
          <div className="flex justify-between text-text-muted">
            <span>
              Sewa Kendaraan ({durasiHari} hari × {formatRupiah(unit.hargaPerHari)})
            </span>
            <span className="tnum font-bold text-text-main">
              {formatRupiah(rincian.sewa)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Proteksi & Asuransi Perjalanan</span>
            </span>
            <span className="tnum font-bold text-text-main">
              {formatRupiah(rincian.proteksi)}
            </span>
          </div>

          <div className="flex justify-between text-text-muted">
            <span>Pajak (PPN 11%)</span>
            <span className="tnum font-bold text-text-main">
              {formatRupiah(rincian.pajak)}
            </span>
          </div>

          <div className="pt-3.5 border-t border-border/80 flex items-baseline justify-between">
            <span className="text-sm font-bold text-primary">Total Pembayaran</span>
            <span className="tnum font-[family-name:var(--font-headline)] text-xl font-black text-secondary">
              {formatRupiah(rincian.total)}
            </span>
          </div>
        </div>

        {/* Submit Action */}
        {onSubmitClick && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={disabled || isLoading}
              isLoading={isLoading}
              onClick={onSubmitClick}
              leftIcon={<PhoneCall className="w-4 h-4" />}
              className="shadow-md shadow-blue-500/20"
            >
              {submitButtonText}
            </Button>

            <p className="text-[11px] text-text-muted text-center mt-2.5 leading-relaxed">
              Pesanan dicatat di sistem & diteruskan langsung ke WhatsApp admin resmi untuk konfirmasi serah terima.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
