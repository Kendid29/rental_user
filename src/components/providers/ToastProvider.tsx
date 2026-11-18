'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#FFFFFF',
          color: '#102447',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          boxShadow:
            '0 12px 28px -6px rgba(16, 36, 71, 0.12), 0 4px 12px -2px rgba(16, 36, 71, 0.06)',
          fontSize: '13px',
          fontWeight: 600,
          padding: '12px 18px',
          fontFamily: 'var(--font-body)',
        },
        success: {
          iconTheme: {
            primary: '#00C48C',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#FF4D4D',
            secondary: '#FFFFFF',
          },
        },
      }}
    />
  );
}
