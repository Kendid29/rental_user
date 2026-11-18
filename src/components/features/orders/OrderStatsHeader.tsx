'use client';

import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  CheckCheck,
  ChevronRight,
} from 'lucide-react';
import { Pesanan, StatusPesanan } from '@/types';
import { cn } from '@/lib/utils';

export interface OrderStatsHeaderProps {
  pesanans: Pesanan[];
  selectedStatus: StatusPesanan | 'semua';
  onSelectStatus: (status: StatusPesanan | 'semua') => void;
}

export function OrderStatsHeader({
  pesanans,
  selectedStatus,
  onSelectStatus,
}: OrderStatsHeaderProps) {
  const totalCount = pesanans.length;
  const menungguCount = pesanans.filter(
    (p) => p.status === 'menunggu_pembayaran'
  ).length;
  const terkonfirmasiCount = pesanans.filter(
    (p) => p.status === 'terkonfirmasi'
  ).length;
  const selesaiCount = pesanans.filter(
    (p) => p.status === 'selesai'
  ).length;

  const statCards = [
    {
      id: 'semua' as const,
      label: 'Semua Pesanan',
      count: totalCount,
      icon: <FileText className="w-5 h-5 text-secondary" />,
      colorClass: 'text-secondary',
      bgClass: 'bg-blue-50/80',
      activeRing: 'ring-2 ring-secondary/80 bg-blue-50/30 shadow-sm',
    },
    {
      id: 'menunggu_pembayaran' as const,
      label: 'Menunggu Konfirmasi',
      count: menungguCount,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50/80',
      activeRing: 'ring-2 ring-amber-500 bg-amber-50/30 shadow-sm',
    },
    {
      id: 'terkonfirmasi' as const,
      label: 'Aktif / Terkonfirmasi',
      count: terkonfirmasiCount,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50/80',
      activeRing: 'ring-2 ring-emerald-500 bg-emerald-50/30 shadow-sm',
    },
    {
      id: 'selesai' as const,
      label: 'Selesai & Riwayat',
      count: selesaiCount,
      icon: <CheckCheck className="w-5 h-5 text-indigo-600" />,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50/80',
      activeRing: 'ring-2 ring-indigo-500 bg-indigo-50/30 shadow-sm',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {statCards.map((stat) => {
        const isSelected = selectedStatus === stat.id;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => onSelectStatus(stat.id)}
            className={cn(
              'group relative text-left p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer overflow-hidden',
              isSelected
                ? `${stat.activeRing} border-transparent`
                : 'bg-white border-border/80 hover:border-slate-300 hover:shadow-xs'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105',
                  stat.bgClass
                )}
              >
                {stat.icon}
              </div>

              <span
                className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full border transition-opacity flex items-center gap-0.5',
                  isSelected
                    ? 'opacity-100 bg-white border-slate-200 text-slate-700'
                    : 'opacity-0 group-hover:opacity-100 bg-slate-50 border-slate-200 text-slate-500'
                )}
              >
                <span>Filter</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-headline)] text-primary tnum block">
                {stat.count}
              </span>
              <p className="text-xs font-semibold text-text-muted truncate">
                {stat.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
