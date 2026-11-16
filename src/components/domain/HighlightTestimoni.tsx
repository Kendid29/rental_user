'use client';

import React from 'react';
import Link from 'next/link';
import { CardTestimoni } from './CardTestimoni';
import { testimoniList, testimoniSectionContent } from '@/content/testimoni';
import { Button } from '../ui/Button';

export interface HighlightTestimoniProps {
  className?: string;
  maxItems?: number;
}

export const HighlightTestimoni: React.FC<HighlightTestimoniProps> = ({
  className = '',
  maxItems = 3,
}) => {
  const previewList = testimoniList.slice(0, maxItems);

  return (
    <section
      className={`py-12 sm:py-16 bg-slate-50 border-y border-border relative overflow-hidden ${className}`}
    >
      {/* Subtle ambient light accents matching design system */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-semibold select-none">
              <svg
                className="w-3.5 h-3.5 text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              {testimoniSectionContent.badge}
            </div>

            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
              {testimoniSectionContent.heading}
            </h2>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {testimoniSectionContent.deskripsi}
            </p>
          </div>

          <Link href="/testimoni" className="hidden sm:inline-flex shrink-0">
            <Button
              variant="secondary"
              size="md"
              className="font-bold shadow-sm hover:border-secondary/40 text-xs sm:text-sm"
              rightIcon={
                <svg
                  className="w-4 h-4 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              }
            >
              Lihat Semua Testimoni ({testimoniList.length})
            </Button>
          </Link>
        </div>

        {/* 3 Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewList.map((testimoni) => (
            <div key={testimoni.id} className="h-full flex flex-col">
              <CardTestimoni testimoni={testimoni} />
            </div>
          ))}
        </div>

        {/* Bottom CTA for Mobile */}
        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/testimoni" className="w-full">
            <Button
              variant="secondary"
              size="md"
              fullWidth
              className="font-bold shadow-sm hover:border-secondary/40 text-xs"
              rightIcon={
                <svg
                  className="w-4 h-4 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              }
            >
              Lihat Semua Testimoni ({testimoniList.length})
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

