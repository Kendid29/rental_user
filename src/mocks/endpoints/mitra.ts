import { ApiClientError } from '@/api/client';
import { GetMitraParams, Mitra, MitraWithUnits, Paginated } from '@/types';
import { simulatedDelay } from '../delay';
import { checkMockError } from '../errorFlag';
import { paginate } from '../query';
import { mockStore } from '../store';

export async function list(params?: GetMitraParams): Promise<Paginated<Mitra>> {
  await simulatedDelay();
  checkMockError('mitra:list');

  let mitras = mockStore.getMitras();

  if (params?.kota) {
    mitras = mitras.filter(
      (m) => m.kota.toLowerCase() === params.kota?.toLowerCase()
    );
  }

  if (params?.search) {
    const term = params.search.toLowerCase();
    mitras = mitras.filter(
      (m) =>
        m.nama.toLowerCase().includes(term) ||
        m.kota.toLowerCase().includes(term)
    );
  }

  return paginate(mitras, params?.page || 1, params?.limit || 10);
}

export async function getById(id: string): Promise<Mitra> {
  await simulatedDelay();
  checkMockError('mitra:getById');

  const mitra = mockStore.getMitraById(id);
  if (!mitra) {
    throw new ApiClientError({
      code: 'NOT_FOUND',
      message: `Mitra dengan ID "${id}" tidak ditemukan`,
    });
  }

  return mitra;
}

export async function listWithUnits(params?: GetMitraParams): Promise<MitraWithUnits[]> {
  await simulatedDelay();
  checkMockError('mitra:listWithUnits');

  let mitras = mockStore.getMitras();
  const allUnits = mockStore.getUnits();

  if (params?.kota) {
    mitras = mitras.filter(
      (m) => m.kota.toLowerCase() === params.kota?.toLowerCase()
    );
  }

  // Maksimal 2 unit per mitra sesuai PRD F1
  return mitras.map((m) => {
    const mitraUnits = allUnits.filter((u) => u.mitraId === m.id).slice(0, 2);
    return {
      ...m,
      units: mitraUnits,
    };
  });
}
