import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  level?: 1 | 2 | 3;
  interactive?: boolean;
  active?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  level = 1,
  interactive = false,
  active = false,
  padding = 'md',
  className = '',
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

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-secondary/40 hover:elevation-2 transition-all duration-200'
    : '';

  const activeStyles = active ? 'border-secondary ring-2 ring-secondary/20 elevation-2' : '';

  return (
    <div
      className={`rounded-2xl transition-all ${levelStyles[level]} ${paddingStyles[padding]} ${interactiveStyles} ${activeStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
