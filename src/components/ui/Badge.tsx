import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle2, Star, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-full font-semibold tracking-tight shrink-0 select-none transition-colors border',
  {
    variants: {
      variant: {
        verified: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        superPartner: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs',
        rating: 'bg-amber-50 text-amber-700 border-amber-200/90 font-bold',
        urgency: 'bg-rose-50 text-rose-600 border-rose-200/90 font-bold',
        info: 'bg-blue-50 text-secondary border-blue-200/80',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200',
        outline: 'bg-transparent text-slate-700 border-slate-300',
        primary: 'bg-primary text-white border-primary shadow-xs',
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5 gap-1',
        md: 'text-xs px-2.5 py-1 gap-1.5',
        lg: 'text-sm px-3.5 py-1.5 gap-2',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  icon,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}

      {!icon && variant === 'rating' && (
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      )}

      {!icon && variant === 'verified' && (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      )}

      {!icon && variant === 'superPartner' && (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      )}

      {!icon && variant === 'urgency' && (
        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
      )}

      {!icon && variant === 'info' && (
        <Info className="w-3.5 h-3.5 text-secondary shrink-0" />
      )}

      <span>{children}</span>
    </span>
  );
};
