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
      title: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
      code: "PROG101",
      category: "Engineering Foundation",
      icon: Code,
      desc: "ពង្រឹងមូលដ្ឋានគ្រឹះ C, C++, Data Structures, Algorithms, និងការដោះស្រាយបញ្ហាជាក់ស្តែងសម្រាប់វិស្វកម្ម។",
      topics: ["C/C++ Fundamentals", "Pointers & Memory Allocation", "Data Structures (Stack, Queue, Tree)", "Algorithmic Complexity"],
    },
    {
      slug: "mathematics",
      title: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
      code: "MATH101",
      category: "Engineering Foundation",
      icon: Calculator,
      desc: "ស្វែងយល់ស៊ីជម្រៅអំពី Calculus, Linear Algebra, Differential Equations, និងការអនុវត្តជាក់ស្តែងក្នុងវិស្វកម្ម។",
      topics: ["Multivariable Calculus", "Linear Transformations & Matrices", "Ordinary Differential Equations", "Numerical Analysis"],
    },
    {
      slug: "physics",
      title: "រូបវិទ្យាវិស្វកម្ម (Physics)",
      code: "PHYS101",
      category: "Natural Sciences",
      icon: Atom,
      desc: "ទ្រឹស្តីមេកានិកបុរាណ ចលនារលក ទែរម៉ូឌីណាមិក និងបាតុភូតរូបវិទ្យាសម្រាប់និស្សិតវិស្វកម្ម។",
      topics: ["Newtonian Mechanics", "Wave Motion & Optics", "Thermodynamics", "Electromagnetism"],
    },
    {
      slug: "chemistry",
      title: "គីមីវិទ្យាទូទៅ (Chemistry)",
      code: "CHEM101",
      category: "Natural Sciences",
      icon: FlaskConical,
      desc: "ទម្រង់ម៉ូលេគុល ប្រតិកម្មកាតាលីករ និងទែរម៉ូឌីណាមិកគីមីសម្រាប់ការស្រាវជ្រាវវិស្វកម្មទំនើប។",
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
              កម្មវិធីបណ្តុះបណ្តាលរបស់ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              មុខវិជ្ជាស្នូលដែលត្រូវបានបង្រៀនដោយនិស្សិតរៀមច្បងសម្រាប់និស្សិតប្អូនឆ្នាំទី១ និងទី២ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
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
                        ប្រធានបទសំខាន់ៗ:
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
                        <span>មើលកាលវិភាគ និងព័ត៌មានលម្អិត</span>
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
