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

export interface PilihanMetodeBayarProps {
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
    icon: <Wallet className="w-4 h-4 text-sky-500" />,
  },
  {
    id: 'dana',
    name: 'DANA',
    category: 'ewallet',
    icon: <Wallet className="w-4 h-4 text-sky-500" />,
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay',
    category: 'ewallet',
    icon: <Wallet className="w-4 h-4 text-orange-500" />,
  },
  {
    id: 'kartu_kredit',
    name: 'Kartu Kredit / Debit Online',
    category: 'card',
    icon: <CreditCard className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'indomaret',
    name: 'Gerai Indomaret',
    category: 'gerai',
    icon: <Store className="w-4 h-4 text-red-500" />,
  },
  {
    id: 'alfamart',
    name: 'Gerai Alfamart',
    category: 'gerai',
    icon: <Store className="w-4 h-4 text-red-500" />,
  },
];

export const PilihanMetodeBayar: React.FC<PilihanMetodeBayarProps> = ({
  selectedMetode,
  onSelect,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-primary block">
          Pilih Jalur Pembayaran
        </label>
        <span className="text-[11px] text-text-muted">
          Dikonfirmasi via WhatsApp Admin
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CHANNELS.map((ch) => {
          const isSelected = selectedMetode === ch.id;

          return (
            <div
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={cn(
                'p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between select-none',
                isSelected
                  ? 'border-secondary bg-blue-50/50 ring-2 ring-secondary/20 shadow-xs'
                  : 'border-border/80 bg-white hover:border-slate-300 hover:bg-slate-50/70'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Radio checkmark circle */}
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors',
                    isSelected
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-slate-300 bg-white'
                  )}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100/80 flex items-center justify-center shrink-0">
                    {ch.icon}
                  </div>
                  <span className="text-xs font-bold text-primary truncate">
                    {ch.name}
                  </span>
                </div>
              </div>

              {ch.badge && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                  {ch.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
