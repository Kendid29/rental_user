'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, Car, CheckCircle2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HomeCtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-secondary to-indigo-800 p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border border-white/20">
        {/* Ambient Glows */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-xs font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Customer Care Standby 24/7 Siap Membantu</span>
            </div>

            <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Butuh Rekomendasi Unit atau Sewa Khusus Rombongan?
            </h3>

            <p className="text-xs sm:text-base text-blue-100 leading-relaxed max-w-xl">
              Konsultasikan rencana sewa HiAce/Elf, rental korporat bulanan, maupun antar-jemput luar kota langsung dengan admin resmi kami.
            </p>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Respon Cepat &lt; 5 Menit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Bebas Konsultasi Kebutuhan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Jaminan Unit Pengganti
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20RentalinAja,%20saya%20ingin%20konsultasi%20sewa%20kendaraan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full sm:w-auto"
            >
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                className="bg-white text-primary hover:bg-slate-100 font-black shadow-lg"
                leftIcon={<MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />}
              >
                Chat WhatsApp Admin
              </Button>
            </a>

            <Link href="/fleet/cars" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="text-white border-white/40 hover:bg-white/10 font-bold"
                leftIcon={<Car className="w-4 h-4" />}
              >
                Jelajahi Semua Kendaraan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
