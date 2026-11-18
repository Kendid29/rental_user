import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProgressCheckoutProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const STEPS = [
  { id: 1, label: 'Detail Kendaraan' },
  { id: 2, label: 'Checkout & Pembayaran' },
  { id: 3, label: 'Konfirmasi Selesai' },
];

export const ProgressCheckout: React.FC<ProgressCheckoutProps> = ({
  currentStep,
  className,
}) => {
  return (
    <div className={cn('w-full max-w-2xl mx-auto py-4 sm:py-6', className)}>
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-10 right-10 top-4 -translate-y-1/2 h-0.5 bg-border/80 -z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute left-10 top-4 -translate-y-1/2 h-0.5 bg-secondary transition-all duration-300 -z-0"
          style={{
            width:
              currentStep === 1
                ? '0%'
                : currentStep === 2
                ? '50%'
                : 'calc(100% - 5rem)',
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10 select-none"
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-200',
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isActive
                    ? 'bg-secondary text-white shadow-md ring-4 ring-secondary/20 scale-105'
                    : 'bg-white text-text-muted border-2 border-border/80'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={cn(
                  'mt-2 text-xs font-semibold text-center whitespace-nowrap',
                  isActive
                    ? 'text-primary font-bold'
                    : isCompleted
                    ? 'text-emerald-700 font-semibold'
                    : 'text-text-muted font-normal'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
