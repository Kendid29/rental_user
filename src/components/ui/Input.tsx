import React, { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  cue?: string; // e.g. "(Sesuai KTP)"
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      cue,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    const borderClass = error
      ? 'border-urgency focus:border-urgency focus:ring-urgency/20 text-urgency'
      : 'border-border hover:border-slate-300 focus:border-secondary focus:ring-secondary/15';

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="text-xs font-semibold text-primary block select-none"
            >
              {label}
              {cue && (
                <span className="ml-1 text-[11px] font-normal text-text-muted">
                  {cue}
                </span>
              )}
            </label>
          </div>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full h-11.5 bg-white text-sm text-text-main rounded-xl border px-3.5 transition-all duration-150',
              'placeholder:text-text-muted/60 focus:outline-none focus:ring-3 shadow-2xs',
              'disabled:bg-slate-50 disabled:text-text-muted disabled:cursor-not-allowed',
              leftIcon ? 'pl-10.5' : '',
              rightIcon ? 'pr-10.5' : '',
              borderClass,
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-text-muted flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-urgency flex items-center gap-1.5 font-medium mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p className="text-[11px] text-text-muted mt-1 leading-normal">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
