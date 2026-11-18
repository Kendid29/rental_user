'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { Unit } from '@/types';
import { formatRupiah, hitungRincianBiaya } from '@/lib/pricing';
import { buildWaTanyaUnitLink } from '@/lib/whatsapp';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/ui/DatePicker';

export interface FleetBookingCardProps {
  unit: Unit;
  tanggalMulai: string;
  tanggalSelesai: string;
  dateError: string | null;
  onTanggalMulaiChange: (val: string) => void;
  onTanggalSelesaiChange: (val: string) => void;
  onPesanSekarang: () => void;
}

export function FleetBookingCard({
  unit,
  tanggalMulai,
  tanggalSelesai,
  dateError,
  onTanggalMulaiChange,
  onTanggalSelesaiChange,
  onPesanSekarang,
}: FleetBookingCardProps) {
  const { durasiHari, rincian } = hitungRincianBiaya(
    unit.hargaPerHari,
    tanggalMulai,
    tanggalSelesai
  );

  const isOutOfStock = unit.stok <= 0;
  const isDateInvalid = Boolean(dateError) || !tanggalMulai || !tanggalSelesai;
  const isPesanDisabled = isOutOfStock || isDateInvalid;

  const waTanyaLink = buildWaTanyaUnitLink(
    unit.nama,
    unit.mitra?.nama || '-',
    unit.mitra?.kota || '-'
  );

  return (
    <div className="sticky top-24 space-y-4">
      <Card
        level={2}
        padding="lg"
        className="rounded-3xl border-border/80 shadow-lg space-y-6"
      >
        {/* Tarif Harian */}
        <div>
          <span className="text-xs text-text-muted font-bold uppercase tracking-wider block">
            Tarif Sewa Harian
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-[family-name:var(--font-headline)] text-3xl font-extrabold text-primary tnum">
              {formatRupiah(unit.hargaPerHari)}
            </span>
            <span className="text-xs text-text-muted">/ hari</span>
          </div>
        </div>

        {/* Rental Schedule Selectors */}
        <div className="space-y-3.5 pt-4 border-t border-border/80">
          <DatePicker
            label="Mulai Sewa"
            value={tanggalMulai}
            min={new Date().toISOString().split('T')[0]}
            onChange={onTanggalMulaiChange}
          />

          <DatePicker
            label="Selesai Sewa"
            value={tanggalSelesai}
            min={tanggalMulai || new Date().toISOString().split('T')[0]}
            onChange={onTanggalSelesaiChange}
          />

          {dateError && (
            <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{dateError}</span>
            </p>
          )}

          {/* Duration Badge */}
          <div className="flex items-center justify-between text-xs font-bold py-2 px-3 bg-blue-50/70 rounded-xl text-secondary border border-blue-200/50">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Durasi Sewa:
            </span>
            <span>{durasiHari} Hari</span>
          </div>
        </div>

        {/* Cost Calculation Summary */}
        <div className="space-y-2 pt-4 border-t border-border/80 text-xs">
          <div className="flex justify-between text-text-muted">
            <span>
              Sewa ({durasiHari} Hari × {formatRupiah(unit.hargaPerHari)})
            </span>
            <span className="font-semibold text-primary tnum">
              {formatRupiah(rincian.sewa)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
              Proteksi Asuransi
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
          <div className="pt-3 border-t border-border flex justify-between items-baseline font-black">
            <span className="text-sm text-primary">Estimasi Total</span>
            <span className="text-xl text-secondary font-[family-name:var(--font-headline)] tnum">
              {formatRupiah(rincian.total)}
            </span>
          </div>
        </div>

        {/* Booking CTAs */}
        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={isPesanDisabled}
            onClick={onPesanSekarang}
            className="shadow-lg hover:shadow-primary/25"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isOutOfStock ? 'Unit Sedang Habis' : 'Lanjut ke Pemesanan'}
          </Button>

          <a
            href={waTanyaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="outline"
              size="md"
              fullWidth
              leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
            >
              Tanya Ketersediaan via WhatsApp
            </Button>
          </a>
        </div>
      </Card>

      {/* Trust Assurance Pill */}
      <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-2xs space-y-2 text-xs text-text-muted">
        <div className="flex items-center gap-2 font-bold text-primary">
          <ShieldCheck className="w-4 h-4 text-tertiary" />
          <span>Jaminan Transaksi Resmi</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Tanpa perantara liar. Pembayaran diverifikasi langsung dengan invoice sah dan kwitansi mitra resmi.
        </p>
      </div>
    </div>
  );
}
