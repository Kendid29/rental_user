import { ListParams } from './common';
import { Mitra } from './mitra';

export type JenisKendaraan = 'mobil' | 'motor';

export type Transmisi = 'Manual' | 'Matic';

export interface Unit {
  id: string;
  mitraId: string;
  nama: string;
  jenis: JenisKendaraan;
  gambar: string;
  galeri?: string[];
  transmisi: Transmisi;
  kapasitas: number;
  fitur: string[];
  hargaPerHari: number;
  stok: number;
  label?: string;
  rating: number;
  jumlahUlasan: number;
  mitra?: Mitra;
}

export interface GetUnitsParams extends ListParams {
  kota?: string;
  jenis?: JenisKendaraan;
  kapasitas?: number;
  transmisi?: Transmisi;
  hargaMin?: number;
  hargaMax?: number;
  tanggalMulai?: string;
  tanggalSelesai?: string;
}
