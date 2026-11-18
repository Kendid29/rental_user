'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight, MessageSquareQuote } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { testimoniList, testimoniSectionContent } from '@/content/testimoni';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface ReviewHighlightProps {
  className?: string;
  maxItems?: number;
}

export const ReviewHighlight: React.FC<ReviewHighlightProps> = ({
  className,
  maxItems = 3,
}) => {
  const previewList = testimoniList.slice(0, maxItems);

  return (
    <section
      className={cn(
        'py-14 sm:py-20 bg-slate-50/80 border-y border-border/80 relative overflow-hidden',
        className
      )}
    >
      {/* Ambient background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-secondary text-xs font-bold select-none">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>{testimoniSectionContent.badge}</span>
            </div>

            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
              {testimoniSectionContent.heading}
            </h2>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {testimoniSectionContent.deskripsi}
            </p>
          </div>

          <Link href="/reviews" className="hidden sm:inline-flex shrink-0">
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lihat Semua Ulasan
            </Button>
          </Link>
        </div>

        {/* 3 Review Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewList.map((testimoni) => (
            <div key={testimoni.id} className="flex flex-col h-full">
              <ReviewCard testimoni={testimoni} />
            </div>
          ))}
        </div>

        {/* Mobile View All CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/reviews" className="w-full inline-block">
            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lihat Seluruh Ulasan ({testimoniList.length})
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
