# PRD: Rentaku, Sisi User (Mock-First)

Versi: 0.1 (draft)
Tanggal: 8 November 2026
Cakupan: Sisi user saja. Dashboard admin dan dashboard mitra dibahas di PRD terpisah.
Stack acuan: Next.js (App Router), TypeScript, desain dari Google Stitch (`executive_fleet_modern/DESIGN.md`).

---

## 1. Ringkasan

Rentaku adalah platform rental kendaraan terpadu per kota. User dapat mencari unit dari berbagai mitra rental di satu kota, melihat detail, memesan, lalu menyelesaikan pembayaran lewat WhatsApp admin. Admin mengonfirmasi pembayaran, dan status pesanan di sisi user ikut berubah.

Tahap ini membangun seluruh sisi user dengan data mock yang stateful. Backend belum tersedia, sehingga seluruh alur harus bisa diuji dari awal sampai akhir tanpa server. Saat backend siap, perpindahan ke API asli cukup dilakukan lewat variabel environment.

## 2. Tujuan

1. User dapat menyelesaikan alur pemesanan lengkap di FE, dari pencarian sampai status "Terkonfirmasi", dengan data mock.
2. Seluruh halaman sisi user konsisten secara visual dan perilaku, mengikuti satu design system.
3. Tidak ada komponen atau halaman yang mengambil data langsung dari sumber data. Semua lewat satu lapisan API.
4. Perpindahan ke API asli tidak mengubah kode komponen atau halaman.

## 3. Non-Tujuan (di luar cakupan tahap ini)

- Dashboard admin (verifikasi dan konfirmasi pembayaran).
- Dashboard mitra (kelola armada, harga, ketersediaan).
- Integrasi payment gateway. Pembayaran hanya lewat WhatsApp admin.
- Notifikasi push atau email.
- Ulasan dan rating yang bisa ditulis user.
- Multi-bahasa. Hanya Bahasa Indonesia.

## 4. Pengguna

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| Pelanggan individu | Warga kota atau wisatawan yang butuh sewa mobil atau motor | Cari cepat, harga jelas, pesan tanpa ribet |
| Keluarga | Liburan dengan kebutuhan kursi dan bagasi | Filter kapasitas dan jenis unit, rincian biaya |
| Pelaku usaha | Butuh kendaraan untuk kerja atau tamu | Pesanan bisa dilacak, kontak admin mudah |

## 5. Alur Utama

```
Landing → (pilih kota & mitra) → Detail unit → [Login jika belum]
→ Checkout → Redirect WA admin → Pesanan Saya (Menunggu Konfirmasi)
→ Admin konfirmasi (di luar cakupan) → Status berubah jadi Terkonfirmasi
```

Aturan alur:
- Checkout wajib login. Jika user belum login, simpan niat pesanan (unit, tanggal) lalu arahkan ke `/masuk`. Setelah login, kembalikan user ke checkout dengan data yang sama.
- Pesanan dibuat dengan status `menunggu_pembayaran` sebelum redirect ke WA, supaya admin punya ID untuk dicocokkan.
- Setelah user kembali dari WA, status tetap `menunggu_pembayaran` sampai admin mengonfirmasi. FE tidak boleh mengubah status sendiri.

## 6. Kebutuhan Fungsional

### F1. Landing dan Pencarian
- Hero dengan pencarian: Kota Layanan, Tipe Kendaraan (Semua / Mobil / Motor), dan Tanggal Mulai sewa. Form hero adalah satu-satunya sumber filter pencarian.
- Mengubah isian form hero tidak langsung mengubah daftar sampai tombol "Cari Kendaraan" ditekan.
- Filter tersimpan di query string URL (`kota`, `jenis`, `mulai`), mendukung bookmark dan tombol Back/Forward browser.
- Nilai default saat pertama dibuka: Kota Yogyakarta, Tipe Semua, Tanggal hari ini.
- Menampilkan SEMUA unit mobil dan motor dari kota yang dipilih dalam bentuk flat grid (bukan dikelompokkan per mitra), dengan nama mitra di setiap kartu unit.
- Judul bagian: "Armada Tersedia di {kota} ({jumlah} Unit)", dengan subjudul yang menjelaskan semua unit berasal dari mitra terverifikasi.
- Setiap nama mitra pada kartu unit dapat diklik menuju `/mitra/[id]` (halaman placeholder).
- Jika tanggal dipilih, unit yang tidak tersedia (stok 0) tetap ditampilkan dengan badge "Tidak Tersedia" dan tombol pesan nonaktif (tidak disembunyikan).
- Seluruh tab/pill filter kota dan tombol "Lihat Semua Mitra" dihapus dari bagian daftar karena filter kota sudah terpusat di form hero.

