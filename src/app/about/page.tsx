import Image from "next/image";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { GraduationCap, Target, Users, BookOpen, Shield, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/ui/ui/Card";

export const metadata = {
  title: "áž¢áŸ†áž–áž¸áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ | Senior Teaching Junior",
  description: "áž”áŸ’ážšážœážáŸ’ážáž·áž“áŸƒáž€áž¶ážšáž€áž€áž¾áž áž…áž€áŸ’ážáž»ážœáž·ážŸáŸáž™ áž”áŸážŸáž€áž€áž˜áŸ’áž˜ áž“áž·áž„áž‘ážŸáŸ’ážŸáž“ážœáž·áž‡áŸ’áž‡áž¶áž“áŸƒáž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“ážšáž”ážŸáŸ‹áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="flex justify-center mb-1">
              <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md ring-2 ring-primary/20 flex items-center justify-center">
                <Image
                  src="/images/itc-logo.png"
                  alt="ITC Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ â€¢ Institute of Technology of Cambodia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              áž¢áŸ†áž–áž¸áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ (Senior Teaching Junior)
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              áž”áŸ’ážšážœážáŸ’ážáž·áž“áŸƒáž€áž¶ážšáž€áž€áž¾áž áž…áž€áŸ’ážáž»ážœáž·ážŸáŸáž™ áž“áž·áž„ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„áž€áž¶ážšážŸáž·áž€áŸ’ážŸáž¶ážšáž”ážŸáŸ‹ STJ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶
            </p>
          </div>

          {/* Featured Hero Photo: Team of Mentors */}
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-lg aspect-[16/8] sm:aspect-[21/9] w-full bg-muted">
            <Image
              src="/images/gallery/IMG_2910.JPG"
              alt="STJ Mentors Solidarity at ITC"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                ážŸáž¶áž˜áž‚áŸ’áž‚áž¸áž—áž¶áž– áž“áž·áž„áž€áž¶ážšáž”áŸ’ážáŸáž‡áŸ’áž‰áž¶áž…áž·ážáŸ’áž
              </span>
              <h2 className="text-base sm:text-2xl font-bold leading-tight drop-shadow">
                ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž STJ áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áŸ¢áŸ áŸ¢áŸ¦-áŸ¢áŸ áŸ¢áŸ§
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-sans max-w-2xl">
                áž€áŸ’ážšáž»áž˜áž€áž¶ážšáž„áž¶ážšážšáŸ€áž˜áž…áŸ’áž”áž„ážáŸ†ážŽáž¶áž„áž˜áž€áž–áž¸áž‚áŸ’ážšáž”áŸ‹ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹áž“áŸƒážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ ážšáž½áž˜áž‚áŸ’áž“áž¶áž•áŸ’áž‘áŸážšáž…áŸ†ážŽáŸáŸ‡ážŠáž¹áž„ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">áž…áž€áŸ’ážáž»ážœáž·ážŸáŸáž™ (Vision)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  áž€áŸ’áž›áž¶áž™áž‡áž¶ážŸáž áž‚áž˜áž“áŸážŸáž·áž€áŸ’ážŸáž¶áž‚áŸ†ážšáž¼áž“áŸ… ITC ážŠáŸ‚áž›áž•áŸ’ážŸáž¶ážšáž—áŸ’áž‡áž¶áž”áŸ‹áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„ážšážœáž¶áž„áž“áž·ážŸáŸ’ážŸáž·ážážšáŸ€áž˜áž…áŸ’áž”áž„ áž“áž·áž„áž“áž·ážŸáŸ’ážŸáž·ážáž”áŸ’áž¢áž¼áž“ ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšáž•áŸ’áž‘áŸážšáž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸ áž“áž·áž„áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž‘áŸ†áž“áž¾áž”áŸ”
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">áž”áŸážŸáž€áž€áž˜áŸ’áž˜ (Mission)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ážšáŸ€áž”áž…áŸ†ážáŸ’áž“áž¶áž€áŸ‹áž”áž„áŸ’ážšáŸ€áž“áž”áž“áŸ’ážáŸ‚áž˜ážŠáŸ„áž™áž¥ážáž‚áž·ážážáŸ’áž›áŸƒáž›áž¾áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážŸáŸ’áž“áž¼áž› ážŠáž¼áž…áž‡áž¶ Programming, Math, Physics, áž“áž·áž„ Chemistry ážŠáž¾áž˜áŸ’áž”áž¸áž‡áž½áž™áž–áž„áŸ’ážšáž¹áž„ážŸáž˜ážáŸ’ážáž—áž¶áž–ážŸáž·áž€áŸ’ážŸáž¶áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áŸ”
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">áž‚áž»ážŽážáž˜áŸ’áž›áŸƒ (Values)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ážŸáž¶áž˜áž‚áŸ’áž‚áž¸áž—áž¶áž– áž€áž¶ážšáž‚áŸ„ážšáž–ážœáž·áž“áŸáž™ áž—áž¶áž–ážŸáŸ’áž˜áŸ„áŸ‡ážáŸ’ážšáž„áŸ‹áž€áŸ’áž“áž»áž„áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ áž“áž·áž„áž€áž¶ážšáž›áž¾áž€áž€áž˜áŸ’áž–ážŸáŸ‹ážŸáŸ’áž˜áž¶ážšážáž¸áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€ážŠáŸ„áž™áž¥ážáž¢áž¶ážáŸ’áž˜áž¶áž“áž·áž™áž˜áŸ”
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Philosophy details with Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>áž‘ážŸáŸ’ážŸáž“ážœáž·áž‡áŸ’áž‡áž¶áž“áŸƒáž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“ (Teaching Philosophy)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                ážšáŸ€áž“áž€áž¶áž“áŸ‹ážáŸ‚áž…áŸ’áž”áž¶ážŸáŸ‹ ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž‘áŸ…áž€áž¶áž“áŸ‹áž¢áŸ’áž“áž€ážŠáž‘áŸƒ
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                áž“áŸ… STJ áž™áž¾áž„áž‡áž¿áž‡áž¶áž€áŸ‹ážáž¶ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšáž›áŸ’áž¢áž”áŸ†áž•áž»ážáž€áŸ’áž“áž»áž„áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ…áž›áž¾áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ áž‚ážºáž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“áž‘áŸ…áž€áž¶áž“áŸ‹áž¢áŸ’áž“áž€ážŠáž‘áŸƒáŸ” áž“áž·ážŸáŸ’ážŸáž·ážážšáŸ€áž˜áž…áŸ’áž”áž„ážŠáŸ‚áž›áž‘áž‘áž½áž›áž”áž¶áž“áž–áž·áž“áŸ’áž‘áž»áž›áŸ’áž¢ áž“áž·áž„áž˜áž¶áž“áž‡áŸ†áž“áž¶áž‰áž‚ážšáž»áž€áŸ„ážŸáž›áŸ’áž™ ážáŸ’ážšáž¼ážœáž”áž¶áž“áž‡áŸ’ážšáž¾ážŸážšáž¾ážŸážŠáž¾áž˜áŸ’áž”áž¸ážŠáž¹áž€áž“áž¶áŸ†áž€áŸ’ážšáž»áž˜ážŸáž·áž€áŸ’ážŸáž¶áŸ” áž–áž½áž€áž‚áŸáž˜áž·áž“ážáŸ’ážšáž¹áž˜ážáŸ‚áž”áž„áŸ’ážšáŸ€áž“áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž”áŸ‰áž»ážŽáŸ’ážŽáŸ„áŸ‡áž‘áŸ áž”áŸ‰áž»áž“áŸ’ážáŸ‚ážáŸ‚áž˜áž‘áž¶áŸ†áž„áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€ážáž·áž…áž“áž·áž€áž“áŸƒáž€áž¶ážšáž”áŸ’ážšáž¡áž„ áž“áž·áž„áž€áž¶ážšážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž›áŸ†áž áž¶ážáŸ‹ážŸáŸ’áž˜áž»áž‚ážŸáŸ’áž˜áž¶áž‰áž•áž„ážŠáŸ‚ážšáŸ”
              </p>
              <div className="space-y-2 pt-2 text-xs text-foreground font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>áž€áž¶ážšáž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž¢áž“áž»ážœážáŸ’ážáž€áž¼ážŠ áž“áž·áž„ážšáž¼áž”áž˜áž“áŸ’ážážŠáŸ„áž™áž•áŸ’áž‘áž¶áž›áŸ‹</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>áž€áž¶ážšážáž¶áž˜ážŠáž¶áž“ážœážáŸ’ážáž˜áž¶áž“ áž“áž·áž„ážœážŒáŸ’ážáž“áž—áž¶áž–ážŸáž·áž€áŸ’ážŸáž¶áž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážáž˜áŸ’áž›áž¶áž—áž¶áž–</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-border shadow-md bg-muted">
              <Image
                src="/images/gallery/IMG_2905.JPG"
                alt="Classroom Mentoring at ITC"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                <p className="font-bold">áž”ážšáž·áž™áž¶áž€áž¶ážŸážŸáž·áž€áŸ’ážŸáž¶ážŠáŸ„áž™áž•áŸ’áž‘áž¶áž›áŸ‹</p>
                <p className="text-[10px] text-white/80 font-sans">áž¢áž‚áž¶ážš B, áž”áž“áŸ’áž‘áž”áŸ‹ážŸáž·áž€áŸ’ážŸáž¶ ITC</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
