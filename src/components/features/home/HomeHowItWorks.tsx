'use client';

import React from 'react';
import { Search, MessageSquare, KeyRound, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export function HomeHowItWorks() {
  const STEPS = [
    {
      num: '01',
      title: 'Cari & Pilih Kendaraan',
      desc: 'Tentukan kota tujuan, tanggal sewa, dan pilih unit mobil atau motor sesuai kapasitas, transmisi, dan kebutuhan Anda.',
      icon: <Search className="w-5 h-5 text-cyan-300" />,
      badge: 'Langkah Pertama',
    },
    {
      num: '02',
      title: 'Isi Data & Konfirmasi WA',
      desc: 'Lengkapi identitas penyewa di web secara instan. Admin mitra resmi akan segera menghubungi via WhatsApp untuk validasi unit.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-300" />,
      badge: 'Rata-rata 3 Menit',
    },
    {
      num: '03',
      title: 'Serah Terima & Berangkat',
      desc: 'Unit diantarkan ke bandara, stasiun, hotel Anda atau diambil di pool mitra. Cek fisik sebentar, serahkan kunci, dan nikmati perjalanan!',
      icon: <KeyRound className="w-5 h-5 text-amber-300" />,
      badge: 'Siap Jalan',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-primary-dark text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Ambient Decorative Glows */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-bold backdrop-blur-md">
              <Zap className="w-3.5 h-3.5" />
              <span>Sederhana & Cepat</span>
            </div>

            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Mulai Perjalanan Anda dalam 3 Langkah
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tanpa prosedur berbelit, tanpa deposit uang tunai mencurigakan. Seluruh proses sewa terintegrasi dengan koordinasi WhatsApp yang transparan.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 self-start md:self-end">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Estimasi Waktu: <strong className="text-white">~5 Menit</strong></span>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4 hover:bg-white/10 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold">
                    {step.icon}
                  </div>
                  <span className="font-[family-name:var(--font-headline)] text-2xl font-black text-white/30">
                    {step.num}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block mb-1">
                    {step.badge}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex items-center gap-1 text-[11px] text-cyan-300/80 pt-2 border-t border-white/10">
                  <span>Lanjut ke langkah berikutnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
