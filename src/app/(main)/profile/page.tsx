'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { api } from '@/api';
import { useSesi, RouteGuard } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

function ProfileContent() {
  const { user, refreshSesi } = useSesi();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nomorWA, setNomorWA] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setNama(user.nama);
      setEmail(user.email);
      setNomorWA(user.nomorWA);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!nama.trim()) {
      setErrorMessage('Nama lengkap wajib diisi');
      return;
    }

    if (!nomorWA.trim()) {
      setErrorMessage('Nomor WhatsApp wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedWA = normalisasiNomorWA(nomorWA);
      await api.profil.update({
        nama,
        nomorWA: normalizedWA,
      });
      await refreshSesi();
      setSuccessMessage('Data profil berhasil diperbarui.');
      toast.success('Profil berhasil diperbarui!');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal memperbarui profil';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Page Header */}
      <div className="border-b border-border/80 pb-5">
        <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-black text-primary">
          Pengaturan Profil
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
          Kelola informasi identitas akun dan nomor kontak untuk kemudahan koordinasi sewa.
        </p>
      </div>

      {/* User Header Card */}
      <Card
        level={1}
        padding="md"
        className="rounded-3xl p-6 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between gap-4 border-border/80"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary text-white font-black text-xl flex items-center justify-center shadow-md shadow-blue-500/20">
            {nama ? nama.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-primary">{nama}</h3>
            <p className="text-xs text-text-muted">{email}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pelanggan Terdaftar</span>
            </span>
          </div>
        </div>

        <Link href="/profile/security">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Ubah Sandi
          </Button>
        </Link>
      </Card>

      {/* Edit Form */}
      <Card level={1} padding="lg" className="rounded-3xl shadow-sm space-y-5">
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
            label="Nama Lengkap"
            cue="(Sesuai KTP)"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            disabled={isSubmitting}
            leftIcon={<User className="w-4 h-4" />}
          />

          <Input
            label="Alamat Email"
            type="email"
            value={email}
            disabled
            helperText="Alamat email digunakan sebagai identitas login utama dan tidak dapat diubah."
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Nomor WhatsApp"
            cue="(Format 08...)"
            value={nomorWA}
            onChange={(e) => setNomorWA(e.target.value)}
            disabled={isSubmitting}
            helperText="Nomor ini digunakan untuk konfirmasi transaksi sewa dengan admin resmi."
            leftIcon={<Phone className="w-4 h-4" />}
          />

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
              className="shadow-sm shadow-blue-500/20"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard>
      <ProfileContent />
    </RouteGuard>
  );
}