Kriteria penerimaan:
- Form hero menjadi satu-satunya pengendali filter kota dan tipe armada.
- Menekan "Cari Kendaraan" memperbarui daftar armada dan parameter URL tanpa reload halaman penuh.
- Jika kota tidak punya armada, tampil EmptyState dengan ajakan mengubah filter di form hero atau memilih kota lain.
- Error penarikan data menampilkan ErrorState lengkap dengan tombol "Coba lagi".

### F2. Katalog
- Route terpisah untuk mobil dan motor (`/katalog/mobil`, `/katalog/motor`).
- Filter: kota, kapasitas (kursi), transmisi (Manual/Matic), rentang harga.
- Sorting: harga terendah, harga tertinggi, rating tertinggi.
- Pagination atau load more, dengan jumlah per halaman 12 unit.

Kriteria penerimaan:
- Filter dan sorting tersimpan di URL (query string), sehingga bisa dibagikan dan kembali dengan tombol back.
- Kombinasi filter yang tidak menghasilkan unit menampilkan state kosong, bukan halaman error.

### F3. Detail Unit (`/armada/[id]`)
- Galeri gambar, nama unit, mitra, kota, rating mitra, dan fitur unit.
- Harga per hari dalam format Rupiah.
- Pilih tanggal mulai dan selesai. Sistem menghitung jumlah hari.
- Tombol utama "Pesan Sekarang" mengarah ke checkout.
- Tombol sekunder "Tanya dulu" membuka WA admin tanpa membuat pesanan.

Kriteria penerimaan:
- Jika stok unit 0 untuk rentang tanggal yang dipilih, tombol pesan nonaktif dan tampil pesan jelas.
- Tanggal selesai tidak boleh sebelum tanggal mulai.

### F4. Autentikasi (`/masuk`, `/daftar`, lupa sandi)
- Login dan daftar dengan email dan kata sandi.
- Setelah login, user diarahkan ke halaman asal (misalnya checkout) lewat parameter `redirect`.
- Form memakai validasi inline dengan pesan dalam Bahasa Indonesia.

Kriteria penerimaan:
- Setelah login, niat pesanan (unit dan tanggal) tetap ada dan checkout menampilkan data yang sama.
- Sesi bertahan setelah refresh. Sesi kedaluwarsa mengarahkan ke login.

### F5. Checkout (`/checkout`, wajib login)
- Ringkasan pesanan: unit, mitra, tanggal, durasi.
- Data penyewa: nama, nomor WA (wajib terverifikasi), dan opsi "Pesan untuk orang lain" dengan nama dan nomor WA penerima.
- Pilihan metode pembayaran: Transfer VA, QRIS, Kartu Kredit, E-Wallet, PayLater/Gerai. Pilihan ini hanya dicatat untuk admin, bukan diproses di aplikasi.
- Rincian biaya: sewa, proteksi, pajak, total.
- Tombol "Bayar & Konfirmasi via WhatsApp" membuat pesanan lalu membuka tautan WA admin dengan ringkasan pesanan.

Kriteria penerimaan:
- Tombol hanya aktif jika semua field wajib terisi dan nomor WA valid.
- Setelah pesanan dibuat, tombol tidak bisa diklik ulang untuk membuat pesanan kedua (cegah duplikasi).
- Jika pembuatan pesanan gagal, tampil error dan user bisa mencoba lagi tanpa kehilangan data form.

### F6. Pesanan Saya (`/pesanan`, `/pesanan/[id]`)
- Daftar pesanan dengan status, tanggal, dan total.
- Filter status: Semua, Menunggu Konfirmasi, Terkonfirmasi, Selesai, Dibatalkan.
- Detail pesanan menampilkan rincian lengkap dan tombol "Hubungi Admin" (WA admin dengan ID pesanan).
- Status ditampilkan dengan label dan warna konsisten dengan design system.

