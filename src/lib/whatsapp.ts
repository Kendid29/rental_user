import { nomorWaAdmin } from '@/config/env';
import { Pesanan } from '@/types';
import { formatRupiah, formatTanggalIndo } from './pricing';

/**
 * Format teks konfirmasi WhatsApp admin untuk pesanan
 */
export function buildWaAdminMessage(pesanan: Pesanan): string {
  const unitNama = pesanan.unit?.nama || 'Unit Kendaraan';
  const mitraNama = pesanan.mitra?.nama || '-';
  const kota = pesanan.mitra?.kota || '-';
  const rentangTanggal = `${formatTanggalIndo(pesanan.tanggalMulai)} s/d ${formatTanggalIndo(pesanan.tanggalSelesai)}`;
  const totalStr = formatRupiah(pesanan.rincianBiaya.total);

  return (
    `*KONFIRMASI PESANAN RENTAKU*\n` +
    `--------------------------------\n` +
    `*ID Pesanan:* ${pesanan.id}\n` +
    `*Penyewa:* ${pesanan.namaPenyewa} (${pesanan.nomorWAPenyewa})\n` +
    (pesanan.pesanUntukOrangLain && pesanan.pemesanLain
      ? `*Penerima Unit:* ${pesanan.pemesanLain.nama} (${pesanan.pemesanLain.nomorWA})\n`
      : '') +
    `*Kendaraan:* ${unitNama}\n` +
    `*Mitra:* ${mitraNama} (${kota})\n` +
    `*Jadwal:* ${rentangTanggal} (${pesanan.durasiHari} Hari)\n` +
    `*Metode Bayar:* ${pesanan.metodePembayaran.toUpperCase()}\n` +
    `*Total Bayar:* ${totalStr}\n` +
    `--------------------------------\n` +
    `Halo Admin Rentaku, saya ingin melakukan konfirmasi pembayaran untuk pesanan di atas. Mohon instruksi nomor rekening / detail pembayaran. Terima kasih!`
  );
}

/**
 * Membuat tautan resmi WhatsApp admin Rentaku
 */
export function buildWaAdminLink(pesanan: Pesanan): string {
  const message = buildWaAdminMessage(pesanan);
  const cleanPhone = nomorWaAdmin.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Membuat tautan WhatsApp untuk tanya-tanya unit (tanpa pesanan)
 */
export function buildWaTanyaUnitLink(unitNama: string, mitraNama: string, kota: string): string {
  const cleanPhone = nomorWaAdmin.replace(/\D/g, '');
  const message =
    `Halo Admin Rentaku, saya ingin bertanya tentang ketersediaan unit *${unitNama}* di *${mitraNama} (${kota})*. Apakah unit ini tersedia untuk jadwal sewa dalam waktu dekat?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
