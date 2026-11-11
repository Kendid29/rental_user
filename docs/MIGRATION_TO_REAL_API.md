# Panduan Migrasi ke API Backend Produksi (MIGRATION_TO_REAL_API.md)

Dokumen ini memandu tim pengembang ketika backend nyata telah siap digunakan, untuk beralih secara mulus dari mode Stateful Mock ke API Backend Produksi tanpa mengubah kode UI (komponen dan halaman).

---

## Prinsip Desain: Zero Component Modification

Arsitektur Frontend Rentaku dirancang dengan **Satu Pintu Data** (`src/api`). Seluruh halaman dan komponen UI hanya memanggil `api.*` tanpa mengetahui apakah data bersumber dari Mock atau API backend riil. Oleh karena itu, perpindahan ke backend riil **TIDAK MEMERLUKAN PERUBAHAN APAPUN pada folder `src/app` maupun `src/components`**.

---

## Langkah 1: Pengalihan Environment Variables

Di server staging/produksi atau di file `.env.local` lokal Anda, ubah variabel berikut:

```bash
# 1. Nonaktifkan mode mock
NEXT_PUBLIC_USE_MOCK=false

# 2. Masukkan alamat URL dasar backend nyata
NEXT_PUBLIC_API_BASE_URL=https://api.rentaku.id/v1

# 3. Pastikan nomor WhatsApp resmi admin sudah sesuai
NEXT_PUBLIC_NOMOR_WA_ADMIN=6281234567890
```

Hanya dengan mengubah dua variabel di atas, aplikasi secara otomatis akan mengarahkan seluruh pemanggilan data ke `src/api/endpoints/` via HTTP Client (`src/api/client.ts`).

---

## Langkah 2: Verifikasi & Penyesuaian Endpoint (Jika Diperlukan)

Buka [docs/API_CONTRACT.md](API_CONTRACT.md) dan lakukan pencocokan spesifikasi dengan tim Backend:

1. **Format Error:** Pastikan backend mengembalikan format seragam:
   ```json
   {
     "code": "STRING_CODE",
     "message": "Pesan deskriptif dalam Bahasa Indonesia",
     "details": {}
   }
   ```
2. **Penyesuaian di `src/api/endpoints/`:**
   Jika terdapat sedikit perbedaan penamaan parameter query atau struktur body antara backend dengan kontrak draft, sesuaikan **hanya** pada file domain terkait di `src/api/endpoints/*.ts`.
   *Dilarang mengubah komponen atau halaman.*

---

## Langkah 3: Pengujian Alur End-to-End dengan API Nyata

Lakukan pengujian alur kritis:
1. Registrasi akun baru & Login (`/daftar`, `/masuk`) -> Periksa penyimpanan token di header Authorization.
2. Pencarian landing & pergantian kota (`/`) -> Verifikasi endpoint `/mitra/with-units`.
3. Filter katalog mobil & motor (`/katalog/mobil`, `/katalog/motor`) -> Verifikasi query string & paginasi.
4. Detail armada & cek ketersediaan (`/armada/[id]`).
5. Pembuatan pesanan checkout (`/checkout`) -> Verifikasi pembuatan pesanan dengan status `menunggu_pembayaran` dan pembukaan tautan WhatsApp admin resmi.
6. Riwayat pesanan & detail pesanan (`/pesanan`, `/pesanan/[id]`).
7. Pembaruan profil & kata sandi (`/profil`, `/profil/ubah-sandi`).

---

## Langkah 4: Pembersihan Kode Mock (Opsional / Tahap Akhir)

Setelah seluruh alur terverifikasi 100% stabil dengan backend nyata di lingkungan staging:

1. Di file [src/api/index.ts](../src/api/index.ts), hapus dependensi mock:
   ```ts
   import { realApi } from './endpoints';

   export const api = realApi;
   export default api;
   export * from './client';
   ```
2. Hapus direktori mock:
   ```bash
   rm -rf src/mocks
   ```
3. Hapus flag `NEXT_PUBLIC_USE_MOCK` dari `.env.example`.

Langkah ini murni pembersihan file (code cleanup) dan dijamin tidak akan menimbulkan regresi pada tampilan antarmuka.