Kriteria penerimaan:
- Status `menunggu_pembayaran` ditampilkan sebagai "Menunggu Konfirmasi" dengan keterangan bahwa admin sedang memverifikasi.
- Status `terkonfirmasi` menampilkan badge emerald sesuai DESIGN.md.
- Halaman membaca status dari lapisan API, bukan dari state lokal, sehingga perubahan dari admin terlihat saat halaman dibuka ulang.

### F7. Profil dan Ubah Sandi (`/profil`, `/profil/ubah-sandi`)
- Lihat dan ubah nama serta nomor WA.
- Ubah kata sandi dengan validasi (kata sandi lama, baru, dan konfirmasi).

### F8. Tentang Kami (`/tentang-kami`)
- Halaman statis dengan konten dari desain Stitch.

## 7. Kebutuhan Non-Fungsional

### 7.1 Konsistensi Desain (wajib)
Desain Stitch belum konsisten antar halaman. Karena itu:
- Semua token warna, font, radius, dan spasi diambil dari `DESIGN.md` dan didefinisikan sekali di konfigurasi Tailwind atau CSS variable.
- Komponen yang dipakai di lebih dari satu halaman wajib dibuat sebagai komponen reusable: Button, Input, Card Mitra, Card Unit, Badge Status, Progress Checkout, Ringkasan Pesanan, Pilihan Metode Bayar, Empty State, Error State, Skeleton Loading.
- Varian visual yang berbeda di Stitch (misalnya dua gaya kartu yang sedikit berbeda) dipetakan ke satu komponen dengan prop varian, bukan dibuat ulang.
- Font: Outfit untuk heading, Hanken Grotesk untuk body dan angka harga (dengan `tnum`).

### 7.2 Responsif
- Desktop (≥1024px): grid 12 kolom, max-width 1240px. Checkout memakai 8 kolom form dan 4 kolom ringkasan sticky.
- Tablet (768–1023px): grid 8 kolom. Ringkasan jadi panel bawah yang bisa dibuka dan ditutup.
- Mobile (<768px): grid 4 kolom, alur linear, tombol utama lebar penuh.

### 7.3 Format
- Harga: Rupiah dengan pemisah ribuan titik (Rp 700.000).
- Tanggal: format Indonesia (8 Nov 2026).
- Nomor WA: normalisasi ke format 62xxxxxxxx.

