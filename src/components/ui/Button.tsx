'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center font-bold tracking-tight select-none',
    'rounded-xl transition-all duration-200 cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
    'active:scale-[0.98]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-secondary text-white shadow-sm hover:bg-secondary-hover',
          'focus-visible:ring-secondary shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25',
        ],
        secondary: [
          'bg-white text-primary border border-border shadow-xs',
          'hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-300',
        ],
        tertiary: [
          'bg-transparent text-secondary hover:bg-blue-50/70 p-0 hover:underline',
          'focus-visible:ring-secondary',
        ],
        outline: [
          'bg-transparent text-secondary border border-secondary/40',
          'hover:bg-secondary/5 hover:border-secondary focus-visible:ring-secondary',
        ],
        danger: [
          'bg-urgency text-white shadow-sm hover:bg-red-600',
          'focus-visible:ring-urgency shadow-red-500/20',
        ],
        ghost: [
          'bg-transparent text-text-main hover:bg-slate-100/80 hover:text-primary',
          'focus-visible:ring-slate-300',
        ],
        dark: [
          'bg-primary text-white hover:bg-primary-dark shadow-sm',
          'focus-visible:ring-primary shadow-slate-900/20',
        ],
      },
      size: {
        sm: 'text-xs px-3 py-1.5 gap-1.5 h-8.5 rounded-lg',
        md: 'text-sm px-4.5 py-2.5 gap-2 h-11 rounded-xl',
        lg: 'text-base px-6 py-3.5 gap-2.5 h-13 rounded-2xl',
        icon: 'h-10 w-10 p-0 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            className,
          })
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-current shrink-0 -ml-0.5" />
        )}

        {!isLoading && leftIcon && (
          <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}

        <span>{children}</span>

        {!isLoading && rightIcon && (
          <span className="shrink-0 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
