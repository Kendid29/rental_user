'use client';

import React, { use, Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/api';
import { Mitra } from '@/types';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

// TODO: Implement full mitra detail page
function DetailMitraContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mitra, setMitra] = useState<Mitra | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMitra() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await api.mitra.getById(id);
        setMitra(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Mitra tidak ditemukan');
      } finally {
        setIsLoading(false);
      }
    }
    loadMitra();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-secondary hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Placeholder Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
                {mitra ? mitra.nama : `Mitra #${id}`}
              </h1>
              {mitra?.isSuperPartner && (
                <Badge variant="superPartner" size="sm">
                  ★ Super Partner
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Kota Layanan: <span className="font-semibold text-primary">{mitra?.kota || 'Indonesia'}</span>
              {mitra?.rating && ` · Rating ${mitra.rating} (${mitra.jumlahUlasan} ulasan)`}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
              Profil Mitra Terverifikasi
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-amber-50 text-amber-800 text-xs border border-amber-200">
            {error} (Menampilkan mode placeholder profil)
          </div>
        )}

        <div className="p-4 rounded-2xl bg-slate-50 border border-border text-xs sm:text-sm text-text-muted leading-relaxed space-y-2">
          <p className="font-semibold text-primary">
            ℹ️ Informasi Halaman Mitra
          </p>
          <p>
            Halaman profil lengkap untuk mitra ini sedang dalam proses pengembangan. Di masa mendatang, halaman ini akan memuat seluruh daftar armada khusus mitra, jam operasional, ulasan terperinci, dan sertifikasi verifikasi.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="secondary" size="md">
              Jelajahi Armada di Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DetailMitraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      }
    >
      <DetailMitraContent params={params} />
    </Suspense>
  );
}
