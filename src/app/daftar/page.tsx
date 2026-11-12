'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function DaftarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectUrl = getSafeRedirectUrl(rawRedirect, '/');

  const { register } = useSesi();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!nama.trim()) {
      errors.nama = 'Nama lengkap wajib diisi';
    }

    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!nomorWA.trim()) {
      errors.nomorWA = 'Nomor WhatsApp aktif wajib diisi';
    } else if (nomorWA.replace(/\D/g, '').length < 9) {
      errors.nomorWA = 'Nomor WhatsApp minimal 9 digit';
    }

    if (!kataSandi) {
      errors.kataSandi = 'Kata sandi wajib diisi';
    } else if (kataSandi.length < 6) {
      errors.kataSandi = 'Kata sandi minimal 6 karakter';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const normalizedWA = normalisasiNomorWA(nomorWA);
      await register({
        nama,
        email,
        nomorWA: normalizedWA,
        kataSandi,
      });
      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pendaftaran gagal. Silakan coba kembali.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
            Daftar Akun RentalinAja
          </h1>
          <p className="text-sm text-text-muted">
            Buat akun untuk memesan rental mobil dan motor di berbagai kota
          </p>
        </div>

        <Card level={2} padding="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-urgency font-medium flex items-center gap-2">
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
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              error={validationErrors.nama}
              disabled={isLoading}
            />

            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              disabled={isLoading}
            />

            <Input
              label="Nomor WhatsApp Aktif"
              cue="(Format 08... atau 62...)"
              placeholder="081234567890"
              value={nomorWA}
              onChange={(e) => setNomorWA(e.target.value)}
              error={validationErrors.nomorWA}
              helperText="Digunakan untuk konfirmasi pesanan via WhatsApp resmi"
              disabled={isLoading}
            />

            <Input
              label="Kata Sandi"
              type="password"
              placeholder="Minimal 6 karakter"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              error={validationErrors.kataSandi}
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Daftar Sekarang
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-muted">
              Sudah memiliki akun?{' '}
              <Link
                href={`/masuk${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
                className="font-bold text-secondary hover:underline"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function DaftarPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat...</div>}>
      <DaftarForm />
    </Suspense>
  );
}
