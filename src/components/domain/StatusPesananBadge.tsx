import React from 'react';
import { StatusPesanan } from '@/types';
import { Badge } from '../ui/Badge';

export interface StatusPesananBadgeProps {
  status: StatusPesanan;
  className?: string;
}

export const StatusPesananBadge: React.FC<StatusPesananBadgeProps> = ({
  status,
  className = '',
}) => {
  switch (status) {
    case 'menunggu_pembayaran':
      return (
        <Badge
          variant="rating"
          className={className}
          icon={
            <svg className="w-3.5 h-3.5 fill-[#FFB800]" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          Menunggu Konfirmasi
        </Badge>
      );
    case 'terkonfirmasi':
      return (
        <Badge variant="verified" className={className}>
          Terkonfirmasi
        </Badge>
      );
    case 'dibatalkan':
      return (
        <Badge variant="urgency" className={className}>
          Dibatalkan
        </Badge>
      );
    case 'selesai':
      return (
        <Badge variant="neutral" className={className}>
          Selesai
        </Badge>
      );
    default:
      return <Badge variant="neutral" className={className}>{status}</Badge>;
  }
};
