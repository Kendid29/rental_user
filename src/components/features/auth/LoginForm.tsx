'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  PhoneCall,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useSesi, getSafeRedirectUrl } from '@/hooks/useSesi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const redirectUrl = getSafeRedirectUrl(rawRedirect, '/');

  const { login } = useSesi();

  const [email, setEmail] = useState('budi.santoso@example.com');
  const [kataSandi, setKataSandi] = useState('rahasia123');
  const [ingatSaya, setIngatSaya] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [demoFilledNotice, setDemoFilledNotice] = useState(false);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi';
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
      const user = await login({ email, kataSandi });
      toast.success(`Selamat datang kembali, ${user.nama}!`);
      router.push(redirectUrl);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat masuk. Periksa kembali email dan kata sandi.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('budi.santoso@example.com');
    setKataSandi('rahasia123');
    setValidationErrors({});
    setDemoFilledNotice(true);
    toast.success('Kredensial demo Budi Santoso terisi!', { id: 'demo-filled' });
    setTimeout(() => {
      setDemoFilledNotice(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[420px] mx-auto"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-7 sm:p-9 space-y-6">
        {/* Title Header */}
        <div className="space-y-1">
          <h1 className="font-[family-name:var(--font-headline)] text-2xl font-black text-primary tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs text-text-muted leading-relaxed">
            Masuk ke akun Anda untuk melanjutkan pemesanan armada.
          </p>
        </div>

        {/* Clean Demo Account Fast-Fill Box */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">
                Akun Demo: Budi Santoso
              </p>
              <p className="text-[11px] text-text-muted font-mono truncate">
                {demoFilledNotice ? (
                  <span className="text-emerald-600 font-bold font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Kredensial demo terisi!
                  </span>
                ) : (
                  'budi.santoso@example.com'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 text-xs font-bold text-secondary hover:text-white hover:bg-secondary border border-secondary/30 rounded-lg bg-white transition-all shrink-0 cursor-pointer shadow-2xs"
          >
            Isi Cepat
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Input
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              placeholder="Masukkan kata sandi"
              error={validationErrors.kataSandi}
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted hover:text-primary transition-colors focus:outline-none cursor-pointer"
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
              disabled={isLoading}
            />

            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={ingatSaya}
                  onChange={(e) => setIngatSaya(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-secondary border-slate-300 focus:ring-secondary/20 cursor-pointer"
                />
                <span className="text-text-muted font-medium">Ingat saya</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-secondary hover:text-secondary-hover font-bold hover:underline transition-colors cursor-pointer"
              >
                Lupa kata sandi?
              </button>
            </div>
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
              Masuk ke Akun
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

        {/* Switch Link to Register */}
        <div className="text-center text-xs text-text-muted">
          Belum memiliki akun?{' '}
          <Link
            href={`/register${rawRedirect ? `?redirect=${encodeURIComponent(rawRedirect)}` : ''}`}
            className="text-secondary font-bold hover:underline"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Bantuan Pemulihan Kata Sandi"
      >
        <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <p>
            Untuk alasan keamanan akun penyewa, proses reset sandi dilakukan secara langsung melalui verifikasi nomor WhatsApp resmi Admin RentalinAja.
          </p>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 text-secondary space-y-1">
            <span className="font-bold text-xs uppercase block text-primary">
              Kontak WhatsApp Layanan Akun:
            </span>
            <p className="font-bold text-secondary text-sm font-mono">
              +62 812-3456-7890
            </p>
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
              href="https://wa.me/6281234567890?text=Halo%20Admin%20RentalinAja,%20saya%20membutuhkan%20bantuan%20reset%20kata%20sandi%20akun."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PhoneCall className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Chat WhatsApp Admin
              </Button>
            </a>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
