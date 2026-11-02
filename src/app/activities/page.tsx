import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, MapPin, Sparkles, Camera } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "សកម្មភាព និងព្រឹត្តិការណ៍ STJ | Senior Teaching Junior",
  description: "ទិដ្ឋភាពសិក្ខាសាលា ថ្នាក់រៀន និងព្រឹត្តិការណ៍ជាក់ស្តែងរបស់កម្មវិធី STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
};

export default function ActivitiesPage() {
  const activities = [
    {
      title: "សិក្ខាសាលា៖ វិធីសាស្ត្រដោះស្រាយលំហាត់ប្រឡង Programming ប្រចាំឆមាស",
      category: "WORKSHOP",
      date: "12 វិច្ឆិកា 2026",
      location: "សាលសន្និសីទ ITC, អគារ F",
      status: "UPCOMING",
      image: "/images/gallery/IMG_2851.JPG",
      desc: "ការចែករំលែកបទពិសោធន៍ពីនិស្សិតឆ្នើមឆ្នាំទី៤ និងទី៥ អំពីរបៀបសរសេរកូដប្រឡង និងការជៀសវាង syntax/logic errors ក្នុងពេលប្រឡង។",
    },
    {
      title: "ការប្រកួតប្រជែងដោះស្រាយលំហាត់គណិតវិទ្យាវិស្វកម្ម STJ Math Sprint",
      category: "COMPETITION",
      date: "25 តុលា 2026",
      location: "បន្ទប់ A-201 ដល់ A-204, ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2849.JPG",
      desc: "ការប្រកួតគណិតវិទ្យារយៈពេល ២ម៉ោង សម្រាប់និស្សិតឆ្នាំទី១ ចូលរួមដោះស្រាយលំហាត់ Calculus និង Linear Algebra ជាមួយរៀមច្បង។",
    },
    {
      title: "វគ្គបណ្តុះបណ្តាលគរុកោសល្យ និងការដឹកនាំក្រុម សម្រាប់ប្រធានមុខវិជ្ជា STJ",
      category: "TRAINING",
      date: "05 តុលា 2026",
      location: "បន្ទប់ប្រជុំ STJ, Campus 1",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2853.JPG",
      desc: "ការបណ្តុះបណ្តាលជំនាញបង្រៀន និងរបៀបប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រងវត្តមាន STJ ឌីជីថល ជូនដល់ប្រធានមុខវិជ្ជាទាំងអស់។",
    },
    {
      title: "វគ្គបង្រៀនអនុវត្តជាក់ស្តែង Computer Programming & Data Structures",
      category: "CLASSROOM",
      date: "តុលា 2026",
      location: "Computer Lab អគារ F, ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2847.JPG",
      desc: "ការហ្វឹកហាត់សរសេរកូដជាក់ស្តែងលើកុំព្យូទ័រ ដោយមានការណែនាំផ្ទាល់ពីសមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្ត។",
    },
    {
      title: "វេទិកាចែករំលែកបទពិសោធន៍ និងតម្រង់ទិសនិស្សិតឆ្នាំទី១ (Mentorship Forum)",
      category: "MENTORSHIP",
      date: "កញ្ញា 2026",
      location: "អគារ B, បរិវេណ ITC",
      status: "COMPLETED",
      image: "/images/gallery/IMG_2905.JPG",
      desc: "ការជួបជុំរវាងរៀមច្បង និងប្អូនៗ ដើម្បីពិភាក្សាអំពីវិធីសាស្ត្ររៀនវិស្វកម្ម និងការត្រៀមខ្លួនសម្រាប់ឆមាសសិក្សាថ្មី។",
    },
    {
      title: "ការបង្ហាញគម្រោងបច្ចេកវិទ្យា និងនវានុវត្តន៍វិស្វកម្ម (Engineering Showcase)",
      category: "SHOWCASE",
      date: "វិច្ឆិកា 2026",
      location: "Innovation Hub, ITC",
      status: "UPCOMING",
      image: "/images/gallery/IMG_2915.JPG",
      desc: "ការតាំងបង្ហាញសមិទ្ធផលគម្រោងសរសេរកូដ និងការស្រាវជ្រាវបច្ចេកវិទ្យាដែលបង្កើតឡើងដោយក្រុមសិក្សា STJ។",
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
              <span>សកម្មភាព និងព្រឹត្តិការណ៍ (STJ Events & Life)</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              សកម្មភាព និងព្រឹត្តិការណ៍ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              ទិដ្ឋភាពជាក់ស្តែងនៃការរៀន ការបង្រៀន ការប្រកួតប្រជែង និងសិក្ខាសាលារបស់កម្មវិធី STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
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
                      {act.status === "UPCOMING" ? "ខាងមុខនេះ" : "បានបញ្ចប់"}
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
