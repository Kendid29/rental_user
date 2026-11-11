import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { tentangKamiContent } from '@/content/tentangKami';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function TentangKamiPage() {
  const { hero, stats, visiMisi, nilaiUtama, faq } = tentangKamiContent;

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-[#000f2b] to-[#102447] text-white pt-14 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold backdrop-blur-sm text-emerald-400">
            <span>🇮🇩</span>
            <span>{hero.badge}</span>
          </div>

          <h1 className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {hero.headline}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Banner Showcase & Stats Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20 space-y-8">
        {/* Banner Visual */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl aspect-[21/9] sm:aspect-[24/9] bg-primary">
          <Image
            src={hero.bannerImage}
            alt="Armada Rental Rentaku"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent flex flex-col justify-end p-6 sm:p-10">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              {hero.bannerBadge}
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-xl sm:text-3xl font-bold text-white mt-1">
              {hero.bannerTitle}
            </h2>
          </div>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <Card key={idx} level={1} padding="md" className="space-y-3">
              <span className="tnum font-[family-name:var(--font-headline)] text-3xl sm:text-4xl font-extrabold text-secondary block">
                {stat.number}
              </span>
              <div>
                <h3 className="font-bold text-primary text-sm sm:text-base">{stat.label}</h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Visi & Misi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-border p-6 sm:p-12 elevation-1 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">
              Tujuan Kami
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
              {visiMisi.visiTitle}
            </h2>
            <p className="text-sm text-text-muted leading-relaxed">
              {visiMisi.visiDesc}
            </p>
          </div>

          <div className="space-y-4 lg:border-l lg:border-border lg:pl-10">
            <h3 className="font-[family-name:var(--font-headline)] text-xl font-bold text-primary">
              {visiMisi.misiTitle}
            </h3>
            <ul className="space-y-3">
              {visiMisi.misiItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-text-main">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-secondary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Nilai-Nilai Utama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Standar Layanan
          </span>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary mt-1">
            Nilai Utama yang Kami Junjung
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nilaiUtama.map((n, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-6 elevation-1 space-y-3 hover:elevation-2 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center text-xl font-bold">
                {n.icon}
              </div>
              <h3 className="font-bold text-primary text-base">{n.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{n.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tanya Jawab (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl font-extrabold text-primary">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Semua yang perlu Anda ketahui mengenai proses sewa di RentaKu
          </p>
        </div>

        <div className="space-y-3">
          {faq.map((item, idx) => (
            <Card key={idx} level={1} padding="md" className="space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-start gap-2">
                <span className="text-secondary font-extrabold">Q:</span>
                <span>{item.question}</span>
              </h3>
              <p className="text-xs text-text-muted leading-relaxed pl-5">
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-[#00132f] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-extrabold">
              Siap Memulai Perjalanan Anda?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Temukan armada mobil atau motor pilihan Anda dari mitra resmi dan terpercaya di kota tujuan.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/katalog/mobil">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                  Cari Sewa Mobil
                </Button>
              </Link>
              <Link href="/katalog/motor">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Cari Sewa Motor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
