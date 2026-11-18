'use client';

import React from 'react';
import { StatusPesanan } from '@/types';
import { cn } from '@/lib/utils';

export interface OrderStatusTabItem {
  label: string;
  value: StatusPesanan | 'semua';
}

export const ORDER_STATUS_TABS: OrderStatusTabItem[] = [
  { label: 'Semua Status', value: 'semua' },
  { label: 'Menunggu Konfirmasi', value: 'menunggu_pembayaran' },
  { label: 'Terkonfirmasi', value: 'terkonfirmasi' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

export interface OrderStatusTabsProps {
  selectedStatus: StatusPesanan | 'semua';
  onSelectStatus: (status: StatusPesanan | 'semua') => void;
}

export function OrderStatusTabs({
  selectedStatus,
  onSelectStatus,
}: OrderStatusTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60">
      {ORDER_STATUS_TABS.map((tab) => {
        const isActive = selectedStatus === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onSelectStatus(tab.value)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none',
              isActive
                ? 'bg-secondary text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-primary hover:bg-slate-100 border border-border/80'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
