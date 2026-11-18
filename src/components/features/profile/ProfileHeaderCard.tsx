'use client';

import React from 'react';
import { User, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export interface ProfileHeaderCardProps {
  nama: string;
  email: string;
  nomorWA: string;
}

export function ProfileHeaderCard({ nama, email, nomorWA }: ProfileHeaderCardProps) {
  const initial = nama ? nama.charAt(0).toUpperCase() : 'U';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white p-6 sm:p-8 border border-white/10 shadow-xl">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-tertiary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Large Avatar */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-secondary to-blue-400 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {initial}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-primary flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-white tracking-tight">
                {nama || 'Pengguna RentalinAja'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Terverifikasi</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{email || '-'}</span>
              </span>
              {nomorWA && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{nomorWA}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
