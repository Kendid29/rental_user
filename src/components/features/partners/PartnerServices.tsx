'use client';

import React from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

export interface PartnerServicesProps {
  layanan: string[];
}

export function PartnerServices({ layanan }: PartnerServicesProps) {
  if (!layanan || layanan.length === 0) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
        <Award className="w-4 h-4 text-secondary" />
        Keunggulan & Fasilitas Layanan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {layanan.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-border shadow-xs hover:border-secondary/30 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-primary">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
