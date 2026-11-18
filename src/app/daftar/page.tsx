'use client';

import React, { useState, Suspense } from 'react';
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
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
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
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal melakukan pendaftaran. Silakan coba lagi.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-3 border border-secondary/20 shadow-xs">
            <UserPlus className="w-6 h-6 text-secondary" />
          </div>

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
              cue="(Sesuai KTP)"
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              error={validationErrors.nama}
              disabled={isLoading}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              disabled={isLoading}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Nomor WhatsApp"
              cue="(Format 08...)"
              placeholder="081234567890"
              value={nomorWA}
              onChange={(e) => setNomorWA(e.target.value)}
              error={validationErrors.nomorWA}
              disabled={isLoading}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimal 6 karakter"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              error={validationErrors.kataSandi}
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-text-muted hover:text-primary transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-md shadow-blue-500/20"
              >
                Daftar Sekarang
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-border/80 text-center">
            <p className="text-xs text-text-muted">
              Sudah punya akun?{' '}
              <Link
                href={`/masuk${
                  rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''
                }`}
                className="font-bold text-secondary hover:underline"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </Card>

        {/* Security Pledge Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-border/80 text-xs text-text-muted flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] leading-relaxed">
            Data pribadi Anda dilindungi enkripsi standar industri dan tidak disalahgunakan.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DaftarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
          Memuat halaman pendaftaran...
        </div>
      }
    >
      <DaftarForm />
    </Suspense>
  );
}
