'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { RouteGuard } from '@/hooks/useSesi';
import {
  AccountSidebar,
  ProfileEditForm,
} from '@/components/features/profile';

function ProfileEditContent() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6">
      {/* Mobile Back Button (< lg) */}
      <div className="block lg:hidden">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-xs font-bold text-secondary bg-blue-50/80 hover:bg-blue-100/70 px-3.5 py-2 rounded-2xl border border-blue-200/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Akun</span>
        </Link>
      </div>

      {/* Desktop Breadcrumbs (>= lg) */}
      <div className="hidden lg:flex items-center gap-1.5 text-xs text-text-muted">
        <Link
          href="/profile"
          className="hover:text-secondary font-semibold transition-colors"
        >
          Pengaturan Akun
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-bold text-primary">Data Diri & Profil</span>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4">
          <AccountSidebar />
        </div>

        {/* Right Content Form (Full width on mobile, 8-cols on desktop) */}
        <div className="lg:col-span-8">
          <ProfileEditForm />
        </div>
      </div>
    </div>
  );
}

export default function ProfileEditPage() {
  return (
    <RouteGuard>
      <ProfileEditContent />
    </RouteGuard>
  );
}
