import { useMock } from '@/config/env';
import { realApi, ApiInterface } from './endpoints';
import { mockApi } from '@/mocks/endpoints';

/**
 * Lapisan API Tunggal Rentaku
 * Mengatur switch antara implementasi mock stateful dan API backend nyata
 * berdasarkan NEXT_PUBLIC_USE_MOCK.
 */
export const api: ApiInterface = useMock ? mockApi : realApi;

export default api;
export * from './client';
