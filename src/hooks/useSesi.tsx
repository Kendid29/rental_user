'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { api } from '@/api';

interface SesiContextType {
  user: User | null;
  isLoading: boolean;
  login: (req: LoginRequest) => Promise<User>;
  register: (req: RegisterRequest) => Promise<User>;
  logout: () => Promise<void>;
  refreshSesi: () => Promise<void>;
}

const SesiContext = createContext<SesiContextType | undefined>(undefined);

export function SesiProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSesi = useCallback(async () => {
    try {
      const currentUser = await api.auth.getSesi();
      setUser(currentUser);
    } catch (e) {
      console.warn('[useSesi] Gagal mengambil sesi:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api.auth.getSesi().then((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (req: LoginRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(req);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(req);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await api.auth.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SesiContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refreshSesi,
      }}
    >
      {children}
    </SesiContext.Provider>
  );
}

export function useSesi(): SesiContextType {
  const context = useContext(SesiContext);
  if (!context) {
    throw new Error('useSesi harus digunakan di dalam SesiProvider');
  }
  return context;
}

/**
 * Validasi path internal agar terhindar dari kerentanan Open Redirect
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback = '/'): string {
  if (!target) return fallback;
  // Hanya izinkan path yang diawali satu slash dan bukan protokol / double slash
  if (target.startsWith('/') && !target.startsWith('//') && !target.includes('\\')) {
    return target;
  }
  return fallback;
}

function RouteGuardInner({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSesi();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentQuery = searchParams.toString();
      const fullPath = currentQuery ? `${pathname}?${currentQuery}` : pathname;
      router.replace(`/masuk?redirect=${encodeURIComponent(fullPath)}`);
    }
  }, [user, isLoading, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-text-muted">Memverifikasi sesi pengguna...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Route guard component untuk halaman yang membutuhkan login (Checkout, Pesanan, Profil)
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-text-muted">Memverifikasi sesi...</p>
        </div>
      }
    >
      <RouteGuardInner>{children}</RouteGuardInner>
    </React.Suspense>
  );
}
