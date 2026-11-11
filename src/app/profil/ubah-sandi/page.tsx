'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/api';
import { RouteGuard } from '@/hooks/useSesi';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function UbahSandiContent() {
  const router = useRouter();

  const [kataSandiLama, setKataSandiLama] = useState('');
  const [kataSandiBaru, setKataSandiBaru] = useState('');
  const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!kataSandiLama) {
      errors.kataSandiLama = 'Kata sandi lama wajib diisi';
    }

    if (!kataSandiBaru) {
      errors.kataSandiBaru = 'Kata sandi baru wajib diisi';
    } else if (kataSandiBaru.length < 6) {
      errors.kataSandiBaru = 'Kata sandi baru minimal 6 karakter';
    }

    if (!konfirmasiKataSandi) {
      errors.konfirmasiKataSandi = 'Konfirmasi kata sandi baru wajib diisi';
    } else if (kataSandiBaru !== konfirmasiKataSandi) {
      errors.konfirmasiKataSandi = 'Konfirmasi kata sandi tidak cocok';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.profil.ubahSandi({
        kataSandiLama,
        kataSandiBaru,
        konfirmasiKataSandi,
      });

      setSuccessMessage('Kata sandi berhasil diperbarui.');
      setKataSandiLama('');
      setKataSandiBaru('');
      setKonfirmasiKataSandi('');

      setTimeout(() => {
        router.push('/profil');
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui kata sandi';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <div className="border-b border-border pb-4">
        <Link href="/profil" className="text-xs text-secondary hover:underline">
          ← Kembali ke Profil
        </Link>
        <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary mt-1">
          Ubah Kata Sandi
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun
        </p>
      </div>

      <Card level={1} padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>{successMessage} Mengalihkan kembali ke profil...</span>
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
            label="Kata Sandi Lama"
            type="password"
            placeholder="••••••••"
            value={kataSandiLama}
            onChange={(e) => setKataSandiLama(e.target.value)}
            error={validationErrors.kataSandiLama}
            disabled={isSubmitting}
          />

          <Input
            label="Kata Sandi Baru"
            type="password"
            placeholder="Minimal 6 karakter"
            value={kataSandiBaru}
            onChange={(e) => setKataSandiBaru(e.target.value)}
            error={validationErrors.kataSandiBaru}
            disabled={isSubmitting}
          />

          <Input
            label="Konfirmasi Kata Sandi Baru"
            type="password"
            placeholder="Ulangi kata sandi baru"
            value={konfirmasiKataSandi}
            onChange={(e) => setKonfirmasiKataSandi(e.target.value)}
            error={validationErrors.konfirmasiKataSandi}
            disabled={isSubmitting}
          />

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              Simpan Kata Sandi Baru
            </Button>

            <Link href="/profil">
              <Button variant="secondary" size="md" fullWidth>
                Batal
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function UbahSandiPage() {
  return (
    <RouteGuard>
      <UbahSandiContent />
    </RouteGuard>
  );
}
