# Rentaku API Contract & Specification

Dokumen spesifikasi antarmuka API tunggal antara Frontend Rentaku dan Backend Service (atau Mock Store).
Frontend dibangun dengan prinsip **Satu Pintu Data** (`src/api`) sehingga format request, response, dan kode error pada tahap Mock maupun Production API adalah identik.

---

## 1. Standar Komunikasi & Format Error

### Base URL
- Dikendalikan melalui environment variable: `NEXT_PUBLIC_API_BASE_URL`
- Autentikasi: Header `Authorization: Bearer <token>` disertakan secara otomatis oleh client `src/api/client.ts` untuk endpoint terproteksi.

### Format Standar Error
Setiap error non-2xx mengembalikan format JSON seragam:
```json
{
  "code": "STRING_ERROR_CODE",
  "message": "Pesan deskripsi error dalam Bahasa Indonesia yang siap ditampilkan di UI",
  "details": {
    "field_name": "Pesan validasi spesifik kolom (opsional)"
  }
}
```

---

## 2. Domain Autentikasi (`/auth`)

### 2.1 Masuk / Login
- **Method:** `POST`
- **Path:** `/auth/login`
- **Request Body:**
```json
{
  "email": "budi.santoso@example.com",
  "kataSandi": "rahasia123"
}
```
- **Response (200 OK):**
```json
{
  "user": {
    "id": "usr-demo-01",
    "nama": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "nomorWA": "6281234567890",
    "createdAt": "2026-10-01T08:00:00Z"
  },
  "token": "mock-jwt-token-string"
}
```
- **Error Codes:** `VALIDATION_ERROR`, `AUTH_FAILED`.

### 2.2 Pendaftaran Akun Pelanggan
- **Method:** `POST`
- **Path:** `/auth/register`
- **Request Body:**
```json
{
  "nama": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "nomorWA": "6281234567890",
  "kataSandi": "rahasia123"
}
```
- **Response (201 Created):** Objek `LoginResponse` (user & token).
- **Error Codes:** `VALIDATION_ERROR`, `EMAIL_ALREADY_EXISTS`.

