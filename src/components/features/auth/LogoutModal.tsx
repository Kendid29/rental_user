'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center space-y-4 py-1">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <LogOut className="w-7 h-7" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="font-[family-name:var(--font-headline)] font-bold text-lg text-primary">
            Konfirmasi Keluar Akun
          </h3>
          <p className="text-xs text-text-muted leading-relaxed px-2">
            Apakah Anda yakin ingin mengakhiri sesi akun ini? Anda harus masuk kembali untuk mengelola transaksi sewa dan data profil Anda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/60">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl justify-center font-bold"
          >
            Batal
          </Button>

          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={onConfirm}
            isLoading={isLoading}
            className="rounded-xl justify-center shadow-md shadow-rose-500/20"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Ya, Keluar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
