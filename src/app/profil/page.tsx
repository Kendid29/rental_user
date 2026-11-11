'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/api';
import { useSesi, RouteGuard } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function ProfilContent() {
  const { user, refreshSesi } = useSesi();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setNama(user.nama);
      setEmail(user.email);
      setNomorWA(user.nomorWA);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!nama.trim()) {
      setErrorMessage('Nama lengkap wajib diisi');
      return;
    }

    if (!nomorWA.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedWA = normalisasiNomorWA(nomorWA);
      await api.profil.update({
        nama,
        nomorWA: normalizedWA,
      });
      await refreshSesi();
      setSuccessMessage('Data profil berhasil diperbarui.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
          Profil Saya
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Kelola informasi data diri dan nomor kontak untuk kelancaran transaksi sewa
        </p>
      </div>

      <Card level={1} padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-urgency flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap"
            cue="(Sesuai KTP)"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            label="Alamat Email"
            value={email}
            disabled
            helperText="Alamat email digunakan sebagai ID akun permanen dan tidak dapat diubah"
          />

          <Input
            label="Nomor WhatsApp"
            cue="(Format 08... atau 62...)"
            value={nomorWA}
            onChange={(e) => setNomorWA(e.target.value)}
            disabled={isSubmitting}
            helperText="Nomor ini akan otomatis terisi saat melakukan checkout pesanan baru"
          />

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Simpan Perubahan
            </Button>

            <Link href="/profil/ubah-sandi">
              <Button variant="secondary" size="md" fullWidth>
                Ubah Kata Sandi
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function ProfilPage() {
  return (
    <RouteGuard>
      <ProfilContent />
    </RouteGuard>
  );
}
