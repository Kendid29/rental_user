import { ApiClientError } from '@/api/client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types';
import { simulatedDelay } from '../delay';
import { checkMockError } from '../errorFlag';
import { mockStore } from '../store';

export async function login(req: LoginRequest): Promise<LoginResponse> {
  await simulatedDelay();
  checkMockError('auth:login');

  if (!req.email || !req.kataSandi) {
    throw new ApiClientError({
      code: 'VALIDATION_ERROR',
      message: 'Email dan kata sandi wajib diisi',
    });
  }

  const user = mockStore.getUserByEmail(req.email);
  if (!user) {
    throw new ApiClientError({
      code: 'AUTH_FAILED',
      message: 'Email atau kata sandi tidak sesuai',
    });
  }

  mockStore.setCurrentUser(user);
  return {
    user,
    token: `mock-token-${user.id}-${Date.now()}`,
  };
}

export async function register(req: RegisterRequest): Promise<RegisterResponse> {
  await simulatedDelay();
  checkMockError('auth:register');

  if (!req.nama || !req.email || !req.nomorWA || !req.kataSandi) {
    throw new ApiClientError({
      code: 'VALIDATION_ERROR',
      message: 'Semua kolom registrasi wajib diisi',
    });
  }

  const existing = mockStore.getUserByEmail(req.email);
  if (existing) {
    throw new ApiClientError({
      code: 'EMAIL_ALREADY_EXISTS',
      message: 'Email sudah terdaftar. Silakan gunakan email lain atau masuk.',
    });
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    nama: req.nama,
    email: req.email,
    nomorWA: req.nomorWA,
    createdAt: new Date().toISOString(),
  };

  mockStore.addUser(newUser);
  mockStore.setCurrentUser(newUser);

  return {
    user: newUser,
    token: `mock-token-${newUser.id}-${Date.now()}`,
  };
}

export async function logout(): Promise<void> {
  await simulatedDelay(150, 300);
  checkMockError('auth:logout');
  mockStore.setCurrentUser(null);
}

export async function getSesi(): Promise<User | null> {
  await simulatedDelay(100, 250);
  checkMockError('auth:session');
  return mockStore.getCurrentUser();
}
