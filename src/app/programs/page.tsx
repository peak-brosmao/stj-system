import Link from "next/link";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/Card";
import { Code, Calculator, Atom, FlaskConical, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ProgramsPage() {
  const programs = [
    {
      slug: "programming",
      title: "Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€™Ã¡Å¾Â¸Ã¡Å¾â‚¬Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¼Ã¡Å¾â€˜Ã¡Å¸ÂÃ¡Å¾Å¡ (Programming)",
      code: "PROG101",
      category: "Engineering Foundation",
      icon: Code,
      desc: "Ã¡Å¾â€“Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾ËœÃ¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾Å Ã¡Å¸â€™Ã¡Å¾â€¹Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¸â€¡ C, C++, Data Structures, Algorithms, Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â„¢Ã¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€",
      topics: ["C/C++ Fundamentals", "Pointers & Memory Allocation", "Data Structures (Stack, Queue, Tree)", "Algorithmic Complexity"],
    },
    {
      slug: "mathematics",
      title: "Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ (Mathematics)",
      code: "MATH101",
      category: "Engineering Foundation",
      icon: Calculator,
      desc: "Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â„¢Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾â€¡Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€¦Ã¡Å¾Â¢Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â¸ Calculus, Linear Algebra, Differential Equations, Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€",
      topics: ["Multivariable Calculus", "Linear Transformations & Matrices", "Ordinary Differential Equations", "Numerical Analysis"],
    },
    {
      slug: "physics",
      title: "Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ (Physics)",
      code: "PHYS101",
      category: "Natural Sciences",
      icon: Atom,
      desc: "Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¹Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â€Ã¡Å¾Â»Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å½ Ã¡Å¾â€¦Ã¡Å¾â€ºÃ¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€ºÃ¡Å¾â‚¬ Ã¡Å¾â€˜Ã¡Å¸â€šÃ¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾Â¼Ã¡Å¾Å’Ã¡Å¾Â¸Ã¡Å¾Å½Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â‚¬ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾â€”Ã¡Å¾Â¼Ã¡Å¾ÂÃ¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾â€Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€",
      topics: ["Newtonian Mechanics", "Wave Motion & Optics", "Thermodynamics", "Electromagnetism"],
    },
    {
      slug: "chemistry",
      title: "Ã¡Å¾â€šÃ¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾â€˜Ã¡Å¸â€¦ (Chemistry)",
      code: "CHEM101",
      category: "Natural Sciences",
      icon: FlaskConical,
      desc: "Ã¡Å¾â€˜Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾â€šÃ¡Å¾Â»Ã¡Å¾â€º Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾Â¸Ã¡Å¾â‚¬Ã¡Å¾Å¡ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¸â€šÃ¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾Â¼Ã¡Å¾Å’Ã¡Å¾Â¸Ã¡Å¾Å½Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â€šÃ¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â¾Ã¡Å¾â€Ã¡Å¸â€",
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
              Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€™Ã¡Å¾Â¸Ã¡Å¾â€Ã¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â»Ã¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾Å Ã¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾ËœÃ¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¼Ã¡Å¾â€œÃ¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¸Â¡ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¸Â¢ Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶
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
                        Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€˜Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¸â€”:
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
                        <span>Ã¡Å¾ËœÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€š Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€ºÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â·Ã¡Å¾Â</span>
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

