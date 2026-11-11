import { request, AUTH_TOKEN_KEY } from '../client';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from '@/types';

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(req),
  });

  if (typeof window !== 'undefined' && res.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
  }

  return res;
}

export async function register(req: RegisterRequest): Promise<RegisterResponse> {
  const res = await request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(req),
  });

  if (typeof window !== 'undefined' && res.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
  }

  return res;
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/auth/logout', {
      method: 'POST',
    });
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
}

export async function getSesi(): Promise<User | null> {
  if (typeof window !== 'undefined' && !localStorage.getItem(AUTH_TOKEN_KEY)) {
    return null;
  }
  return request<User>('/auth/session');
}
