import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { ArrowLeft, Clock, MapPin, User, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

const COURSE_DATA: Record<
  string,
  {
    title: string;
    code: string;
    term: string;
    leaders: string[];
    schedule: string;
    room: string;
    desc: string;
    syllabus: string[];
  }
> = {
  programming: {
    title: "áž€áž¶ážšážŸážšážŸáŸážšáž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž€áž»áŸ†áž–áŸ’áž™áž¼áž‘áŸážš (Programming)",
    code: "PROG101",
    term: "2026-2027 Semester 1",
    leaders: ["áž›áž¶áž„ áž‡áž¸áž„áž áŸáž„ (LEANG JINGHENG - I3-GTI, Student ID: e20240704)"],
    schedule: "ážšáŸ€áž„ážšáž¶áž›áŸ‹ážáŸ’áž„áŸƒážŸáŸ…ážšáŸ áž˜áŸ‰áŸ„áž„ 08:00 - 11:00 áž–áŸ’ážšáž¹áž€",
    room: "áž”áž“áŸ’áž‘áž”áŸ‹ SF1 (Room SF1), ITC Campus 1",
    desc: "ážœáž‚áŸ’áž‚áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›ážŠáŸ‚áž›áž•áŸ’ážáŸ„ážáž›áž¾áž€áž¶ážšážŸážšážŸáŸážšáž€áž¼ážŠáž”áŸ’ážšáž€áž”ážŠáŸ„áž™áž”áŸ’ážšážŸáž·áž‘áŸ’áž’áž—áž¶áž– áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„áž¢áŸ†áž–áž¸ Memory Management, Pointer Mechanics, áž“áž·áž„ Algorithms ážŸáŸ†ážáž¶áž“áŸ‹áŸ—ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
    syllabus: [
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¡-áŸ¢áŸ– áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áž‚áŸ’ážšáž¹áŸ‡ C/C++, Syntax, Data Types & Control Flow",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ£-áŸ¤áŸ– Pointers, Arrays, Dynamic Memory Allocation (malloc, free)",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¥-áŸ¦áŸ– Data Structures: Linked Lists, Stacks, Queues",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ§-áŸ¨áŸ– Binary Trees, Graph Traversal & Sorting Algorithms",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ©-áŸ¡áŸ áŸ– áž€áž¶ážšážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž›áŸ†áž áž¶ážáŸ‹áž”áŸ’ážšáž¡áž„ áž“áž·áž„ mini-project áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„",
    ],
  },
  mathematics: {
    title: "áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Mathematics)",
    code: "MATH101",
    term: "2026-2027 Semester 1",
    leaders: ["áž‚áž¹áž˜ ážšážáž“áŸˆ (KIM Ratanak - I5-GIM, Student ID: e20221423)"],
    schedule: "ážšáŸ€áž„ážšáž¶áž›áŸ‹ážáŸ’áž„áŸƒáž¢áž¶áž‘áž·ážáŸ’áž™ áž˜áŸ‰áŸ„áž„ 08:00 - 11:00 áž–áŸ’ážšáž¹áž€",
    room: "áž”áž“áŸ’áž‘áž”áŸ‹ SF2 (Room SF2), ITC Campus 1",
    desc: "áž–áž„áŸ’ážšáž¹áž„áž€áž¶ážšáž‚áž·ážáž”áŸ‚áž”ážšáž·áŸ‡áž‚áž“áŸ‹ážáž¶áž˜ážšáž™áŸˆáž€áž¶ážšážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™ážŸáž˜áž¸áž€áž¶ážšážŒáž¸áž•áŸážšáŸ‰áž„áŸ‹ážŸáŸ’áž™áŸ‚áž› áž€áž¶ážšážœáž·áž—áž¶áž‚áž˜áŸ‰áž¶áž‘áŸ’ážšáž¸ážŸ áž“áž·áž„ Calculus áž€áž˜áŸ’ážšáž·ážážáŸ’áž–ážŸáŸ‹ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
    syllabus: [
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¡-áŸ¢áŸ– Partial Derivatives, Gradients & Directional Derivatives",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ£-áŸ¤áŸ– Double and Triple Integrals & Coordinate Transformations",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¥-áŸ¦áŸ– Matrices, Eigenvalues, Eigenvectors and Diagonalization",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ§-áŸ¨áŸ– First and Second-Order Ordinary Differential Equations",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ©-áŸ¡áŸ áŸ– Laplace Transforms áž“áž·áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž€áŸ’áž“áž»áž„ážŸáŸ€áž‚áŸ’ážœáž¸áž¢áž‚áŸ’áž‚áž·ážŸáž“áž¸",
    ],
  },
  physics: {
    title: "ážšáž¼áž”ážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Physics)",
    code: "PHYS101",
    term: "2026-2027 Semester 1",
    leaders: ["áž‚áŸ’ážšáž»áž™ áž¢áž¸áž»ážáž¶áž„ (KRUY Ykhang - I3-GIM, Student ID: e20240096)"],
    schedule: "ážšáŸ€áž„ážšáž¶áž›áŸ‹ážáŸ’áž„áŸƒážŸáŸ…ážšáŸ áž˜áŸ‰áŸ„áž„ 02:00 - 05:00 ážšážŸáŸ€áž›",
    room: "áž”áž“áŸ’áž‘áž”áŸ‹ SF1 (Room SF1), ITC Campus 1",
    desc: "áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž˜áŸáž€áž¶áž“áž·áž€áž”áž»ážšáž¶ážŽ ážáž¶áž˜áž–áž› áž…áž›áž“áž¶ážšáž›áž€ áž“áž·áž„áž¢áž»áž”áž‘áž·áž…ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áž‘áž¼áž‘áŸ…áŸ”",
    syllabus: [
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¡-áŸ¢áŸ– Kinematics, Newton's Laws & Friction Forces",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ£-áŸ¤áŸ– Work, Kinetic & Potential Energy, Conservation Laws",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¥-áŸ¦áŸ– Rotational Dynamics, Torque & Angular Momentum",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ§-áŸ¨áŸ– Simple Harmonic Motion, Waves & Sound Propagation",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ©-áŸ¡áŸ áŸ– Thermodynamics: Heat Transfer, First & Second Laws",
    ],
  },
  chemistry: {
    title: "áž‚áž¸áž˜áž¸ážœáž·áž‘áŸ’áž™áž¶áž‘áž¼áž‘áŸ… (Chemistry)",
    code: "CHEM101",
    term: "2026-2027 Semester 1",
    leaders: ["ážáŸáž„ áž›áž¸áž§ážŸáŸ’ážŸáž¶áž áŸ (KHENG Lyussa - I3-GCI, Student ID: e20240046)"],
    schedule: "ážšáŸ€áž„ážšáž¶áž›áŸ‹ážáŸ’áž„áŸƒáž¢áž¶áž‘áž·ážáŸ’áž™ áž˜áŸ‰áŸ„áž„ 02:00 - 05:00 ážšážŸáŸ€áž›",
    room: "áž”áž“áŸ’áž‘áž”áŸ‹ SF2 (Room SF2), ITC Campus 1",
    desc: "áž€áž¶ážšáž™áž›áŸ‹ážŠáž¹áž„áž¢áŸ†áž–áž¸áž‘áž˜áŸ’ážšáž„áŸ‹áž¢áž¶ážáž¼áž˜ áž”áŸ’ážšážáž·áž€áž˜áŸ’áž˜áž‚áž¸áž˜áž¸ áž‘áŸ‚ážšáž˜áŸ‰áž¼ážŒáž¸ážŽáž¶áž˜áž·áž€áž‚áž¸áž˜áž¸ áž“áž·áž„áž¢áŸáž¡áž·áž…ážáŸ’ážšáž¼áž‚áž¸áž˜áž¸áŸ”",
    syllabus: [
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¡-áŸ¢áŸ– Atomic Structure, Periodic Trends & Chemical Bonding",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ£-áŸ¤áŸ– Stoichiometry, Solutions & Concentration Units",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¥-áŸ¦áŸ– Chemical Equilibrium & Acid-Base Reactions",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ§-áŸ¨áŸ– Chemical Kinetics & Reaction Rates",
      "ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ©-áŸ¡áŸ áŸ– Electrochemistry, Oxidation-Reduction & Batteries",
    ],
  },
};

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = COURSE_DATA[slug];

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <Link
            href="/programs"
            className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ážáŸ’ážšáž¡áž”áŸ‹áž‘áŸ…áž”áž‰áŸ’áž‡áž¸áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹</span>
          </Link>

          <div className="space-y-3">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              {course.code}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {course.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {course.desc}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">áž€áž¶áž›ážœáž·áž—áž¶áž‚</p>
                  <p className="text-xs font-semibold">{course.schedule}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">áž‘áž¸ážáž¶áŸ†áž„</p>
                  <p className="text-xs font-semibold">{course.room}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <User className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶</p>
                  <p className="text-xs font-semibold">{course.leaders[0]}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Syllabus Section */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold">áž‚áŸ’ážšáŸ„áž„áž˜áŸážšáŸ€áž“ áž“áž·áž„áž€áž¶áž›ážœáž·áž—áž¶áž‚áž”áž„áŸ’ážšáŸ€áž“ (Syllabus)</h2>
            <div className="space-y-3">
              {course.syllabus.map((s, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
            <div>
              <p className="text-xs font-semibold">áž…áž¶áž”áŸ‹áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸáž…áž„áŸ‹áž…áž¼áž›ážšáž½áž˜?</p>
              <p className="text-[11px] text-muted-foreground">
                áž‘áž¶áž€áŸ‹áž‘áž„áž˜áž€áž€áž¶áž“áŸ‹áž€áž¶ážšáž·áž™áž¶áž›áŸáž™ STJ áž¬áž”áŸ’ážšáž’áž¶áž“ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€
              </p>
            </div>
            <Link href="/contact">
              <Button size="sm">áž‘áž¶áž€áŸ‹áž‘áž„áž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

