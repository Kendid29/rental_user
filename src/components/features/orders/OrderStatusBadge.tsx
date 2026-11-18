'use client';

import React from 'react';
import { Clock, CheckCircle2, XCircle, Check } from 'lucide-react';
import { StatusPesanan } from '@/types';
import { Badge } from '@/components/ui/Badge';

export interface OrderStatusBadgeProps {
  status: StatusPesanan;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className,
}) => {
  switch (status) {
    case 'menunggu_pembayaran':
      return (
        <Badge
          variant="rating"
          className={className}
          icon={<Clock className="w-3.5 h-3.5 text-amber-600" />}
        >
          Menunggu Konfirmasi
        </Badge>
      );
    case 'terkonfirmasi':
      return (
        <Badge
          variant="verified"
          className={className}
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        >
          Terkonfirmasi
        </Badge>
      );
    case 'dibatalkan':
      return (
        <Badge
          variant="urgency"
          className={className}
          icon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}
        >
          Dibatalkan
        </Badge>
      );
    case 'selesai':
      return (
        <Badge
          variant="neutral"
          className={className}
          icon={<Check className="w-3.5 h-3.5 text-slate-600" />}
        >
          Selesai
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" className={className}>
          {status}
        </Badge>
      );
  }
};
