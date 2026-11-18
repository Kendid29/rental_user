'use client';

import React, { Suspense } from 'react';
import { FleetCatalog } from '@/components/features/fleet/FleetCatalog';

export default function FleetCarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
          Memuat katalog sewa mobil...
        </div>
      }
    >
      <FleetCatalog
        jenis="mobil"
        title="Katalog Sewa Mobil"
        subtitle="Temukan armada mobil terbaik dengan opsi lepas kunci atau dengan pengemudi profesional"
      />
    </Suspense>
  );
}
