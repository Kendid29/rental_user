import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-14 bg-white/70 backdrop-blur-xs',
        'rounded-3xl border border-dashed border-border/80 shadow-2xs',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-secondary mb-4 shadow-xs">
        {icon || <SearchX className="w-8 h-8 stroke-[1.75]" />}
      </div>

      <h3 className="font-[family-name:var(--font-headline)] text-lg sm:text-xl font-bold text-primary mb-1.5 tracking-tight">
        {title}
      </h3>

      <p className="text-sm text-text-muted max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
