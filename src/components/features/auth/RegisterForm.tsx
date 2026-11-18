'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!nama.trim()) {
      errors.nama = 'Nama lengkap wajib diisi';
    } else if (nama.trim().length < 3) {
      errors.nama = 'Nama minimal 3 karakter';
    }

    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Format email tidak valid';
    }

    const cleanWA = nomorWA.replace(/\D/g, '');
    if (!nomorWA.trim()) {
      errors.nomorWA = 'Nomor WhatsApp wajib diisi';
    } else if (cleanWA.length < 9) {
      errors.nomorWA = 'Nomor WhatsApp minimal 9 digit angka';
    }

    if (!kataSandi) {
      errors.kataSandi = 'Kata sandi wajib diisi';
    } else if (kataSandi.length < 6) {
      errors.kataSandi = 'Kata sandi minimal 6 karakter';
    }

    if (!konfirmasiSandi) {
      errors.konfirmasiSandi = 'Ulangi kata sandi Anda';
    } else if (kataSandi !== konfirmasiSandi) {
      errors.konfirmasiSandi = 'Konfirmasi kata sandi tidak cocok';
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'Anda harus menyetujui syarat & ketentuan layanan';
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[440px] mx-auto"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-7 sm:p-9 space-y-6">
        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="font-[family-name:var(--font-headline)] text-2xl font-black text-primary tracking-tight">
            Daftar Akun Baru
          </h1>
          <p className="text-xs text-text-muted leading-relaxed">
            Lengkapi data di bawah untuk mulai menyewa armada mobil & motor.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Nama Lengkap"
            cue="(Sesuai KTP)"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            error={validationErrors.nama}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
            autoComplete="name"
            disabled={isLoading}
          />

          <Input
            label="Alamat Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            error={validationErrors.email}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            autoComplete="email"
            disabled={isLoading}
          />

          <Input
            label="Nomor WhatsApp Aktif"
            cue="(Format 08...)"
            type="tel"
            value={nomorWA}
            onChange={(e) => setNomorWA(e.target.value)}
            placeholder="Contoh: 08123456789"
            error={validationErrors.nomorWA}
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            autoComplete="tel"
            disabled={isLoading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              placeholder="Min. 6 digit"
              error={validationErrors.kataSandi}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              autoComplete="new-password"
              disabled={isLoading}
            />

            <Input
              label="Ulangi Sandi"
              type={showPassword ? 'text' : 'password'}
              value={konfirmasiSandi}
              onChange={(e) => setKonfirmasiSandi(e.target.value)}
              placeholder="Ketik ulang sandi"
              error={validationErrors.konfirmasiSandi}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>

          <div className="pt-0.5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Sembunyikan kata sandi</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat kata sandi</span>
                </>
              )}
            </button>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-secondary border-slate-300 focus:ring-secondary/20 cursor-pointer"
              />
              <span className="text-[11px] text-text-muted leading-tight">
                Saya menyetujui{' '}
                <span className="text-primary font-bold">Syarat & Ketentuan Layanan</span>{' '}
                serta{' '}
                <span className="text-primary font-bold">Kebijakan Privasi</span> RentalinAja.
              </span>
            </label>
            {validationErrors.agreeTerms && (
              <p className="text-xs text-rose-600 mt-1 font-medium">
                {validationErrors.agreeTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="h-12 rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Daftar Sekarang
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-text-muted font-medium">
              atau
            </span>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center text-xs text-text-muted">
          Sudah memiliki akun?{' '}
          <Link
            href={`/login${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
            className="text-secondary font-bold hover:underline"
          >
            Masuk ke Akun
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
