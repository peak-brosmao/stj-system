"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  Layers,
  LayoutDashboard,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SessionUser } from "@/types";

export interface HeroShowcaseImage {
  id: string;
  src: string;
  titleKh: string;
  titleEn: string;
  category: string;
  location: string;
  date: string;
}

const HERO_SLIDES: HeroShowcaseImage[] = [
  {
    id: "s1",
    src: "/images/gallery/IMG_2910.JPG",
    titleKh: "សាមគ្គីភាព និងការប្តេជ្ញាចិត្តរបស់សមាជិកស្ម័គ្រចិត្ត STJ",
    titleEn: "Volunteer Mentors Solidarity & Commitment",
    category: "ថ្នាក់ដឹកនាំ & សមាជិក",
    location: "បរិវេណវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
    date: "ឆ្នាំសិក្សា ២០២៦-២០២៧",
  },
  {
    id: "s2",
    src: "/images/gallery/IMG_2847.JPG",
    titleKh: "ថ្នាក់រៀនអនុវត្តជាក់ស្តែង Computer Programming & Coding",
    titleEn: "Hands-on Programming & Coding Session",
    category: "ថ្នាក់រៀនជាក់ស្តែង",
    location: "Computer Lab អគារ F, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "s3",
    src: "/images/gallery/IMG_2845.JPG",
    titleKh: "វគ្គបណ្តុះបណ្តាល និងចែករំលែកបទពិសោធន៍ផ្ទាល់",
    titleEn: "Direct Peer Coaching & Mentorship",
    category: "ការបង្ហាត់បង្ហាញ",
    location: "បន្ទប់សិក្សា ITC, Campus 1",
    date: "តុលា ២០២៦",
  },
  {
    id: "s4",
    src: "/images/gallery/IMG_2851.JPG",
    titleKh: "សិក្ខាសាលាពង្រឹងមូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រពិត",
    titleEn: "Engineering & Science Foundations Workshop",
    category: "សិក្ខាសាលា",
    location: "សាលសន្និសីទ ITC",
    date: "កញ្ញា ២០២៦",
  },
  {
    id: "s5",
    src: "/images/gallery/IMG_2849.JPG",
    titleKh: "ការពិភាក្សាដោះស្រាយលំហាត់ស្មុគស្មាញជាក្រុម",
    titleEn: "Interactive Group Problem Solving",
    category: "ការពិភាក្សា",
    location: "បន្ទប់ A-201, អគារ A, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "s6",
    src: "/images/gallery/IMG_2905.JPG",
    titleKh: "បរិយាកាសសិក្សាសកម្ម និងកក់ក្តៅរវាងរៀមច្បង និងប្អូនៗ",
    titleEn: "Active & Supportive Peer Learning",
    category: "ការបង្ហាត់បង្ហាញ",
    location: "អគារ B, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "s7",
    src: "/images/gallery/IMG_2915.JPG",
    titleKh: "ការបង្ហាញវិធីសាស្ត្រស្រាវជ្រាវបច្ចេកវិទ្យាទំនើប",
    titleEn: "Modern Engineering & Tech Showcase",
    category: "នវានុវត្តន៍",
    location: "Innovation Hub, ITC",
    date: "វិច្ឆិកា ២០២៦",
  },
];

interface HeroShowcaseProps {
  session: SessionUser | null;
  dashboardUrl: string;
}

