'use client';

import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { Pesanan } from '@/types';
import { formatRupiah } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';

export interface OrderDetailPaymentProps {
  pesanan: Pesanan;
}

export function OrderDetailPayment({ pesanan }: OrderDetailPaymentProps) {
  return (
    <Card level={1} padding="md" className="space-y-4 rounded-3xl shadow-xs">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
        <CreditCard className="w-3.5 h-3.5 text-secondary" />
        <span>Rincian Pembayaran</span>
      </h3>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-text-muted">
          <span>
            Tarif Sewa Pokok ({pesanan.durasiHari} Hari ×{' '}
            {formatRupiah(pesanan.unit?.hargaPerHari || 0)})
          </span>
          <span className="font-semibold text-primary tnum">
            {formatRupiah(pesanan.rincianBiaya.sewa)}
          </span>
        </div>

        <div className="flex justify-between text-text-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-tertiary" />
            Proteksi Sewa & Asuransi
          </span>
          <span className="font-semibold text-primary tnum">
            {formatRupiah(pesanan.rincianBiaya.proteksi)}
          </span>
        </div>

        <div className="flex justify-between text-text-muted">
          <span>Pajak Transaksi (PPN 11%)</span>
          <span className="font-semibold text-primary tnum">
            {formatRupiah(pesanan.rincianBiaya.pajak)}
          </span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-baseline font-black">
          <div>
            <span className="text-sm text-primary block">
              Total Nilai Transaksi
            </span>
            <span className="text-[10px] text-text-muted">
              Status: {pesanan.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <span className="font-[family-name:var(--font-headline)] text-2xl text-secondary tnum">
            {formatRupiah(pesanan.rincianBiaya.total)}
          </span>
        </div>
      </div>
    </Card>
  );
}
