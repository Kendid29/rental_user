import { ApiClientError } from '@/api/client';

export const MOCK_ERROR_STORAGE_KEY = 'rentaku:mock:force_error';

let inMemoryError: string | null = null;

export function setMockError(val = '1'): void {
  inMemoryError = val;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(MOCK_ERROR_STORAGE_KEY, val);
    } catch {
      // ignore
    }
  }
}

export function clearMockError(): void {
  inMemoryError = null;
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(MOCK_ERROR_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

/**
 * Cek apakah simulasi error sedang aktif via in-memory flag,
 * URL query param (?mockError=1), atau localStorage.
 */
export function checkMockError(endpointKey?: string): void {
  if (
    inMemoryError === '1' ||
    inMemoryError === 'true' ||
    (endpointKey && inMemoryError === endpointKey)
  ) {
    throw new ApiClientError({
      code: 'MOCK_SIMULATED_ERROR',
      message: `Simulasi error mock terpicu untuk endpoint: ${endpointKey || 'umum'}.`,
    });
  }

  if (typeof window === 'undefined') return;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('mockError');
    const storedFlag = localStorage.getItem(MOCK_ERROR_STORAGE_KEY);

    const shouldError =
      queryParam === '1' ||
      queryParam === 'true' ||
      (endpointKey && queryParam === endpointKey) ||
      storedFlag === '1' ||
      storedFlag === 'true';

    if (shouldError) {
      throw new ApiClientError({
        code: 'MOCK_SIMULATED_ERROR',
        message: `Simulasi error mock terpicu untuk endpoint: ${endpointKey || 'umum'}. Hapus ?mockError dari URL atau reset localStorage untuk menonaktifkan.`,
      });
    }
  } catch (err: unknown) {
    if (err instanceof ApiClientError) throw err;
  }
}
