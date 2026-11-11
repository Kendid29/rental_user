import { request } from '../client';

export async function list(): Promise<string[]> {
  return request<string[]>('/kota');
}
