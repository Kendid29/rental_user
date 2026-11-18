'use client';

import React from 'react';
import { ShieldCheck, BadgePercent, Zap, Clock } from 'lucide-react';

export function HomeWhyUs() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white border-y border-border/80 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Keunggulan Layanan
          </span>
          <h3 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-primary mt-1.5 tracking-tight">
            Mengapa Sewa di RentalinAja?
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
            Kami menyatukan standar keamanan, kenyamanan unit, dan kemudahan transaksi rental kendaraan di setiap kota.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mitra Terverifikasi */}
          <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary border border-blue-100 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="font-bold text-primary text-base">Mitra Terverifikasi</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Seluruh mitra rental melewati proses verifikasi fisik, kelengkapan surat resmi, serta kondisi armada yang prima.
            </p>
          </div>

          {/* Harga Jujur & Pasti */}
          <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold">
              <BadgePercent className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-bold text-primary text-base">Harga Jujur & Pasti</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Tanpa biaya tersembunyi saat serah terima. Apa yang tertera di rincian pesanan adalah tarif yang Anda bayarkan.
            </p>
          </div>

          {/* Konfirmasi Kilat */}
          <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 text-amber-500" />
            </div>
            <h4 className="font-bold text-primary text-base">Konfirmasi Kilat</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Setelah buat pesanan di web, Anda langsung terhubung dengan admin resmi via WhatsApp untuk koordinasi lokasi kunci.
            </p>
          </div>

          {/* Layanan Siaga 24/7 */}
          <div className="p-6 rounded-3xl bg-white border border-border/80 hover:border-secondary/40 hover:shadow-lg transition-all space-y-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-primary text-base">Layanan Siaga 24/7</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Tim support dan mitra standby mendampingi jika terjadi kendala teknis darurat selama masa sewa kendaraan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
