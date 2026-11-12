# Aturan Permanen Frontend RentalinAja (AGENTS.md)

Dokumen ini merupakan panduan dan aturan permanen untuk pengembangan frontend RentalinAja. Semua agent dan pengembang wajib mematuhi aturan ini sebelum menulis kode.

---

## 1. Arsitektur Data Tunggal (Single Source of Truth)
- **Satu Pintu Data:** Semua interaksi data wajib melalui lapisan API tunggal di `src/api`. Dilarang keras melakukan fetch langsung (`fetch`/`axios`) atau menaruh data hardcode di komponen atau halaman.
- **Isolasi Mock:** Seluruh implementasi mock dan data seed wajib berada di folder `src/mocks` agar mudah dilepas saat migrasi ke backend produksi.
- **Mock Stateful & Aman SSR:** Mock berjalan di memori dengan persistensi `localStorage` (diakses aman hanya di sisi browser setelah mount). Mendukung CRUD, filter, sorting, pagination, simulasi delay (300–800 ms), dan flag simulasi error.

## 2. Switch Environment (Mock vs API Asli)
- Perpindahan mode dikendalikan via environment variable:
  - `NEXT_PUBLIC_USE_MOCK=true|false`
  - `NEXT_PUBLIC_API_BASE_URL=https://...`
- Interface, parameter, dan format response antara implementasi mock dan API asli wajib identik dengan tipe bersama di `src/types`.

## 3. Checklist Wajib Fitur Baru & Perubahan (Aturan Permanen)
Setiap fitur baru atau perubahan dianggap **BELUM SELESAI** jika salah satu dari 6 poin berikut belum dikerjakan:
1. **Fungsi API:** Dibuat di `src/api/endpoints/` (implementasi API asli).
2. **Implementasi Mock:** Dibuat di `src/mocks/` dengan perilaku setara.
3. **Switch Environment:** Dihubungkan di `src/api/index.ts` via flag env.
4. **Pembaruan Kontrak:** Didokumentasikan di `docs/API_CONTRACT.md` (method, path, request/response).
5. **Type Definition:** Request dan response didefinisikan di `src/types/`.
6. **State UI Lengkap:** UI wajib menangani 3 state (Loading/Skeleton, Error dengan tombol coba lagi, Empty state). Format error seragam `{ code, message, details? }`.

## 4. Desain & Komponen Reusable
- **Design Tokens:** Semua token warna, tipografi, radius, shadow, dan spasi wajib bersumber dari `docs/design/DESIGN.md` dan didefinisikan terpusat (Tailwind config / CSS variables).
- **Tipografi:** Outfit untuk heading, Hanken Grotesk untuk body dan harga (dengan font feature `tnum` untuk angka).
- **Format:** Harga format Rupiah (`Rp 700.000`), tanggal format Indonesia (`8 Nov 2026`), nomor WhatsApp dinormalisasi ke `62xxxxxxxx`.
- **Komponen Reusable:** Komponen yang dipakai di lebih dari satu halaman wajib reusable (props varian, bukan menduplikasi komponen).

## 5. Acuan Dokumen Proyek
- `docs/PRD.md`: Ruang lingkup, alur user, kriteria penerimaan.
- `docs/design/DESIGN.md`: Token visual dan aturan komponen.
- `docs/API_CONTRACT.md`: Kontrak endpoint yang selalu sinkron dengan kode.
- `docs/ASSUMPTIONS.md`: Catatan asumsi sementara jika ada hal yang ambigu.
