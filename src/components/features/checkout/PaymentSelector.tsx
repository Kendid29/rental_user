'use client';

import React from 'react';
import {
  QrCode,
  CreditCard,
  Building,
  Wallet,
  Store,
  CheckCircle2,
} from 'lucide-react';
import { MetodePembayaran } from '@/types';
import { cn } from '@/lib/utils';

export interface PaymentSelectorProps {
  selectedMetode: MetodePembayaran;
  onSelect: (metode: MetodePembayaran) => void;
  className?: string;
}

interface ChannelOption {
  id: MetodePembayaran;
  name: string;
  category: 'instant' | 'va' | 'ewallet' | 'card' | 'gerai';
  badge?: string;
  icon: React.ReactNode;
}

const CHANNELS: ChannelOption[] = [
  {
    id: 'qris',
    name: 'QRIS (Gopay, OVO, Dana, BCA)',
    category: 'instant',
    badge: 'Rekomendasi',
    icon: <QrCode className="w-4 h-4 text-secondary" />,
  },
  {
    id: 'va_bca',
    name: 'BCA Virtual Account',
    category: 'va',
    icon: <Building className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'va_mandiri',
    name: 'Mandiri Virtual Account',
    category: 'va',
    icon: <Building className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'va_bri',
    name: 'BRI Virtual Account',
    category: 'va',
    icon: <Building className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'va_bni',
    name: 'BNI Virtual Account',
    category: 'va',
    icon: <Building className="w-4 h-4 text-blue-600" />,
  },
  {
    id: 'gopay',
    name: 'GoPay',
    category: 'ewallet',
    icon: <Wallet className="w-4 h-4 text-cyan-600" />,
  },
  {
    id: 'ovo',
    name: 'OVO',
    category: 'ewallet',
    icon: <Wallet className="w-4 h-4 text-purple-600" />,
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'ewallet',
    icon: <Wallet className="w-4 h-4 text-sky-600" />,
  },
  {
    id: 'kartu_kredit',
    name: 'Kartu Kredit / Debit (Visa, Mastercard, JCB)',
    category: 'card',
    icon: <CreditCard className="w-4 h-4 text-indigo-600" />,
  },
  {
    id: 'indomaret',
    name: 'Indomaret / Ceriamart',
    category: 'gerai',
    icon: <Store className="w-4 h-4 text-amber-600" />,
  },
  {
    id: 'alfamart',
    name: 'Alfamart / Alfamidi / Dan+Dan',
    category: 'gerai',
    icon: <Store className="w-4 h-4 text-rose-600" />,
  },
];

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMetode,
  onSelect,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Category: Rekomendasi Instan */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
          Pembayaran Instan (Verifikasi Otomatis)
        </span>
        <div className="space-y-2">
          {CHANNELS.filter((c) => c.category === 'instant').map((channel) => {
            const isSelected = selectedMetode === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => onSelect(channel.id)}
                className={cn(
                  'w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer',
                  isSelected
                    ? 'border-secondary bg-blue-50/60 ring-2 ring-secondary/20 shadow-xs'
                    : 'border-border/80 bg-white hover:border-secondary/40 hover:bg-slate-50/50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-border/70 flex items-center justify-center shrink-0 shadow-2xs">
                    {channel.icon}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-primary block">
                      {channel.name}
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Scan via seluruh aplikasi mobile banking & e-wallet
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {channel.badge && (
                    <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {channel.badge}
                    </span>
                  )}
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                      isSelected
                        ? 'border-secondary bg-secondary text-white'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category: Virtual Account */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
          Virtual Account Bank
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CHANNELS.filter((c) => c.category === 'va').map((channel) => {
            const isSelected = selectedMetode === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => onSelect(channel.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer',
                  isSelected
                    ? 'border-secondary bg-blue-50/60 ring-2 ring-secondary/20 shadow-xs'
                    : 'border-border/80 bg-white hover:border-secondary/40'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-border/70 flex items-center justify-center shrink-0">
                    {channel.icon}
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {channel.name}
                  </span>
                </div>

                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected
                      ? 'border-secondary bg-secondary'
                      : 'border-slate-300 bg-white'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Category: E-Wallet */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
          Dompet Digital (E-Wallet)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CHANNELS.filter((c) => c.category === 'ewallet').map((channel) => {
            const isSelected = selectedMetode === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => onSelect(channel.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer',
                  isSelected
                    ? 'border-secondary bg-blue-50/60 ring-2 ring-secondary/20 shadow-xs'
                    : 'border-border/80 bg-white hover:border-secondary/40'
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-border/70 flex items-center justify-center shrink-0">
                    {channel.icon}
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {channel.name}
                  </span>
                </div>

                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected
                      ? 'border-secondary bg-secondary'
                      : 'border-slate-300 bg-white'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Category: Lainnya */}
      <div className="space-y-2 pt-2">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
          Kartu Kredit & Gerai Retail
        </span>
        <div className="space-y-2">
          {CHANNELS.filter(
            (c) => c.category === 'card' || c.category === 'gerai'
          ).map((channel) => {
            const isSelected = selectedMetode === channel.id;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => onSelect(channel.id)}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer',
                  isSelected
                    ? 'border-secondary bg-blue-50/60 ring-2 ring-secondary/20 shadow-xs'
                    : 'border-border/80 bg-white hover:border-secondary/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-border/70 flex items-center justify-center shrink-0">
                    {channel.icon}
                  </div>
                  <span className="text-xs font-bold text-primary">
                    {channel.name}
                  </span>
                </div>

                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                    isSelected
                      ? 'border-secondary bg-secondary'
                      : 'border-slate-300 bg-white'
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