export function HeroShowcase({ session, dashboardUrl }: HeroShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: HERO INFORMATION & ACTIONS (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-2 shadow-md ring-2 ring-primary/20 flex items-center justify-center shrink-0">
                <Image
                  src="/images/itc-logo.png"
                  alt="ITC Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា • STJ ឆ្នាំសិក្សា 2026-2027</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                កម្មវិធីរៀមច្បងបង្រៀនប្អូន <br />
                <span className="text-primary font-bold">Senior Teaching Junior</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                ប្រព័ន្ធគ្រប់គ្រងការសិក្សា និងស្រង់វត្តមានផ្លូវការ នៃកម្មវិធី STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)។ លើកកម្ពស់គុណភាពអប់រំវិស្វកម្ម តាមរយៈការផ្ទេរចំណេះដឹងពីនិស្សិតរៀមច្បងឆ្នើម ជូនដល់និស្សិតជំនាន់ក្រោយ។
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link href="/programs">
                <Button size="lg" className="space-x-2 shadow-md">
                  <span>ស្វែងយល់ពីមុខវិជ្ជាសិក្សា</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/structure">
                <Button variant="outline" size="lg" className="space-x-2 border-primary/40 hover:bg-primary/5">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>មែកធាងរចនាសម្ព័ន្ធ (Hierarchy Tree)</span>
                </Button>
              </Link>
              {session ? (
                <Link href={dashboardUrl}>
                  <Button variant="outline" size="lg" className="space-x-2 border-primary text-primary hover:bg-primary/10 font-bold">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span>ផ្ទាំងគ្រប់គ្រង ({session.fullNameKh || "Dashboard"})</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/portal/login">
                  <Button variant="outline" size="lg" className="space-x-2 border-primary/40 hover:bg-primary/5">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <span>ច្រកចូលសមាជិក (Portal)</span>
                  </Button>
                </Link>
              )}
              <Link href="/about">
                <Button variant="ghost" size="lg">
                  អំពីកម្មវិធី STJ
                </Button>
              </Link>
            </div>

            {/* QUICK HIGHLIGHT PILLS */}
            <div className="pt-4 border-t border-border flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-card border border-border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-foreground">៤ មុខវិជ្ជាស្នូល</span>
                <span>(Core Programs)</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-card border border-border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-foreground">៣៧+ សមាជិករៀមច្បង</span>
                <span>(Active Mentors)</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-card border border-border shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="font-semibold text-foreground">វត្តមានឌីជីថល ១០០%</span>
                <span>(Digital System)</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PROMINENT, ULTRA-SHARP PHOTO SHOWCASE CARD (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-card group">
              {/* Main Image Frame (Full 100% Opacity, Ultra Clear & Sharp) */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-muted">
                {HERO_SLIDES.map((slide, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={slide.titleEn}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-cover transform transition-transform duration-[6000ms] ease-out scale-100 group-hover:scale-105"
                      />
                    </div>
                  );
                })}

                {/* Subtle bottom-only gradient for readable caption without washing out image */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-md">
                    {activeSlide.category}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary text-primary-foreground font-bold shadow-md">
                    {currentIndex + 1} / {HERO_SLIDES.length}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 z-30 text-white space-y-1.5 pointer-events-none">
                  <h3 className="text-sm sm:text-base font-bold leading-snug drop-shadow line-clamp-2">
                    {activeSlide.titleKh}
                  </h3>
                  <p className="text-[11px] text-white/80 font-sans truncate">
                    {activeSlide.titleEn}
                  </p>
                  <div className="flex items-center space-x-3 text-[10px] text-white/70 pt-1 border-t border-white/20">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-primary-foreground shrink-0" />
                      <span className="truncate">{activeSlide.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-primary-foreground shrink-0" />
                      <span>{activeSlide.date}</span>
                    </span>
                  </div>
                </div>

                {/* Manual Navigation Arrows */}
                <button
                  type="button"
                  onClick={prevSlide}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Thumbnail Strip for Instant Selection */}
              <div className="p-3 bg-card border-t border-border flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-12 h-9 rounded-lg overflow-hidden shrink-0 transition-all border-2 ${
                        idx === currentIndex
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : "border-border/60 opacity-60 hover:opacity-100 hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={slide.src}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Autoplay Pause/Play */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause slideshow" : "Start slideshow"}
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors shrink-0"
                  title={isPlaying ? "ផ្អាកស្លាយ" : "បន្តស្លាយ"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
