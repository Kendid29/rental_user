import { RincianBiaya } from '@/types';

export const BIAYA_PROTEKSI_PER_HARI = 25000;
export const TARIF_PAJAK_PPN = 0.11; // 11% PPN

/**
 * Menghitung selisih hari antara dua tanggal string (YYYY-MM-DD)
 */
export function hitungDurasiHari(tanggalMulai: string, tanggalSelesai: string): number {
  if (!tanggalMulai || !tanggalSelesai) return 1;

  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Minimal 1 hari
  return Math.max(1, diffDays);
}

/**
 * Menghitung rincian biaya pemesanan sewa kendaraan
 */
export function hitungRincianBiaya(
  hargaPerHari: number,
  tanggalMulai: string,
  tanggalSelesai: string
): { durasiHari: number; rincian: RincianBiaya } {
  const durasiHari = hitungDurasiHari(tanggalMulai, tanggalSelesai);
  const sewa = hargaPerHari * durasiHari;
  const proteksi = BIAYA_PROTEKSI_PER_HARI * durasiHari;
  const pajak = Math.round(sewa * TARIF_PAJAK_PPN);
  const total = sewa + proteksi + pajak;

  return {
    durasiHari,
    rincian: {
      sewa,
      proteksi,
      pajak,
      total,
    },
  };
}

/**
 * Format angka ke Rupiah Indonesia (cth: Rp 700.000)
 */
export function formatRupiah(amount: number): string {
  return `Rp ${new Intl.NumberFormat('id-ID').format(amount)}`;
}

/**
 * Format tanggal ISO ke format Indonesia (cth: 8 Nov 2026)
 */
export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Normalisasi nomor WhatsApp ke format internasional (cth: 628123456789)
 */
export function normalisasiNomorWA(nomor: string): string {
  const clean = nomor.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    return `62${clean.slice(1)}`;
  }
  if (clean.startsWith('62')) {
    return clean;
  }
  return `62${clean}`;
}
