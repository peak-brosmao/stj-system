import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, MapPin, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default function ActivitiesPage() {
  const activities = [
    {
      title: "សិក្ខាសាលា៖ វិធីសាស្ត្រដោះស្រាយលំហាត់ប្រឡង Programming ប្រចាំឆមាស",
      category: "WORKSHOP",
      date: "12 វិច្ឆិកា 2026",
      location: "សាលសន្និសីទ ITC, អគារ F",
      status: "UPCOMING",
      desc: "ការចែករំលែកបទពិសោធន៍ពីនិស្សិតឆ្នើមឆ្នាំទី៤ និងទី៥ អំពីរបៀបសរសេរកូដប្រឡង និងការជៀសវាង syntax/logic errors ក្នុងពេលប្រឡង។",
    },
    {
      title: "ការប្រកួតប្រជែងដោះស្រាយលំហាត់គណិតវិទ្យាវិស្វកម្ម STJ Math Sprint",
      category: "COMPETITION",
      date: "25 តុលា 2026",
      location: "បន្ទប់ A-201 ដល់ A-204",
      status: "COMPLETED",
      desc: "ការប្រកួតគណិតវិទ្យារយៈពេល ២ម៉ោង សម្រាប់និស្សិតឆ្នាំទី១ ចូលរួមដោះស្រាយលំហាត់ Calculus និង Linear Algebra។",
    },
    {
      title: "វគ្គបណ្តុះបណ្តាលគរុកោសល្យ និងការដឹកនាំក្រុម សម្រាប់ប្រធានមុខវិជ្ជា STJ",
      category: "TRAINING",
      date: "05 តុលា 2026",
      location: "បន្ទប់ប្រជុំ STJ, Campus 1",
      status: "COMPLETED",
      desc: "ការបណ្តុះបណ្តាលជំនាញបង្រៀន និងរបៀបប្រើប្រាស់ប្រព័ន្ធគ្រប់គ្រងវត្តមាន STJ ឌីជីថល ជូនដល់ប្រធានមុខវិជ្ជាទាំងអស់។",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              សកម្មភាព និងព្រឹត្តិការណ៍ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              សិក្ខាសាលា ការបណ្តុះបណ្តាល ការប្រកួតប្រជែង និងសកម្មភាពសហគមន៍វិស្វកម្មនៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
            </p>
          </div>

          <div className="space-y-4">
            {activities.map((act, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {act.category}
                    </span>
                    <Badge variant={act.status === "UPCOMING" ? "info" : "success"}>
                      {act.status === "UPCOMING" ? "ខាងមុខនេះ" : "បានបញ្ចប់"}
                    </Badge>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold">{act.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{act.desc}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{act.date}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{act.location}</span>
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

