'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  PhoneCall,
  LogIn,
} from 'lucide-react';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export function LoginForm() {
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
          : 'Terjadi kesalahan saat masuk. Periksa kembali email dan sandi.';
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
          Selamat Datang Kembali
        </h1>

        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Masuk ke akun Anda untuk melanjutkan pemesanan armada.
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            error={validationErrors.email}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
          />

          <div className="space-y-1">
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
              autoComplete="current-password"
            />

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-secondary hover:underline font-semibold"
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
            className="shadow-lg shadow-blue-500/25 mt-2"
            rightIcon={<LogIn className="w-4 h-4" />}
          >
            Masuk ke Akun
          </Button>

          {/* Quick Demo Credential Note */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-border text-[11px] text-text-muted space-y-1">
            <span className="font-bold text-primary block">Akun Uji Coba Default:</span>
            <p>
              Email: <span className="font-mono text-primary font-semibold">budi.santoso@example.com</span>
            </p>
            <p>
              Kata Sandi: <span className="font-mono text-primary font-semibold">rahasia123</span>
            </p>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-text-muted">
          Belum memiliki akun?{' '}
          <Link
            href={`/register${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
            className="text-secondary font-bold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </div>
      </Card>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Lupa Kata Sandi?"
      >
        <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <p>
            Untuk alasan keamanan akun penyewa, proses reset sandi dilakukan melalui verifikasi nomor WhatsApp resmi admin RentalinAja.
          </p>
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-secondary space-y-1">
            <span className="font-bold text-xs uppercase block">Layanan WhatsApp 24 Jam:</span>
            <p className="font-bold text-primary text-sm">+62 812-3456-7890</p>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForgotModal(false)}
            >
              Tutup
            </Button>
            <a
              href="https://wa.me/6281234567890?text=Halo%20Admin%20RentalinAja,%20saya%20butuh%20bantuan%20reset%20kata%20sandi%20akun."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
              >
                Chat Admin
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
