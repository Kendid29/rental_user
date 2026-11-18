'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  CreditCard,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react';
import { Pesanan } from '@/types';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export interface OrderDetailCustomerProps {
  pesanan: Pesanan;
}

const METODE_LABEL_MAP: Record<string, string> = {
  va_bca: 'BCA Virtual Account',
  va_mandiri: 'Mandiri Virtual Account',
  va_bni: 'BNI Virtual Account',
  va_bri: 'BRI Virtual Account',
  qris: 'QRIS Instant Payment',
  kartu_kredit: 'Kartu Kredit / Debit Online',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
  indomaret: 'Gerai Indomaret',
  alfamart: 'Gerai Alfamart',
};

export function OrderDetailCustomer({ pesanan }: OrderDetailCustomerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyWA = () => {
    navigator.clipboard.writeText(pesanan.nomorWAPenyewa);
    setCopied(true);
    toast.success('Nomor WhatsApp disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentLabel =
    METODE_LABEL_MAP[pesanan.metodePembayaran] ||
    pesanan.metodePembayaran.toUpperCase();

  return (
    <Card
      level={1}
      padding="lg"
      className="space-y-5 rounded-3xl shadow-xs border-border/80 bg-white"
    >
      <div className="flex items-center justify-between border-b border-border/80 pb-3.5">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-secondary" />
          <span>Data Identitas Penyewa</span>
        </h3>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-emerald-600" />
          <span>Terdaftar</span>
        </span>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-border/70 space-y-1">
          <span className="text-text-muted text-[11px] block">
            Nama Lengkap Penyewa:
          </span>
          <p className="font-bold text-primary text-sm">
            {pesanan.namaPenyewa}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-border/70 flex items-center justify-between">
          <div>
            <span className="text-text-muted text-[11px] block">
              Nomor WhatsApp Kontak:
            </span>
            <p className="font-mono font-bold text-primary text-sm">
              {pesanan.nomorWAPenyewa}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyWA}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-border/80 text-[11px] font-semibold text-slate-700 hover:text-secondary shadow-2xs transition-colors cursor-pointer"
            title="Salin Nomor WhatsApp"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-border/70 space-y-1">
          <span className="text-text-muted text-[11px] block">
            Metode Pembayaran:
          </span>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-secondary" />
            <span className="font-bold text-primary">
              {paymentLabel}
            </span>
          </div>
        </div>

        {pesanan.pesanUntukOrangLain && pesanan.pemesanLain && (
          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-1">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
              Driver / Kontak Penerima Khusus:
            </span>
            <p className="font-bold text-primary">
              {pesanan.pemesanLain.nama} ({pesanan.pemesanLain.nomorWA})
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
