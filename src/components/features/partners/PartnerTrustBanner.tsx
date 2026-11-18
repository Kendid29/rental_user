'use client';

import React from 'react';
import { ShieldCheck, Clock, Wrench, HelpCircle } from 'lucide-react';

export function PartnerTrustBanner() {
  return (
    <div className="rounded-3xl bg-slate-50 border border-border p-6 sm:p-8 space-y-4">
      <h3 className="font-bold text-primary text-base flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-secondary" />
        Standar Operasional RentalinAja
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-text-muted">
        {/* Pillar 1 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-secondary flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-primary">Konfirmasi Instan</p>
            <p className="text-xs mt-0.5">
              Pesanan langsung diteruskan ke staf mitra untuk verifikasi cepat tanpa antre.
            </p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-tertiary flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-primary">Kondisi Prima & Higienis</p>
            <p className="text-xs mt-0.5">
              Unit diservis berkala dan dibersihkan secara menyeluruh sebelum diserahterimakan.
            </p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100/60 text-purple-600 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-primary">Dukungan Darurat 24/7</p>
            <p className="text-xs mt-0.5">
              Layanan bantuan darurat dan penggantian unit apabila terjadi kendala teknis di jalan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
