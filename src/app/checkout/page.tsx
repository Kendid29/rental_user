'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/api';
import { MetodePembayaran, Unit } from '@/types';
import { useSesi, RouteGuard } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import { ProgressCheckout } from '@/components/domain/ProgressCheckout';
import { RingkasanPesanan } from '@/components/domain/RingkasanPesanan';
import { PilihanMetodeBayar } from '@/components/domain/PilihanMetodeBayar';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSesi();

  const unitId = searchParams.get('unitId');
  const tanggalMulai = searchParams.get('mulai');
  const tanggalSelesai = searchParams.get('selesai');

  const [unit, setUnit] = useState<Unit | null>(null);
  const [isLoadingUnit, setIsLoadingUnit] = useState(true);
  const [unitError, setUnitError] = useState<string | null>(null);

  // Form State
  const [namaPenyewa, setNamaPenyewa] = useState('');
  const [nomorWAPenyewa, setNomorWAPenyewa] = useState('');
  const [pesanUntukOrangLain, setPesanUntukOrangLain] = useState(false);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [nomorWAPenerima, setNomorWAPenerima] = useState('');
  const [metodePembayaran, setMetodePembayaran] = useState<MetodePembayaran>('qris');

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Prefill user data if available
  useEffect(() => {
    if (user) {
      if (!namaPenyewa) setNamaPenyewa(user.nama);
      if (!nomorWAPenyewa) setNomorWAPenyewa(user.nomorWA);
    }
  }, [user, namaPenyewa, nomorWAPenyewa]);

  // Fetch Unit
  const loadUnit = useCallback(async () => {
    if (!unitId || !tanggalMulai || !tanggalSelesai) {
      router.replace('/');
      return;
    }

    setIsLoadingUnit(true);
    setUnitError(null);
    try {
      const data = await api.unit.getById(unitId);
      setUnit(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat detail unit checkout';
      setUnitError(msg);
    } finally {
      setIsLoadingUnit(false);
    }
  }, [unitId, tanggalMulai, tanggalSelesai, router]);

  useEffect(() => {
    loadUnit();
  }, [loadUnit]);

  // Form Validation
  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!namaPenyewa.trim()) {
      errors.namaPenyewa = 'Nama penyewa wajib diisi';
    }

    const cleanWA = nomorWAPenyewa.replace(/\D/g, '');
    if (!nomorWAPenyewa.trim()) {
      errors.nomorWAPenyewa = 'Nomor WhatsApp wajib diisi';
    } else if (cleanWA.length < 9) {
      errors.nomorWAPenyewa = 'Nomor WhatsApp minimal 9 digit';
    }

    if (pesanUntukOrangLain) {
      if (!namaPenerima.trim()) {
        errors.namaPenerima = 'Nama penerima unit wajib diisi';
      }
      const cleanReceiverWA = nomorWAPenerima.replace(/\D/g, '');
      if (!nomorWAPenerima.trim()) {
        errors.nomorWAPenerima = 'Nomor WhatsApp penerima wajib diisi';
      } else if (cleanReceiverWA.length < 9) {
        errors.nomorWAPenerima = 'Nomor WhatsApp penerima minimal 9 digit';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePesanan = async () => {
    if (isSubmitting || !unit || !tanggalMulai || !tanggalSelesai) return;
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const normalizedWAPenyewa = normalisasiNomorWA(nomorWAPenyewa);
      const normalizedWAPenerima = pesanUntukOrangLain
        ? normalisasiNomorWA(nomorWAPenerima)
        : '';

      const res = await api.pesanan.create({
        unitId: unit.id,
        tanggalMulai,
        tanggalSelesai,
        namaPenyewa,
        nomorWAPenyewa: normalizedWAPenyewa,
        pesanUntukOrangLain,
        pemesanLain: pesanUntukOrangLain
          ? {
              nama: namaPenerima,
              nomorWA: normalizedWAPenerima,
            }
          : undefined,
        metodePembayaran,
      });

      // Buka tautan WhatsApp Admin di tab baru
      if (typeof window !== 'undefined' && res.waAdminLink) {
        window.open(res.waAdminLink, '_blank');
      }

      // Arahkan user ke halaman detail pesanan
      router.push(`/pesanan/${res.pesanan.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat pesanan. Silakan periksa formulir dan coba lagi.';
      setSubmitError(msg);
      setIsSubmitting(false); // Kembalikan tombol agar bisa coba lagi
    }
  };

  if (isLoadingUnit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-72 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-64 rounded-2xl w-full" />
            <Skeleton className="h-48 rounded-2xl w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96 rounded-2xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (unitError || !unit || !tanggalMulai || !tanggalSelesai) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Data Checkout Tidak Lengkap"
          message={unitError || 'Parameter kendaraan atau tanggal sewa belum dipilih secara lengkap.'}
          onRetry={() => router.push('/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 3-Step Progress Bar */}
      <ProgressCheckout currentStep={2} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interaction Area: 8 Columns Desktop */}
        <div className="lg:col-span-8 space-y-6">
          {submitError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-urgency font-semibold flex items-center gap-2.5">
              <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          {/* Form Penyewa */}
          <Card level={1} padding="lg" className="space-y-5">
            <div className="border-b border-border pb-3">
              <h2 className="font-[family-name:var(--font-headline)] text-lg font-bold text-primary">
                Data Pemesan / Penyewa
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Pastikan nama dan nomor WhatsApp aktif untuk verifikasi serah terima kunci
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap Penyewa"
                cue="(Sesuai KTP)"
                placeholder="Contoh: Budi Santoso"
                value={namaPenyewa}
                onChange={(e) => setNamaPenyewa(e.target.value)}
                error={validationErrors.namaPenyewa}
                disabled={isSubmitting}
              />

              <Input
                label="Nomor WhatsApp"
                cue="(Format 08... atau 62...)"
                placeholder="081234567890"
                value={nomorWAPenyewa}
                onChange={(e) => setNomorWAPenyewa(e.target.value)}
                error={validationErrors.nomorWAPenyewa}
                disabled={isSubmitting}
              />
            </div>

            {/* Checkbox: Pesan untuk orang lain */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={pesanUntukOrangLain}
                  onChange={(e) => setPesanUntukOrangLain(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 text-secondary rounded border-slate-300 focus:ring-secondary/20"
                />
                <span className="text-xs font-semibold text-primary">
                  Saya memesan untuk orang lain (Pengemudi / Penerima berbeda)
                </span>
              </label>

              {pesanUntukOrangLain && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap Penerima Unit"
                    cue="(Sesuai KTP)"
                    placeholder="Nama teman / keluarga"
                    value={namaPenerima}
                    onChange={(e) => setNamaPenerima(e.target.value)}
                    error={validationErrors.namaPenerima}
                    disabled={isSubmitting}
                  />

                  <Input
                    label="Nomor WhatsApp Penerima"
                    placeholder="08xxxxxxxxxx"
                    value={nomorWAPenerima}
                    onChange={(e) => setNomorWAPenerima(e.target.value)}
                    error={validationErrors.nomorWAPenerima}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Payment Method Selector */}
          <Card level={1} padding="lg">
            <PilihanMetodeBayar
              selectedMetode={metodePembayaran}
              onSelect={(metode) => setMetodePembayaran(metode)}
            />
          </Card>

          {/* Ketentuan Sewa */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 text-xs text-text-muted space-y-1.5">
            <p className="font-bold text-primary flex items-center gap-1.5 text-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Alur Transaksi & Konfirmasi
            </p>
            <p className="leading-relaxed">
              Setelah menekan tombol pembayaran, pesanan akan tercatat di sistem dengan status <strong>Menunggu Konfirmasi</strong>. Anda akan diarahkan otomatis ke WhatsApp resmi Admin RentaKu untuk mengirimkan ringkasan pesanan dan menerima instruksi nomor pembayaran.
            </p>
          </div>
        </div>

        {/* Right Sticky Summary: 4 Columns Desktop */}
        <div className="lg:col-span-4 sticky top-24">
          <RingkasanPesanan
            unit={unit}
            tanggalMulai={tanggalMulai}
            tanggalSelesai={tanggalSelesai}
            onSubmitClick={handleCreatePesanan}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RouteGuard>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat checkout...</div>}>
        <CheckoutForm />
      </Suspense>
    </RouteGuard>
  );
}
