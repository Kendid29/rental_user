'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Info } from 'lucide-react';
import { api } from '@/api';
import { MetodePembayaran, Unit } from '@/types';
import { useSesi, RouteGuard } from '@/hooks/useSesi';
import { normalisasiNomorWA } from '@/lib/pricing';
import {
  CheckoutProgress,
  OrderSummary,
  PaymentSelector,
  CheckoutCustomerForm,
} from '@/components/features/checkout';
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
  const [metodePembayaran, setMetodePembayaran] =
    useState<MetodePembayaran>('qris');

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Prefill user data if available
  useEffect(() => {
    if (user) {
      if (!namaPenyewa) setNamaPenyewa(user.nama);
      if (!nomorWAPenyewa) setNomorWAPenyewa(user.nomorWA);
    }
  }, [user, namaPenyewa, nomorWAPenyewa]);

  // Fetch Unit Details
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
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal memuat detail unit checkout';
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
      errors.nomorWAPenyewa = 'Nomor WhatsApp aktif wajib diisi';
    } else if (cleanWA.length < 9) {
      errors.nomorWAPenyewa = 'Nomor WhatsApp minimal 9 digit';
    }

    if (pesanUntukOrangLain) {
      if (!namaPenerima.trim()) {
        errors.namaPenerima = 'Nama penerima / pengemudi wajib diisi';
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

      // Buka tautan WhatsApp Admin resmi
      if (typeof window !== 'undefined' && res.waAdminLink) {
        window.open(res.waAdminLink, '_blank');
      }

      // Redirect ke riwayat detail pesanan
      router.push(`/orders/${res.pesanan.id}`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Gagal membuat pesanan. Silakan periksa formulir dan coba lagi.';
      setSubmitError(msg);
      setIsSubmitting(false);
    }
  };

  if (isLoadingUnit) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-72 mx-auto" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-64 rounded-3xl w-full" />
            <Skeleton className="h-48 rounded-3xl w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96 rounded-3xl w-full" />
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
          message={
            unitError ||
            'Parameter kendaraan atau tanggal sewa belum dipilih secara lengkap.'
          }
          onRetry={() => router.push('/')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 3-Step Progress Header */}
      <CheckoutProgress currentStep={2} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Form & Payment Method */}
        <div className="lg:col-span-8 space-y-6">
          {submitError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-600 font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Form Penyewa Component */}
          <CheckoutCustomerForm
            namaPenyewa={namaPenyewa}
            setNamaPenyewa={setNamaPenyewa}
            nomorWAPenyewa={nomorWAPenyewa}
            setNomorWAPenyewa={setNomorWAPenyewa}
            pesanUntukOrangLain={pesanUntukOrangLain}
            setPesanUntukOrangLain={setPesanUntukOrangLain}
            namaPenerima={namaPenerima}
            setNamaPenerima={setNamaPenerima}
            nomorWAPenerima={nomorWAPenerima}
            setNomorWAPenerima={setNomorWAPenerima}
            validationErrors={validationErrors}
            disabled={isSubmitting}
          />

          {/* Payment Method Selector Card */}
          <Card level={1} padding="lg" className="rounded-3xl shadow-sm">
            <PaymentSelector
              selectedMetode={metodePembayaran}
              onSelect={(metode) => setMetodePembayaran(metode)}
            />
          </Card>

          {/* Transaction Flow Info Banner */}
          <div className="p-4.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-text-muted space-y-1.5">
            <p className="font-bold text-primary flex items-center gap-2 text-secondary">
              <Info className="w-4 h-4" />
              <span>Alur Konfirmasi Transaksi</span>
            </p>
            <p className="leading-relaxed text-slate-600">
              Setelah menekan tombol pemesanan, data akan dicatat dan Anda otomatis diarahkan ke WhatsApp resmi Admin RentalinAja untuk konfirmasi ketersediaan unit fisik dan petunjuk pembayaran.
            </p>
          </div>
        </div>

        {/* Right Sticky Order Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <OrderSummary
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
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
            Memuat checkout...
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </RouteGuard>
  );
}
