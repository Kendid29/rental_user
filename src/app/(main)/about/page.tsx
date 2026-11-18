import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Target,
  Award,
  HeartHandshake,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Car,
} from 'lucide-react';
import { tentangKamiContent } from '@/content/tentangKami';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const { hero, stats, visiMisi, nilaiUtama, faq } = tentangKamiContent;

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-dark via-primary to-primary text-white pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold backdrop-blur-md text-emerald-300 shadow-sm">
            <span>🇮🇩</span>
            <span>{hero.badge}</span>
          </div>

          <h1 className="font-[family-name:var(--font-headline)] text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            {hero.headline}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Banner Visual & Key Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-28 relative z-20 space-y-10">
        {/* Banner Visual Card */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-white/20 shadow-2xl aspect-[21/9] sm:aspect-[24/9] bg-primary">
          <Image
            src={hero.bannerImage}
            alt="Armada RentalinAja"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/50 to-transparent flex flex-col justify-end p-6 sm:p-12">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{hero.bannerBadge}</span>
            </span>
            <h2 className="font-[family-name:var(--font-headline)] text-xl sm:text-3xl lg:text-4xl font-black text-white mt-1.5 tracking-tight">
              {hero.bannerTitle}
            </h2>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              level={1}
              padding="lg"
              className="space-y-3 rounded-3xl bg-white border-border/80 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <span className="tnum font-[family-name:var(--font-headline)] text-3xl sm:text-4xl font-black text-secondary block">
                {stat.number}
              </span>
              <div>
                <h3 className="font-bold text-primary text-base">
                  {stat.label}
                </h3>
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
        <div className="bg-white rounded-3xl border border-border/80 p-8 sm:p-14 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Visi Kami</span>
            </span>

            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-primary tracking-tight">
              {visiMisi.visiTitle}
            </h2>

            <p className="text-sm text-text-muted leading-relaxed">
              {visiMisi.visiDesc}
            </p>
          </div>

          <div className="space-y-5 lg:border-l lg:border-border/80 lg:pl-12">
            <h3 className="font-[family-name:var(--font-headline)] text-xl sm:text-2xl font-bold text-primary">
              {visiMisi.misiTitle}
            </h3>

            <ul className="space-y-3.5">
              {visiMisi.misiItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3.5 text-xs sm:text-sm text-text-main"
                >
                  <div className="w-6 h-6 rounded-xl bg-blue-50 text-secondary border border-blue-200/60 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="leading-relaxed font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Nilai-Nilai Utama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Standar Layanan
          </span>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-primary mt-1.5 tracking-tight">
            Nilai Utama yang Kami Junjung
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-2">
            Komitmen kami untuk memberikan pengalaman sewa kendaraan yang transparan dan aman.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nilaiUtama.map((n, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-border/80 p-6 sm:p-7 space-y-4 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary border border-blue-100 flex items-center justify-center text-xl font-bold">
                {n.icon}
              </div>
              <h3 className="font-bold text-primary text-base sm:text-lg">
                {n.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {n.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Tanya Jawab (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Pusat Bantuan</span>
          </span>
          <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black text-primary tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            Semua hal yang perlu Anda ketahui mengenai persyaratan dan alur sewa di RentalinAja.
          </p>
        </div>

        <div className="space-y-4">
          {faq.map((item, idx) => (
            <Card
              key={idx}
              level={1}
              padding="lg"
              className="space-y-2 rounded-2xl border-border/80 shadow-2xs hover:border-secondary/30 transition-colors"
            >
              <h3 className="font-bold text-sm sm:text-base text-primary flex items-start gap-2.5">
                <span className="text-secondary font-black">Q:</span>
                <span>{item.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed pl-6">
                {item.answer}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary via-primary-dark to-[#00183b] rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3.5">
            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-4xl font-black">
              Siap Menjelajahi Kota Bersama Kami?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pilih mobil atau motor favorit Anda langsung dari mitra lokal terpercaya dengan harga jujur dan konfirmasi cepat.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/fleet/cars">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Cari Sewa Mobil
                </Button>
              </Link>
              <Link href="/fleet/bikes">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
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
