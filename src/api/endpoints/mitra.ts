import { request } from '../client';
import { GetMitraParams, Mitra, MitraWithUnits, Paginated } from '@/types';

export async function list(params?: GetMitraParams): Promise<Paginated<Mitra>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.kota) query.set('kota', params.kota);
  if (params?.search) query.set('search', params.search);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<Paginated<Mitra>>(`/mitra${qs}`);
}

export async function getById(id: string): Promise<Mitra> {
  return request<Mitra>(`/mitra/${id}`);
}

export async function listWithUnits(params?: GetMitraParams): Promise<MitraWithUnits[]> {
  const query = new URLSearchParams();
  if (params?.kota) query.set('kota', params.kota);
  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<MitraWithUnits[]>(`/mitra/with-units${qs}`);
}
