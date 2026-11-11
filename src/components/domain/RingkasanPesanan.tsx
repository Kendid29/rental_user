import React from 'react';
import Image from 'next/image';
import { Unit } from '@/types';
import { formatRupiah, formatTanggalIndo, hitungRincianBiaya } from '@/lib/pricing';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

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
  className = '',
}) => {
  const { durasiHari, rincian } = hitungRincianBiaya(
    unit.hargaPerHari,
    tanggalMulai,
    tanggalSelesai
  );

  return (
    <Card level={2} padding="none" className={`overflow-hidden ${className}`}>
      {/* Header Widget */}
      <div className="p-4 sm:p-5 border-b border-border bg-slate-50/70">
        <h3 className="font-[family-name:var(--font-headline)] text-base font-bold text-primary">
          Ringkasan Pesanan
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          Periksa rincian kendaraan dan jadwal sewa
        </p>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Unit Info Card */}
        <div className="flex gap-3 items-center">
          <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-border">
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
            <p className="text-xs text-text-muted">
              {unit.mitra?.nama} ({unit.mitra?.kota})
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-text-muted">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                {unit.transmisi}
              </span>
              <span>•</span>
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                {unit.kapasitas} Kursi
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-slate-50 rounded-xl p-3 border border-border text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Mulai Sewa:</span>
            <span className="font-semibold text-primary">
              {formatTanggalIndo(tanggalMulai)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Selesai Sewa:</span>
            <span className="font-semibold text-primary">
              {formatTanggalIndo(tanggalSelesai)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200/80">
            <span className="text-text-muted font-medium">Durasi Sewa:</span>
            <span className="font-bold text-secondary">
              {durasiHari} Hari
            </span>
          </div>
        </div>

        {/* Itemized Cost Breakdown */}
        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between text-text-muted">
            <span>
              Sewa Kendaraan ({durasiHari} × {formatRupiah(unit.hargaPerHari)})
            </span>
            <span className="tnum font-medium text-text-main">
              {formatRupiah(rincian.sewa)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Biaya Proteksi & Asuransi</span>
            <span className="tnum font-medium text-text-main">
              {formatRupiah(rincian.proteksi)}
            </span>
          </div>
          <div className="flex justify-between text-text-muted">
            <span>Pajak (PPN 11%)</span>
            <span className="tnum font-medium text-text-main">
              {formatRupiah(rincian.pajak)}
            </span>
          </div>

          <div className="pt-3 border-t border-border flex items-baseline justify-between">
            <span className="text-sm font-bold text-primary">Total Pembayaran</span>
            <span className="tnum font-[family-name:var(--font-headline)] text-lg font-bold text-secondary">
              {formatRupiah(rincian.total)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {onSubmitClick && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={disabled || isLoading}
              isLoading={isLoading}
              onClick={onSubmitClick}
              leftIcon={
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.585 1.961.948 2.801.948 3.178 0 5.767-2.587 5.767-5.766.001-3.182-2.586-5.769-5.772-5.769zm3.364 8.163c-.144.405-.837.774-1.17.822-.312.043-.68.077-2.12-.519-1.841-.762-3.031-2.617-3.123-2.738-.093-.122-.746-.992-.746-1.893 0-.901.47-1.344.636-1.528.167-.184.364-.23.486-.23.122 0 .243.001.348.006.111.005.259-.042.404.307.151.365.516 1.258.561 1.35.046.092.077.2.015.323-.061.123-.092.2-.183.307-.091.107-.193.24-.275.322-.093.092-.19.192-.082.378.107.185.476.786 1.022 1.272.705.628 1.3.822 1.484.914.185.092.293.077.401-.046.108-.123.462-.538.585-.722.123-.184.246-.154.415-.092.17.061 1.077.507 1.262.599.185.092.308.138.354.215.046.077.046.446-.098.851z" />
                </svg>
              }
            >
              {submitButtonText}
            </Button>
            <p className="text-[11px] text-text-muted text-center mt-2">
              Pesanan dicatat di sistem dan admin segera mengonfirmasi pembayaran
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
