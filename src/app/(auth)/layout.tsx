'use client';

import React from 'react';
import Link from 'next/link';
import { Car, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 relative overflow-hidden">
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-40 w-[600px] h-[600px] bg-secondary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-32 -mb-32 w-80 h-80 bg-tertiary/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation - Consistent on both Login and Register */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <span className="font-[family-name:var(--font-headline)] text-xl font-black text-primary tracking-tight block leading-tight">
              Rentalin<span className="text-secondary">Aja</span>
            </span>
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase block">
              Marketplace Rental Terpadu
            </span>
          </div>
        </Link>

        {/* Modern Glass Pill Back-to-Home Button */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:shadow-sm text-xs font-bold text-slate-600 hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Centered Auth Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
        {children}
      </main>

      {/* Clean minimal spacer (Removed verbose SSL footer as requested) */}
      <div className="h-6" />
    </div>
  );
}
