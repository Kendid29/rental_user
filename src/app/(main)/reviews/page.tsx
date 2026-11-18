import type { Metadata } from 'next';
import React from 'react';
import { ReviewSection } from '@/components/features/reviews';

export const metadata: Metadata = {
  title: 'Testimoni & Ulasan Pelanggan - RentalinAja',
  description:
    'Pengalaman nyata ribuan pelanggan yang mempercayakan perjalanan liburan keluarga dan mobilitas dinas mereka bersama mitra resmi RentalinAja di berbagai kota.',
};

export default function ReviewsPage() {
  return (
    <div className="flex-1 flex flex-col justify-center min-h-[calc(100vh-160px)]">
      <ReviewSection className="flex-1 flex flex-col justify-center border-y-0" />
    </div>
  );
}
