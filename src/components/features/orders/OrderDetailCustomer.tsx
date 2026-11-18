'use client';

import React from 'react';
import { User } from 'lucide-react';
import { Pesanan } from '@/types';
import { Card } from '@/components/ui/Card';

export interface OrderDetailCustomerProps {
  pesanan: Pesanan;
}

export function OrderDetailCustomer({ pesanan }: OrderDetailCustomerProps) {
  return (
    <Card level={1} padding="md" className="space-y-4 rounded-3xl shadow-xs">
      <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
        <User className="w-3.5 h-3.5 text-secondary" />
        <span>Data Identitas Penyewa</span>
      </h3>

      <div className="space-y-3 text-xs">
        <div>
          <span className="text-text-muted block">Nama Pemesan:</span>
          <span className="font-bold text-primary text-sm">
            {pesanan.namaPenyewa}
          </span>
        </div>

        <div>
          <span className="text-text-muted block">Nomor WhatsApp:</span>
          <span className="font-bold text-primary font-mono">
            {pesanan.nomorWAPenyewa}
          </span>
        </div>

        <div>
          <span className="text-text-muted block">Metode Pembayaran:</span>
          <span className="font-bold text-primary uppercase">
            {pesanan.metodePembayaran}
          </span>
        </div>

        {pesanan.pesanUntukOrangLain && pesanan.pemesanLain && (
          <div className="pt-2 border-t border-border/70 space-y-1">
            <span className="text-[10px] font-bold text-secondary uppercase block">
              Penerima Unit / Driver:
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
