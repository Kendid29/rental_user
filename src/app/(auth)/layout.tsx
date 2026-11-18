import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Car, ShieldCheck } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Car className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <span className="font-[family-name:var(--font-headline)] text-lg sm:text-xl font-black text-primary tracking-tight block leading-tight">
              Rentalin<span className="text-secondary">Aja</span>
            </span>
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase block">
              Marketplace Terpadu
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-primary transition-colors py-2 px-3 rounded-xl hover:bg-slate-200/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* Content Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-10">
        {children}
      </main>

      {/* Bottom Trust & Security Banner */}
      <footer className="relative z-10 py-6 text-center text-xs text-text-muted border-t border-border/60 bg-white/60 backdrop-blur-xs">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Keamanan Terjamin • Enkripsi End-to-End SSL 256-bit</span>
        </div>
      </footer>
    </div>
  );
}
