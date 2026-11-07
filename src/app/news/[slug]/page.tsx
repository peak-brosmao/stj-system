import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { ArrowLeft, Calendar, UserCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const NEWS_DATA: Record<
  string,
  {
    title: string;
    date: string;
    author: string;
    content: string[];
  }
> = {
  "launch-stj-management-system": {
    title: "ការដាក់ឱ្យដំណើរការជាផ្លូវការនូវប្រព័ន្ធគ្រប់គ្រងវត្តមាន STJ ឌីជីថល នៅ ITC",
    date: "30 តុលា 2026",
    author: "គណៈគ្រប់គ្រង STJ កណ្តាល",
    content: [
      "ដើម្បីឆ្លើយតបនឹងការកើនឡើងនៃចំនួននិស្សិតចូលរួមក្នុងកម្មវិធី Senior Teaching Junior (STJ) នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា គណៈគ្រប់គ្រងកម្មវិធីបានសហការជាមួយក្រុមការងារបច្ចេកវិទ្យាដើម្បីបង្កើតនូវប្រព័ន្ធគ្រប់គ្រងវត្តមាន និងទិន្នន័យឌីជីថលកណ្តាល។",
      "ប្រព័ន្ធនេះមានមុខងារស្នូលសំខាន់ៗរួមមាន៖ ការស្រង់វត្តមានយ៉ាងឆាប់រហ័សដោយអ្នកគ្រប់គ្រងផ្លូវការ, ការហាមឃាត់ការកែប្រែវត្តមានដោយគ្មានការអនុញ្ញាត, ផ្ទាំងគ្រប់គ្រងសម្រាប់ប្រធានមុខវិជ្ជាដើម្បីតាមដានវត្តមានរបស់សមាជិកក្នុងបន្ទុក, និងការបង្កើតតំណភ្ជាប់ចែករំលែករបាយការណ៍វត្តមាន (Read-only Share Links) ដែលមានកូដ QR សុវត្ថិភាព។",
      "ចាប់ពីឆមាសនេះតទៅ រាល់ការកត់ត្រាវត្តមានទាំងអស់នឹងត្រូវបានរក្សាទុកនៅលើប្រព័ន្ធកណ្តាលដើម្បីធានានូវតម្លាភាព និងភាពត្រឹមត្រូវខ្ពស់បំផុត។",
    ],
  },
  "schedule-semester-1-2026": {
    title: "កាលវិភាគបង្រៀនមុខវិជ្ជាស្នូល ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
    date: "14 តុលា 2026",
    author: "ការិយាល័យសម្របសម្រួល STJ",
    content: [
      "សេចក្តីជូនដំណឹងស្តីពីកាលវិភាគថ្នាក់រៀនមុខវិជ្ជា Programming, Mathematics, Physics និង Chemistry នៅ ITC Campus 1។",
      "ថ្នាក់រៀនទាំងអស់នឹងប្រព្រឹត្តទៅនៅរៀងរាល់ចុងសប្តាហ៍ (ថ្ងៃសៅរ៍ និងថ្ងៃអាទិត្យ) នៅអគារ A និងអគារ B។ និស្សិតទាំងអស់ត្រូវបានតម្រូវឱ្យមកដល់បន្ទប់រៀនឱ្យបានទាន់ពេលវេលាដើម្បីកត់ត្រាវត្តមាន។",
      "ករណីអវត្តមានដោយមានធុរៈចាំបាច់ ឬប្រឡង សូមដាក់ពាក្យស្នើសុំច្បាប់ជាមុនមកកាន់ប្រធានមុខវិជ្ជា ឬអ្នកគ្រប់គ្រង STJ។",
    ],
  },
  "recruitment-senior-tutors-2026": {
    title: "ការជ្រើសរើសនិស្សិតរៀមច្បងបង្រៀនប្អូន (Senior Mentors) សម្រាប់ដេប៉ាតឺម៉ង់ GIC, AMS, GIM",
    date: "01 តុលា 2026",
    author: "គណៈកម្មការជ្រើសរើសគ្រូបង្រៀន STJ",
    content: [
      "ឱកាសសម្រាប់និស្សិតឆ្នាំទី៤ និងទី៥ នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា ចូលរួមចែករំលែកចំណេះដឹង និងទទួលវិញ្ញាបនបត្របញ្ជាក់ការងារសង្គម។",
      "បេក្ខជនត្រូវមានចំណាត់ថ្នាក់សិក្សាល្អលើមុខវិជ្ជាដែលត្រូវបង្រៀន មានឆន្ទៈក្នុងការជួយសង្គម និងមានស្មារតីទទួលខុសត្រូវខ្ពស់។",
      "ព័ត៌មានបន្ថែម សូមទាក់ទងមកកាន់ការិយាល័យ STJ ឬផ្ញើប្រវត្តិរូបសង្ខេបមកកាន់ stj@itc.edu.kh។",
    ],
  },
};

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = NEWS_DATA[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <Link
            href="/news"
            className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ត្រឡប់ទៅព័ត៌មានទាំងអស់</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              {article.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground border-y border-border py-2.5">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>{article.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-primary" />
                <span>{article.author}</span>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-4 text-xs sm:text-sm leading-relaxed text-foreground">
            {article.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
