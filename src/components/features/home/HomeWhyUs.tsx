'use client';

import React from 'react';
import {
  ShieldCheck,
  BadgePercent,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export function HomeWhyUs() {
  const PILLARS = [
    {
      title: 'Mitra Resmi Terverifikasi',
      tag: 'Aman & Berizin',
      desc: 'Bekerja sama dengan 50+ mitra rental resmi berizin di berbagai kota. Setiap unit wajib lolos uji fisik, kelengkapan surat STNK, dan kebersihan.',
      icon: <ShieldCheck className="w-6 h-6 text-secondary" />,
      boxBg: 'bg-blue-50 border-blue-200/60',
      tagBg: 'bg-blue-100 text-secondary',
    },
    {
      title: 'Harga Jujur & Pasti',
      tag: 'Tanpa Biaya Siluman',
      desc: 'Tarif sewa transparan sejak awal pencarian. Apa yang tertera pada rincian pesanan adalah nominal final yang Anda bayarkan tanpa biaya tak terduga.',
      icon: <BadgePercent className="w-6 h-6 text-emerald-600" />,
      boxBg: 'bg-emerald-50 border-emerald-200/60',
      tagBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Antar Jemput Lokasi Fleksibel',
      tag: 'Praktis & Tepat Waktu',
      desc: 'Mobil atau motor diantar langsung ke titik kedatangan Anda: Bandara, Stasiun Kereta, Terminal, maupun Hotel tempat Anda menginap.',
      icon: <MapPin className="w-6 h-6 text-purple-600" />,
      boxBg: 'bg-purple-50 border-purple-200/60',
      tagBg: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Dukungan Siaga 24 Jam',
      tag: 'Roadside Assistance',
      desc: 'Koordinasi langsung dengan PIC resmi via WhatsApp. Tim darurat kami siap mendampingi dan menyediakan unit pengganti bila ada kendala teknis.',
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      boxBg: 'bg-amber-50 border-amber-200/60',
      tagBg: 'bg-amber-100 text-amber-800',
    },
  ];

  const TRUST_ITEMS = [
    'Unit Bersih, Harum & Terawat',
    'Syarat Sewa Mudah & Jelas',
    'Garansi Unit Pengganti Cepat',
    'Respon WhatsApp Siaga 24 Jam',
  ];

  return (
    <section className="bg-gradient-to-b from-slate-50/70 via-white to-slate-50/70 border-y border-border/80 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Standar Keamanan & Kenyamanan</span>
          </div>

          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-primary tracking-tight">
            Mengapa Memilih RentalinAja?
          </h2>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Kami menghadirkan pengalaman sewa kendaraan yang aman, transparan, dan terstandarisasi untuk liburan keluarga maupun perjalanan bisnis.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl ${pillar.boxBg} border flex items-center justify-center font-bold transition-transform group-hover:scale-105 duration-200`}
                  >
                    {pillar.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${pillar.tagBg}`}
                  >
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="font-bold text-primary text-base group-hover:text-secondary transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs text-text-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Guarantee Checklist Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-border/80 shadow-xs max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold text-primary">
            {TRUST_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
