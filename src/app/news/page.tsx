import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, ArrowRight, Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  const articles = [
    {
      slug: "launch-stj-management-system",
      title: "ការដាក់ឱ្យដំណើរការជាផ្លូវការនូវប្រព័ន្ធគ្រប់គ្រងវត្តមាន STJ ឌីជីថល នៅ ITC",
      date: "30 តុលា 2026",
      summary: "ប្រព័ន្ធឌីជីថលថ្មីជំនួសឱ្យការស្រង់វត្តមានលើក្រដាស និងផ្តល់នូវតំណភ្ជាប់ចែករំលែករបាយការណ៍វត្តមានប្រកបដោយសុវត្ថិភាព។",
    },
    {
      slug: "schedule-semester-1-2026",
      title: "កាលវិភាគបង្រៀនមុខវិជ្ជាស្នូល ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
      date: "14 តុលា 2026",
      summary: "សេចក្តីជូនដំណឹងស្តីពីកាលវិភាគថ្នាក់រៀនមុខវិជ្ជា Programming, Mathematics, Physics និង Chemistry នៅ ITC Campus 1។",
    },
    {
      slug: "recruitment-senior-tutors-2026",
      title: "ការជ្រើសរើសនិស្សិតរៀមច្បងបង្រៀនប្អូន (Senior Mentors) សម្រាប់ដេប៉ាតឺម៉ង់ GIC, AMS, GIM",
      date: "01 តុលា 2026",
      summary: "ឱកាសសម្រាប់និស្សិតឆ្នាំទី៤ និងទី៥ នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា ចូលរួមចែករំលែកចំណេះដឹង និងទទួលវិញ្ញាបនបត្របញ្ជាក់ការងារសង្គម។",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ព័ត៌មាន & សេចក្តីជូនដំណឹង STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              ព័ត៌មានចុងក្រោយអំពីកាលវិភាគសិក្សា ការស្រង់វត្តមាន និងសេចក្តីប្រកាសផ្លូវការ
            </p>
          </div>

          <div className="space-y-4">
            {articles.map((art) => (
              <Card key={art.slug} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{art.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold hover:text-primary transition-colors">
                    <Link href={`/news/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">{art.summary}</p>

                  <div className="pt-2">
                    <Link
                      href={`/news/${art.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>អានសេចក្តីលម្អិត</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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

