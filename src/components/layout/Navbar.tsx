'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSesi } from '@/hooks/useSesi';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useSesi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/katalog/mobil', label: 'Sewa Mobil' },
    { href: '/katalog/motor', label: 'Sewa Motor' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border elevation-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 select-none group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-[family-name:var(--font-headline)] font-black text-xl shadow-md group-hover:bg-secondary transition-colors">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-primary">
                Renta<span className="text-secondary">Ku</span>
              </span>
              <span className="text-[10px] text-text-muted -mt-1 font-medium">
                Rental Terpadu Kota
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'text-secondary bg-blue-50/80'
                    : 'text-text-main hover:text-secondary hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/pesanan"
                  className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                    pathname.startsWith('/pesanan')
                      ? 'text-secondary bg-blue-50'
                      : 'text-text-main hover:text-secondary'
                  }`}
                >
                  Pesanan Saya
                </Link>

                <div className="h-4 w-px bg-border" />

                <Link
                  href="/profil"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-secondary font-bold text-xs flex items-center justify-center border border-blue-200">
                    {user.nama.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-primary max-w-[120px] truncate">
                    {user.nama}
                  </span>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="text-xs text-text-muted hover:text-urgency hover:border-urgency"
                >
                  Keluar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/masuk">
                  <Button variant="secondary" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/daftar">
                  <Button variant="primary" size="sm">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-main hover:bg-slate-100 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                  isActive(link.href)
                    ? 'text-secondary bg-blue-50'
                    : 'text-text-main hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-border space-y-2">
              {user ? (
                <>
                  <Link
                    href="/pesanan"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-text-main"
                  >
                    Pesanan Saya
                  </Link>
                  <Link
                    href="/profil"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-sm font-semibold text-text-main"
                  >
                    Profil ({user.nama})
                  </Link>
                  <div className="px-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Keluar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 px-3 pt-2">
                  <Link href="/masuk" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" fullWidth>
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/daftar" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" fullWidth>
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
