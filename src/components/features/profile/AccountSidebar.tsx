'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  FileText,
  KeyRound,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useSesi } from '@/hooks/useSesi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface AccountSidebarProps {
  className?: string;
}

export function AccountSidebar({ className }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useSesi();

  const isProfileActive = pathname === '/profile' || pathname === '/profile/edit';

  const navItems = [
    {
      label: 'Data Diri & Profil',
      href: '/profile/edit',
      icon: <User className="w-4 h-4" />,
      active: isProfileActive,
      tag: null,
    },
    {
      label: 'Pesanan Saya',
      href: '/orders',
      icon: <FileText className="w-4 h-4" />,
      active: pathname.startsWith('/orders'),
      tag: 'Lihat Sewa',
    },
    {
      label: 'Ubah Kata Sandi',
      href: '/profile/security',
      icon: <KeyRound className="w-4 h-4" />,
      active: pathname === '/profile/security',
      tag: null,
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Navigation Card */}
      <div className="bg-white rounded-3xl border border-border/80 shadow-sm p-3 sm:p-4 space-y-1.5">
        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider px-3 py-1.5 block">
          Menu Akun
        </span>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-150',
              item.active
                ? 'bg-blue-50 text-secondary border border-blue-200/60 shadow-2xs'
                : 'text-slate-700 hover:text-primary hover:bg-slate-50'
            )}
          >
            <span className="flex items-center gap-3">
              <span
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
                  item.active
                    ? 'bg-secondary text-white'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </span>

            {item.tag ? (
              <span className="text-[10px] font-bold text-secondary bg-white px-2 py-0.5 rounded-lg border border-blue-100">
                {item.tag}
              </span>
            ) : (
              <ChevronRight
                className={cn(
                  'w-4 h-4 transition-transform',
                  item.active ? 'text-secondary translate-x-0.5' : 'text-slate-400'
                )}
              />
            )}
          </Link>
        ))}
      </div>

      {/* Dedicated Logout Card */}
      <div className="bg-white rounded-3xl border border-border/80 shadow-sm p-4 space-y-3">
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-primary">Sesi Pengguna</p>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Akhiri sesi Anda di perangkat ini secara aman.
          </p>
        </div>

        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={handleLogout}
          className="text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 justify-center h-10.5 rounded-xl"
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          Keluar dari Akun
        </Button>
      </div>
    </div>
  );
}
