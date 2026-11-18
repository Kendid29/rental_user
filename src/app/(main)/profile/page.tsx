'use client';

import React from 'react';
import { useSesi, RouteGuard } from '@/hooks/useSesi';
import {
  ProfileHeaderCard,
  AccountSidebar,
  ProfileEditForm,
} from '@/components/features/profile';

function ProfileContent() {
  const { user } = useSesi();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8">
      {/* 1. Header Hero Card */}
      <ProfileHeaderCard
        nama={user?.nama || ''}
        email={user?.email || ''}
        nomorWA={user?.nomorWA || ''}
      />

      {/* 2. Desktop View (>= lg): 2-Column Side-by-Side Dashboard */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-4">
          <AccountSidebar />
        </div>

        {/* Right Content Form */}
        <div className="lg:col-span-8">
          <ProfileEditForm />
        </div>
      </div>

      {/* 3. Mobile View (< lg): Pure Mobile Account Hub (Navigation Menu + Logout) */}
      <div className="block lg:hidden">
        <AccountSidebar />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard>
      <ProfileContent />
    </RouteGuard>
  );
}
