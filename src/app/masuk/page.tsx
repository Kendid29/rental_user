'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  PhoneCall,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectUrl = getSafeRedirectUrl(rawRedirect, '/');

  const { login } = useSesi();

  const [email, setEmail] = useState('budi.santoso@example.com');
  const [kataSandi, setKataSandi] = useState('rahasia123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
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
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Periksa email dan kata sandi Anda.';
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
            <Lock className="w-6 h-6 text-secondary" />
          </div>

          <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary tracking-tight">
            Masuk ke RentalinAja
          </h1>

          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Lanjutkan pemesanan dan kelola riwayat sewa kendaraan Anda.
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
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              disabled={isLoading}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div>
              <Input
                label="Kata Sandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
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

              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
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
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="mt-2 shadow-md shadow-blue-500/20"
            >
              Masuk Sekarang
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/80 text-center">
            <p className="text-xs text-text-muted">
              Belum punya akun RentalinAja?{' '}
              <Link
                href={`/daftar${
                  rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''
                }`}
                className="font-bold text-secondary hover:underline"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </Card>

        {/* Demo Credentials Box */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-primary space-y-1 shadow-2xs">
          <p className="font-bold flex items-center gap-1.5 text-secondary">
            <KeyRound className="w-4 h-4" />
            <span>Akun Demo Cepat:</span>
          </p>
          <p className="text-text-muted text-[11px] leading-relaxed">
            Email: <strong className="text-primary font-bold">budi.santoso@example.com</strong> | Sandi: <strong className="text-primary font-bold">rahasia123</strong>
          </p>
        </div>
      </div>

      {/* Modal Lupa Sandi */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Lupa Kata Sandi?"
        description="Bantuan pemulihan akun RentalinAja"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-muted leading-relaxed">
            Untuk keamanan akun Anda, silakan hubungi tim Support Admin RentalinAja melalui WhatsApp resmi kami untuk verifikasi identitas dan pemulihan akses akun.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20RentalinAja,%20saya%20butuh%20bantuan%20reset%20kata%20sandi%20akun%20saya"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<PhoneCall className="w-4 h-4" />}
              >
                Chat WhatsApp Admin
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
      </Modal>
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
          Memuat halaman masuk...
        </div>
      }
    >
      <MasukForm />
    </Suspense>
  );
}
