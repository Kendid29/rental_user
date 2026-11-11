import { request } from '../client';
import {
  CreatePesananRequest,
  CreatePesananResponse,
  GetPesananParams,
  Paginated,
  Pesanan,
} from '@/types';

export async function list(params?: GetPesananParams): Promise<Paginated<Pesanan>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);

  const qs = query.toString() ? `?${query.toString()}` : '';
  return request<Paginated<Pesanan>>(`/pesanan${qs}`);
}

export async function getById(id: string): Promise<Pesanan> {
  return request<Pesanan>(`/pesanan/${id}`);
}

export async function create(req: CreatePesananRequest): Promise<CreatePesananResponse> {
  return request<CreatePesananResponse>('/pesanan', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
