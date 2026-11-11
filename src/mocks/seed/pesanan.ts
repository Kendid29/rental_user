import { Pesanan } from '@/types';
import { SEED_UNITS } from './unit';
import { SEED_MITRA } from './mitra';

export const SEED_PESANAN: Pesanan[] = [
  {
    id: 'ORD-20261108-001',
    userId: 'usr-demo-01',
    unitId: 'unit-01',
    unit: SEED_UNITS[0],
    mitra: SEED_MITRA[0],
    tanggalMulai: '2026-11-10',
    tanggalSelesai: '2026-11-12',
    durasiHari: 2,
    namaPenyewa: 'Budi Santoso',
    nomorWAPenyewa: '6281234567890',
    pesanUntukOrangLain: false,
    metodePembayaran: 'qris',
    rincianBiaya: {
      sewa: 1400000,
      proteksi: 50000,
      pajak: 140000,
      total: 1590000,
    },
    status: 'menunggu_pembayaran',
    createdAt: '2026-11-08T10:00:00Z',
  },
  {
    id: 'ORD-20261101-002',
    userId: 'usr-demo-01',
    unitId: 'unit-05',
    unit: SEED_UNITS[4],
    mitra: SEED_MITRA[2],
    tanggalMulai: '2026-11-01',
    tanggalSelesai: '2026-11-03',
    durasiHari: 2,
    namaPenyewa: 'Budi Santoso',
    nomorWAPenyewa: '6281234567890',
    pesanUntukOrangLain: false,
    metodePembayaran: 'va_bca',
    rincianBiaya: {
      sewa: 150000,
      proteksi: 20000,
      pajak: 15000,
      total: 185000,
    },
    status: 'terkonfirmasi',
    createdAt: '2026-11-01T08:30:00Z',
  },
];
