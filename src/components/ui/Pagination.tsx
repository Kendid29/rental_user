import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className={cn('flex items-center justify-center gap-2 py-6', className)}
      aria-label="Paginasi Halaman"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Sebelumnya
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                'w-9 h-9 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer select-none',
                isCurrent
                  ? 'bg-secondary text-white shadow-sm shadow-blue-500/25 scale-105'
                  : 'text-text-main bg-white hover:bg-slate-100 border border-border/80'
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Selanjutnya
      </Button>
    </nav>
  );
};
