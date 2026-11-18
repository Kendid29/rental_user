'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className,
}) => {
  return (
    <div
      className={cn(
        'inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-border/80 max-w-full overflow-x-auto',
        className
      )}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold',
              'transition-colors duration-150 cursor-pointer select-none whitespace-nowrap z-10',
              isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadge"
                className="absolute inset-0 bg-white rounded-xl shadow-xs border border-border/60 -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              />
            )}

            {tab.icon && <span className="shrink-0">{tab.icon}</span>}

            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={cn(
                  'ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold',
                  isActive
                    ? 'bg-blue-50 text-secondary'
                    : 'bg-slate-200 text-text-muted'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
