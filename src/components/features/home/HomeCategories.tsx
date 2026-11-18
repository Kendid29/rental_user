'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Bike, ArrowRight } from 'lucide-react';

export interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
  tag: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: 'city-car',
    name: 'City Car Hemat',
    desc: 'Brio, Agya, Yaris',
    href: '/fleet/cars?search=brio',
    icon: <Car className="w-5 h-5 text-secondary" />,
    tag: 'Paling Laris',
  },
  {
    id: 'mpv-keluarga',
    name: 'MPV Keluarga',
    desc: 'Avanza, Xpander, Innova',
    href: '/fleet/cars?kapasitas=7',
    icon: <Car className="w-5 h-5 text-sky-500" />,
    tag: '7 Penumpang',
  },
  {
    id: 'suv-premium',
    name: 'SUV Premium',
    desc: 'Fortuner, Pajero, HR-V',
    href: '/fleet/cars?transmisi=Matic',
    icon: <Car className="w-5 h-5 text-indigo-500" />,
    tag: 'Executive',
  },
  {
    id: 'motor-matic',
    name: 'Motor Matic Praktis',
    desc: 'Beat, Scoopy, Vario',
    href: '/fleet/bikes?transmisi=Matic',
    icon: <Bike className="w-5 h-5 text-emerald-500" />,
    tag: 'Hemat Bahan Bakar',
  },
  {
    id: 'maxi-scooter',
    name: 'Maxi Scooter & Tour',
    desc: 'NMAX, PCX, Aerox',
    href: '/fleet/bikes?search=nmax',
    icon: <Bike className="w-5 h-5 text-amber-500" />,
    tag: 'Nyaman Jauh',
  },
];

export function HomeCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Kategori Terfavorit
          </span>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary mt-1">
            Pilihan Armada Sesuai Kebutuhan
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Temukan kendaraan ideal untuk liburan keluarga, perjalanan dinas, atau jelajah kota.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {DEFAULT_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group bg-white p-5 rounded-2xl border border-border/80 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-border/60 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-secondary transition-colors">
                  {cat.tag}
                </span>
              </div>

              <h3 className="font-bold text-sm text-primary group-hover:text-secondary transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-text-muted mt-1">{cat.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-secondary">
              <span>Lihat Unit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
