import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: '/masuk', destination: '/login', permanent: false },
      { source: '/daftar', destination: '/register', permanent: false },
      { source: '/katalog/mobil', destination: '/fleet/cars', permanent: false },
      { source: '/katalog/motor', destination: '/fleet/bikes', permanent: false },
      { source: '/katalog', destination: '/fleet', permanent: false },
      { source: '/armada/:id', destination: '/fleet/:id', permanent: false },
      { source: '/pesanan', destination: '/orders', permanent: false },
      { source: '/pesanan/:id', destination: '/orders/:id', permanent: false },
      { source: '/profil', destination: '/profile', permanent: false },
      { source: '/profil/ubah-sandi', destination: '/profile/security', permanent: false },
      { source: '/mitra/:id', destination: '/partners/:id', permanent: false },
      { source: '/tentang-kami', destination: '/about', permanent: false },
      { source: '/testimoni', destination: '/reviews', permanent: false },
    ];
  },
};

export default nextConfig;