### 2.3 Keluar / Logout
- **Method:** `POST`
- **Path:** `/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** `{ "success": true }`

### 2.4 Ambil Sesi Pengguna
- **Method:** `GET`
- **Path:** `/auth/session`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Objek `User` atau `null` jika sesi tidak valid.

---

## 3. Domain Kota Layanan (`/kota`)

### 3.1 Daftar Kota Layanan
- **Method:** `GET`
- **Path:** `/kota`
- **Deskripsi:** Mengambil seluruh daftar kota yang aktif dilayani oleh Rentaku (digunakan pada dropdown filter Hero pencarian).
- **Query Params:** Tidak ada.
- **Response (200 OK):**
```json
[
  "Yogyakarta",
  "Bandung",
  "Denpasar",
  "Surabaya"
]
```
- **Error Codes:** `SERVER_ERROR`.

---

## 4. Domain Mitra (`/mitra`)

### 3.1 Daftar Mitra
- **Method:** `GET`
- **Path:** `/mitra`
- **Query Params:**
  - `kota` (string, opsional)
  - `search` (string, opsional)
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
- **Response (200 OK):**
```json
{
  "items": [
    {
      "id": "mitra-01",
      "nama": "Nusantara Rent",
      "kota": "Yogyakarta",
      "rating": 4.9,
      "jumlahUlasan": 284,
      "unitTersedia": 18,
      "isSuperPartner": true,
      "layanan": [
        "Gratis Antar Stasiun / Bandara",
        "Unit Bersih & Terawat",
        "Pelayanan 24 Jam"
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 4.2 Detail Mitra
- **Method:** `GET`
- **Path:** `/mitra/:id`
- **Response (200 OK):** Objek `Mitra`.

### 4.3 Daftar Mitra dengan Unit Unggulan
- **Method:** `GET`
- **Path:** `/mitra/with-units`
- **Query Params:** `kota` (string, opsional)
- **Response (200 OK):** Array `MitraWithUnits[]` (setiap mitra menyertakan unit unggulan).

---

## 5. Domain Unit Kendaraan (`/unit`)

### 5.1 Katalog & Daftar Armada Unit (Landing & Katalog)
- **Method:** `GET`
- **Path:** `/unit`
- **Deskripsi:** Mengambil daftar unit kendaraan dengan dukungan filter terintegrasi. Setiap unit wajib menyertakan objek `mitra` (`id`, `nama`, `kota`, `rating`, `isSuperPartner`) sehingga frontend tidak memerlukan request tambahan.
- **Query Params:**
  - `kota` (string, opsional) — Filter kota lokasi armada (misal `Yogyakarta`, `Bandung`, `Denpasar`)
  - `jenis` (`mobil` | `motor`, opsional) — Filter tipe armada
  - `tanggalMulai` (string YYYY-MM-DD, opsional) — Tanggal mulai sewa (unit stok 0 pada tanggal ini tetap dikembalikan dengan `stok: 0`)
  - `tanggalSelesai` (string YYYY-MM-DD, opsional) — Tanggal selesai sewa
  - `transmisi` (`Manual` | `Matic`, opsional)
  - `kapasitas` (number, opsional)
  - `hargaMin` (number, opsional)
  - `hargaMax` (number, opsional)
  - `search` (string, opsional)
  - `sort` (`harga` | `rating`, default: `harga`)
  - `order` (`asc` | `desc`, default: `asc`)
  - `page` (number, default: 1)
  - `limit` (number, default: 12)
- **Response (200 OK):**
```json
{
  "items": [
    {
      "id": "unit-01",
      "mitraId": "mitra-01",
      "nama": "Toyota Innova Zenix",
      "jenis": "mobil",
      "gambar": "https://...",
      "galeri": ["https://..."],
      "transmisi": "Matic",
      "kapasitas": 7,
      "fitur": ["AC Double Blower", "Captain Seat"],
      "hargaPerHari": 700000,
      "stok": 3,
      "label": "Lepas Kunci",
      "rating": 4.9,
      "jumlahUlasan": 98,
      "mitra": {
        "id": "mitra-01",
        "nama": "Nusantara Rent",
        "kota": "Yogyakarta",
        "rating": 4.9,
        "isSuperPartner": true
      }
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 12,
  "totalPages": 1
}
```

### 5.2 Detail Unit
- **Method:** `GET`
- **Path:** `/unit/:id`
- **Response (200 OK):** Objek `Unit` lengkap beserta profil `mitra`.

### 5.3 Cek Ketersediaan Unit
- **Method:** `GET`
- **Path:** `/unit/:id/availability`
- **Query Params:** `tanggalMulai`, `tanggalSelesai`
- **Response (200 OK):** `{ "available": true, "stok": 3 }`

---

## 6. Domain Pesanan (`/pesanan`)

### 5.1 Buat Pesanan Baru (Checkout F5)
- **Method:** `POST`
- **Path:** `/pesanan`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "unitId": "unit-01",
  "tanggalMulai": "2026-11-10",
  "tanggalSelesai": "2026-11-12",
  "namaPenyewa": "Budi Santoso",
  "nomorWAPenyewa": "6281234567890",
  "pesanUntukOrangLain": false,
  "pemesanLain": {
    "nama": "Nama Penerima",
    "nomorWA": "6289876543210"
  },
  "metodePembayaran": "qris"
}
```
- **Response (201 Created):**
```json
{
  "pesanan": {
    "id": "ORD-20261108-101",
    "userId": "usr-demo-01",
    "unitId": "unit-01",
    "tanggalMulai": "2026-11-10",
    "tanggalSelesai": "2026-11-12",
    "durasiHari": 2,
    "namaPenyewa": "Budi Santoso",
    "nomorWAPenyewa": "6281234567890",
    "metodePembayaran": "qris",
    "rincianBiaya": {
      "sewa": 1400000,
      "proteksi": 50000,
      "pajak": 154000,
      "total": 1604000
    },
    "status": "menunggu_pembayaran",
    "createdAt": "2026-11-08T08:30:00Z"
  },
  "waAdminLink": "https://wa.me/6281234567890?text=..."
}
```

### 5.2 Riwayat Pesanan Saya
- **Method:** `GET`
- **Path:** `/pesanan`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `status` (`menunggu_pembayaran` | `terkonfirmasi` | `selesai` | `dibatalkan`, opsional)
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
- **Response (200 OK):** `Paginated<Pesanan>`.

### 5.3 Detail Pesanan
- **Method:** `GET`
- **Path:** `/pesanan/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Objek `Pesanan` lengkap.

---

## 7. Domain Profil Pengguna (`/profil`)

### 6.1 Ambil Profil
- **Method:** `GET`
- **Path:** `/profil`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** Objek `User`.

### 6.2 Perbarui Profil
- **Method:** `PUT`
- **Path:** `/profil`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "nama": "Budi Santoso Baru",
  "nomorWA": "6281234567890"
}
```
- **Response (200 OK):** Objek `User` yang diperbarui.

### 6.3 Ubah Kata Sandi
- **Method:** `POST`
- **Path:** `/profil/ubah-sandi`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "kataSandiLama": "rahasia123",
  "kataSandiBaru": "rahasia456",
  "konfirmasiKataSandi": "rahasia456"
}
```
- **Response (200 OK):** `{ "success": true }`
