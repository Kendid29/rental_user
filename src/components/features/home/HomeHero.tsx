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
  return (
    <section className="relative bg-gradient-to-b from-primary-dark via-primary to-primary text-white pt-12 pb-28 sm:pt-20 sm:pb-36 px-4 sm:px-6 lg:px-8">
      {/* Ambient Glows Container with overflow-hidden */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6 sm:space-y-8">
        {/* Top Assurance Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold backdrop-blur-md text-emerald-300 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Platform Rental Terpadu Terpercaya #1 di Indonesia</span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
        >
          Sewa Mobil & Motor <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-300 to-cyan-200">
            Langsung dari Mitra Resmi
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
        >
          Pilihan armada lengkap, unit bersih terawat, tarif jujur tanpa biaya tersembunyi, dan proses konfirmasi cepat via WhatsApp admin resmi.
        </motion.p>

        {/* Search Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-2 max-w-4xl mx-auto"
        >
          {/* Vehicle Type Switcher */}
          <div className="inline-flex p-1 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 mb-3 shadow-md">
            <button
              type="button"
              onClick={() => setFormJenis('semua')}
              className={cn(
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
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
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
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
                'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
                formJenis === 'motor'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-white/80 hover:text-white'
              )}
            >
              <Bike className="w-4 h-4" />
              <span>Sewa Motor</span>
            </button>
          </div>

          {/* Search Inputs Form */}
          <form
            onSubmit={onSearch}
            className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/30 text-text-main text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end"
          >
            {/* Kota */}
            <Select
              label="Kota Layanan"
              leftIcon={<MapPin className="w-4 h-4 text-secondary" />}
              value={formKota}
              onChange={setFormKota}
              options={cityOptions.length > 0 ? cityOptions : [formKota]}
            />

            {/* Kategori Kendaraan */}
            <Select
              label="Kategori Kendaraan"
              leftIcon={<Car className="w-4 h-4 text-secondary" />}
              value={formJenis}
              onChange={(val) => setFormJenis(val as JenisKendaraan | 'semua')}
              options={[
                { value: 'semua', label: 'Semua (Mobil & Motor)' },
                { value: 'mobil', label: 'Mobil' },
                { value: 'motor', label: 'Motor' },
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
                className="h-11.5 shadow-lg shadow-blue-500/25"
                leftIcon={<Search className="w-4 h-4" />}
              >
                Cari Armada
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Stats Summary Bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-white/10 text-center">
          <div>
            <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-white">
              500+
            </p>
            <p className="text-[11px] text-slate-300 font-medium">Unit Armada Terawat</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-white">
              50+
            </p>
            <p className="text-[11px] text-slate-300 font-medium">Mitra Terverifikasi</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-emerald-400">
              4.9 / 5.0
            </p>
            <p className="text-[11px] text-slate-300 font-medium">Rating Kepuasan</p>
          </div>
          <div>
            <p className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-black text-cyan-300">
              100%
            </p>
            <p className="text-[11px] text-slate-300 font-medium">Harga Transparan</p>
          </div>
        </div>
      </div>
    </section>
  );
}
