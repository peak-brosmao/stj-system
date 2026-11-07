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
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/ui/Card";
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
    { label: "សមាជិករៀមច្បងស្ម័គ្រចិត្ត (Active Members)", value: `${totalMembers}+`, icon: Users },
    { label: "មុខវិជ្ជាស្នូល (Core Programs)", value: `${totalCourses}`, icon: BookOpen },
    { label: "ជំនួយការអាវុសោ (Senior Mentors)", value: `${totalLeaders}`, icon: Award },
    { label: "វគ្គបង្រៀនបានបញ្ចប់ (Completed Sessions)", value: `${completedSessions}+`, icon: Calendar },
  ];

  const programs = [
    {
      slug: "programming",
      title: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
      code: "PROG101",
      icon: Code,
      desc: "ពង្រឹងមូលដ្ឋានគ្រឹះ C, C++, Data Structures, Algorithms, និងការដោះស្រាយបញ្ហាជាក់ស្តែងសម្រាប់វិស្វកម្ម។",
      color: "from-blue-600 to-indigo-600",
      image: "/images/gallery/IMG_2847.JPG",
    },
    {
      slug: "mathematics",
      title: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      code: "MATH101",
      icon: Calculator,
      desc: "ស្វែងយល់ស៊ីជម្រៅអំពី Calculus, Linear Algebra, Differential Equations, និងការអនុវត្តជាក់ស្តែងក្នុងវិស្វកម្ម។",
      color: "from-indigo-600 to-purple-600",
      image: "/images/gallery/IMG_2849.JPG",
    },
    {
      slug: "physics",
      title: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      code: "PHYS101",
      icon: Atom,
      desc: "ទ្រឹស្តីមេកានិកបុរាណ ចលនារលក ទែរម៉ូឌីណាមិក និងបាតុភូតរូបវិទ្យាសម្រាប់និស្សិតវិស្វកម្ម។",
      color: "from-cyan-600 to-blue-600",
      image: "/images/gallery/IMG_2851.JPG",
    },
    {
      slug: "chemistry",
      title: "គីមីវិទ្យាទូទៅ (Chemistry)",
      code: "CHEM101",
      icon: FlaskConical,
      desc: "ទម្រង់ម៉ូលេគុល ប្រតិកម្មកាតាលីករ និងទែរម៉ូឌីណាមិកគីមីសម្រាប់ការស្រាវជ្រាវវិស្វកម្មទំនើប។",
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
              <span>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា • STJ ឆ្នាំសិក្សា 2026-2027 • បន្ទប់ SF1 & SF2</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight drop-shadow-sm">
              កម្មវិធីរៀមច្បងបង្រៀនប្អូន <br />
              <span className="text-primary font-bold">Senior Teaching Junior</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              ប្រព័ន្ធគ្រប់គ្រងការសិក្សា និងស្រង់វត្តមានផ្លូវការ នៃកម្មវិធី STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)។ ថ្នាក់រៀន និងការបង្រៀនប្រព្រឹត្តទៅនៅបន្ទប់ SF1 និង SF2 ដើម្បីពង្រឹងគុណភាពអប់រំវិស្វកម្ម។
            </p>

            {/* ONLY 3 PUBLIC BUTTONS - STRICTLY NO SYSTEM/DASHBOARD LINK */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link href="/programs">
                <Button size="lg" className="space-x-2 shadow-md">
                  <span>ស្វែងយល់ពីមុខវិជ្ជាសិក្សា</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/structure">
                <Button variant="outline" size="lg" className="space-x-2 border-primary/40 hover:bg-primary/5 bg-background/80 backdrop-blur-md">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>មែកធាងរចនាសម្ព័ន្ធ (Hierarchy Tree)</span>
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="lg" className="bg-background/40 hover:bg-background/80 backdrop-blur-md">
                  អំពីកម្មវិធី STJ
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
                មុខវិជ្ជាបណ្តុះបណ្តាលស្នូល
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                កម្មវិធីត្រូវបានរៀបចំឡើងយ៉ាងសម្រិតសម្រាំងស្របតាមកម្មវិធីសិក្សាវិស្វកម្ម នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
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
                          <span>ព័ត៌មានលម្អិតមុខវិជ្ជា</span>
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
                  ចក្ខុវិស័យ និងបេសកកម្មអប់រំ STJ
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  STJ ត្រូវបានបង្កើតឡើងក្នុងគោលបំណងបង្កើតជាវេទិកាសហការសិក្សា ដែលនិស្សិតរៀមច្បងចែករំលែកបទពិសោធន៍ វិធីសាស្ត្រស្រាវជ្រាវ និងការអនុវត្តលំហាត់ជាក់ស្តែងជូននិស្សិតប្អូនៗ ដើម្បីឆ្លើយតបនឹងស្តង់ដារគុណវុឌ្ឍិវិស្វកម្មរបស់ ITC។
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      ពង្រឹងមូលដ្ឋានគ្រឹះវិទ្យាសាស្ត្រពិត និងបច្ចេកវិទ្យា
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      គ្រប់គ្រងវត្តមាន និងការចូលរួមយ៉ាងត្រឹមត្រូវ តាមរយៈប្រព័ន្ធឌីជីថលកណ្តាល
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="text-xs text-foreground font-medium">
                      បង្កើតតំណភ្ជាប់ចែករំលែករបាយការណ៍វត្តមានប្រកបដោយសុវត្ថិភាព
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                <h3 className="font-bold text-base text-foreground">
                  ការចូលរួមជាមួយ STJ
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  និស្សិត ITC គ្រប់ដេប៉ាតឺម៉ង់ (GIC, AMS, GIM, GCA, GEE) អាចចុះឈ្មោះចូលរៀនក្នុងកម្មវិធីបានតាមរយៈការសម្របសម្រួលរបស់ប្រធានមុខវិជ្ជា និងគណៈគ្រប់គ្រង STJ។
                </p>
                <div className="pt-2">
                  <Link href="/contact">
                    <Button variant="default" size="sm" className="w-full">
                      ទាក់ទងមកកាន់ពួកយើង
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
                  <span>រចនាសម្ព័ន្ធមែកធាងដឹកនាំ (Organizational Tree)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  ស្វែងយល់អំពីរចនាសម្ព័ន្ធ និងសមាជិក STJ តាមឆ្នាំសិក្សា
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  ពិនិត្យមើលរចនាសម្ព័ន្ធមែកធាងដឹកនាំពីប្រធាន STJ កណ្តាល ប្រធានក្រុមតាមមុខវិជ្ជា និងសមាជិករៀមច្បងបង្រៀនទាំងអស់ ជាមួយនឹងមុខងារផ្លាស់ប្តូរឆ្នាំសិក្សាដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
                <Link href="/structure">
                  <Button size="lg" className="space-x-2 shadow-md">
                    <Sparkles className="w-4 h-4" />
                    <span>ពិនិត្យមើលមែកធាងពេញលេញ</span>
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