import { request } from '../client';
import { GetUnitsParams, Paginated, Unit } from '@/types';

export async function list(params?: GetUnitsParams): Promise<Paginated<Unit>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.kota) query.set('kota', params.kota);
  if (params?.jenis) query.set('jenis', params.jenis);
  if (params?.transmisi) query.set('transmisi', params.transmisi);
  if (params?.kapasitas) query.set('kapasitas', String(params.kapasitas));
  if (params?.hargaMin) query.set('hargaMin', String(params.hargaMin));
  if (params?.hargaMax) query.set('hargaMax', String(params.hargaMax));
  if (params?.sort) query.set('sort', params.sort);
  if (params?.order) query.set('order', params.order);
  if (params?.tanggalMulai) query.set('tanggalMulai', params.tanggalMulai);
  if (params?.tanggalSelesai) query.set('tanggalSelesai', params.tanggalSelesai);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<Paginated<Unit>>(`/unit${qs}`);
}

export async function getById(id: string): Promise<Unit> {
  return request<Unit>(`/unit/${id}`);
}

export async function checkAvailability(
  id: string,
  tanggalMulai: string,
  tanggalSelesai: string
): Promise<{ available: boolean; stok: number }> {
  const qs = `?tanggalMulai=${encodeURIComponent(tanggalMulai)}&tanggalSelesai=${encodeURIComponent(tanggalSelesai)}`;
  return request<{ available: boolean; stok: number }>(`/unit/${id}/availability${qs}`);
}
