'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: (SelectOption | string)[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  cue?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function Select({
  options,
  value,
  onChange,
  label,
  cue,
  placeholder = 'Pilih salah satu...',
  leftIcon,
  error,
  helperText,
  size = 'md',
  fullWidth = true,
  disabled = false,
  className,
  triggerClassName,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();

  // Normalize options to SelectOption objects
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const sizeClasses = {
    sm: 'h-9 px-3 text-xs rounded-xl',
    md: 'h-11.5 px-3.5 text-xs sm:text-sm rounded-xl',
    lg: 'h-13 px-4 text-sm sm:text-base rounded-2xl',
  };

  const borderClass = error
    ? 'border-urgency ring-1 ring-urgency/20 text-urgency'
    : isOpen
    ? 'border-secondary ring-3 ring-secondary/15'
    : 'border-border hover:border-slate-300';

  return (
    <div
      ref={containerRef}
      className={cn('relative', fullWidth ? 'w-full' : 'inline-block', className)}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={generatedId}
          className="text-xs font-semibold text-primary block mb-1.5 select-none"
        >
          {label}
          {cue && (
            <span className="ml-1 text-[11px] font-normal text-text-muted">
              {cue}
            </span>
          )}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={generatedId}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'w-full bg-slate-50/80 hover:bg-slate-100/70 border text-text-main font-bold flex items-center justify-between gap-2.5 transition-all duration-150 cursor-pointer shadow-2xs select-none',
          'disabled:bg-slate-100 disabled:text-text-muted disabled:cursor-not-allowed disabled:hover:bg-slate-100',
          sizeClasses[size],
          borderClass,
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {leftIcon && (
            <span className="text-secondary shrink-0 flex items-center">
              {leftIcon}
            </span>
          )}

          {selectedOption ? (
            <span className="truncate flex items-center gap-2 text-primary font-bold">
              {selectedOption.icon && (
                <span className="shrink-0">{selectedOption.icon}</span>
              )}
              <span className="truncate">{selectedOption.label}</span>
            </span>
          ) : (
            <span className="truncate text-text-muted font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
            isOpen ? 'rotate-180 text-secondary' : ''
          )}
        />
      </button>

      {/* Custom Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-50 mt-1.5 bg-white border border-border/90 rounded-2xl shadow-xl overflow-hidden p-1.5 max-h-64 overflow-y-auto scrollbar-thin"
            role="listbox"
          >
            {normalizedOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-text-muted font-medium">
                Tidak ada pilihan tersedia
              </div>
            ) : (
              normalizedOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left select-none',
                      isSelected
                        ? 'bg-blue-50 text-secondary font-bold'
                        : 'text-slate-700 hover:text-primary hover:bg-slate-50',
                      option.disabled &&
                        'opacity-40 cursor-not-allowed hover:bg-transparent'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {option.icon && (
                        <span className="shrink-0">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {option.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {option.badge}
                        </span>
                      )}

                      {isSelected && (
                        <Check className="w-4 h-4 text-secondary stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error / Helper text */}
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
