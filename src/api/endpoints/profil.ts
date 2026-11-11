import { request } from '../client';
import { UbahSandiRequest, UpdateProfilRequest, User } from '@/types';

export async function get(): Promise<User> {
  return request<User>('/profil');
}

export async function update(req: UpdateProfilRequest): Promise<User> {
  return request<User>('/profil', {
    method: 'PUT',
    body: JSON.stringify(req),
  });
}

export async function ubahSandi(req: UbahSandiRequest): Promise<void> {
  return request<void>('/profil/ubah-sandi', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
