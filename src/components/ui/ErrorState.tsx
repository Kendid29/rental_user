import React from 'react';
import { Button } from './Button';

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
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-red-200/80 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-urgency mb-4">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-muted max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
