'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
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
  counts?: Partial<Record<StatusPesanan | 'semua', number>>;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function OrderStatusTabs({
  selectedStatus,
  onSelectStatus,
  counts = {},
  searchQuery = '',
  onSearchChange,
}: OrderStatusTabsProps) {
  return (
    <div className="space-y-4">
      {/* Search & Tabs Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Horizontal Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {ORDER_STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.value;
            const count = counts[tab.value];

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onSelectStatus(tab.value)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none border',
                  isActive
                    ? 'bg-secondary text-white border-secondary shadow-xs'
                    : 'bg-white text-slate-600 hover:text-primary hover:bg-slate-50 border-border/80'
                )}
              >
                <span>{tab.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={cn(
                      'text-[10px] font-black px-1.5 py-0.5 rounded-full tnum',
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Real-time Order Search Input */}
        {onSearchChange && (
          <div className="relative min-w-[260px] sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari ID pesanan atau armada..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-2xl border border-border/80 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                title="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
