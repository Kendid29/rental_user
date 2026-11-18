import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data dari sistem. Silakan periksa koneksi Anda dan coba lagi.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-rose-200/80 shadow-xs',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-2xs">
        <AlertTriangle className="w-7 h-7 stroke-[2]" />
      </div>

      <h3 className="font-[family-name:var(--font-headline)] text-lg sm:text-xl font-bold text-primary mb-1.5">
        {title}
      </h3>

      <p className="text-sm text-text-muted max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="md"
          leftIcon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
