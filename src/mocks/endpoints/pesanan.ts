import { ApiClientError } from '@/api/client';
import { hitungRincianBiaya } from '@/lib/pricing';
import { buildWaAdminLink } from '@/lib/whatsapp';
import {
  CreatePesananRequest,
  CreatePesananResponse,
  GetPesananParams,
  Paginated,
  Pesanan,
  StatusPesanan,
} from '@/types';
import { simulatedDelay } from '../delay';
import { checkMockError } from '../errorFlag';
import { paginate } from '../query';
import { mockStore } from '../store';

export async function list(params?: GetPesananParams): Promise<Paginated<Pesanan>> {
  await simulatedDelay();
  checkMockError('pesanan:list');

  const currentUser = mockStore.getCurrentUser();
  let pesanans = mockStore.getPesanans();

  // Filter pesanan milik user yang sedang login (atau semua jika demo)
  if (currentUser) {
    pesanans = pesanans.filter((p) => p.userId === currentUser.id);
  }

  // Filter status jika ada
  if (params?.status) {
    pesanans = pesanans.filter((p) => p.status === params.status);
  }

  return paginate(pesanans, params?.page || 1, params?.limit || 10);
}

export async function getById(id: string): Promise<Pesanan> {
  await simulatedDelay();
  checkMockError('pesanan:getById');

  const pesanan = mockStore.getPesananById(id);
  if (!pesanan) {
    throw new ApiClientError({
      code: 'NOT_FOUND',
      message: `Pesanan dengan ID "${id}" tidak ditemukan`,
    });
  }

  return pesanan;
}

export async function create(req: CreatePesananRequest): Promise<CreatePesananResponse> {
  await simulatedDelay(400, 800);
  checkMockError('pesanan:create');

  if (!req.unitId || !req.tanggalMulai || !req.tanggalSelesai || !req.namaPenyewa || !req.nomorWAPenyewa) {
    throw new ApiClientError({
      code: 'VALIDATION_ERROR',
      message: 'Semua informasi wajib pemesanan harus diisi',
    });
  }

  const unit = mockStore.getUnitById(req.unitId);
  if (!unit) {
    throw new ApiClientError({
      code: 'UNIT_NOT_FOUND',
      message: 'Unit yang dipilih tidak ditemukan',
    });
  }

  if (unit.stok <= 0) {
    throw new ApiClientError({
      code: 'UNIT_OUT_OF_STOCK',
      message: 'Maaf, unit ini sedang tidak tersedia untuk rentang tanggal yang dipilih',
    });
  }

  const mitra = mockStore.getMitraById(unit.mitraId);
  const currentUser = mockStore.getCurrentUser();
  const userId = currentUser ? currentUser.id : 'usr-demo-01';

  // Hitung rincian biaya
  const { durasiHari, rincian } = hitungRincianBiaya(
    unit.hargaPerHari,
    req.tanggalMulai,
    req.tanggalSelesai
  );

  const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSeq = Math.floor(100 + Math.random() * 900);
  const pesananId = `ORD-${dateCode}-${randomSeq}`;

  const pesanan: Pesanan = {
    id: pesananId,
    userId,
    unitId: unit.id,
    unit,
    mitra,
    tanggalMulai: req.tanggalMulai,
    tanggalSelesai: req.tanggalSelesai,
    durasiHari,
    namaPenyewa: req.namaPenyewa,
    nomorWAPenyewa: req.nomorWAPenyewa,
    pesanUntukOrangLain: req.pesanUntukOrangLain,
    pemesanLain: req.pemesanLain,
    metodePembayaran: req.metodePembayaran,
    rincianBiaya: rincian,
    status: 'menunggu_pembayaran', // Wajib menunggu_pembayaran sesuai PRD
    createdAt: new Date().toISOString(),
  };

  mockStore.addPesanan(pesanan);
  const waAdminLink = buildWaAdminLink(pesanan);

  return {
    pesanan,
    waAdminLink,
  };
}

/**
 * Helper internal mock untuk pengujian alur status pesanan (misalnya admin konfirmasi)
 * Hanya tersedia di mode mock, tidak dipanggil oleh alur user reguler
 */
export function _updatePesananStatus(id: string, status: StatusPesanan): Pesanan {
  const updated = mockStore.updatePesananStatus(id, status);
  if (!updated) {
    throw new ApiClientError({
      code: 'NOT_FOUND',
      message: 'Pesanan tidak ditemukan',
    });
  }
  return updated;
}
