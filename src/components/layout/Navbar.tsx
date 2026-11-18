'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  Bike,
  Home,
  Info,
  User,
  LogOut,
  FileText,
  Menu,
  X,
  Phone,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useSesi } from '@/hooks/useSesi';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useSesi();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    {
      href: '/',
      label: 'Beranda',
      icon: <Home className="w-4 h-4" />,
    },
    {
      href: '/fleet/cars',
      label: 'Sewa Mobil',
      icon: <Car className="w-4 h-4" />,
    },
    {
      href: '/fleet/bikes',
      label: 'Sewa Motor',
      icon: <Bike className="w-4 h-4" />,
    },
    {
      href: '/reviews',
      label: 'Testimoni',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      href: '/about',
      label: 'Tentang Kami',
      icon: <Info className="w-4 h-4" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-border/80 shadow-xs py-2.5'
          : 'bg-white/95 backdrop-blur-xs border-b border-border/60 py-3.5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 select-none group"
            aria-label="RentalinAja Beranda"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-[family-name:var(--font-headline)] font-black text-xl shadow-md shadow-primary/20 group-hover:from-secondary group-hover:to-secondary-hover transition-all duration-300">
              R
            </div>

            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-primary leading-none">
                Rentalin<span className="text-secondary">Aja</span>
              </span>
              <span className="text-[10px] text-text-muted mt-1 font-medium tracking-wide">
                Rental Terpadu Kota
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-50/80 p-1.5 rounded-2xl border border-border/60">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200',
                    active
                      ? 'text-secondary font-bold'
                      : 'text-text-main/80 hover:text-primary hover:bg-white/80'
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white rounded-xl shadow-xs border border-border/70"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.icon}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                href="/profile"
                className={cn(
                  'flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-150 cursor-pointer',
                  pathname.startsWith('/profile') || pathname.startsWith('/orders')
                    ? 'bg-blue-50 text-secondary border-blue-200/80 shadow-2xs font-bold'
                    : 'bg-white hover:bg-slate-50 text-primary border-border/80 shadow-2xs hover:shadow-xs'
                )}
                title="Buka Pengaturan Akun & Pesanan"
              >
                <div className="w-7 h-7 rounded-full bg-secondary text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold truncate max-w-[120px]">
                  {user.nama}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-primary hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-border/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6"
          >
            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all',
                      active
                        ? 'bg-blue-50 text-secondary'
                        : 'text-text-main hover:bg-slate-50'
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      {link.icon}
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 mt-3 border-t border-border/70 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/orders"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-text-main hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-secondary" />
                      Pesanan Saya
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-text-main hover:bg-slate-50"
                  >
                    <span className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-primary" />
                      Profil Saya ({user.nama})
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </Link>

                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => logout()}
                    className="mt-3 text-urgency border-rose-200 hover:bg-rose-50"
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Keluar Akun
                  </Button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link href="/login">
                    <Button variant="secondary" size="md" fullWidth>
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="md" fullWidth>
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
