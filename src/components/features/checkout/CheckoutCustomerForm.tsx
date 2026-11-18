'use client';

import React from 'react';
import { User, Phone, Users } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export interface CheckoutCustomerFormProps {
  namaPenyewa: string;
  setNamaPenyewa: (val: string) => void;
  nomorWAPenyewa: string;
  setNomorWAPenyewa: (val: string) => void;
  pesanUntukOrangLain: boolean;
  setPesanUntukOrangLain: (val: boolean) => void;
  namaPenerima: string;
  setNamaPenerima: (val: string) => void;
  nomorWAPenerima: string;
  setNomorWAPenerima: (val: string) => void;
  validationErrors: Record<string, string>;
  disabled: boolean;
}

export function CheckoutCustomerForm({
  namaPenyewa,
  setNamaPenyewa,
  nomorWAPenyewa,
  setNomorWAPenyewa,
  pesanUntukOrangLain,
  setPesanUntukOrangLain,
  namaPenerima,
  setNamaPenerima,
  nomorWAPenerima,
  setNomorWAPenerima,
  validationErrors,
  disabled,
}: CheckoutCustomerFormProps) {
  return (
    <Card level={1} padding="lg" className="space-y-5 rounded-3xl shadow-sm">
      <div className="border-b border-border/80 pb-4">
        <h2 className="font-[family-name:var(--font-headline)] text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" />
          <span>Data Pemesan & Penyewa</span>
        </h2>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">
          Pastikan nama dan nomor WhatsApp aktif untuk verifikasi identitas serta koordinasi serah terima unit.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Lengkap Penyewa"
          cue="(Sesuai KTP)"
          placeholder="Contoh: Budi Santoso"
          value={namaPenyewa}
          onChange={(e) => setNamaPenyewa(e.target.value)}
          error={validationErrors.namaPenyewa}
          disabled={disabled}
          leftIcon={<User className="w-4 h-4" />}
        />

        <Input
          label="Nomor WhatsApp Aktif"
          cue="(Format 08... atau 62...)"
          placeholder="081234567890"
          value={nomorWAPenyewa}
          onChange={(e) => setNomorWAPenyewa(e.target.value)}
          error={validationErrors.nomorWAPenyewa}
          disabled={disabled}
          leftIcon={<Phone className="w-4 h-4" />}
        />
      </div>

      {/* Checkbox: Pesan untuk orang lain */}
      <div className="pt-2">
        <label className="flex items-center gap-3 cursor-pointer select-none bg-slate-50 p-3.5 rounded-2xl border border-border/70 hover:bg-slate-100/60 transition-colors">
          <input
            type="checkbox"
            checked={pesanUntukOrangLain}
            onChange={(e) => setPesanUntukOrangLain(e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-secondary rounded border-slate-300 focus:ring-secondary/20 cursor-pointer"
          />
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Users className="w-4 h-4 text-secondary" />
            <span>Saya memesan untuk orang lain (Penerima / Pengemudi berbeda)</span>
          </span>
        </label>

        {pesanUntukOrangLain && (
          <div className="mt-4 p-4.5 rounded-2xl bg-slate-50/90 border border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap Penerima"
              cue="(Sesuai KTP)"
              placeholder="Nama teman / keluarga"
              value={namaPenerima}
              onChange={(e) => setNamaPenerima(e.target.value)}
              error={validationErrors.namaPenerima}
              disabled={disabled}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Nomor WhatsApp Penerima"
              placeholder="08xxxxxxxxxx"
              value={nomorWAPenerima}
              onChange={(e) => setNomorWAPenerima(e.target.value)}
              error={validationErrors.nomorWAPenerima}
              disabled={disabled}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
