'use client';

import React, { Suspense } from 'react';
import { KatalogView } from '@/components/domain/KatalogView';

export default function KatalogMobilPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat katalog mobil...</div>}>
      <KatalogView
        jenis="mobil"
        title="Katalog Sewa Mobil"
        subtitle="Temukan armada mobil terbaik dengan opsi lepas kunci atau dengan pengemudi"
      />
    </Suspense>
  );
}
