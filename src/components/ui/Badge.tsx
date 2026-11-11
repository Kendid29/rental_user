import React from 'react';

export interface BadgeProps {
  variant?: 'verified' | 'rating' | 'urgency' | 'info' | 'neutral' | 'superPartner';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const variantStyles = {
    verified: 'bg-[#E6F9F3] text-[#00875A] border border-[#00C48C]/30',
    superPartner: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold',
    rating: 'bg-[#FFF9E6] text-[#B27B00] border border-[#FFB800]/30 font-semibold',
    urgency: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FF4D4D]/30 font-semibold',
    info: 'bg-blue-50 text-secondary border border-blue-200/50',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tracking-tight shrink-0 select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {!icon && variant === 'rating' && (
        <svg className="w-3.5 h-3.5 fill-[#FFB800] shrink-0" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {!icon && variant === 'verified' && (
        <svg className="w-3.5 h-3.5 text-[#00875A] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      )}
      <span>{children}</span>
    </span>
  );
};
