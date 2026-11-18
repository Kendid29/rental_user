'use client';

import React, { Suspense } from 'react';
import { RegisterForm } from '@/components/features/auth';

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md px-4 py-12 text-center text-sm font-semibold text-text-muted">
          Memuat formulir pendaftaran...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
