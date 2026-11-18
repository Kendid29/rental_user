'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { api } from '@/api';
import { RouteGuard } from '@/hooks/useSesi';
import { AccountSidebar } from '@/components/features/profile';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

function SecurityContent() {
  const router = useRouter();

  const [kataSandiLama, setKataSandiLama] = useState('');
  const [kataSandiBaru, setKataSandiBaru] = useState('');
  const [konfirmasiKataSandi, setKonfirmasiKataSandi] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!kataSandiLama) {
      errors.kataSandiLama = 'Kata sandi saat ini wajib diisi';
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
      toast.success('Kata sandi berhasil diperbarui!');
      setKataSandiLama('');
      setKataSandiBaru('');
      setKonfirmasiKataSandi('');

      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memperbarui kata sandi';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Navigation & Logout */}
        <div className="lg:col-span-4">
          <AccountSidebar />
        </div>

        {/* Right Content: Change Password Form */}
        <div className="lg:col-span-8 space-y-6">
          <Card
            level={1}
            padding="lg"
            className="rounded-3xl shadow-sm border-border/80 bg-white p-6 sm:p-8 space-y-6"
          >
            <div className="border-b border-border/80 pb-4">
              <h2 className="font-[family-name:var(--font-headline)] text-xl font-bold text-primary">
                Ubah Kata Sandi
              </h2>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Amankan akun Anda secara berkala dengan kata sandi yang kuat dan unik.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Kata Sandi Saat Ini"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan sandi lama"
                value={kataSandiLama}
                onChange={(e) => setKataSandiLama(e.target.value)}
                error={validationErrors.kataSandiLama}
                disabled={isSubmitting}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Kata Sandi Baru"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                value={kataSandiBaru}
                onChange={(e) => setKataSandiBaru(e.target.value)}
                error={validationErrors.kataSandiBaru}
                disabled={isSubmitting}
                leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Ulangi Kata Sandi Baru"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ketik ulang kata sandi baru"
                value={konfirmasiKataSandi}
                onChange={(e) => setKonfirmasiKataSandi(e.target.value)}
                error={validationErrors.konfirmasiKataSandi}
                disabled={isSubmitting}
                leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      <span>Sembunyikan karakter sandi</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      <span>Tampilkan karakter sandi</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="shadow-md shadow-blue-500/20 rounded-xl"
                >
                  Perbarui Kata Sandi
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <RouteGuard>
      <SecurityContent />
    </RouteGuard>
  );
}
