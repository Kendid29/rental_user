'use client';

import React from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Receipt } from 'lucide-react';
import { Pesanan } from '@/types';
import { formatRupiah } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';

export interface OrderDetailPaymentProps {
  pesanan: Pesanan;
}

export function OrderDetailPayment({ pesanan }: OrderDetailPaymentProps) {
  const isLunas =
    pesanan.status === 'terkonfirmasi' || pesanan.status === 'selesai';

  return (
    <Card
      level={1}
      padding="lg"
      className="space-y-5 rounded-3xl shadow-xs border-border/80 bg-white"
    >
      <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="w-3.5 h-3.5 text-secondary" />
          <span>Rincian Transaksi & Pembayaran</span>
        </h3>

        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
            isLunas
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isLunas ? 'Pembayaran Lunas' : 'Menunggu Konfirmasi'}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Sewa Pokok */}
        <div className="flex justify-between items-center text-text-muted">
          <span>
            Tarif Pokok Kendaraan ({pesanan.durasiHari} Hari ×{' '}
            {formatRupiah(pesanan.unit?.hargaPerHari || 0)})
          </span>
          <span className="font-semibold text-primary tnum">
            {formatRupiah(pesanan.rincianBiaya.sewa)}
          </span>
        </div>

        {/* Proteksi & Asuransi */}
        <div className="flex justify-between items-center text-text-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paket Proteksi All-Risk & Bantuan Darurat</span>
          </span>
          <span className="font-semibold text-primary tnum">
            {formatRupiah(pesanan.rincianBiaya.proteksi)}
          </span>
        </div>

        {/* Pajak Transaksi PPN 11% */}
        <div className="flex justify-between items-center text-text-muted">
          <span>Pajak Pertambahan Nilai (PPN 11%)</span>
          <span className="font-semibold text-primary tnum">
            {formatRupiah(pesanan.rincianBiaya.pajak)}
          </span>
        </div>

        {/* Grand Total Bar */}
        <div className="pt-4 border-t border-border flex justify-between items-end">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-primary block">
              Total Pembayaran
            </span>
            <span className="text-[11px] text-text-muted">
              Tarif final terpadu tanpa biaya tersembunyi
            </span>
          </div>

          <span className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-secondary tnum">
            {formatRupiah(pesanan.rincianBiaya.total)}
          </span>
        </div>
      </div>
    </Card>
  );
}
