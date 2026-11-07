"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, Eye, MapPin, Calendar, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";

interface PhotoItem {
  id: string;
  src: string;
  titleKh: string;
  titleEn: string;
  category: "classroom" | "mentorship" | "workshop";
  location: string;
  date: string;
}

const GALLERY_PHOTOS: PhotoItem[] = [
  {
    id: "p1",
    src: "/images/gallery/IMG_2845.JPG",
    titleKh: "វគ្គបណ្តុះបណ្តាល និងចែករំលែកបទពិសោធន៍ផ្ទាល់",
    titleEn: "Mentorship & Direct Peer Coaching",
    category: "mentorship",
    location: "បន្ទប់ SF2, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "p2",
    src: "/images/gallery/IMG_2847.JPG",
    titleKh: "ថ្នាក់រៀនអនុវត្តជាក់ស្តែង Programming & Coding",
    titleEn: "Hands-on Programming Classroom Session",
    category: "classroom",
    location: "បន្ទប់ SF1, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "p3",
    src: "/images/gallery/IMG_2849.JPG",
    titleKh: "ការពិភាក្សាដោះស្រាយលំហាត់ស្មុគស្មាញជាក្រុម",
    titleEn: "Interactive Group Problem Solving",
    category: "classroom",
    location: "បន្ទប់ SF1, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "p4",
    src: "/images/gallery/IMG_2851.JPG",
    titleKh: "សិក្ខាសាលាពង្រឹងមូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រពិត",
    titleEn: "Science & Engineering Foundations Workshop",
    category: "workshop",
    location: "បន្ទប់ SF1 & SF2, ITC",
    date: "កញ្ញា ២០២៦",
  },
  {
    id: "p5",
    src: "/images/gallery/IMG_2853.JPG",
    titleKh: "ការប្រជុំត្រួតពិនិត្យវត្តមាន និងផែនការបង្រៀនរបស់ក្រុមដឹកនាំ",
    titleEn: "STJ Leadership & Academic Coordination Meeting",
    category: "workshop",
    location: "បន្ទប់ SF1, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "p6",
    src: "/images/gallery/IMG_2905.JPG",
    titleKh: "បរិយាកាសសិក្សាសកម្ម និងកក់ក្តៅរវាងរៀមច្បង និងប្អូនៗ",
    titleEn: "Active & Supportive Peer-Learning Atmosphere",
    category: "mentorship",
    location: "បន្ទប់ SF2, ITC",
    date: "តុលា ២០២៦",
  },
  {
    id: "p7",
    src: "/images/gallery/IMG_2908.JPG",
    titleKh: "ការណែនាំគន្លឹះដោះស្រាយលំហាត់ប្រឡងប្រចាំឆមាស",
    titleEn: "Midterm & Final Exam Strategy Coaching",
    category: "classroom",
    location: "បន្ទប់ SF1, ITC",
    date: "វិច្ឆិកា ២០២៦",
  },
  {
    id: "p8",
    src: "/images/gallery/IMG_2910.JPG",
    titleKh: "សាមគ្គីភាព និងការប្តេជ្ញាចិត្តរបស់សមាជិកស្ម័គ្រចិត្ត STJ",
    titleEn: "Volunteer Mentors Solidarity & Commitment",
    category: "mentorship",
    location: "បរិវេណវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
    date: "តុលា ២០២៦",
  },
  {
    id: "p9",
    src: "/images/gallery/IMG_2915.JPG",
    titleKh: "ការបង្ហាញវិធីសាស្ត្រស្រាវជ្រាវបច្ចេកវិទ្យាទំនើប",
    titleEn: "Modern Engineering & Tech Research Showcase",
    category: "workshop",
    location: "បន្ទប់ SF2, ITC",
    date: "វិច្ឆិកា ២០២៦",
  },
];

export function HomeGallery() {
  const [activeTab, setActiveTab] = useState<"all" | "classroom" | "mentorship" | "workshop">("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const filteredPhotos = activeTab === "all"
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeTab);

  const openLightbox = (idx: number) => {
    setSelectedPhotoIndex(idx);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
  };

  return (
    <section className="py-16 md:py-24 border-b border-border bg-gradient-to-b from-card/30 via-background to-card/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>សកម្មភាពផ្ទាល់នៅបរិវេណ ITC (Authentic Campus Moments)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              រូបភាពសកម្មភាពជាក់ស្តែងនៃកម្មវិធី STJ
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              ទិដ្ឋភាពថ្នាក់រៀន សិក្ខាសាលា និងការចែករំលែកចំណេះដឹងពីសមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្តជូនដល់និស្សិតប្អូនៗនៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា។
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border shrink-0 text-xs">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              ទាំងអស់ ({GALLERY_PHOTOS.length})
            </button>
            <button
              onClick={() => setActiveTab("classroom")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "classroom"
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              ថ្នាក់បង្រៀន (Classrooms)
            </button>
            <button
              onClick={() => setActiveTab("mentorship")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "mentorship"
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              ការបង្ហាត់បង្ហាញ (Mentorship)
            </button>
            <button
              onClick={() => setActiveTab("workshop")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "workshop"
                  ? "bg-primary text-primary-foreground font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              សិក្ខាសាលា (Workshops)
            </button>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={photo.src}
                  alt={photo.titleEn}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {photo.category === "classroom" ? "ថ្នាក់រៀន" : photo.category === "mentorship" ? "ការបង្ហាត់" : "សិក្ខាសាលា"}
                  </span>
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Bottom title on photo */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <p className="text-xs font-bold leading-snug drop-shadow line-clamp-1">{photo.titleKh}</p>
                  <p className="text-[11px] text-white/80 font-sans truncate">{photo.titleEn}</p>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-4 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border bg-card/60">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </div>
                <div className="flex items-center space-x-1 shrink-0 font-mono">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>{photo.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            title="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            title="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[90vh] w-full flex flex-col items-center space-y-4">
            <div className="relative w-full h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={filteredPhotos[selectedPhotoIndex].src}
                alt={filteredPhotos[selectedPhotoIndex].titleEn}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center text-white space-y-1">
              <h3 className="text-base sm:text-lg font-bold">{filteredPhotos[selectedPhotoIndex].titleKh}</h3>
              <p className="text-xs text-white/70 font-sans">{filteredPhotos[selectedPhotoIndex].titleEn}</p>
              <p className="text-[11px] text-primary-foreground/80 font-mono pt-1">
                {filteredPhotos[selectedPhotoIndex].location} • {filteredPhotos[selectedPhotoIndex].date}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
