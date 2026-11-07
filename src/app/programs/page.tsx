import Link from "next/link";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/ui/Card";
import { Code, Calculator, Atom, FlaskConical, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ProgramsPage() {
  const programs = [
    {
      slug: "programming",
      title: "áž€áž¶ážšážŸážšážŸáŸážšáž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž€áž»áŸ†áž–áŸ’áž™áž¼áž‘áŸážš (Programming)",
      code: "PROG101",
      category: "Engineering Foundation",
      icon: Code,
      desc: "áž–áž„áŸ’ážšáž¹áž„áž˜áž¼áž›ážŠáŸ’áž‹áž¶áž“áž‚áŸ’ážšáž¹áŸ‡ C, C++, Data Structures, Algorithms, áž“áž·áž„áž€áž¶ážšážŠáŸ„áŸ‡ážŸáŸ’ážšáž¶áž™áž”áž‰áŸ’áž áž¶áž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
      topics: ["C/C++ Fundamentals", "Pointers & Memory Allocation", "Data Structures (Stack, Queue, Tree)", "Algorithmic Complexity"],
    },
    {
      slug: "mathematics",
      title: "áž‚ážŽáž·ážážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Mathematics)",
      code: "MATH101",
      category: "Engineering Foundation",
      icon: Calculator,
      desc: "ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹ážŸáŸŠáž¸áž‡áž˜áŸ’ážšáŸ…áž¢áŸ†áž–áž¸ Calculus, Linear Algebra, Differential Equations, áž“áž·áž„áž€áž¶ážšáž¢áž“áž»ážœážáŸ’ážáž‡áž¶áž€áŸ‹ážŸáŸ’ážáŸ‚áž„áž€áŸ’áž“áž»áž„ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
      topics: ["Multivariable Calculus", "Linear Transformations & Matrices", "Ordinary Differential Equations", "Numerical Analysis"],
    },
    {
      slug: "physics",
      title: "ážšáž¼áž”ážœáž·áž‘áŸ’áž™áž¶ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜ (Physics)",
      code: "PHYS101",
      category: "Natural Sciences",
      icon: Atom,
      desc: "áž‘áŸ’ážšáž¹ážŸáŸ’ážáž¸áž˜áŸáž€áž¶áž“áž·áž€áž”áž»ážšáž¶ážŽ áž…áž›áž“áž¶ážšáž›áž€ áž‘áŸ‚ážšáž˜áŸ‰áž¼ážŒáž¸ážŽáž¶áž˜áž·áž€ áž“áž·áž„áž”áž¶ážáž»áž—áž¼ážážšáž¼áž”ážœáž·áž‘áŸ’áž™áž¶ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áŸ”",
      topics: ["Newtonian Mechanics", "Wave Motion & Optics", "Thermodynamics", "Electromagnetism"],
    },
    {
      slug: "chemistry",
      title: "áž‚áž¸áž˜áž¸ážœáž·áž‘áŸ’áž™áž¶áž‘áž¼áž‘áŸ… (Chemistry)",
      code: "CHEM101",
      category: "Natural Sciences",
      icon: FlaskConical,
      desc: "áž‘áž˜áŸ’ážšáž„áŸ‹áž˜áŸ‰áž¼áž›áŸáž‚áž»áž› áž”áŸ’ážšážáž·áž€áž˜áŸ’áž˜áž€áž¶ážáž¶áž›áž¸áž€ážš áž“áž·áž„áž‘áŸ‚ážšáž˜áŸ‰áž¼ážŒáž¸ážŽáž¶áž˜áž·áž€áž‚áž¸áž˜áž¸ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž€áž¶ážšážŸáŸ’ážšáž¶ážœáž‡áŸ’ážšáž¶ážœážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜áž‘áŸ†áž“áž¾áž”áŸ”",
      topics: ["Chemical Bonding & Structure", "Reaction Kinetics", "Electrochemistry", "Materials Science Basics"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              áž€áž˜áŸ’áž˜ážœáž·áž’áž¸áž”ážŽáŸ’ážáž»áŸ‡áž”ážŽáŸ’ážáž¶áž›ážšáž”ážŸáŸ‹ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážŸáŸ’áž“áž¼áž›ážŠáŸ‚áž›ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž„áŸ’ážšáŸ€áž“ážŠáŸ„áž™áž“áž·ážŸáŸ’ážŸáž·ážážšáŸ€áž˜áž…áŸ’áž”áž„ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážáž”áŸ’áž¢áž¼áž“áž†áŸ’áž“áž¶áŸ†áž‘áž¸áŸ¡ áž“áž·áž„áž‘áž¸áŸ¢ áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.slug} className="hover:border-primary/50 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {p.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5">{p.desc}</p>
                    </div>

                    <div className="space-y-1 pt-1">
                      <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
                        áž”áŸ’ážšáž’áž¶áž“áž”áž‘ážŸáŸ†ážáž¶áž“áŸ‹áŸ—:
                      </p>
                      <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5">
                        {p.topics.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/programs/${p.slug}`}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <span>áž˜áž¾áž›áž€áž¶áž›ážœáž·áž—áž¶áž‚ áž“áž·áž„áž–áŸážáŸŒáž˜áž¶áž“áž›áž˜áŸ’áž¢áž·áž</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

