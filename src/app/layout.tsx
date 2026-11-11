import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import { SesiProvider } from '@/hooks/useSesi';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Rentaku - Marketplace Rental Mobil & Motor Terpadu',
  description: 'Satu aplikasi yang menyatukan seluruh rental kendaraan di setiap kota',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-canvas text-text-main">
        <SesiProvider>
          <Suspense fallback={<div className="h-16 sm:h-20 bg-white border-b border-border" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </SesiProvider>
      </body>
    </html>
  );
}
