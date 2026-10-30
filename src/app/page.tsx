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
  Building2,
  UserCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { OFFICIAL_METRICS } from "@/lib/officialRoster";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const stats = [
    { label: "សមាជិកស្ម័គ្រចិត្ត ២០២៦~២០២៧ (Official Members)", value: `${OFFICIAL_METRICS.totalMembers}`, icon: Users },
    { label: "មុខវិជ្ជាស្នូល (Core Programs)", value: `${OFFICIAL_METRICS.totalCourses}`, icon: BookOpen },
    { label: "គណៈដឹកនាំ & ប្រធានក្រុម (Course Leaders)", value: `${OFFICIAL_METRICS.totalLeaders}`, icon: Award },
    { label: "ដេប៉ាតឺម៉ង់វិស្វកម្ម ITC (Engineering Depts)", value: `${OFFICIAL_METRICS.departmentsCount}`, icon: Building2 },
  ];

  const programs = [
    {
      slug: "programming",
      title: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
      code: "PROG101",
      icon: Code,
      desc: "ពង្រឹងមូលដ្ឋានគ្រឹះ C, C++, Data Structures, Algorithms, និងការដោះស្រាយបញ្ហាជាក់ស្តែងសម្រាប់វិស្វកម្ម។",
      color: "from-blue-600 to-indigo-600",
    },
    {
      slug: "mathematics",
      title: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      code: "MATH101",
      icon: Calculator,
      desc: "ស្វែងយល់ស៊ីជម្រៅអំពី Calculus, Linear Algebra, Differential Equations, និងការអនុវត្តជាក់ស្តែងក្នុងវិស្វកម្ម។",
      color: "from-indigo-600 to-purple-600",
    },
    {
      slug: "physics",
      title: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      code: "PHYS101",
      icon: Atom,
      desc: "ទ្រឹស្តីមេកានិកបុរាណ ចលនារលក ទែរម៉ូឌីណាមិក និងបាតុភូតរូបវិទ្យាសម្រាប់និស្សិតវិស្វកម្ម។",
      color: "from-cyan-600 to-blue-600",
    },
    {
      slug: "chemistry",
      title: "គីមីវិទ្យាទូទៅ (Chemistry)",
      code: "CHEM101",
      icon: FlaskConical,
      desc: "ទម្រង់ម៉ូលេគុល ប្រតិកម្មកាតាលីករ និងទែរម៉ូឌីណាមិកគីមីសម្រាប់ការស្រាវជ្រាវវិស្វកម្មទំនើប។",
      color: "from-emerald-600 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="flex justify-center mb-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2 shadow-lg ring-4 ring-primary/20 flex items-center justify-center transition-transform hover:scale-105">
                  <Image
                    src="/images/itc-logo.png"
                    alt="ITC Logo"
                    width={112}
                    height={112}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <GraduationCap className="w-4 h-4" />
                <span>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា • STJ ឆ្នាំសិក្សា {OFFICIAL_METRICS.academicYearTerm}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                កម្មវិធីរៀមច្បងបង្រៀនប្អូន <br />
                <span className="text-primary font-bold">Senior Teaching Junior</span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                ប្រព័ន្ធគ្រប់គ្រងការសិក្សា និងស្រង់វត្តមានផ្លូវការ នៃកម្មវិធី STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)។ លើកកម្ពស់គុណភាពអប់រំវិស្វកម្ម តាមរយៈការផ្ទេរចំណេះដឹងពីនិស្សិតរៀមច្បងឆ្នើម ជូនដល់និស្សិតជំនាន់ក្រោយ។
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/programs">
                  <Button size="lg" className="w-full sm:w-auto space-x-2">
                    <span>ស្វែងយល់ពីមុខវិជ្ជាសិក្សា</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/portal/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto space-x-2 border-primary/40 hover:bg-primary/5">
                    <UserCheck className="w-4 h-4 text-primary" />
                    <span>ច្រកចូលសមាជិក & រៀមច្បង (Portal)</span>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    អំពីកម្មវិធី STJ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

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
                  <Card key={prog.slug} className="group hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {prog.code}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                          {prog.desc}
                        </p>
                      </div>
                      <div className="pt-2">
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
      </main>

      <Footer />
    </div>
  );
}

