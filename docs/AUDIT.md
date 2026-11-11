# Audit Proyek Frontend Rentaku

**Tanggal Audit:** 8 November 2026  
**Status Proyek:** Inisialisasi Baru (Fresh Next.js App Router)

---

## 1. Stack Proyek

- **Framework:** Next.js 16.4.5 (Turbopack, App Router)
- **Library UI / View:** React 19.x, React DOM 19.x
- **Bahasa:** TypeScript 5.x (strict mode)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/turbopack`)
- **Linting:** ESLint 9.x (`eslint-config-next`)
- **State Management:** Belum ada (akan menggunakan custom stateful mock store berbasis memory + localStorage)
- **Fetch Library:** Native `fetch` yang dibungkus client terpusat di `src/api`
- **Struktur Folder Saat Ini:**
  - `src/app/` (App Router entrypoint: `layout.tsx`, `page.tsx`, `globals.css`)
  - `docs/` (`PRD.md`, `design/DESIGN.md`, `stitch/`, `draft/`)
  - `rules/` (`AGENTS.md`)
  - `public/` (aset statis)

---

## 2. Pemetaan Halaman dan Komponen

| Route | Fungsi / Fitur PRD | Status | Catatan |
|---|---|---|---|
| `/` | Landing page & hero search per kota (F1) | Belum | Masih boilerplate default Next.js |
| `/katalog/mobil` | Katalog sewa mobil, filter, sorting, pagination (F2) | Belum | Route belum dibuat |
| `/katalog/motor` | Katalog sewa motor, filter, sorting, pagination (F2) | Belum | Route belum dibuat |
| `/armada/[id]` | Detail unit, kalender sewa, tombol pesan/tanya (F3) | Belum | Route belum dibuat |
| `/masuk` | Autentikasi login pelanggan (F4) | Belum | Route belum dibuat |
| `/daftar` | Registrasi akun pelanggan baru (F4) | Belum | Route belum dibuat |
| `/checkout` | Form penyewa, rincian biaya, buat pesanan & WA (F5) | Belum | Route belum dibuat |
| `/pesanan` | Riwayat pesanan saya & filter status (F6) | Belum | Route belum dibuat |
| `/pesanan/[id]` | Detail pesanan & status verifikasi admin (F6) | Belum | Route belum dibuat |
| `/profil` | Pengelolaan data profil pengguna (F7) | Belum | Route belum dibuat |
| `/profil/ubah-sandi` | Ubah kata sandi pengguna (F7) | Belum | Route belum dibuat |
| `/tentang-kami` | Profil perusahaan & informasi Rentaku (F8) | Belum | Route belum dibuat |

---

## 3. Data Hardcode dan Fetch Langsung

Karena proyek ini diinisiasi baru dari nol (*fresh start*), **tidak ditemukan data hardcode bisnis atau pemanggilan fetch/axios langsung di codebase aplikasi (`src/`)**.

| File | Baris | Jenis Data / Pola | Rencana Aksi |
|---|---|---|---|
| `src/app/page.tsx` | Seluruh baris | Template default Next.js | Diganti dengan F1 Landing Page pada Langkah 9 |
| `docs/draft/data.ts` | 1-210 | Draft seed data (referensi terisolasi) | Dipindahkan ke `src/mocks/seed/` pada Langkah 6 |

---

## 4. Kondisi Lingkungan & Lapisan Data

- **File Environment:** Belum ada `.env.example` maupun `.env.local`. Akan dibuat di Langkah 2.
- **Lapisan API (`src/api`):** Belum ada. Akan dibuat di Langkah 5.
- **Mock Store (`src/mocks`):** Belum ada. Akan dibuat di Langkah 6.
- **Design Tokens:** `src/app/globals.css` masih default Tailwind, belum mendefinisikan palet warna, typography Outfit & Hanken Grotesk, radius, dan spasi dari `docs/design/DESIGN.md`. Akan diterapkan di Langkah 3.

---

## 5. Fitur PRD yang Belum Ada

Seluruh fitur PRD sisi user belum diimplementasikan:
- [ ] **F1:** Landing page dan hero pencarian multi-kota
- [ ] **F2:** Katalog kendaraan (mobil & motor) dengan filter, sorting, URL query state
- [ ] **F3:** Halaman detail armada, pemilih tanggal sewa, validasi stok
- [ ] **F4:** Autentikasi (`/masuk`, `/daftar`, lupa sandi) dengan session storage & redirect
- [ ] **F5:** Alur checkout, formulir pemesan, rincian biaya, integrasi WhatsApp admin
- [ ] **F6:** Riwayat pesanan saya & pelacakan status pesanan
- [ ] **F7:** Profil pengguna & ubah kata sandi
- [ ] **F8:** Halaman statis tentang kami (`src/content`)

---

## 6. Rencana Pengerjaan (Urut Prioritas)

Karena proyek dimulai dari inisialisasi baru, tidak ada technical debt atau refactor kode lama yang berisiko merusak sistem eksisting. Rencana pengerjaan mengikuti tahapan baku secara sistematis:

1. **Langkah 2 - Environment & Konfigurasi:** Setup `.env.example`, `.env.local`, dan `src/config/env.ts`.
2. **Langkah 3 - Design Tokens:** Terapkan warna, tipografi (Outfit & Hanken Grotesk), radius, shadow, dan skala spasi di Tailwind CSS.
3. **Langkah 4 - Tipe Bersama:** Definisikan domain types di `src/types/` (user, mitra, unit, pesanan, common, ApiError).
4. **Langkah 5 - Lapisan API:** Setup HTTP client, route endpoints di `src/api`, dan entrypoint switch `src/api/index.ts`.
5. **Langkah 6 - Mock Store (Stateful):** Setup in-memory + localStorage store, simulasi delay, generator ID, dan flag error di `src/mocks`.
6. **Langkah 7 - Komponen Reusable:** Buat komponen UI dasar (`src/components/ui`) dan komponen domain (`src/components/domain`).
7. **Langkah 8-12 - Fitur User PRD:**
   - Langkah 8: Autentikasi (F4) & Route Guard
   - Langkah 9: Landing (F1), Katalog (F2), Detail Armada (F3)
   - Langkah 10: Checkout & WhatsApp Redirect (F5)
   - Langkah 11: Riwayat Pesanan (F6) & Profil (F7)
   - Langkah 12: Halaman Tentang Kami (F8)
8. **Langkah 14 - Dokumentasi Migrasi:** Panduan beralih ke backend nyata (`docs/MIGRATION_TO_REAL_API.md` & `docs/API_CONTRACT.md`).
9. **Langkah 15 - Verifikasi Akhir:** Build, lint, typecheck, verifikasi end-to-end tanpa hardcode data.

---

## 7. Pertanyaan & Konfirmasi

1. Font pada `docs/design/DESIGN.md` menentukan **Outfit** untuk heading dan **Hanken Grotesk** untuk body. Apakah font cukup diimpor via Google Fonts di CSS (`@import url(...)`) agar aman saat build offline/sandboxed?
2. Pada alur F5 (WhatsApp admin), apakah nomor telepon admin placeholder yang akan digunakan adalah `6281234567890`?
