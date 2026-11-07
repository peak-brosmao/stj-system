import Image from "next/image";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/ui/Card";
import { Calendar, MapPin, Sparkles, Camera } from "lucide-react";
import { Badge } from "@/ui/ui/Badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ážŸáž€áž˜áŸ’áž˜áž—áž¶áž– áž“áž·áž„áž–áŸ’ážšáž¹ážáŸ’ážáž·áž€áž¶ážšážŽáŸ STJ | Senior Teaching Junior",
  description: "áž‘áž·ážŠáŸ’áž‹áž—áž¶áž–ážŸáž·áž€áŸ’ážáž¶ážŸáž¶áž›áž¶ ážáŸ’áž“áž¶áž€áŸ‹ážšáŸ€áž“ áž“áž·áž„áž–áŸ’ážšáž¹ážáŸ’ážáž·áž€áž¶ážšážŽáŸáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ážšáž”ážŸáŸ‹áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶",
};

export default function ActivitiesPage() {
  const activities = [
    {
      title: "ážŸáž·áž€áŸ’ážáž¶ážŸáž¶áž›áž¶áŸ– ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž›áŸ†áž áž¶ážáŸ‹áž”áŸ’ážšáž¡áž„ Programming áž”áŸ’ážšáž…áž¶áŸ†áž†áž˜áž¶ážŸ",
      category: "WORKSHOP",
      date: "12 ážœáž·áž…áŸ’áž†áž·áž€áž¶ 2026",
      location: "ážŸáž¶áž›ážŸáž“áŸ’áž“áž·ážŸáž¸áž‘ ITC, áž¢áž‚áž¶ážš F",
      status: "UPCOMING",
      image: "/images/gallery/IMG_2851.JPG",
      desc: "áž€áž¶ážšáž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸáž–áž¸áž“áž·ážŸáŸ’ážŸáž·ážáž†áŸ’áž“áž¾áž˜áž†áŸ’áž“áž¶áŸ†áž‘áž¸áŸ¤ áž“áž·áž„áž‘áž¸áŸ¥ áž¢áŸ†áž–áž¸ážšáž”áŸ€áž”ážŸážšážŸáŸážšáž€áž¼ážŠáž”áŸ’ážšáž¡áž„ áž“áž·áž„áž€áž¶ážšáž‡áŸ€ážŸážœáž¶áž„ syntax/logic errors áž€áŸ’áž“áž»áž„áž–áŸáž›áž”áŸ’ážšáž¡áž„áŸ”",
    },
    {
      title: "áž€áž¶ážšáž”áŸ’ážšáž€áž½ážáž”áŸ’ážšáž‡áŸ‚áž„ážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž›áŸ†áž áž¶ážáŸ‹áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ STJ Math Sprint",
      category: "COMPETITION",
      date: "25 ážáž»áž›áž¶ 2026",
      location: "áž”áž“áŸ’áž‘áž”áŸ‹ SF1 & SF2, ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2849.JPG",
      desc: "áž€áž¶ážšáž”áŸ’ážšáž€áž½ážáž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážšáž™áŸˆáž–áŸáž› áŸ¢áž˜áŸ‰áŸ„áž„ ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážáž†áŸ’áž“áž¶áŸ†áž‘áž¸áŸ¡ áž…áž¼áž›ážšáž½áž˜ážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž›áŸ†áž áž¶ážáŸ‹ Calculus áž“áž·áž„ Linear Algebra áž‡áž¶áž˜áž½áž™ážšáŸ€áž˜áž…áŸ’áž”áž„áŸ”",
    },
    {
      title: "ážœáž‚áŸ’áž‚áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž‚ážšáž»áž€áŸ„ážŸáž›áŸ’áž™ áž“áž·áž„áž€áž¶ážšážŠáž¹áž€áž“áž¶áŸ†áž€áŸ’ážšáž»áž˜ ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ STJ",
      category: "TRAINING",
      date: "05 ážáž»áž›áž¶ 2026",
      location: "áž”áž“áŸ’áž‘áž”áŸ‹ SF1, ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2853.JPG",
      desc: "áž€áž¶ážšáž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›áž‡áŸ†áž“áž¶áž‰áž”áž„áŸ’ážšáŸ€áž“ áž“áž·áž„ážšáž”áŸ€áž”áž”áŸ’ážšáž¾áž”áŸ’ážšáž¶ážŸáŸ‹áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážœážáŸ’ážáž˜áž¶áž“ STJ ážŒáž¸áž‡áž¸ážáž› áž‡áž¼áž“ážŠáž›áŸ‹áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áŸ”",
    },
    {
      title: "ážœáž‚áŸ’áž‚áž”áž„áŸ’ážšáŸ€áž“áž¢áž“áž»ážœážáŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ Computer Programming & Data Structures",
      category: "CLASSROOM",
      date: "ážáž»áž›áž¶ 2026",
      location: "áž”áž“áŸ’áž‘áž”áŸ‹ SF1, ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2847.JPG",
      desc: "áž€áž¶ážšáž áŸ’ážœáž¹áž€áž áž¶ážáŸ‹ážŸážšážŸáŸážšáž€áž¼ážŠáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž›áž¾áž€áž»áŸ†áž–áŸ’áž™áž¼áž‘áŸážš ážŠáŸ„áž™áž˜áž¶áž“áž€áž¶ážšážŽáŸ‚áž“áž¶áŸ†áž•áŸ’áž‘áž¶áž›áŸ‹áž–áž¸ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’ážáŸ”",
    },
    {
      title: "ážœáŸáž‘áž·áž€áž¶áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž”áž‘áž–áž·ážŸáŸ„áž’áž“áŸ áž“áž·áž„ážáž˜áŸ’ážšáž„áŸ‹áž‘áž·ážŸáž“áž·ážŸáŸ’ážŸáž·ážáž†áŸ’áž“áž¶áŸ†áž‘áž¸áŸ¡ (Mentorship Forum)",
      category: "MENTORSHIP",
      date: "áž€áž‰áŸ’áž‰áž¶ 2026",
      location: "áž¢áž‚áž¶ážš B, áž”ážšáž·ážœáŸážŽ ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2905.JPG",
      desc: "áž€áž¶ážšáž‡áž½áž”áž‡áž»áŸ†ážšážœáž¶áž„ážšáŸ€áž˜áž…áŸ’áž”áž„ áž“áž·áž„áž”áŸ’áž¢áž¼áž“áŸ— ážŠáž¾áž˜áŸ’áž”áž¸áž–áž·áž—áž¶áž€áŸ’ážŸáž¶áž¢áŸ†áž–áž¸ážœáž·áž’áž¸ážŸáž¶ážŸáŸ’ážáŸ’ážšážšáŸ€áž“ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ áž“áž·áž„áž€áž¶ážšážáŸ’ážšáŸ€áž˜ážáŸ’áž›áž½áž“ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž†áž˜áž¶ážŸážŸáž·áž€áŸ’ážŸáž¶ážáŸ’áž˜áž¸áŸ”",
    },
    {
      title: "áž€áž¶ážšáž”áž„áŸ’áž áž¶áž‰áž‚áž˜áŸ’ážšáŸ„áž„áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶ áž“áž·áž„áž“ážœáž¶áž“áž»ážœážáŸ’ážáž“áŸážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Engineering Showcase)",
      category: "SHOWCASE",
      date: "ážœáž·áž…áŸ’áž†áž·áž€áž¶ 2026",
      location: "Innovation Hub, ITC",
      status: "UPCOMING",
      image: "/images/gallery/IMG_2915.JPG",
      desc: "áž€áž¶ážšážáž¶áŸ†áž„áž”áž„áŸ’áž áž¶áž‰ážŸáž˜áž·áž‘áŸ’áž’áž•áž›áž‚áž˜áŸ’ážšáŸ„áž„ážŸážšážŸáŸážšáž€áž¼ážŠ áž“áž·áž„áž€áž¶ážšážŸáŸ’ážšáž¶ážœáž‡áŸ’ážšáž¶ážœáž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶ážŠáŸ‚áž›áž”áž„áŸ’áž€áž¾ážáž¡áž¾áž„ážŠáŸ„áž™áž€áŸ’ážšáž»áž˜ážŸáž·áž€áŸ’ážŸáž¶ STJáŸ”",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>ážŸáž€áž˜áŸ’áž˜áž—áž¶áž– áž“áž·áž„áž–áŸ’ážšáž¹ážáŸ’ážáž·áž€áž¶ážšážŽáŸ (STJ Events & Life)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              ážŸáž€áž˜áŸ’áž˜áž—áž¶áž– áž“áž·áž„áž–áŸ’ážšáž¹ážáŸ’ážáž·áž€áž¶ážšážŽáŸ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              áž‘áž·ážŠáŸ’áž‹áž—áž¶áž–áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž“áŸƒáž€áž¶ážšážšáŸ€áž“ áž€áž¶ážšáž”áž„áŸ’ážšáŸ€áž“ áž€áž¶ážšáž”áŸ’ážšáž€áž½ážáž”áŸ’ážšáž‡áŸ‚áž„ áž“áž·áž„ážŸáž·áž€áŸ’ážáž¶ážŸáž¶áž›áž¶ážšáž”ážŸáŸ‹áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act, idx) => (
              <Card key={idx} className="overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 group flex flex-col shadow-sm hover:shadow-md">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                  <Image
                    src={act.image}
                    alt={act.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {act.category}
                    </span>
                    <Badge variant={act.status === "UPCOMING" ? "info" : "success"}>
                      {act.status === "UPCOMING" ? "ážáž¶áž„áž˜áž»ážáž“áŸáŸ‡" : "áž”áž¶áž“áž”áž‰áŸ’áž…áž”áŸ‹"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {act.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex flex-col gap-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{act.date}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
