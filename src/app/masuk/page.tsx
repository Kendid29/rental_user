'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectUrl = getSafeRedirectUrl(rawRedirect, '/');

  const { login } = useSesi();

  const [email, setEmail] = useState('budi.santoso@example.com');
  const [kataSandi, setKataSandi] = useState('rahasia123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!kataSandi) {
      errors.kataSandi = 'Kata sandi wajib diisi';
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
      await login({ email, kataSandi });
      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal masuk. Periksa email dan kata sandi Anda.';
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
            Masuk ke RentalinAja
          </h1>
          <p className="text-sm text-text-muted">
            Lanjutkan pemesanan rental kendaraan Anda dengan mudah
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
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              disabled={isLoading}
            />

            <div>
              <Input
                label="Kata Sandi"
                type="password"
                placeholder="••••••••"
                value={kataSandi}
                onChange={(e) => setKataSandi(e.target.value)}
                error={validationErrors.kataSandi}
                disabled={isLoading}
              />
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-secondary hover:underline cursor-pointer"
                >
                  Lupa kata sandi?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Masuk Sekarang
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-text-muted">
              Belum punya akun RentalinAja?{' '}
              <Link
                href={`/daftar${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
                className="font-bold text-secondary hover:underline"
              >
                Daftar Pelanggan Baru
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials Box */}
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs text-primary space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            Akun Demo Siap Pakai:
          </p>
          <p className="text-text-muted">
            Email: <span className="font-semibold text-primary">budi.santoso@example.com</span> | Sandi: <span className="font-semibold text-primary">rahasia123</span>
          </p>
        </div>
      </div>

      {/* Modal Lupa Sandi */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 elevation-3 space-y-4">
            <h3 className="font-[family-name:var(--font-headline)] text-lg font-bold text-primary">
              Lupa Kata Sandi?
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Untuk keamanan akun Anda pada tahap ini, silakan hubungi tim Admin RentalinAja melalui WhatsApp untuk verifikasi dan pemulihan akses akun Anda.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin%20RentalinAja,%20saya%20butuh%20bantuan%20reset%20kata%20sandi%20akun%20saya"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="md" fullWidth>
                  Hubungi Admin via WhatsApp
                </Button>
              </a>
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => setShowForgotModal(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat...</div>}>
      <MasukForm />
    </Suspense>
  );
}
