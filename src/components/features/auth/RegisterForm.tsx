'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectUrl = getSafeRedirectUrl(rawRedirect, '/');

  const { register } = useSesi();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!nama.trim()) {
      errors.nama = 'Nama lengkap wajib diisi';
    } else if (nama.trim().length < 3) {
      errors.nama = 'Nama minimal 3 karakter';
    }

    if (!email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!nomorWA.trim()) {
      errors.nomorWA = 'Nomor WhatsApp wajib diisi';
    } else if (nomorWA.replace(/\D/g, '').length < 10) {
      errors.nomorWA = 'Nomor WhatsApp minimal 10 digit angka';
    }

    if (!kataSandi) {
      errors.kataSandi = 'Kata sandi wajib diisi';
    } else if (kataSandi.length < 6) {
      errors.kataSandi = 'Kata sandi minimal 6 karakter';
    }

    if (!konfirmasiSandi) {
      errors.konfirmasiSandi = 'Konfirmasi kata sandi wajib diisi';
    } else if (kataSandi !== konfirmasiSandi) {
      errors.konfirmasiSandi = 'Konfirmasi kata sandi tidak cocok';
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
      await register({
        nama: nama.trim(),
        email: email.trim(),
        nomorWA: normalisasiNomorWA(nomorWA),
        kataSandi,
      });

      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Pendaftaran gagal. Silakan coba kembali.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 space-y-6">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary tracking-tight">
          Daftar Akun Baru
        </h1>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Bergabung dengan ribuan penyewa armada terpercaya di kota Anda.
        </p>
      </div>

      <Card level={2} padding="lg" className="rounded-3xl shadow-lg border-border/80">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            error={validationErrors.nama}
            leftIcon={<User className="w-4 h-4" />}
            autoComplete="name"
          />

          <Input
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            error={validationErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <Input
            label="Nomor WhatsApp"
            type="tel"
            value={nomorWA}
            onChange={(e) => setNomorWA(e.target.value)}
            placeholder="Contoh: 08123456789"
            error={validationErrors.nomorWA}
            leftIcon={<Phone className="w-4 h-4" />}
            autoComplete="tel"
          />

          <Input
            label="Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            value={kataSandi}
            onChange={(e) => setKataSandi(e.target.value)}
            placeholder="Minimal 6 karakter"
            error={validationErrors.kataSandi}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-primary transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            autoComplete="new-password"
          />

          <Input
            label="Ulangi Kata Sandi"
            type={showPassword ? 'text' : 'password'}
            value={konfirmasiSandi}
            onChange={(e) => setKonfirmasiSandi(e.target.value)}
            placeholder="Masukkan kembali sandi"
            error={validationErrors.konfirmasiSandi}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            className="shadow-lg shadow-blue-500/25 mt-2"
            rightIcon={<UserPlus className="w-4 h-4" />}
          >
            Daftar Sekarang
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-text-muted">
          Sudah memiliki akun?{' '}
          <Link
            href={`/login${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
            className="text-secondary font-bold hover:underline"
          >
            Masuk ke Akun
          </Link>
        </div>
      </Card>
    </div>
  );
}
