'use client';

import React, { useState, useRef, useEffect, useId, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatTanggalIndo } from '@/lib/pricing';

export interface DatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (value: string) => void;
  label?: string;
  cue?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  min?: string; // 'YYYY-MM-DD'
  max?: string; // 'YYYY-MM-DD'
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

const BULAN_INDO = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const HARI_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

function formatDateString(year: number, month: number, day: number): string {
  return `${year}-${padZero(month + 1)}-${padZero(day)}`;
}

export function DatePicker({
  value,
  onChange,
  label,
  cue,
  placeholder = 'Pilih tanggal...',
  leftIcon = <CalendarIcon className="w-4 h-4 text-secondary" />,
  min,
  max,
  error,
  helperText,
  size = 'md',
  fullWidth = true,
  disabled = false,
  className,
  triggerClassName,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();

  // Internal view year and month (0-indexed month)
  const initialDate = useMemo(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [value]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  // Update view when value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside listener
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

  // Escape listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Days in current view month calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Empty lead slots before month starts
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: 0, dateStr: '', isCurrentMonth: false });
    }

    // Actual days of the month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      days.push({
        day: d,
        dateStr: formatDateString(viewYear, viewMonth, d),
        isCurrentMonth: true,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const todayStr = useMemo(() => {
    const now = new Date();
    return formatDateString(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const tomorrowStr = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateString(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate()
    );
  }, []);

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
        aria-haspopup="dialog"
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
          {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}

          {value ? (
            <span className="truncate text-primary font-bold">
              {formatTanggalIndo(value)}
            </span>
          ) : (
            <span className="truncate text-text-muted font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {/* Calendar Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 sm:left-auto sm:right-0 z-50 mt-2 w-full sm:w-76 bg-white border border-border/90 rounded-3xl shadow-2xl p-3.5 sm:p-4 space-y-3 select-none"
          >
            {/* Header: Month & Year Navigator */}
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <span className="font-[family-name:var(--font-headline)] font-bold text-sm text-primary">
                {BULAN_INDO[viewMonth]} {viewYear}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Bulan sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Bulan berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day Names Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {HARI_SINGKAT.map((h, i) => (
                <span
                  key={h}
                  className={cn(
                    'text-[10px] font-bold uppercase py-1',
                    i === 0 ? 'text-rose-500' : 'text-slate-400'
                  )}
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((item, idx) => {
                if (!item.isCurrentMonth) {
                  return <div key={`empty-${idx}`} className="h-7.5 w-7.5 sm:h-8 sm:w-8" />;
                }

                const isSelected = item.dateStr === value;
                const isToday = item.dateStr === todayStr;
                const isPast = min ? item.dateStr < min : false;
                const isFutureBlocked = max ? item.dateStr > max : false;
                const isDisabled = isPast || isFutureBlocked;

                return (
                  <button
                    key={item.dateStr}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDay(item.dateStr)}
                    className={cn(
                      'h-7.5 w-7.5 sm:h-8 sm:w-8 mx-auto rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center relative cursor-pointer',
                      isSelected
                        ? 'bg-secondary text-white shadow-xs'
                        : isToday
                        ? 'bg-blue-50 text-secondary border border-blue-200/80 font-black'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-primary',
                      isDisabled &&
                        'text-slate-300 opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-300'
                    )}
                  >
                    <span>{item.day}</span>
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-secondary" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Action Shortcuts */}
            <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectDay(todayStr)}
                  className="px-2 py-1 rounded-lg text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDay(tomorrowStr)}
                  className="px-2 py-1 rounded-lg text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  Besok
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
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
