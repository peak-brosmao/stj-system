import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
    title: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)",
    code: "PROG101",
    term: "2026-2027 Semester 1",
    leaders: ["លាង ជីងហេង (LEANG JINGHENG - I3-GTI, Student ID: e20240704)"],
    schedule: "រៀងរាល់ថ្ងៃសៅរ៍ ម៉ោង 08:00 - 11:00 ព្រឹក",
    room: "បន្ទប់ SF1 (Room SF1), ITC Campus 1",
    desc: "វគ្គបណ្តុះបណ្តាលដែលផ្តោតលើការសរសេរកូដប្រកបដោយប្រសិទ្ធភាព ការយល់ដឹងអំពី Memory Management, Pointer Mechanics, និង Algorithms សំខាន់ៗសម្រាប់និស្សិតវិស្វកម្ម។",
    syllabus: [
      "សប្តាហ៍ទី១-២៖ មូលដ្ឋានគ្រឹះ C/C++, Syntax, Data Types & Control Flow",
      "សប្តាហ៍ទី៣-៤៖ Pointers, Arrays, Dynamic Memory Allocation (malloc, free)",
      "សប្តាហ៍ទី៥-៦៖ Data Structures: Linked Lists, Stacks, Queues",
      "សប្តាហ៍ទី៧-៨៖ Binary Trees, Graph Traversal & Sorting Algorithms",
      "សប្តាហ៍ទី៩-១០៖ ការដោះស្រាយលំហាត់ប្រឡង និង mini-project ជាក់ស្តែង",
    ],
  },
  mathematics: {
    title: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)",
    code: "MATH101",
    term: "2026-2027 Semester 1",
    leaders: ["គឹម រតនៈ (KIM Ratanak - I5-GIM, Student ID: e20221423)"],
    schedule: "រៀងរាល់ថ្ងៃអាទិត្យ ម៉ោង 08:00 - 11:00 ព្រឹក",
    room: "បន្ទប់ SF2 (Room SF2), ITC Campus 1",
    desc: "ពង្រឹងការគិតបែបរិះគន់តាមរយៈការដោះស្រាយសមីការឌីផេរ៉ង់ស្យែល ការវិភាគម៉ាទ្រីស និង Calculus កម្រិតខ្ពស់សម្រាប់វិស្វកម្ម។",
    syllabus: [
      "សប្តាហ៍ទី១-២៖ Partial Derivatives, Gradients & Directional Derivatives",
      "សប្តាហ៍ទី៣-៤៖ Double and Triple Integrals & Coordinate Transformations",
      "សប្តាហ៍ទី៥-៦៖ Matrices, Eigenvalues, Eigenvectors and Diagonalization",
      "សប្តាហ៍ទី៧-៨៖ First and Second-Order Ordinary Differential Equations",
      "សប្តាហ៍ទី៩-១០៖ Laplace Transforms និងការអនុវត្តក្នុងសៀគ្វីអគ្គិសនី",
    ],
  },
  physics: {
    title: "រូបវិទ្យាវិស្វកម្ម (Physics)",
    code: "PHYS101",
    term: "2026-2027 Semester 1",
    leaders: ["គ្រុយ អីុខាង (KRUY Ykhang - I3-GIM, Student ID: e20240096)"],
    schedule: "រៀងរាល់ថ្ងៃសៅរ៍ ម៉ោង 02:00 - 05:00 រសៀល",
    room: "បន្ទប់ SF1 (Room SF1), ITC Campus 1",
    desc: "ទ្រឹស្តីមេកានិកបុរាណ ថាមពល ចលនារលក និងអុបទិចសម្រាប់និស្សិតវិស្វកម្មទូទៅ។",
    syllabus: [
      "សប្តាហ៍ទី១-២៖ Kinematics, Newton's Laws & Friction Forces",
      "សប្តាហ៍ទី៣-៤៖ Work, Kinetic & Potential Energy, Conservation Laws",
      "សប្តាហ៍ទី៥-៦៖ Rotational Dynamics, Torque & Angular Momentum",
      "សប្តាហ៍ទី៧-៨៖ Simple Harmonic Motion, Waves & Sound Propagation",
      "សប្តាហ៍ទី៩-១០៖ Thermodynamics: Heat Transfer, First & Second Laws",
    ],
  },
  chemistry: {
    title: "គីមីវិទ្យាទូទៅ (Chemistry)",
    code: "CHEM101",
    term: "2026-2027 Semester 1",
    leaders: ["ខេង លីឧស្សាហ៍ (KHENG Lyussa - I3-GCI, Student ID: e20240046)"],
    schedule: "រៀងរាល់ថ្ងៃអាទិត្យ ម៉ោង 02:00 - 05:00 រសៀល",
    room: "បន្ទប់ SF2 (Room SF2), ITC Campus 1",
    desc: "ការយល់ដឹងអំពីទម្រង់អាតូម ប្រតិកម្មគីមី ទែរម៉ូឌីណាមិកគីមី និងអេឡិចត្រូគីមី។",
    syllabus: [
      "សប្តាហ៍ទី១-២៖ Atomic Structure, Periodic Trends & Chemical Bonding",
      "សប្តាហ៍ទី៣-៤៖ Stoichiometry, Solutions & Concentration Units",
      "សប្តាហ៍ទី៥-៦៖ Chemical Equilibrium & Acid-Base Reactions",
      "សប្តាហ៍ទី៧-៨៖ Chemical Kinetics & Reaction Rates",
      "សប្តាហ៍ទី៩-១០៖ Electrochemistry, Oxidation-Reduction & Batteries",
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
            <span>ត្រឡប់ទៅបញ្ជីមុខវិជ្ជាទាំងអស់</span>
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
                  <p className="text-[11px] text-muted-foreground">កាលវិភាគ</p>
                  <p className="text-xs font-semibold">{course.schedule}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">ទីតាំង</p>
                  <p className="text-xs font-semibold">{course.room}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <User className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-[11px] text-muted-foreground">ប្រធានមុខវិជ្ជា</p>
                  <p className="text-xs font-semibold">{course.leaders[0]}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Syllabus Section */}
          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold">គ្រោងមេរៀន និងកាលវិភាគបង្រៀន (Syllabus)</h2>
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
              <p className="text-xs font-semibold">ចាប់អារម្មណ៍ចង់ចូលរួម?</p>
              <p className="text-[11px] text-muted-foreground">
                ទាក់ទងមកកាន់ការិយាល័យ STJ ឬប្រធានដេប៉ាតឺម៉ង់របស់អ្នក
              </p>
            </div>
            <Link href="/contact">
              <Button size="sm">ទាក់ទងចុះឈ្មោះ</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

