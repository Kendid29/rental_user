import { ApiClientError } from '@/api/client';
import { GetUnitsParams, Paginated, Unit } from '@/types';
import { simulatedDelay } from '../delay';
import { checkMockError } from '../errorFlag';
import { paginate, sortItems } from '../query';
import { mockStore } from '../store';

export async function list(params?: GetUnitsParams): Promise<Paginated<Unit>> {
  await simulatedDelay();
  checkMockError('unit:list');

  let units = mockStore.getUnits();
  const mitras = mockStore.getMitras();

  // Attach mitra object to each unit
  units = units.map((u) => ({
    ...u,
    mitra: mitras.find((m) => m.id === u.mitraId),
  }));

  // Filter kota
  if (params?.kota) {
    units = units.filter(
      (u) => u.mitra?.kota.toLowerCase() === params.kota?.toLowerCase()
    );
  }

  // Filter jenis (mobil / motor)
  if (params?.jenis) {
    units = units.filter((u) => u.jenis === params.jenis);
  }

  // Filter transmisi (Manual / Matic)
  if (params?.transmisi) {
    units = units.filter((u) => u.transmisi === params.transmisi);
  }

  // Filter kapasitas
  if (params?.kapasitas) {
    units = units.filter((u) => u.kapasitas >= (params.kapasitas || 0));
  }

  // Filter rentang harga
  if (params?.hargaMin !== undefined) {
    units = units.filter((u) => u.hargaPerHari >= (params.hargaMin || 0));
  }
  if (params?.hargaMax !== undefined) {
    units = units.filter((u) => u.hargaPerHari <= (params.hargaMax || 0));
  }

  // Filter search
  if (params?.search) {
    const term = params.search.toLowerCase();
    units = units.filter(
      (u) =>
        u.nama.toLowerCase().includes(term) ||
        u.mitra?.nama.toLowerCase().includes(term) ||
        u.mitra?.kota.toLowerCase().includes(term)
    );
  }

  // Sorting
  if (params?.sort === 'harga') {
    units = sortItems(units, 'hargaPerHari', params.order || 'asc');
  } else if (params?.sort === 'rating') {
    units = sortItems(units, 'rating', params.order || 'desc');
  }

  return paginate(units, params?.page || 1, params?.limit || 12);
}

export async function getById(id: string): Promise<Unit> {
  await simulatedDelay();
  checkMockError('unit:getById');

  const unit = mockStore.getUnitById(id);
  if (!unit) {
    throw new ApiClientError({
      code: 'NOT_FOUND',
      message: `Unit kendaraan dengan ID "${id}" tidak ditemukan`,
    });
  }

  const mitra = mockStore.getMitraById(unit.mitraId);
  return {
    ...unit,
    mitra,
  };
}

export async function checkAvailability(
  id: string,
  tanggalMulai: string,
  tanggalSelesai: string
): Promise<{ available: boolean; stok: number }> {
  void tanggalMulai;
  void tanggalSelesai;
  await simulatedDelay(150, 350);
  checkMockError('unit:availability');

  const unit = mockStore.getUnitById(id);
  if (!unit) {
    throw new ApiClientError({
      code: 'NOT_FOUND',
      message: 'Unit tidak ditemukan',
    });
  }

  return {
    available: unit.stok > 0,
    stok: unit.stok,
  };
}
