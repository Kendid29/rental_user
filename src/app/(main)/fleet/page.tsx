'use client';

import React, { Suspense } from 'react';
import { FleetCatalog } from '@/components/features/fleet/FleetCatalog';

export default function FleetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
          Memuat seluruh katalog armada...
        </div>
      }
    >
      <FleetCatalog
        jenis="semua"
        title="Katalog Seluruh Armada"
        subtitle="Temukan pilihan mobil dan motor terbaik dengan opsi lepas kunci atau dengan sopir berpengalaman"
      />
    </Suspense>
  );
}
