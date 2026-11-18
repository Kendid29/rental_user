'use client';

import React, { Suspense } from 'react';
import { FleetCatalog } from '@/components/features/fleet/FleetCatalog';

export default function FleetBikesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-semibold text-text-muted">
          Memuat katalog sewa motor...
        </div>
      }
    >
      <FleetCatalog
        jenis="motor"
        title="Katalog Sewa Motor"
        subtitle="Jelajahi sudut kota dengan praktis dan hemat bersama armada motor matic dan maxi tour terawat"
      />
    </Suspense>
  );
}
