"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface HeroImage {
  src: string;
  titleKh: string;
  titleEn: string;
}

const HERO_IMAGES: HeroImage[] = [
  {
    src: "/images/gallery/IMG_2910.JPG",
    titleKh: "សាមគ្គីភាព និងការប្តេជ្ញាចិត្តរបស់សមាជិកស្ម័គ្រចិត្ត STJ",
    titleEn: "STJ Volunteer Mentors Solidarity at ITC",
  },
  {
    src: "/images/gallery/IMG_2847.JPG",
    titleKh: "ថ្នាក់រៀនអនុវត្តជាក់ស្តែង Programming & Coding",
    titleEn: "Hands-on Programming & Coding Lab",
  },
  {
    src: "/images/gallery/IMG_2845.JPG",
    titleKh: "វគ្គបណ្តុះបណ្តាល និងចែករំលែកបទពិសោធន៍ផ្ទាល់",
    titleEn: "Direct Peer Coaching & Mentorship",
  },
  {
    src: "/images/gallery/IMG_2851.JPG",
    titleKh: "សិក្ខាសាលាពង្រឹងមូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រពិត",
    titleEn: "Science & Engineering Workshop",
  },
  {
    src: "/images/gallery/IMG_2849.JPG",
    titleKh: "ការពិភាក្សាដោះស្រាយលំហាត់ស្មុគស្មាញជាក្រុម",
    titleEn: "Engineering Problem Solving Session",
  },
  {
    src: "/images/gallery/IMG_2905.JPG",
    titleKh: "បរិយាកាសសិក្សាសកម្ម និងកក់ក្តៅរវាងរៀមច្បង និងប្អូនៗ",
    titleEn: "Active & Supportive Learning Environment",
  },
  {
    src: "/images/gallery/IMG_2915.JPG",
    titleKh: "ការបង្ហាញវិធីសាស្ត្រស្រាវជ្រាវបច្ចេកវិទ្យាទំនើប",
    titleEn: "Modern Engineering & Tech Research Showcase",
  },
];

interface HeroAnimatedBackgroundProps {
  children: React.ReactNode;
}

export function HeroAnimatedBackground({ children }: HeroAnimatedBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  return (
    <div className="relative min-h-[640px] md:min-h-[720px] flex items-center justify-center overflow-hidden border-b border-border">
      {/* BACKGROUND IMAGE CAROUSEL / REDEEM ANIMATION LAYERS */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {HERO_IMAGES.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div
                className={`w-full h-full transform transition-transform duration-[6000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.titleEn}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}

        {/* ELEGANT GRADIENT & GLASS OVERLAYS */}
        {/* Layer 1: Soft radial glow in center for text focus */}
        <div className="absolute inset-0 z-20 bg-background/85 dark:bg-background/90 backdrop-blur-[4px]" />

        {/* Layer 2: Top and Bottom Edge Fades for seamless integration */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-background/95 via-transparent to-background" />

        {/* Layer 3: Subtle primary accent tint */}
        <div className="absolute inset-0 z-20 bg-gradient-to-tr from-primary/10 via-transparent to-indigo-500/10 pointer-events-none" />
      </div>

      {/* FOREGROUND HERO CONTENT */}
      <div className="relative z-30 container mx-auto px-4 py-16 md:py-24">
        {children}
      </div>

      {/* BOTTOM CONTROLS & PHOTO CAPTION PILL */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto">
        {/* Current photo caption pill */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-background/80 dark:bg-card/85 backdrop-blur-md border border-border/80 text-[11px] text-muted-foreground shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="font-semibold text-foreground truncate max-w-[260px] sm:max-w-md">
            {HERO_IMAGES[currentIndex].titleKh}
          </span>
          <span className="hidden md:inline font-sans text-muted-foreground/80">
            • {HERO_IMAGES[currentIndex].titleEn}
          </span>
        </div>

        {/* Interactive Slide Navigation Dots & Play/Pause */}
        <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-background/80 dark:bg-card/85 backdrop-blur-md border border-border/80 shadow-sm">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-1 px-1">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-5 bg-primary"
                    : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3 bg-border mx-0.5" />

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
