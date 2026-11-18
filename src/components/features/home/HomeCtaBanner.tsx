'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HomeCtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-secondary to-indigo-700 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold">
            Butuh Rekomendasi atau Sewa Khusus?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Konsultasikan rencana sewa rombongan, sewa bulanan, atau drop off luar kota langsung dengan customer care resmi RentalinAja.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              className="text-primary font-bold shadow-md hover:bg-white"
              leftIcon={<PhoneCall className="w-4 h-4 text-emerald-600" />}
            >
              Chat WhatsApp Admin
            </Button>
          </a>

          <Link href="/fleet/cars">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              className="text-white border-white/60 hover:bg-white/15"
            >
              Lihat Semua Mobil
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
