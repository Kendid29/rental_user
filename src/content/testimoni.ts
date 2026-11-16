import { Testimoni } from '@/types';

export const testimoniSectionContent = {
  badge: 'Ulasan Pelanggan Terverifikasi',
  heading: 'Apa Kata Mereka?',
  deskripsi:
    'Pengalaman nyata ribuan pelanggan yang mempercayakan perjalanan liburan keluarga dan mobilitas dinas mereka bersama mitra resmi RentalinAja.',
  ratingSummary: {
    score: 4.9,
    totalReviews: '1.250+',
    verifiedPercentage: '99.2%',
  },
};

export const testimoniList: Testimoni[] = [
  {
    id: 'testi-1',
    nama: 'Dimas Suryaputra',
    kota: 'Jakarta Selatan',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Sewa Innova Zenix untuk liburan keluarga di Jogja sangat memuaskan. Mobil diantar tepat waktu di Stasiun Tugu, kondisi kabin harum dan bersih sekali. Admin WhatsApp juga sangat tanggap saat saya butuh rekomendasi rute.',
    kendaraan: 'Toyota Innova Zenix',
    tanggal: '24 Oktober 2026',
    layanan: 'Lepas Kunci',
    kotaRental: 'Yogyakarta',
  },
  {
    id: 'testi-2',
    nama: 'Clarissa Angelica',
    kota: 'Surabaya',
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Pertama kali sewa motor di Bali via RentalinAja langsung puas banget. Honda PCX-nya terawat, tarikan enteng, ban masih tebal, dan helmnya higienis. Serah terima di Bandara Ngurah Rai lancar tanpa ribet sama sekali.',
    kendaraan: 'Honda PCX 160',
    tanggal: '18 Oktober 2026',
    layanan: 'Motor Harian',
    kotaRental: 'Denpasar (Bali)',
  },
  {
    id: 'testi-3',
    nama: 'Bambang Wicaksono',
    kota: 'Bandung',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Butuh kendaraan mendadak untuk kunjungan dinas dan klien di area Jakarta. Proses verifikasi KTP dan SIM cepat, unit Mitsubishi Xpander disiapkan dalam kondisi prima. Tarif jujur tanpa ada biaya siluman saat pengembalian.',
    kendaraan: 'Mitsubishi Xpander',
    tanggal: '12 Oktober 2026',
    layanan: 'Lepas Kunci',
    kotaRental: 'Jakarta',
  },
  {
    id: 'testi-4',
    nama: 'Siti Rahmawati',
    kota: 'Semarang',
    foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Driver dari mitra rental RentalinAja di Bandung sangat ramah, sopan, dan menguasai jalan alternatif ke Lembang saat macet weekend. Mobil Avanza Veloz adem dan nyaman untuk anak-anak.',
    kendaraan: 'Toyota Avanza Veloz',
    tanggal: '05 Oktober 2026',
    layanan: 'Dengan Sopir',
    kotaRental: 'Bandung',
  },
  {
    id: 'testi-5',
    nama: 'Fajar Nugraha',
    kota: 'Medan',
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Sewa Yamaha NMAX untuk solo touring keliling pantai Gunungkidul. Pelayanan admin 24 jam responsif via WA. Dokumen motor lengkap dan disediakan jas hujan cadangan di bagasi. Sangat profesional!',
    kendaraan: 'Yamaha NMAX 155',
    tanggal: '29 September 2026',
    layanan: 'Motor Matic',
    kotaRental: 'Yogyakarta',
  },
  {
    id: 'testi-6',
    nama: 'Nadira Putri Utami',
    kota: 'Makassar',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Paling suka transparansi biayanya. Apa yang tertera di website sama persis dengan yang ditagihkan, termasuk asuransi. Unit Honda Brio gesit dan hemat bensin untuk keliling pusat kota Surabaya selama 3 hari.',
    kendaraan: 'Honda Brio Satya',
    tanggal: '20 September 2026',
    layanan: 'Lepas Kunci',
    kotaRental: 'Surabaya',
  },
  {
    id: 'testi-7',
    nama: 'Hendra Gunawan',
    kota: 'Tangerang',
    foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Layanan sewa mobil terbaik yang pernah saya coba. Hyundai Stargazer sangat terawat, AC dingin, dan mitra rental disiplin waktu saat penjemputan di Stasiun Kereta Cepat Padalarang.',
    kendaraan: 'Hyundai Stargazer',
    tanggal: '15 September 2026',
    layanan: 'Lepas Kunci',
    kotaRental: 'Bandung',
  },
  {
    id: 'testi-8',
    nama: 'Maya Indah Kusuma',
    kota: 'Malang',
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    rating: 5,
    komentar:
      'Vespa Primavera-nya estetik dan prima untuk jalan-jalan sore di Ubud. Helm retro yang disediakan matching dan wangi. Pengalaman sewa yang membuat liburan di Bali semakin berkesan!',
    kendaraan: 'Vespa Primavera 150',
    tanggal: '08 September 2026',
    layanan: 'Motor Tour',
    kotaRental: 'Denpasar (Bali)',
  },
];

