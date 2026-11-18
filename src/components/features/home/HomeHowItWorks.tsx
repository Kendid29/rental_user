'use client';

import React from 'react';

export function HomeHowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-primary-dark text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mb-10">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Cara Sewa Mudah
          </span>
          <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-extrabold text-white mt-1.5">
            Mulai Perjalanan Anda dalam 3 Langkah
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-cyan-300 font-extrabold text-lg flex items-center justify-center border border-white/20">
              1
            </div>
            <h4 className="font-bold text-base text-white">Pilih Kendaraan & Jadwal</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tentukan kota, jenis mobil/motor, dan rentang tanggal sewa yang sesuai dengan rencana Anda.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-cyan-300 font-extrabold text-lg flex items-center justify-center border border-white/20">
              2
            </div>
            <h4 className="font-bold text-base text-white">Isi Data & Konfirmasi WA</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lengkapi identitas penyewa dan lanjutkan ke WhatsApp resmi admin untuk verifikasi cepat.
            </p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-cyan-300 font-extrabold text-lg flex items-center justify-center border border-white/20">
              3
            </div>
            <h4 className="font-bold text-base text-white">Serah Terima Kunci</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kendaraan siap diantarkan ke stasiun, bandara, hotel, atau diambil di garasi mitra terdekat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
