import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-200/80 rounded-xl',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent',
        className
      )}
      {...props}
    />
  );
};
