'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Save,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/api';
import { useSesi } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export interface ProfileEditFormProps {
  className?: string;
  showQuickOrders?: boolean;
}

export function ProfileEditForm({
  className,
  showQuickOrders = true,
}: ProfileEditFormProps) {
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
    <div className={className || 'space-y-6'}>
      <Card
        level={1}
        padding="lg"
        className="rounded-3xl shadow-sm border-border/80 bg-white p-6 sm:p-8 space-y-6"
      >
        <div className="border-b border-border/80 pb-4">
          <h2 className="font-[family-name:var(--font-headline)] text-xl font-bold text-primary">
            Informasi Data Diri
          </h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Perbarui identitas akun Anda untuk kelancaran verifikasi dan serah terima kunci armada.
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
            label="Nama Lengkap"
            cue="(Sesuai KTP)"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            disabled={isSubmitting}
            leftIcon={<User className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Alamat Email"
            type="email"
            value={email}
            disabled
            helperText="Alamat email terverifikasi sebagai identitas login utama dan tidak dapat diubah."
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />

          <Input
            label="Nomor WhatsApp Aktif"
            cue="(Format 08...)"
            value={nomorWA}
            onChange={(e) => setNomorWA(e.target.value)}
            disabled={isSubmitting}
            helperText="Nomor aktif ini digunakan oleh admin mitra untuk koordinasi serah terima armada."
            leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
          />

          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<Save className="w-4 h-4" />}
              className="shadow-md shadow-blue-500/20 rounded-xl"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Orders Link Banner */}
      {showQuickOrders && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/60 border border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary">
                Pantau Pesanan Sewa Anda
              </p>
              <p className="text-xs text-text-muted">
                Lihat rincian status pembayaran, jadwal sewa, dan konfirmasi WhatsApp.
              </p>
            </div>
          </div>

          <Link href="/orders" className="shrink-0">
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="bg-white hover:bg-slate-50 shadow-2xs rounded-xl"
            >
              Ke Pesanan Saya
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
