'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  Car,
  Bike,
  LayoutGrid,
  MapPin,
  Calendar,
  Search,
  ShieldCheck,
  Zap,
  BadgePercent,
  Clock,
  Compass,
} from 'lucide-react';
import { JenisKendaraan } from '@/types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { DatePicker } from '@/components/ui/DatePicker';
import { cn } from '@/lib/utils';

export interface HomeHeroProps {
  formKota: string;
  setFormKota: (kota: string) => void;
  formJenis: JenisKendaraan | 'semua';
  setFormJenis: (jenis: JenisKendaraan | 'semua') => void;
  formTanggal: string;
  setFormTanggal: (tgl: string) => void;
  cityOptions: string[];
  onSearch: (e: React.FormEvent) => void;
}

const POPULAR_CITIES = ['Yogyakarta', 'Bandung', 'Denpasar', 'Surabaya'];

export function HomeHero({
  formKota,
  setFormKota,
  formJenis,
  setFormJenis,
  formTanggal,
  setFormTanggal,
  cityOptions,
  onSearch,
}: HomeHeroProps) {
  // Merge available cities with popular fallback
  const availableCities = cityOptions.length > 0 ? cityOptions : POPULAR_CITIES;
  const popularCityList = cityOptions.length > 0 ? cityOptions : POPULAR_CITIES;

  return (
    <section className="relative bg-gradient-to-b from-primary-dark via-primary to-primary text-white pt-10 pb-20 sm:pt-16 sm:pb-32 px-4 sm:px-6 lg:px-8">
      {/* Ambient Lighting Accents (overflow-hidden kept isolated here so popups are not cut off) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-sky-500/15 rounded-full blur-2xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
        {/* Top Assurance Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold backdrop-blur-md text-emerald-300 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Platform Rental Terpadu Resmi #1 di Indonesia</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white">
            Sewa Mobil & Motor Nyaman, <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-sky-300 to-teal-200">
              Langsung dari Mitra Resmi
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            Ratusan unit pilihan dengan harga transparan tanpa biaya siluman. Antar jemput fleksibel ke bandara, stasiun, atau hotel di kota Anda.
          </p>
        </motion.div>

        {/* Interactive Search Card Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-2 max-w-4xl mx-auto space-y-3"
        >
          {/* Vehicle Category Tab Switcher */}
          <div className="inline-flex p-1 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
            <button
              type="button"
              onClick={() => setFormJenis('semua')}
              className={cn(
                'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                formJenis === 'semua'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:text-white'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Semua Armada</span>
            </button>

            <button
              type="button"
              onClick={() => setFormJenis('mobil')}
              className={cn(
                'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                formJenis === 'mobil'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:text-white'
              )}
            >
              <Car className="w-4 h-4" />
              <span>Sewa Mobil</span>
            </button>

            <button
              type="button"
              onClick={() => setFormJenis('motor')}
              className={cn(
                'px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                formJenis === 'motor'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:text-white'
              )}
            >
              <Bike className="w-4 h-4" />
              <span>Sewa Motor</span>
            </button>
          </div>

          {/* Main Search Form Container */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 text-text-main text-left space-y-4">
            <form
              onSubmit={onSearch}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end"
            >
              {/* Kota Layanan */}
              <Select
                label="Kota Layanan"
                leftIcon={<MapPin className="w-4 h-4 text-secondary" />}
                value={formKota}
                onChange={setFormKota}
                options={availableCities}
              />

              {/* Kategori Kendaraan */}
              <Select
                label="Kategori Kendaraan"
                leftIcon={<Car className="w-4 h-4 text-secondary" />}
                value={formJenis}
                onChange={(val) => setFormJenis(val as JenisKendaraan | 'semua')}
                options={[
                  { value: 'semua', label: 'Semua (Mobil & Motor)' },
                  { value: 'mobil', label: 'Mobil Saja' },
                  { value: 'motor', label: 'Motor Saja' },
                ]}
              />

              {/* Tanggal Mulai */}
              <DatePicker
                label="Tanggal Mulai"
                value={formTanggal}
                onChange={setFormTanggal}
                min={new Date().toISOString().split('T')[0]}
              />

              {/* Submit CTA */}
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  className="h-11.5 font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  leftIcon={<Search className="w-4 h-4" />}
                >
                  Cari Armada
                </Button>
              </div>
            </form>

            {/* Quick Popular City Shortcuts */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-text-muted flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-secondary" />
                Kota Populer:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {popularCityList.map((city) => {
                  const isSelected = formKota.toLowerCase() === city.toLowerCase();
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setFormKota(city)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1',
                        isSelected
                          ? 'bg-blue-50 text-secondary border border-blue-200 font-bold'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-primary'
                      )}
                    >
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{city}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Guarantees Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 max-w-4xl mx-auto pt-2">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-white/10">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Konfirmasi Cepat</p>
              <p className="text-[10px] text-slate-300">Langsung via WhatsApp resmi</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-white/10">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Unit Terawat Prima</p>
              <p className="text-[10px] text-slate-300">Inspeksi rutin & bersih</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-white/10">
              <BadgePercent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Tarif Pasti & Jujur</p>
              <p className="text-[10px] text-slate-300">Tanpa biaya tak terduga</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-white/10">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Antar Jemput Unit</p>
              <p className="text-[10px] text-slate-300">Bandara, stasiun, hotel</p>
            </div>
          </div>
        </div>

        {/* Stats Counter Bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/15 text-center">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-white">
              500+
            </p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Unit Armada Siap Pakai</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-white">
              50+
            </p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Mitra Rental Resmi</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-emerald-400">
              4.9 / 5.0
            </p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Rating Kepuasan Pelanggan</p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <p className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-cyan-300">
              100%
            </p>
            <p className="text-[11px] text-slate-300 font-medium mt-0.5">Harga Bersih Transparan</p>
          </div>
        </div>
      </div>
    </section>
  );
}
