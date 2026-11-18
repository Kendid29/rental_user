'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Car,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import { StatusPesanan } from '@/types';
import { cn } from '@/lib/utils';

export interface OrderTimelineProps {
  status: StatusPesanan;
  createdAt?: string;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}

export function OrderTimeline({
  status,
  createdAt,
  tanggalMulai,
  tanggalSelesai,
}: OrderTimelineProps) {
  if (status === 'dibatalkan') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-3 w-full min-w-0">
        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 shrink-0" />
        <div className="min-w-0">
          <h4 className="font-bold text-sm text-rose-800">
            Pesanan Ini Telah Dibatalkan
          </h4>
          <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
            Transaksi sewa ini dibatalkan dan unit armada telah dikembalikan ke katalog publik.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      title: 'Pesanan Dibuat',
      desc: 'Tercatat di sistem',
      icon: <CheckCircle2 className="w-4 h-4" />,
      isCompleted: true,
      isCurrent: status === 'menunggu_pembayaran',
    },
    {
      title: 'Konfirmasi Pembayaran',
      desc:
        status === 'menunggu_pembayaran'
          ? 'Menunggu verifikasi'
          : 'Lunas & Terverifikasi',
      icon: <Clock className="w-4 h-4" />,
      isCompleted: status === 'terkonfirmasi' || status === 'selesai',
      isCurrent: status === 'menunggu_pembayaran',
    },
    {
      title: 'Serah Terima Kunci',
      desc: 'Pengambilan armada mitra',
      icon: <Car className="w-4 h-4" />,
      isCompleted: status === 'selesai',
      isCurrent: status === 'terkonfirmasi',
    },
    {
      title: 'Rental Selesai',
      desc: 'Unit dikembalikan',
      icon: <CheckCheck className="w-4 h-4" />,
      isCompleted: status === 'selesai',
      isCurrent: status === 'selesai',
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-border/80 shadow-xs p-4 sm:p-6 space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <h3 className="font-bold text-sm text-primary">
          Status Perjalanan Pesanan
        </h3>
        <span className="text-[11px] sm:text-xs text-text-muted">
          Tahapan Sewa Terkini
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col space-y-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all shrink-0',
                  step.isCompleted
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : step.isCurrent
                    ? 'bg-secondary text-white ring-4 ring-secondary/20 shadow-xs'
                    : 'bg-slate-100 text-slate-400'
                )}
              >
                {step.icon}
              </div>

              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wider',
                  step.isCompleted
                    ? 'text-emerald-700'
                    : step.isCurrent
                    ? 'text-secondary'
                    : 'text-slate-400'
                )}
              >
                Tahap {idx + 1}
              </span>
            </div>

            <div className="min-w-0">
              <p
                className={cn(
                  'text-xs font-bold truncate',
                  step.isCompleted || step.isCurrent
                    ? 'text-primary'
                    : 'text-slate-400'
                )}
              >
                {step.title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-text-muted leading-tight mt-0.5 line-clamp-2">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
