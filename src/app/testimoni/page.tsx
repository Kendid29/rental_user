import type { Metadata } from 'next';
import React from 'react';
import { SectionTestimoni } from '@/components/domain/SectionTestimoni';

export const metadata: Metadata = {
  title: 'Testimoni Pelanggan - RentalinAja',
  description:
    'Pengalaman nyata ribuan pelanggan yang mempercayakan perjalanan liburan keluarga dan mobilitas dinas mereka bersama mitra resmi RentalinAja di berbagai kota.',
};

export default function TestimoniPage() {
  return (
    <div className="flex-1 flex flex-col justify-center min-h-[calc(100vh-160px)]">
      <SectionTestimoni className="flex-1 flex flex-col justify-center border-y-0" />
    </div>
  );
}

