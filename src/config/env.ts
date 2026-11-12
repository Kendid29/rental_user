/**
 * Konfigurasi Environment RentalinAja
 * Mengatur switch antara implementasi mock dan API nyata
 */

const rawUseMock = process.env.NEXT_PUBLIC_USE_MOCK;
// Default ke true jika tidak disetel atau nilainya 'true'
export const useMock: boolean = rawUseMock === undefined ? true : rawUseMock === 'true';

export const apiBaseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const nomorWaAdmin: string =
  process.env.NEXT_PUBLIC_NOMOR_WA_ADMIN || '6281234567890';

// Validasi di development
if (!useMock && !apiBaseUrl) {
  const errorMessage =
    '[RentalinAja Config Error]: NEXT_PUBLIC_USE_MOCK disetel false, tetapi NEXT_PUBLIC_API_BASE_URL belum diisi! ' +
    'Silakan isi NEXT_PUBLIC_API_BASE_URL di file .env.local atau setel NEXT_PUBLIC_USE_MOCK=true.';

  if (process.env.NODE_ENV !== 'production') {
    console.error(errorMessage);
    if (typeof window !== 'undefined') {
      // Di browser saat development, lempar error agar langsung disadari developer
      throw new Error(errorMessage);
    }
  }
}

export const env = {
  useMock,
  apiBaseUrl,
  nomorWaAdmin,
} as const;

export default env;
