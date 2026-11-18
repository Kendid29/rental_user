import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { SesiProvider } from '@/hooks/useSesi';
import { ToastProvider } from '@/components/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'RentalinAja - Marketplace Rental Mobil & Motor Terpadu',
  description: 'Satu aplikasi yang menyatukan seluruh rental kendaraan di setiap kota',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-canvas text-text-main">
        <SesiProvider>
          {children}
          <ToastProvider />
        </SesiProvider>
      </body>
    </html>
  );
}
