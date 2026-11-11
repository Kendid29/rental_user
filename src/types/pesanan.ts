import { ListParams } from './common';
import { Unit } from './unit';
import { Mitra } from './mitra';

export type StatusPesanan =
  | 'menunggu_pembayaran'
  | 'terkonfirmasi'
  | 'dibatalkan'
  | 'selesai';

export type MetodePembayaran =
  | 'va_bca'
  | 'va_mandiri'
  | 'va_bni'
  | 'va_bri'
  | 'qris'
  | 'kartu_kredit'
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'shopeepay'
  | 'indomaret'
  | 'alfamart';

export interface RincianBiaya {
  sewa: number;
  proteksi: number;
  pajak: number;
  total: number;
}

export interface PemesanLain {
  nama: string;
  nomorWA: string;
}

export interface Pesanan {
  id: string;
  userId: string;
  unitId: string;
  unit?: Unit;
  mitra?: Mitra;
  tanggalMulai: string; // ISO date 'YYYY-MM-DD'
  tanggalSelesai: string; // ISO date 'YYYY-MM-DD'
  durasiHari: number;
  namaPenyewa: string;
  nomorWAPenyewa: string;
  pesanUntukOrangLain?: boolean;
  pemesanLain?: PemesanLain;
  metodePembayaran: MetodePembayaran;
  rincianBiaya: RincianBiaya;
  status: StatusPesanan;
  createdAt: string;
}

export interface CreatePesananRequest {
  unitId: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  namaPenyewa: string;
  nomorWAPenyewa: string;
  pesanUntukOrangLain?: boolean;
  pemesanLain?: PemesanLain;
  metodePembayaran: MetodePembayaran;
}

export interface CreatePesananResponse {
  pesanan: Pesanan;
  waAdminLink: string;
}

export interface GetPesananParams extends ListParams {
  status?: StatusPesanan;
}
