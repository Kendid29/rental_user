'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CardTestimoni } from './CardTestimoni';
import { testimoniList, testimoniSectionContent } from '@/content/testimoni';
import { Testimoni } from '@/types';

export interface SectionTestimoniProps {
  className?: string;
}

// Number of cards per slide per breakpoint:
// Desktop (lg+): 6 cards per slide (3 cols × 2 rows)
// Tablet (sm-lg): 4 cards per slide (2 cols × 2 rows)
// Mobile (<sm): 2 cards per slide (1 col × 2 rows)

function isMobil(item: Testimoni): boolean {
  const k = item.kendaraan.toLowerCase();
  const l = (item.layanan || '').toLowerCase();
  return (
    k.includes('innova') ||
    k.includes('xpander') ||
    k.includes('avanza') ||
    k.includes('brio') ||
    k.includes('stargazer') ||
    l.includes('lepas kunci') ||
    l.includes('dengan sopir')
  );
}

function isMotor(item: Testimoni): boolean {
  const k = item.kendaraan.toLowerCase();
  const l = (item.layanan || '').toLowerCase();
  return (
    k.includes('pcx') ||
    k.includes('nmax') ||
    k.includes('vespa') ||
    l.includes('motor')
  );
}

export const SectionTestimoni: React.FC<SectionTestimoniProps> = ({
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(6);

  // Filter states
  const [filterKendaraan, setFilterKendaraan] = useState<'semua' | 'mobil' | 'motor'>('semua');
  const [sortRating, setSortRating] = useState<'tertinggi' | 'terendah'>('tertinggi');

  // Touch swipe states
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Responsive cards-per-slide
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 640) {
        setCardsPerSlide(2); // 1 col × 2 rows on mobile
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(4); // 2 cols × 2 rows on tablet
      } else {
        setCardsPerSlide(6); // 3 cols × 2 rows on desktop
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  // Filter and sort testimonials
  const filteredTestimoni = useMemo(() => {
    let list = [...testimoniList];

    // Filter by vehicle type
    if (filterKendaraan === 'mobil') {
      list = list.filter(isMobil);
    } else if (filterKendaraan === 'motor') {
      list = list.filter(isMotor);
    }

    // Sort by rating
    list.sort((a, b) => {
      if (sortRating === 'tertinggi') {
        return b.rating - a.rating;
      }
      return a.rating - b.rating;
    });

    return list;
  }, [filterKendaraan, sortRating]);

  // Counts for filter pills
  const countSemua = testimoniList.length;
  const countMobil = useMemo(() => testimoniList.filter(isMobil).length, []);
  const countMotor = useMemo(() => testimoniList.filter(isMotor).length, []);

  // Split filteredTestimoni into pages/slides
  const slides = useMemo(() => {
    const pages: typeof filteredTestimoni[] = [];
    for (let i = 0; i < filteredTestimoni.length; i += cardsPerSlide) {
      pages.push(filteredTestimoni.slice(i, i + cardsPerSlide));
    }
    return pages;
  }, [filteredTestimoni, cardsPerSlide]);

  const totalSlides = slides.length;

  // Reset slide index when filters change
  const handleFilterKendaraanChange = (type: 'semua' | 'mobil' | 'motor') => {
    setFilterKendaraan(type);
    setCurrentSlide(0);
  };

  const handleSortRatingChange = (sort: 'tertinggi' | 'terendah') => {
    setSortRating(sort);
    setCurrentSlide(0);
  };

  // Clamp currentSlide when cardsPerSlide or filter changes
  useEffect(() => {
    if (totalSlides > 0 && currentSlide >= totalSlides) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [totalSlides, currentSlide]);

  // Viewport intersection animation with reduced motion check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const currentElem = sectionRef.current;
    if (!currentElem) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(currentElem);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle URL hash on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#testimoni') {
      const element = document.getElementById('testimoni');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  // Touch gestures for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="testimoni"
      className={`scroll-mt-20 sm:scroll-mt-24 py-12 sm:py-16 bg-slate-50 border-y border-border relative overflow-hidden ${className}`}
    >
      {/* Subtle ambient light accents matching design system */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated container */}
        <div
          className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8 motion-reduce:opacity-100 motion-reduce:translate-y-0'
          }`}
        >
          {/* Section Header */}
          <div className="max-w-2xl space-y-2 mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-secondary text-xs font-semibold select-none">
              <svg
                className="w-3.5 h-3.5 text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
              {testimoniSectionContent.badge}
            </div>

            <h2 className="font-[family-name:var(--font-headline)] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
              {testimoniSectionContent.heading}
            </h2>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {testimoniSectionContent.deskripsi}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Jenis Kendaraan */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                  />
                </svg>
                Kendaraan:
              </span>
              <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => handleFilterKendaraanChange('semua')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterKendaraan === 'semua'
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-200/70'
                  }`}
                >
                  Semua Kendaraan ({countSemua})
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterKendaraanChange('mobil')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    filterKendaraan === 'mobil'
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-200/70'
                  }`}
                >
                  <span>Mobil</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      filterKendaraan === 'mobil'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {countMobil}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFilterKendaraanChange('motor')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    filterKendaraan === 'motor'
                      ? 'bg-secondary text-white shadow-xs'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-200/70'
                  }`}
                >
                  <span>Motor</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      filterKendaraan === 'motor'
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {countMotor}
                  </span>
                </button>
              </div>
            </div>

            {/* Filter Urutan Rating */}
            <div className="flex items-center gap-2.5 justify-between sm:justify-start">
              <label
                htmlFor="sort-rating"
                className="text-xs font-bold text-text-muted uppercase tracking-wider shrink-0 flex items-center gap-1.5"
              >
                <svg
                  className="w-4 h-4 text-amber-500 fill-amber-500"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Urutkan:
              </label>
              <div className="relative">
                <select
                  id="sort-rating"
                  value={sortRating}
                  onChange={(e) =>
                    handleSortRatingChange(e.target.value as 'tertinggi' | 'terendah')
                  }
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-border rounded-xl pl-3 pr-8 py-1.5 text-xs font-bold text-primary focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary cursor-pointer transition-colors shadow-2xs"
                >
                  <option value="tertinggi">Rating Tertinggi</option>
                  <option value="terendah">Rating Terendah</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Content / Empty State */}
          {filteredTestimoni.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-border my-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-primary text-base">Tidak ada ulasan ditemukan</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                Belum ada ulasan yang sesuai dengan kombinasi filter yang dipilih. Silakan coba filter lainnya.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFilterKendaraan('semua');
                  setSortRating('tertinggi');
                  setCurrentSlide(0);
                }}
                className="mt-4 px-4 py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-xs cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              {/* Carousel Viewport Container */}
              <div
                className="overflow-hidden py-2"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Sliding Track — one flex-child per slide */}
                <div
                  className="flex transition-transform duration-500 ease-out will-change-transform"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slideCards, slideIdx) => (
                    <div key={slideIdx} className="w-full shrink-0">
                      <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
                        {slideCards.map((testimoni) => (
                          <div
                            key={testimoni.id}
                            className="w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-3rem)/3)] flex flex-col"
                          >
                            <CardTestimoni testimoni={testimoni} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation: Left Arrow + Dots + Right Arrow */}
              {totalSlides > 1 && (
                <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4 select-none">
                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentSlide === 0}
                    aria-label="Testimoni sebelumnya"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-border bg-white text-primary hover:text-secondary hover:border-secondary/40 hover:bg-blue-50/50 shadow-xs flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary disabled:hover:border-border cursor-pointer select-none active:scale-95 shrink-0"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>

                  {/* Pagination Dots */}
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalSlides }).map((_, idx) => {
                      const isActiveDot = currentSlide === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentSlide(idx)}
                          aria-label={`Pindah ke slide ${idx + 1}`}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            isActiveDot
                              ? 'w-7 h-2.5 bg-secondary'
                              : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentSlide >= totalSlides - 1}
                    aria-label="Testimoni berikutnya"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-border bg-white text-primary hover:text-secondary hover:border-secondary/40 hover:bg-blue-50/50 shadow-xs flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary disabled:hover:border-border cursor-pointer select-none active:scale-95 shrink-0"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};
