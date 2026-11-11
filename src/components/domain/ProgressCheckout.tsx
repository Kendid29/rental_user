import React from 'react';

export interface ProgressCheckoutProps {
  currentStep: 1 | 2 | 3;
  className?: string;
}

const STEPS = [
  { id: 1, label: 'Detail Kendaraan' },
  { id: 2, label: 'Checkout & Pembayaran' },
  { id: 3, label: 'Selesai' },
];

export const ProgressCheckout: React.FC<ProgressCheckoutProps> = ({
  currentStep,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-2xl mx-auto py-4 sm:py-6 ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-8 right-8 top-4 -translate-y-1/2 h-0.5 bg-border -z-0" />

        {/* Active Progress Line */}
        <div
          className="absolute left-8 top-4 -translate-y-1/2 h-0.5 bg-secondary transition-all duration-300 -z-0"
          style={{
            width:
              currentStep === 1
                ? '0%'
                : currentStep === 2
                ? '50%'
                : 'calc(100% - 4rem)',
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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-tertiary text-white shadow-sm'
                    : isActive
                    ? 'bg-secondary text-white shadow-md ring-4 ring-secondary/20'
                    : 'bg-white text-text-muted border-2 border-border'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center whitespace-nowrap ${
                  isActive
                    ? 'text-primary'
                    : isCompleted
                    ? 'text-tertiary-dark font-medium'
                    : 'text-text-muted font-normal'
                }`}
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
