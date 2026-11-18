'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Bike, ArrowRight, Layers } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  priceNote: string;
  href: string;
  icon: React.ReactNode;
  tag: string;
  accentBg: string;
  accentBorder: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'city-car',
    name: 'City Car Hemat',
    desc: 'Brio, Agya, Yaris',
    priceNote: 'Mulai Rp 250rb/hr',
    href: '/fleet/cars?search=brio',
    icon: <Car className="w-5 h-5 text-secondary" />,
    tag: 'Paling Laris',
    accentBg: 'group-hover:bg-blue-50/80',
    accentBorder: 'group-hover:border-blue-200',
  },
  {
    id: 'mpv-keluarga',
    name: 'MPV Keluarga',
    desc: 'Avanza, Xpander, Innova',
    priceNote: 'Mulai Rp 350rb/hr',
    href: '/fleet/cars?kapasitas=7',
    icon: <Car className="w-5 h-5 text-sky-600" />,
    tag: '7 Kursi Luas',
    accentBg: 'group-hover:bg-sky-50/80',
    accentBorder: 'group-hover:border-sky-200',
  },
  {
    id: 'suv-premium',
    name: 'SUV & Premium',
    desc: 'Fortuner, Pajero, HR-V',
    priceNote: 'Mulai Rp 650rb/hr',
    href: '/fleet/cars?transmisi=Matic',
    icon: <Car className="w-5 h-5 text-indigo-600" />,
    tag: 'Executive Class',
    accentBg: 'group-hover:bg-indigo-50/80',
    accentBorder: 'group-hover:border-indigo-200',
  },
  {
    id: 'motor-matic',
    name: 'Matic Harian',
    desc: 'Beat, Scoopy, Vario',
    priceNote: 'Mulai Rp 75rb/hr',
    href: '/fleet/bikes?transmisi=Matic',
    icon: <Bike className="w-5 h-5 text-emerald-600" />,
    tag: 'Super Irit',
    accentBg: 'group-hover:bg-emerald-50/80',
    accentBorder: 'group-hover:border-emerald-200',
  },
  {
    id: 'maxi-scooter',
    name: 'Maxi Touring',
    desc: 'NMAX, PCX, Aerox',
    priceNote: 'Mulai Rp 120rb/hr',
    href: '/fleet/bikes?search=nmax',
    icon: <Bike className="w-5 h-5 text-amber-600" />,
    tag: 'Nyaman Jauh',
    accentBg: 'group-hover:bg-amber-50/80',
    accentBorder: 'group-hover:border-amber-200',
  },
];

export function HomeCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Kategori Terfavorit</span>
          </div>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl lg:text-4xl font-black text-primary tracking-tight">
            Pilihan Kendaraan Sesuai Kebutuhan
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-xl">
            Dari city car hemat untuk keliling kota hingga SUV nyaman dan motor matic lincah untuk liburan Anda.
          </p>
        </div>

        <Link
          href="/fleet/cars"
          className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 self-start sm:self-end shrink-0"
        >
          <span>Jelajahi Semua Model</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Categories Grid (2 col on mobile, 3 on tablet, 5 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {DEFAULT_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className={`group bg-white p-4 sm:p-5 rounded-3xl border border-border/80 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Top Tag & Icon */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-50 border border-border/60 flex items-center justify-center transition-colors shadow-xs group-hover:scale-105 duration-200">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-secondary transition-colors truncate max-w-[100px]">
                  {cat.tag}
                </span>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-primary group-hover:text-secondary transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{cat.desc}</p>
            </div>

            {/* Bottom: Price indicator & Arrow */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                {cat.priceNote}
              </span>
              <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-secondary flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
