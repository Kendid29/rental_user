import { apiBaseUrl } from '@/config/env';
import { ApiError } from '@/types';

export class ApiClientError extends Error {
  code: string;
  details?: Record<string, string>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.details = error.details;
  }
}

export const AUTH_TOKEN_KEY = 'rentaku:auth_token';

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiBaseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const error: ApiError = {
        code: data?.code || `HTTP_${response.status}`,
        message: data?.message || response.statusText || 'Terjadi kesalahan pada server',
        details: data?.details,
      };
      throw new ApiClientError(error);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiClientError) {
      throw err;
    }

    const networkError: ApiError = {
      code: 'NETWORK_ERROR',
      message: err instanceof Error ? err.message : 'Koneksi ke server gagal. Periksa jaringan Anda.',
    };
    throw new ApiClientError(networkError);
  }
}
