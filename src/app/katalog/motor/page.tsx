'use client';

import React, { Suspense } from 'react';
import { KatalogView } from '@/components/domain/KatalogView';

export default function KatalogMotorPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat katalog motor...</div>}>
      <KatalogView
        jenis="motor"
        title="Katalog Sewa Motor"
        subtitle="Solusi lincah dan hemat untuk menjelajahi kota dan wisata favorit"
      />
    </Suspense>
  );
}
