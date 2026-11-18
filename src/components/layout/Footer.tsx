import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white mt-auto border-t border-slate-800">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-slate-800/80 bg-primary-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
                <ShieldCheck className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Mitra Terverifikasi</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setiap armada dan mitra rental melewati kurasi fisik & izin resmi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Konfirmasi Cepat</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pemesanan instan dan koordinasi WhatsApp langsung dengan admin resmi.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Transparansi Harga</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tanpa biaya tersembunyi. Rincian tarif jelas dari awal pemesanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-[family-name:var(--font-headline)] font-black text-lg shadow-sm">
                R
              </div>
              <span className="font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-white">
                Rentalin<span className="text-secondary">Aja</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform rental kendaraan terpadu per kota di Indonesia. Menghubungkan penyewa dengan mitra rental lokal pilihan untuk mobilitas yang aman, fleksibel, dan terpercaya.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Yogyakarta, Bandung, Malang, Denpasar & sekitarnya</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>bantuan@rentalinaja.id</span>
              </div>
            </div>
          </div>

          {/* Layanan Sewa */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Layanan Sewa
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/fleet/cars" className="hover:text-white transition-colors">
                  Sewa Mobil Lepas Kunci
                </Link>
              </li>
              <li>
                <Link href="/fleet/cars" className="hover:text-white transition-colors">
                  Sewa Mobil dengan Sopir
                </Link>
              </li>
              <li>
                <Link href="/fleet/bikes" className="hover:text-white transition-colors">
                  Sewa Motor Matic
                </Link>
              </li>
              <li>
                <Link href="/fleet/bikes" className="hover:text-white transition-colors">
                  Sewa Motor Tour & Adventure
                </Link>
              </li>
            </ul>
          </div>

          {/* Kota Layanan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Kota Populer
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/fleet/cars?kota=Yogyakarta" className="hover:text-white transition-colors">
                  Rental Mobil Yogyakarta
                </Link>
              </li>
              <li>
                <Link href="/fleet/cars?kota=Bandung" className="hover:text-white transition-colors">
                  Rental Mobil Bandung
                </Link>
              </li>
              <li>
                <Link href="/fleet/cars?kota=Malang" className="hover:text-white transition-colors">
                  Rental Mobil Malang
                </Link>
              </li>
              <li>
                <Link href="/fleet/bikes?kota=Denpasar" className="hover:text-white transition-colors">
                  Rental Motor Denpasar (Bali)
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan & Perusahaan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Informasi
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Ulasan Pelanggan
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Lacak Pesanan
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 text-sky-400 font-semibold"
                >
                  <span>WhatsApp Admin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-10 mt-12 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RentalinAja. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Syarat & Ketentuan
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition-colors">
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
