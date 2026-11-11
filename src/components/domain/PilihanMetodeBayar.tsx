import React from 'react';
import { MetodePembayaran } from '@/types';

export interface PilihanMetodeBayarProps {
  selectedMetode: MetodePembayaran;
  onSelect: (metode: MetodePembayaran) => void;
  className?: string;
}

interface ChannelOption {
  id: MetodePembayaran;
  name: string;
  category: 'va' | 'instant' | 'ewallet' | 'gerai' | 'card';
  badge?: string;
}

const CHANNELS: ChannelOption[] = [
  { id: 'qris', name: 'QRIS (Gopay, OVO, Dana, BCA)', category: 'instant', badge: 'Otomatis' },
  { id: 'va_bca', name: 'BCA Virtual Account', category: 'va' },
  { id: 'va_mandiri', name: 'Mandiri Virtual Account', category: 'va' },
  { id: 'va_bri', name: 'BRI Virtual Account', category: 'va' },
  { id: 'va_bni', name: 'BNI Virtual Account', category: 'va' },
  { id: 'gopay', name: 'GoPay', category: 'ewallet' },
  { id: 'ovo', name: 'OVO', category: 'ewallet' },
  { id: 'dana', name: 'DANA', category: 'ewallet' },
  { id: 'shopeepay', name: 'ShopeePay', category: 'ewallet' },
  { id: 'kartu_kredit', name: 'Kartu Kredit / Debit Online', category: 'card' },
  { id: 'indomaret', name: 'Indomaret', category: 'gerai' },
  { id: 'alfamart', name: 'Alfamart', category: 'gerai' },
];

export const PilihanMetodeBayar: React.FC<PilihanMetodeBayarProps> = ({
  selectedMetode,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-xs font-bold text-primary block">
        Pilih Metode Pembayaran
        <span className="ml-1 text-[11px] font-normal text-text-muted">
          (Akan dikonfirmasi dengan Admin via WhatsApp)
        </span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CHANNELS.map((ch) => {
          const isSelected = selectedMetode === ch.id;

          return (
            <div
              key={ch.id}
              onClick={() => onSelect(ch.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                isSelected
                  ? 'border-secondary bg-blue-50/40 ring-2 ring-secondary/20 shadow-sm'
                  : 'border-border bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Radio checkmark */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-secondary bg-secondary text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary truncate">
                    {ch.name}
                  </p>
                </div>
              </div>

              {ch.badge && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
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
