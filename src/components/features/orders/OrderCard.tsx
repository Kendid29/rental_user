'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Building2,
  PhoneCall,
  ArrowRight,
  Copy,
  Check,
  CreditCard,
  Users,
  Settings2,
} from 'lucide-react';
import { Pesanan } from '@/types';
import { formatRupiah, formatTanggalIndo } from '@/lib/pricing';
import { buildWaAdminLink } from '@/lib/whatsapp';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderStatusBadge } from './OrderStatusBadge';
import toast from 'react-hot-toast';

export interface OrderCardProps {
  pesanan: Pesanan;
}

const METODE_LABEL_MAP: Record<string, string> = {
  va_bca: 'VA BCA',
  va_mandiri: 'VA Mandiri',
  va_bni: 'VA BNI',
  va_bri: 'VA BRI',
  qris: 'QRIS Instant',
  kartu_kredit: 'Kartu Kredit',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
  indomaret: 'Indomaret',
  alfamart: 'Alfamart',
};

export function OrderCard({ pesanan }: OrderCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(pesanan.id);
    setCopied(true);
    toast.success(`ID #${pesanan.id} disalin!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentLabel =
    METODE_LABEL_MAP[pesanan.metodePembayaran] ||
    pesanan.metodePembayaran.toUpperCase();

  const waAdminUrl = buildWaAdminLink(pesanan);

  return (
    <Card
      level={1}
      padding="none"
      className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-white hover:border-secondary/40 hover:shadow-md transition-all duration-200 w-full min-w-0"
    >
      {/* 1. Header Bar: Meta Info & Status */}
      <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-slate-50/70 border-b border-border/70 text-xs space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
        {/* Top line on mobile: ID on left, Status Badge on right */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          {/* Order ID with Copy Action */}
          <div className="flex items-center gap-1.5 bg-white border border-border/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl shadow-2xs">
            <span className="font-mono font-bold text-primary text-[11px]">
              #{pesanan.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-slate-400 hover:text-secondary transition-colors p-0.5 rounded cursor-pointer"
              title="Salin ID Pesanan"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="sm:hidden">
            <OrderStatusBadge status={pesanan.status} />
          </div>
        </div>

        {/* Date & Payment Method */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-text-muted text-[11px]">
          <span className="hidden sm:inline">•</span>
          <span>Dipesan: {formatTanggalIndo(pesanan.createdAt)}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100/80 px-2 py-0.5 rounded-md sm:rounded-lg border border-slate-200">
            <CreditCard className="w-3 h-3 text-slate-500" />
            <span>{paymentLabel}</span>
          </span>
        </div>

        {/* Status Badge (Desktop) */}
        <div className="hidden sm:block">
          <OrderStatusBadge status={pesanan.status} />
        </div>
      </div>

      {/* 2. Middle Body: Vehicle Details & Rental Schedule */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          {/* Left: Vehicle Image & Specs */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 flex-1 min-w-0">
            {pesanan.unit && (
              <div className="relative w-20 h-20 sm:w-28 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-border/80 shadow-2xs">
                <Image
                  src={pesanan.unit.gambar}
                  alt={pesanan.unit.nama}
                  fill
                  sizes="(max-width: 640px) 80px, 112px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <span className="absolute bottom-1 left-1 text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.2 rounded">
                  {pesanan.unit.jenis}
                </span>
              </div>
            )}

            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-[family-name:var(--font-headline)] font-bold text-sm sm:text-base text-primary truncate">
                {pesanan.unit?.nama || 'Unit Kendaraan Rental'}
              </h3>

              <p className="text-xs text-text-muted flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="font-semibold text-slate-700 truncate">
                  {pesanan.mitra?.nama}
                </span>
                <span className="text-slate-400">•</span>
                <span className="truncate">{pesanan.mitra?.kota}</span>
              </p>

              {/* Unit Quick Spec Badges */}
              {pesanan.unit && (
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 pt-0.5">
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg font-medium">
                    <Settings2 className="w-3 h-3 text-slate-400" />
                    <span>{pesanan.unit.transmisi}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg font-medium">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{pesanan.unit.kapasitas} Kursi</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Total Price */}
          <div className="flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-border/70 shrink-0">
            <span className="text-[11px] text-text-muted font-medium">
              Total Tarif ({pesanan.durasiHari} Hari)
            </span>
            <span className="tnum font-[family-name:var(--font-headline)] text-lg sm:text-2xl font-black text-secondary">
              {formatRupiah(pesanan.rincianBiaya.total)}
            </span>
          </div>
        </div>

        {/* Schedule Timeline Strip */}
        <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50/90 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-text-muted font-medium">
            <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>Jadwal Penggunaan:</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 font-semibold text-slate-800 text-[11px] sm:text-xs">
            <span className="bg-white px-2 py-0.5 rounded-lg border border-border/80 shadow-2xs font-bold text-primary">
              {formatTanggalIndo(pesanan.tanggalMulai)}
            </span>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-secondary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              <span>{pesanan.durasiHari} Hari</span>
            </div>
            <span className="bg-white px-2 py-0.5 rounded-lg border border-border/80 shadow-2xs font-bold text-primary">
              {formatTanggalIndo(pesanan.tanggalSelesai)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Footer Bar: Actions */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-50/50 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Link href={`/orders/${pesanan.id}`} className="flex-1 sm:flex-initial">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="rounded-xl shadow-xs justify-center sm:w-auto"
            >
              Detail Pesanan
            </Button>
          </Link>

          {pesanan.status === 'menunggu_pembayaran' && (
            <a
              href={waAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial"
            >
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                leftIcon={<PhoneCall className="w-3.5 h-3.5 text-emerald-600" />}
                className="bg-white hover:bg-slate-50 text-emerald-700 border-emerald-300 rounded-xl justify-center sm:w-auto"
              >
                Konfirmasi WA
              </Button>
            </a>
          )}

          {pesanan.status === 'terkonfirmasi' && (
            <a
              href={waAdminUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial"
            >
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<PhoneCall className="w-3.5 h-3.5 text-slate-600" />}
                className="rounded-xl justify-center sm:w-auto"
              >
                Hubungi Admin
              </Button>
            </a>
          )}
        </div>

        <span className="text-[10px] sm:text-[11px] text-text-muted">
          Pembaruan status otomatis oleh sistem
        </span>
      </div>
    </Card>
  );
}
