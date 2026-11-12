import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 select-none">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-white font-[family-name:var(--font-headline)] font-black text-lg">
                R
              </div>
              <span className="font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight text-white">
                Renta<span className="text-secondary">Ku</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform rental kendaraan terpadu per kota. Menyatukan mitra rental terpercaya untuk mobilitas aman, nyaman, dan transparan.
            </p>
          </div>

          {/* Navigasi Armada */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Layanan Sewa
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/katalog/mobil" className="hover:text-white transition-colors">
                  Sewa Mobil Lepas Kunci
                </Link>
              </li>
              <li>
                <Link href="/katalog/mobil" className="hover:text-white transition-colors">
                  Sewa Mobil dengan Sopir
                </Link>
              </li>
              <li>
                <Link href="/katalog/motor" className="hover:text-white transition-colors">
                  Sewa Motor Harian
                </Link>
              </li>
              <li>
                <Link href="/katalog/motor" className="hover:text-white transition-colors">
                  Sewa Motor Matic & Tour
                </Link>
              </li>
            </ul>
          </div>

          {/* Kota Populer */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Kota Layanan
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/katalog/mobil?kota=Yogyakarta" className="hover:text-white transition-colors">
                  Rental Mobil Yogyakarta
                </Link>
              </li>
              <li>
                <Link href="/katalog/mobil?kota=Bandung" className="hover:text-white transition-colors">
                  Rental Mobil Bandung
                </Link>
              </li>
              <li>
                <Link href="/katalog/motor?kota=Denpasar" className="hover:text-white transition-colors">
                  Rental Motor Denpasar (Bali)
                </Link>
              </li>
            </ul>
          </div>

          {/* Bantuan & Kontak */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Bantuan & Kebijakan
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/tentang-kami" className="hover:text-white transition-colors">
                  Tentang RentalinAja
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  WhatsApp Admin (24 Jam)
                </a>
              </li>
              <li>
                <span className="text-slate-500">Syarat & Ketentuan Sewa</span>
              </li>
              <li>
                <span className="text-slate-500">Kebijakan Privasi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RentalinAja. Seluruh hak cipta dilindungi.</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Sistem Terverifikasi & Aman
          </p>
        </div>
      </div>
    </footer>
  );
};
