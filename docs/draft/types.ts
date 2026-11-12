// Draft Types untuk RentalinAja FE
// Acuan: PRD_RentalinAja_User.md Bagian 9

export type JenisKendaraan = 'mobil' | 'motor';

export type Transmisi = 'Manual' | 'Matic';

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

export interface User {
  id: string;
  nama: string;
  email: string;
  nomorWA: string;
}

export interface Mitra {
  id: string;
  nama: string;
  kota: string;
  rating: number;
  jumlahUlasan: number;
  unitTersedia: number;
  isSuperPartner: boolean;
  layanan: string[]; // e.g. ["Gratis Antar Stasiun / Bandara", "Unit Bersih & Terawat"]
}

export interface Unit {
  id: string;
  mitraId: string;
  nama: string;
  jenis: JenisKendaraan;
  gambar: string;
  galeri?: string[];
  transmisi: Transmisi;
  kapasitas: number; // jumlah kursi
  fitur: string[]; // e.g. ["AC Dingin", "Audio Bluetooth", "Termasuk 2 Helm"]
  hargaPerHari: number;
  stok: number;
  label?: string; // e.g. "Lepas Kunci", "Super Partner"
  rating: number;
  jumlahUlasan: number;
}

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
