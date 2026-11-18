'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Building2,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { Pesanan, StatusPesanan } from '@/types';
import { useMock } from '@/config/env';
import { formatRupiah, formatTanggalIndo } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderStatusBadge } from './OrderStatusBadge';

export interface OrderCardProps {
  pesanan: Pesanan;
  onSimulateStatus?: (id: string, newStatus: StatusPesanan) => void;
}

export function OrderCard({ pesanan, onSimulateStatus }: OrderCardProps) {
  return (
    <Card
      level={1}
      padding="md"
      className="space-y-4 hover:border-secondary/35 hover:shadow-md transition-all rounded-3xl"
    >
      {/* Header Box */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg border border-border/80">
            {pesanan.id}
          </span>
          <span className="text-text-muted">•</span>
          <span className="text-text-muted font-medium">
            Dibuat: {formatTanggalIndo(pesanan.createdAt)}
          </span>
        </div>

        <OrderStatusBadge status={pesanan.status} />
      </div>

      {/* Body Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
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
            <h3 className="font-bold text-base text-primary">
              {pesanan.unit?.nama || 'Unit Kendaraan'}
            </h3>
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-secondary" />
              <span>
                {pesanan.mitra?.nama} ({pesanan.mitra?.kota})
              </span>
            </p>
            <p className="text-xs text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              <span>
                {formatTanggalIndo(pesanan.tanggalMulai)} -{' '}
                {formatTanggalIndo(pesanan.tanggalSelesai)} ({pesanan.durasiHari} Hari)
              </span>
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border/80">
          <span className="text-[11px] text-text-muted font-medium">
            Total Tarif
          </span>
          <span className="tnum font-[family-name:var(--font-headline)] text-lg sm:text-xl font-black text-secondary">
            {formatRupiah(pesanan.rincianBiaya.total)}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3.5 border-t border-border/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href={`/orders/${pesanan.id}`}>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Detail Pesanan
            </Button>
          </Link>

          {pesanan.status === 'menunggu_pembayaran' && (
            <a
              href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                `Halo Admin RentalinAja, saya ingin konfirmasi pesanan dengan ID: ${pesanan.id}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PhoneCall className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Konfirmasi WhatsApp
              </Button>
            </a>
          )}
        </div>

        {/* Developer Mode Quick Simulation Controls */}
        {useMock && onSimulateStatus && (
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl text-[10px] text-slate-500">
            <span className="font-bold">Dev Sim:</span>
            <button
              type="button"
              onClick={() => onSimulateStatus(pesanan.id, 'terkonfirmasi')}
              className="hover:text-emerald-600 font-semibold underline cursor-pointer"
            >
              Terkonfirmasi
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSimulateStatus(pesanan.id, 'selesai')}
              className="hover:text-blue-600 font-semibold underline cursor-pointer"
            >
              Selesai
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => onSimulateStatus(pesanan.id, 'dibatalkan')}
              className="hover:text-rose-600 font-semibold underline cursor-pointer"
            >
              Batalkan
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