### 7.4 Kinerja dan Aksesibilitas
- Gambar unit memakai lazy loading dan ukuran responsif.
- Target sentuh minimal 44px di mobile.
- Kontras teks memenuhi WCAG AA, khususnya badge status dan teks muted (#64748B).
- Semua form bisa dipakai dengan keyboard.

### 7.5 Penanganan Loading, Error, dan Kosong
Setiap pemanggilan API wajib punya tiga state di UI: loading (skeleton), error (pesan dan tombol coba lagi), dan data kosong (empty state dengan ajakan yang sesuai).

## 8. Arsitektur Data dan Mock (ringkasan)

- Semua akses data lewat lapisan API tunggal (misalnya `src/api`).
- Pemilihan mock atau API asli lewat environment variable. Karena stack Next.js, prefix yang dipakai adalah `NEXT_PUBLIC_` (misalnya `NEXT_PUBLIC_USE_MOCK`, `NEXT_PUBLIC_API_BASE_URL`).
- Implementasi mock dan API asli memakai interface dan bentuk response yang sama.
- Mock disimpan di memori dan dipersist ke localStorage. Mendukung CRUD, filter, sorting, dan pagination.
- Delay 300–800 ms dan flag opsional untuk simulasi error.
- Semua data mock berada di satu folder (misalnya `src/mocks`), sehingga bisa dihapus seluruhnya saat migrasi.
- Kontrak endpoint didokumentasikan di `docs/API_CONTRACT.md`.

Catatan: localStorage hanya tersedia di sisi browser. Implementasi mock harus aman saat dijalankan di server rendering dan tidak mengakses localStorage sebelum mount.

## 9. Model Data (acuan)

Model lengkap ada di `types.ts`. Ringkasannya:
- `Mitra`: id, nama, kota, rating, jumlah ulasan, unit tersedia, Super Partner, layanan.
- `Unit`: id, mitra, nama, jenis (mobil/motor), gambar, transmisi, kapasitas, fitur, harga per hari, stok, label.
- `Pesanan`: id, user, unit, tanggal mulai dan selesai, durasi, rincian biaya, total, pemesan lain (opsional), metode bayar, status, waktu dibuat.
- Status pesanan: `menunggu_pembayaran`, `terkonfirmasi`, `dibatalkan`, `selesai`.

## 10. Data Mock Awal

- Kota: Yogyakarta, Bandung, Denpasar.
- Mitra: Nusantara Rent (Yogyakarta), Maju Jaya Rent (Bandung), Sahabat Motor (Denpasar).
- Unit: enam unit dari desain Stitch (Innova Zenix, Avanza 1.5 G, Honda BR-V Prestige, Mitsubishi Pajero Sport Dakar, Honda Beat Deluxe, Yamaha NMAX Connected).
- Dua contoh pesanan untuk satu user demo, satu menunggu konfirmasi dan satu sudah terkonfirmasi.

## 11. Integrasi WhatsApp

- Nomor admin berasal dari konfigurasi (`NOMOR_WA_ADMIN`), bukan dari data mitra.
- Format tautan: `https://wa.me/<nomor>?text=<pesan terenkode>`.
- Pesan berisi ID pesanan, unit, mitra, kota, tanggal, durasi, total, dan metode bayar.
- Nomor di mock masih placeholder dan harus dikonfirmasi ke bos sebelum rilis.

## 12. Asumsi

1. Admin adalah pihak tunggal yang mengonfirmasi pembayaran. Admin bisa lebih dari satu, tetapi user tidak perlu tahu admin mana yang menangani.
2. Pembayaran sepenuhnya di luar aplikasi. FE tidak menyimpan bukti pembayaran.
3. Satu pesanan = satu unit. Pesanan multi-unit tidak termasuk.
4. Ketersediaan unit di mock dihitung dari field `stok`. Logika bentrok tanggal antar pesanan belum dimodelkan.
5. Biaya proteksi dan pajak dihitung dengan aturan sederhana di mock dan bisa diganti aturan asli nanti.

## 13. Pertanyaan Terbuka

1. Berapa nilai biaya proteksi dan pajak, dan apakah persentase atau nominal tetap?
2. Apakah ada batas durasi minimum atau maksimum sewa?
3. Apakah user bisa membatalkan pesanan sendiri sebelum dikonfirmasi? Jika ya, apakah lewat WA atau tombol di aplikasi?
4. Apakah stok dihitung per tanggal (bentrok pesanan) atau cukup jumlah unit?
5. Nomor WA admin resmi untuk produksi.
6. Apakah lupa sandi mengirim tautan reset lewat email, atau cukup lewat WA admin?
7. Bahasa dan wilayah: apakah hanya Indonesia dulu, atau sudah ada rencana kota di luar Jawa dan Bali?

## 14. Kriteria Keberhasilan Tahap Ini

- Alur lengkap bisa dijalankan dari landing sampai pesanan menunggu konfirmasi, hanya dengan mode mock.
- Tidak ada data hardcode di komponen atau halaman. Pemeriksaan dengan pencarian kata kunci (misalnya nama unit atau harga) menunjukkan semuanya berasal dari lapisan API.
- Mengganti `NEXT_PUBLIC_USE_MOCK=false` tidak mengubah kode komponen. Hanya konfigurasi yang berubah.
- Build dan lint lolos tanpa error.
- `docs/API_CONTRACT.md` sinkron dengan endpoint yang dipakai.
- Setiap fitur memenuhi Tahap 4 (API, mock, switch env, dokumentasi kontrak, type, dan state UI).

## 15. Rencana Tahap

1. **Audit proyek.** Stack, fitur yang ada, data hardcode, dan rencana refactor.
2. **Fondasi.** Token desain, komponen reusable, lapisan API, mock store, dan switch env.
3. **Refactor fitur yang sudah ada (±40%).** Pindahkan data hardcode ke lapisan API.
4. **Fitur baru sesuai PRD.** Urutan: landing, katalog, detail, autentikasi, checkout, pesanan saya, profil.
5. **Dokumentasi.** `API_CONTRACT.md` dan `MIGRATION_TO_REAL_API.md`.
6. **Verifikasi.** Uji alur end-to-end di mode mock dan pastikan build bersih.
