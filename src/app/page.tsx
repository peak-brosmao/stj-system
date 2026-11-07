import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Calendar,
  ArrowRight,
  Code,
  Calculator,
  Atom,
  FlaskConical,
  CheckCircle2,
  UserCheck,
  Layers,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Button } from "@/ui/ui/Button";
import { Card, CardContent } from "@/ui/ui/Card";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";
import { HomeGallery } from "@/ui/home/HomeGallery";
import { HeroAnimatedBackground } from "@/ui/home/HeroAnimatedBackground";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Live stats are owned by the backend API.
  let totalMembers = 39;
  let totalCourses = 4;
  let totalLeaders = 4;
  let totalDepts = 9;
  let completedSessions = 0;

  try {
    const response = await fetch(`${LARAVEL_API_BASE}/stats`, { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      totalMembers = data.summary?.activeMembers ?? totalMembers;
      totalCourses = data.summary?.totalCourses ?? totalCourses;
      totalLeaders = data.summary?.totalLeaders ?? totalLeaders;
      completedSessions = data.summary?.totalSessions ?? completedSessions;
    }
  } catch (err) {
    console.warn("[HomePage] Backend stats unavailable:", err);
  }

  const stats = [
    { label: "ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž (Active Members)", value: `${totalMembers}+`, icon: Users },
    { label: "áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážŸáŸ’áž“áž¼áž› (Core Programs)", value: `${totalCourses}`, icon: BookOpen },
    { label: "áž‡áŸ†áž“áž½áž™áž€áž¶ážšáž¢áž¶ážœáž»ážŸáŸ„ (Senior Mentors)", value: `${totalLeaders}`, icon: Award },
    { label: "ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“áž”áž¶áž“áž”áž‰áŸ’áž…áž”áŸ‹ (Completed Sessions)", value: `${completedSessions}+`, icon: Calendar },
  ];

  const programs = [
    {
      slug: "programming",
      title: "áž€áž¶ážšážŸážšážŸáŸážšáž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž€áž»áŸ†áž–áŸ’áž™áž¼áž‘áŸážš (Programming)",
      code: "PROG101",
      icon: Code,
      desc: "áž–áž„áŸ’ážšáž¹áž„áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áž‚áŸ’ážšáž¹áŸ‡ C, C++, Data Structures, Algorithms, áž“áž·áž„áž€áž¶ážšážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž”áž‰áŸ’áž áž¶áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
      color: "from-blue-600 to-indigo-600",
      image: "/images/gallery/IMG_2847.JPG",
    },
    {
      slug: "mathematics",
      title: "áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Mathematics)",
      code: "MATH101",
      icon: Calculator,
      desc: "ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ…áž¢áŸ†áž–áž¸ Calculus, Linear Algebra, Differential Equations, áž“áž·áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž€áŸ’áž“áž»áž„ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
      color: "from-indigo-600 to-purple-600",
      image: "/images/gallery/IMG_2849.JPG",
    },
    {
      slug: "physics",
      title: "ážšáž¼áž”ážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Physics)",
      code: "PHYS101",
      icon: Atom,
      desc: "áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž˜áŸáž€áž¶áž“áž·áž€áž”áž»ážšáž¶ážŽ áž…áž›áž“áž¶ážšáž›áž€ áž‘áŸ‚ážšáž˜áŸ‰áž¼ážŒáž¸ážŽáž¶áž˜áž·áž€ áž“áž·áž„áž”áž¶ážáž»áž—áž¼ážážšáž¼áž”ážœáž·áž‘áŸ’áž™áž¶ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
      color: "from-cyan-600 to-blue-600",
      image: "/images/gallery/IMG_2851.JPG",
    },
    {
      slug: "chemistry",
      title: "áž‚áž¸áž˜áž¸ážœáž·áž‘áŸ’áž™áž¶áž‘áž¼áž‘áŸ… (Chemistry)",
      code: "CHEM101",
      icon: FlaskConical,
      desc: "áž‘áž˜áŸ’ážšáž„áŸ‹áž˜áŸ‰áž¼áž›áŸáž‚áž»áž› áž”áŸ’ážšážáž·áž€áž˜áŸ’áž˜áž€áž¶ážáž¶áž›áž¸áž€ážš áž“áž·áž„áž‘áŸ‚ážšáž˜áŸ‰áž¼ážŒáž¸ážŽáž¶áž˜áž·áž€áž‚áž¸áž˜áž¸ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž€áž¶ážšážŸáŸ’ážšáž¶ážœáž‡áŸ’ážšáž¶ážœážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áž‘áŸ†áž“áž¾áž”áŸ”",
      color: "from-emerald-600 to-teal-600",
      image: "/images/gallery/IMG_2854.JPG",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION WITH ULTRA-SHARP ANIMATED PHOTO BACKGROUND */}
        <HeroAnimatedBackground>
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2 shadow-xl ring-4 ring-primary/20 flex items-center justify-center transition-transform hover:scale-105">
                <Image
                  src="/images/itc-logo.png"
                  alt="ITC Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold backdrop-blur-md">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ â€¢ STJ áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ 2026-2027 â€¢ áž”áž“áŸ’áž‘áž”áŸ‹ SF1 & SF2</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight drop-shadow-sm">
              áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“áž”áŸ’áž¢áž¼áž“ <br />
              <span className="text-primary font-bold">Senior Teaching Junior</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšážŸáž·áž€áŸ’ážŸáž¶ áž“áž·áž„ážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“áž•áŸ’áž›áž¼ážœáž€áž¶ážš áž“áŸƒáž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ (ITC)áŸ” ážáŸ’áž“áž¶áž€áŸ‹ážšáŸ€áž“ áž“áž·áž„áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž”áŸ’ážšáž–áŸ’ážšáž¹ážáŸ’ážáž‘áŸ…áž“áŸ…áž”áž“áŸ’áž‘áž”áŸ‹ SF1 áž“áž·áž„ SF2 ážŠáž¾áž˜áŸ’áž”áž¸áž–áž„áŸ’ážšáž¹áž„áž‚áž»ážŽáž—áž¶áž–áž¢áž”áŸ‹ážšáŸ†ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”
            </p>

            {/* ONLY 3 PUBLIC BUTTONS - STRICTLY NO SYSTEM/DASHBOARD LINK */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/programs">
                <Button size="lg" className="space-x-2 shadow-md">
                  <span>ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž–áž¸áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážŸáž·áž€áŸ’ážŸáž¶</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/structure">
                <Button variant="outline" size="lg" className="space-x-2 border-primary/40 hover:bg-primary/5 bg-background/80 backdrop-blur-md">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>áž˜áŸ‚áž€áž’áž¶áž„ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ (Hierarchy Tree)</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="bg-background/40 hover:bg-background/80 backdrop-blur-md">
                  áž¢áŸ†áž–áž¸áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ
                </Button>
              </Link>
            </div>
          </div>
        </HeroAnimatedBackground>

        {/* STATISTICS SECTION */}
        <section className="py-12 border-b border-border bg-card/40">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <Card key={idx} className="border border-border/80">
                    <CardContent className="p-6 flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold tracking-tight text-foreground">{s.value}</div>
                        <div className="text-xs text-muted-foreground leading-snug">{s.label}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROGRAMS SECTION */}
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Academic Programs
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›ážŸáŸ’áž“áž¼áž›
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážáŸ’ážšáž¼ážœáž”áž¶áž“ážšáŸ€áž”áž…áŸ†áž¡áž¾áž„áž™áŸ‰áž¶áž„ážŸáž˜áŸ’ážšáž·ážážŸáž˜áŸ’ážšáž¶áŸ†áž„ážŸáŸ’ážšáž”ážáž¶áž˜áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ážŸáž·áž€áŸ’ážŸáž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ áž“áŸƒážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {programs.map((prog) => {
                const Icon = prog.icon;
                return (
                  <Card key={prog.slug} className="group hover:border-primary/50 transition-all duration-300 overflow-hidden flex flex-col border border-border">
                    {/* Authentic photo banner for course */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                      <Image
                        src={prog.image}
                        alt={prog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/20">
                          {prog.code}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 className="text-base font-bold text-white drop-shadow leading-snug">
                            {prog.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {prog.desc}
                      </p>
                      <div className="pt-2 border-t border-border/60">
                        <Link
                          href={`/programs/${prog.slug}`}
                          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>áž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·ážáž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* AUTHENTIC CAMPUS PHOTO GALLERY */}
        <HomeGallery />

        {/* PHILOSOPHY & OBJECTIVES */}
        <section className="py-16 md:py-20 bg-muted/20 border-b border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Our Mission & Values
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  áž…áž€áŸ’ážáž»ážœáž·ážŸáŸáž™ áž“áž·áž„áž”áŸážŸáž€áž€áž˜áŸ’áž˜áž¢áž”áŸ‹ážšáŸ† STJ
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  STJ ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’áž€áž¾ážáž¡áž¾áž„áž€áŸ’áž“áž»áž„áž‚áŸ„áž›áž”áŸ†ážŽáž„áž”áž„áŸ’áž€áž¾ážáž‡áž¶ážœáŸáž‘áž·áž€áž¶ážŸáž áž€áž¶ážšážŸáž·áž€áŸ’ážŸáž¶ ážŠáŸ‚áž›áž“áž·ážŸáŸ’ážŸáž·ážážšáŸ€áž˜áž…áŸ’áž”áž„áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸ ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšážŸáŸ’ážšáž¶ážœáž‡áŸ’ážšáž¶ážœ áž“áž·áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž›áŸ†áž áž¶ážáŸ‹áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž‡áž¼áž“áž“áž·ážŸáŸ’ážŸáž·ážáž”áŸ’áž¢áž¼áž“áŸ— ážŠáž¾áž˜áŸ’áž”áž¸áž†áŸ’áž›áž¾áž™ážáž”áž“áž¹áž„ážŸáŸ’ážáž„áŸ‹ážŠáž¶ážšáž‚áž»ážŽážœáž»ážŒáŸ’ážáž·ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ážšáž”ážŸáŸ‹ ITCáŸ”
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      áž–áž„áŸ’ážšáž¹áž„áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áž‚áŸ’ážšáž¹áŸ‡ážœáž·áž‘áŸ’áž™áž¶ážŸáž¶ážŸáŸ’ážáŸ’ážšáž–áž·áž áž“áž·áž„áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážœážáŸ’ážáž˜áž¶áž“ áž“áž·áž„áž€áž¶ážšáž…áž¼áž›ážšáž½áž˜áž™áŸ‰áž¶áž„ážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœ ážáž¶áž˜ážšáž™áŸˆáž”áŸ’ážšáž–áŸáž“áŸ’áž’ážŒáž¸áž‡áž¸ážáž›áž€ážŽáŸ’ážáž¶áž›
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      áž”áž„áŸ’áž€áž¾ážážáŸ†ážŽáž—áŸ’áž‡áž¶áž”áŸ‹áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€ážšáž”áž¶áž™áž€áž¶ážšážŽáŸážœážáŸ’ážáž˜áž¶áž“áž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                <h3 className="font-bold text-base text-foreground">
                  áž€áž¶ážšáž…áž¼áž›ážšáž½áž˜áž‡áž¶áž˜áž½áž™ STJ
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  áž“áž·ážŸáŸ’ážŸáž·áž ITC áž‚áŸ’ážšáž”áŸ‹ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (GIC, AMS, GIM, GCA, GEE) áž¢áž¶áž…áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡áž…áž¼áž›ážšáŸ€áž“áž€áŸ’áž“áž»áž„áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž”áž¶áž“ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšážŸáž˜áŸ’ážšáž”ážŸáž˜áŸ’ážšáž½áž›ážšáž”ážŸáŸ‹áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ áž“áž·áž„áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJáŸ”
                </p>
                <div className="pt-2">
                  <Link href="/contact">
                    <Button variant="default" size="sm" className="w-full">
                      áž‘áž¶áž€áŸ‹áž‘áž„áž˜áž€áž€áž¶áž“áŸ‹áž–áž½áž€áž™áž¾áž„
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ORGANIZATIONAL HIERARCHY TREE BANNER SECTION */}
        <section className="py-16 md:py-20 border-b border-border bg-gradient-to-r from-primary/5 via-card to-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="rounded-3xl border-2 border-primary/20 bg-card p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž˜áŸ‚áž€áž’áž¶áž„ážŠáž¹áž€áž“áž¶áŸ† (Organizational Tree)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž¢áŸ†áž–áž¸ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ áž“áž·áž„ážŸáž˜áž¶áž‡áž·áž€ STJ ážáž¶áž˜áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  áž–áž·áž“áž·ážáŸ’áž™áž˜áž¾áž›ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž˜áŸ‚áž€áž’áž¶áž„ážŠáž¹áž€áž“áž¶áŸ†áž–áž¸áž”áŸ’ážšáž’áž¶áž“ STJ áž€ážŽáŸ’ážáž¶áž› áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜ážáž¶áž˜áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ áž“áž·áž„ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹ áž‡áž¶áž˜áž½áž™áž“áž¹áž„áž˜áž»ážáž„áž¶ážšáž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšáž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ážŠáŸ„áž™ážŸáŸ’ážœáŸáž™áž”áŸ’ážšážœážáŸ’ážáž·áŸ”
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                <Link href="/structure">
                  <Button size="lg" className="space-x-2 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span>áž–áž·áž“áž·ážáŸ’áž™áž˜áž¾áž›áž˜áŸ‚áž€áž’áž¶áž„áž–áŸáž‰áž›áŸáž‰</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
