'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CardTestimoni } from './CardTestimoni';
import { testimoniList, testimoniSectionContent } from '@/content/testimoni';
import { Button } from '../ui/Button';

export interface SectionTestimoniProps {
  className?: string;
}

// Number of cards per slide per breakpoint:
// Desktop (lg+): 6 cards per slide (3 cols × 2 rows)
// Tablet (sm-lg): 4 cards per slide (2 cols × 2 rows)
// Mobile (<sm): 2 cards per slide (1 col × 2 rows)

export const SectionTestimoni: React.FC<SectionTestimoniProps> = ({
  className = '',
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState<'semua' | 'mobil' | 'motor'>('semua');

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

  // Split testimoniList into pages/slides
  const slides = useMemo(() => {
    const pages: typeof testimoniList[] = [];
    for (let i = 0; i < testimoniList.length; i += cardsPerSlide) {
      pages.push(testimoniList.slice(i, i + cardsPerSlide));
    }
    return pages;
  }, [cardsPerSlide]);

  const totalSlides = slides.length;

  // Clamp currentSlide when cardsPerSlide changes (resize)
  useEffect(() => {
    if (currentSlide >= totalSlides) {
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

  // Body scroll locking when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

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

  // Columns class derived from cardsPerSlide
  const gridColsClass =
    cardsPerSlide === 6
      ? 'grid-cols-3'
      : cardsPerSlide === 4
        ? 'grid-cols-2'
        : 'grid-cols-1';

  // Filtered testimonials for modal
  const filteredModalTestimoni = testimoniList.filter((item) => {
    if (modalFilter === 'semua') return true;
    if (modalFilter === 'mobil') {
      return (
        item.kendaraan.toLowerCase().includes('innova') ||
        item.kendaraan.toLowerCase().includes('xpander') ||
        item.kendaraan.toLowerCase().includes('avanza') ||
        item.kendaraan.toLowerCase().includes('brio') ||
        item.kendaraan.toLowerCase().includes('stargazer')
      );
    }
    if (modalFilter === 'motor') {
      return (
        item.kendaraan.toLowerCase().includes('pcx') ||
        item.kendaraan.toLowerCase().includes('nmax') ||
        item.kendaraan.toLowerCase().includes('vespa')
      );
    }
    return true;
  });

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div className="max-w-2xl space-y-2">
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

            {/* Desktop Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                aria-label="Testimoni sebelumnya"
                className="w-11 h-11 rounded-full border border-border bg-white text-primary hover:text-secondary hover:border-secondary/40 hover:bg-blue-50/50 shadow-sm flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary disabled:hover:border-border cursor-pointer select-none active:scale-95"
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

              <button
                type="button"
                onClick={handleNext}
                disabled={currentSlide >= totalSlides - 1}
                aria-label="Testimoni berikutnya"
                className="w-11 h-11 rounded-full border border-border bg-white text-primary hover:text-secondary hover:border-secondary/40 hover:bg-blue-50/50 shadow-sm flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary disabled:hover:border-border cursor-pointer select-none active:scale-95"
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
          </div>

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
                  <div className={`grid ${gridColsClass} gap-4 sm:gap-5 lg:gap-6`}>
                    {slideCards.map((testimoni) => (
                      <div key={testimoni.id} className="flex flex-col h-full">
                        <CardTestimoni testimoni={testimoni} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Arrows, Pagination Dots & Action CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Pagination Dots */}
            <div className="flex items-center gap-2 select-none">
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

            {/* Mobile Prev/Next controls */}
            <div className="flex sm:hidden items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentSlide === 0}
                aria-label="Testimoni sebelumnya"
                className="w-10 h-10 rounded-full border border-border bg-white text-primary hover:text-secondary shadow-sm flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <span className="text-xs font-semibold text-text-muted">
                {currentSlide + 1} / {totalSlides}
              </span>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentSlide >= totalSlides - 1}
                aria-label="Testimoni berikutnya"
                className="w-10 h-10 rounded-full border border-border bg-white text-primary hover:text-secondary shadow-sm flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Button "Lihat Semua Testimoni" */}
            <div>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsModalOpen(true)}
                className="text-xs sm:text-sm font-bold shadow-sm hover:border-secondary/40"
                leftIcon={
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
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                }
              >
                Lihat Semua Testimoni ({testimoniList.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Semua Testimoni Pelanggan */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    id="modal-title"
                    className="font-[family-name:var(--font-headline)] text-lg sm:text-xl font-bold text-primary"
                  >
                    Semua Ulasan & Testimoni Pelanggan
                  </h3>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 fill-[#FFB800]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    4.9 / 5.0
                  </span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Ulasan asli dari penyewa mobil dan motor terverifikasi di berbagai kota.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Tutup modal ulasan"
                className="w-9 h-9 rounded-xl border border-border text-slate-500 hover:text-primary hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="px-4 sm:px-6 py-3 border-b border-border bg-white flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-semibold text-text-muted mr-1 shrink-0">
                Filter Armada:
              </span>
              <button
                type="button"
                onClick={() => setModalFilter('semua')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  modalFilter === 'semua'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({testimoniList.length})
              </button>
              <button
                type="button"
                onClick={() => setModalFilter('mobil')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  modalFilter === 'mobil'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Mobil Saja
              </button>
              <button
                type="button"
                onClick={() => setModalFilter('motor')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  modalFilter === 'motor'
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Motor Saja
              </button>
            </div>

            {/* Modal Body: Grid of all cards */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] bg-slate-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredModalTestimoni.map((testimoni) => (
                  <div key={testimoni.id} className="h-full">
                    <CardTestimoni testimoni={testimoni} />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-border flex items-center justify-between gap-4 bg-white">
              <p className="text-xs text-text-muted hidden sm:block">
                Menampilkan {filteredModalTestimoni.length} dari {testimoniList.length} testimoni
              </p>
              <div className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => setIsModalOpen(false)}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
