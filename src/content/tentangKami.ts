export interface StatItem {
  number: string;
  label: string;
  description: string;
  iconName: string;
}

export interface NilaiUtamaItem {
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TentangKamiContent {
  hero: {
    badge: string;
    headline: string;
    subtitle: string;
    bannerImage: string;
    bannerBadge: string;
    bannerTitle: string;
  };
  stats: StatItem[];
  visiMisi: {
    visiTitle: string;
    visiDesc: string;
    misiTitle: string;
    misiItems: string[];
  };
  nilaiUtama: NilaiUtamaItem[];
  faq: FaqItem[];
}

export const tentangKamiContent: TentangKamiContent = {
  hero: {
    badge: 'Platform Rental Terpercaya Indonesia',
    headline: 'Menghubungkan Perjalanan Anda dengan Mitra Rental Terpercaya di Seluruh Indonesia',
    subtitle:
      'RentalinAja hadir mentransformasi persewaan kendaraan di Indonesia melalui sistem kurasi mitra ketat, transparansi harga tanpa biaya tersembunyi, dan keamanan konfirmasi resmi untuk ketenangan mobilitas Anda.',
    bannerImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDZq_QyenDhhjVVGFt7VtvyMGy6UJUIaPBgRBASyYlPuqyMEZnj5pZVJnS4gfWLvGHphR-HVjjTsFbjwdix_AhfRg_GSfcNH7KPBOFeHpHV7EAYovE00XsgF1I1JD8K92itFHg-UELNDCGSDLvoltu-MgU7MFFrcbRXS0ec_aI43rna2EMNTG90q8D8ZOX8enXR0oV9U0Oq84pRStWy5ruwNtv3gf3EXXAmFBSpkhhdddBVAbUyNBWHuw',
    bannerBadge: 'Komitmen Kualitas & Pelayanan',
    bannerTitle: 'Armada Prima, Dokumen Sah, Siap Melaju Kapan Saja',
  },
  stats: [
    {
      number: '30+',
      label: 'Kota Layanan',
      description: 'Menjangkau Yogyakarta, Bandung, Denpasar (Bali), Jakarta, Surabaya, dan destinasi wisata populer lainnya.',
      iconName: 'city',
    },
    {
      number: '1.500+',
      label: 'Mitra Terkurasi',
      description: 'Seluruh mitra memiliki legalitas usaha terverifikasi dan standar pemeliharaan kendaraan berkala.',
      iconName: 'shield',
    },
    {
      number: '50.000+',
      label: 'Perjalanan Berhasil',
      description: 'Melayani wisatawan domestik, keluarga, hingga profesional bisnis dengan nol komplain tak tertangani.',
      iconName: 'car',
    },
    {
      number: '99.2%',
      label: 'Tingkat Kepuasan',
      description: 'Pelanggan puas dengan kemudahan pemesanan, kelaikan armada, dan ketepatan serah terima kunci.',
      iconName: 'star',
    },
  ],
  visiMisi: {
    visiTitle: 'Visi Kami',
    visiDesc:
      'Menjadi ekosistem persewaan mobilitas nomor satu di Indonesia yang menyatukan seluruh pelaku rental lokal berintegritas ke dalam satu platform digital modern dan tepercaya.',
    misiTitle: 'Misi Kami',
    misiItems: [
      'Menghapuskan biaya tersembunyi dan penipuan persewaan melalui sistem transparansi harga dan verifikasi ketat.',
      'Memberdayakan mitra pengusaha rental lokal di berbagai kota agar dapat menjangkau pelanggan lebih luas.',
      'Menyediakan armada mobil dan motor yang higienis, berdokumen sah, dan siap pakai dengan jaminan penggantian unit.',
      'Memberikan layanan pendampingan pelanggan yang responsif dan solutif 24 jam sehari via WhatsApp resmi.',
    ],
  },
  nilaiUtama: [
    {
      title: 'Transparansi Tarif Penuh',
      description: 'Harga sewa yang Anda lihat adalah harga pasti, lengkap dengan rincian asuransi dan pajak tanpa jebakan biaya siluman di lokasi.',
      icon: '✓',
    },
    {
      title: 'Inspeksi & Kelaikan Fisik',
      description: 'Setiap unit mobil dan motor wajib melalui checklist kebersihan kabin, rem, ban, dan kelistrikan sebelum diserahkan ke penyewa.',
      icon: '🔍',
    },
    {
      title: 'Jaminan Serah Terima Tepat Waktu',
      description: 'Mitra kami siap mengantarkan armada ke stasiun kereta, bandara, hotel, maupun terminal sesuai kesepakatan waktu Anda.',
      icon: '⏱',
    },
    {
      title: 'Dukungan WhatsApp 24/7',
      description: 'Tim Admin RentalinAja selalu siaga memandu koordinasi serah terima, perpanjangan sewa, hingga bantuan darurat jalan raya.',
      icon: '💬',
    },
  ],
  faq: [
    {
      question: 'Apa saja syarat umum untuk menyewa kendaraan lepas kunci?',
      answer:
        'Penyewa wajib memiliki e-KTP asli yang masih berlaku, SIM A (untuk mobil) atau SIM C (untuk motor) yang masih aktif, serta dokumen pendukung seperti tiket perjalanan atau akun media sosial aktif untuk verifikasi identitas.',
    },
    {
      question: 'Bagaimana cara konfirmasi pembayaran di RentalinAja?',
      answer:
        'Setelah mengisi form checkout di website, Anda akan langsung diarahkan ke nomor WhatsApp resmi Admin RentalinAja. Admin akan memberikan rincian tagihan resmi dan memverifikasi pembayaran Anda hingga status pesanan berubah menjadi Terkonfirmasi.',
    },
    {
      question: 'Apakah bisa memesan kendaraan untuk diantarkan ke bandara atau stasiun?',
      answer:
        'Bisa. Mayoritas mitra terverifikasi RentalinAja menyediakan fasilitas antar-jemput ke bandara atau stasiun kereta api utama di kota terkait.',
    },
    {
      question: 'Bagaimana jika kendaraan mengalami kendala teknis saat masa sewa?',
      answer:
        'Seluruh unit kami dilindungi garansi operasional. Anda cukup menghubungi nomor darurat admin WhatsApp, dan mitra akan mengirimkan mekanik atau unit mobil/motor pengganti setara.',
    },
  ],
};
