import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3;
  interactive?: boolean;
  active?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  level = 1,
  interactive = false,
  active = false,
  glass = false,
  padding = 'md',
  className,
  ...props
}) => {
  const levelStyles = {
    1: 'bg-card border border-border elevation-1',
    2: 'bg-card border border-border elevation-2',
    3: 'bg-card border border-border elevation-3',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const glassStyle = glass
    ? 'bg-white/80 backdrop-blur-md border-white/60 shadow-lg'
    : '';

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-secondary/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200'
    : '';

  const activeStyles = active
    ? 'border-secondary ring-2 ring-secondary/20 shadow-md'
    : '';

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-200',
        levelStyles[level],
        paddingStyles[padding],
        glassStyle,
        interactiveStyles,
        activeStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex flex-col space-y-1.5 pb-4', className)}
    {...props}
  />
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={cn(
      'font-[family-name:var(--font-headline)] text-lg sm:text-xl font-bold tracking-tight text-primary',
      className
    )}
    {...props}
  />
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={cn('text-sm text-text-muted leading-relaxed', className)}
    {...props}
  />
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('pt-0', className)} {...props} />;

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn('flex items-center pt-4 border-t border-border/60', className)}
    {...props}
  />
);
