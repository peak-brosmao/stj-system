"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, MapPin } from "lucide-react";

interface HeroImage {
  src: string;
  titleKh: string;
  titleEn: string;
  room: string;
}

const HERO_IMAGES: HeroImage[] = [
  {
    src: "/images/gallery/IMG_2910.JPG",
    titleKh: "សាមគ្គីភាព និងការប្តេជ្ញាចិត្តរបស់សមាជិកស្ម័គ្រចិត្ត STJ",
    titleEn: "STJ Volunteer Mentors Solidarity at ITC",
    room: "បរិវេណវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
  },
  {
    src: "/images/gallery/IMG_2847.JPG",
    titleKh: "ថ្នាក់រៀនអនុវត្តជាក់ស្តែង Computer Programming & Coding",
    titleEn: "Hands-on Programming & Coding Lab",
    room: "បន្ទប់ SF1, ITC",
  },
  {
    src: "/images/gallery/IMG_2845.JPG",
    titleKh: "វគ្គបណ្តុះបណ្តាល និងចែករំលែកបទពិសោធន៍ផ្ទាល់",
    titleEn: "Direct Peer Coaching & Mentorship",
    room: "បន្ទប់ SF2, ITC",
  },
  {
    src: "/images/gallery/IMG_2849.JPG",
    titleKh: "ការពិភាក្សាដោះស្រាយលំហាត់ស្មុគស្មាញជាក្រុម",
    titleEn: "Engineering Problem Solving Session",
    room: "បន្ទប់ SF1, ITC",
  },
  {
    src: "/images/gallery/IMG_2905.JPG",
    titleKh: "បរិយាកាសសិក្សាសកម្ម និងកក់ក្តៅរវាងរៀមច្បង និងប្អូនៗ",
    titleEn: "Active & Supportive Learning Environment",
    room: "បន្ទប់ SF2, ITC",
  },
  {
    src: "/images/gallery/IMG_2851.JPG",
    titleKh: "សិក្ខាសាលាពង្រឹងមូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រពិត",
    titleEn: "Science & Engineering Workshop",
    room: "បន្ទប់ SF1 & SF2, ITC",
  },
  {
    src: "/images/gallery/IMG_2915.JPG",
    titleKh: "ការបង្ហាញវិធីសាស្ត្រស្រាវជ្រាវបច្ចេកវិទ្យាទំនើប",
    titleEn: "Modern Engineering & Tech Research Showcase",
    room: "បន្ទប់ SF1, ITC",
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

  const currentImage = HERO_IMAGES[currentIndex];

  return (
    <div className="relative min-h-[600px] md:min-h-[680px] flex items-center justify-center overflow-hidden border-b border-border bg-black">
      {/* BACKGROUND IMAGE CAROUSEL WITH HIGH CLARITY (ច្បាស់ត្រដែត) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {HERO_IMAGES.map((img, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={img.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-80 dark:opacity-75 z-10" : "opacity-0 z-0"
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

        {/* LIGHT VIGNETTE & SUBTLE GRADIENTS FOR MAXIMUM IMAGE CLARITY & TEXT READABILITY */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/75 pointer-events-none" />
      </div>

      {/* FOREGROUND HERO CONTENT WRAPPED IN A REFINED GLASS CARD */}
      <div className="relative z-30 container mx-auto px-4 pt-12 pb-24 md:py-24 flex justify-center">
        <div className="max-w-4xl w-full bg-background/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-3xl p-6 sm:p-10 md:p-12 border border-white/50 dark:border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)]">
          {children}
        </div>
      </div>

      {/* BOTTOM CONTROLS & PHOTO CAPTION PILL */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-auto">
        {/* Current photo caption pill with Room */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] text-white shadow-lg">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
          <span className="font-semibold truncate max-w-[240px] sm:max-w-md">
            {currentImage.titleKh}
          </span>
          <span className="flex items-center space-x-1 text-primary-foreground font-mono bg-primary/40 px-2 py-0.5 rounded-full text-[10px]">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span>{currentImage.room}</span>
          </span>
        </div>

        {/* Slide Navigation Dots & Play/Pause */}
        <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-lg">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Previous slide"
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
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
                    : "w-1.5 bg-white/40 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next slide"
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3 bg-white/30 mx-1" />

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
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