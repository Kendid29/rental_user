import { ApiClientError } from '@/api/client';
import { UbahSandiRequest, UpdateProfilRequest, User } from '@/types';
import { simulatedDelay } from '../delay';
import { checkMockError } from '../errorFlag';
import { mockStore } from '../store';

export async function get(): Promise<User> {
  await simulatedDelay();
  checkMockError('profil:get');

  const user = mockStore.getCurrentUser();
  if (!user) {
    throw new ApiClientError({
      code: 'UNAUTHORIZED',
      message: 'Sesi pengguna tidak ditemukan atau belum masuk',
    });
  }

  return user;
}

export async function update(req: UpdateProfilRequest): Promise<User> {
  await simulatedDelay();
  checkMockError('profil:update');

  const currentUser = mockStore.getCurrentUser();
  if (!currentUser) {
    throw new ApiClientError({
      code: 'UNAUTHORIZED',
      message: 'Sesi pengguna tidak ditemukan',
    });
  }

  if (!req.nama || !req.nomorWA) {
    throw new ApiClientError({
      code: 'VALIDATION_ERROR',
      message: 'Nama dan nomor WhatsApp wajib diisi',
    });
  }

  const updated = mockStore.updateUser(currentUser.id, {
    nama: req.nama,
    nomorWA: req.nomorWA,
  });

  if (!updated) {
    throw new ApiClientError({
      code: 'NOT_FOUND',
      message: 'Gagal memperbarui profil pengguna',
    });
  }

  mockStore.setCurrentUser(updated);
  return updated;
}

export async function ubahSandi(req: UbahSandiRequest): Promise<void> {
  await simulatedDelay();
  checkMockError('profil:ubahSandi');

  if (!req.kataSandiLama || !req.kataSandiBaru || !req.konfirmasiKataSandi) {
    throw new ApiClientError({
      code: 'VALIDATION_ERROR',
      message: 'Semua kolom kata sandi wajib diisi',
    });
  }

  if (req.kataSandiBaru !== req.konfirmasiKataSandi) {
    throw new ApiClientError({
      code: 'PASSWORD_MISMATCH',
      message: 'Konfirmasi kata sandi baru tidak cocok',
    });
  }

  if (req.kataSandiBaru.length < 6) {
    throw new ApiClientError({
      code: 'PASSWORD_TOO_SHORT',
      message: 'Kata sandi baru minimal 6 karakter',
    });
  }
}
