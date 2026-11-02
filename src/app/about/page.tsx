import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, Target, Users, BookOpen, Shield, HeartHandshake, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata = {
  title: "អំពីកម្មវិធី STJ | Senior Teaching Junior",
  description: "ប្រវត្តិនៃការកកើត ចក្ខុវិស័យ បេសកកម្ម និងទស្សនវិជ្ជានៃការបង្រៀនរបស់កម្មវិធី STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="flex justify-center mb-1">
              <div className="w-20 h-20 rounded-full bg-white p-1.5 shadow-md ring-2 ring-primary/20 flex items-center justify-center">
                <Image
                  src="/images/itc-logo.png"
                  alt="ITC Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <GraduationCap className="w-4 h-4" />
              <span>វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា • Institute of Technology of Cambodia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              អំពីកម្មវិធី STJ (Senior Teaching Junior)
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              ប្រវត្តិនៃការកកើត ចក្ខុវិស័យ និងរចនាសម្ព័ន្ធគ្រប់គ្រងការសិក្សារបស់ STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
            </p>
          </div>

          {/* Featured Hero Photo: Team of Mentors */}
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-lg aspect-[16/8] sm:aspect-[21/9] w-full bg-muted">
            <Image
              src="/images/gallery/IMG_2910.JPG"
              alt="STJ Mentors Solidarity at ITC"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-1">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                សាមគ្គីភាព និងការប្តេជ្ញាចិត្ត
              </span>
              <h2 className="text-base sm:text-2xl font-bold leading-tight drop-shadow">
                សមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្ត STJ ឆ្នាំសិក្សា ២០២៦-២០២៧
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-sans max-w-2xl">
                ក្រុមការងាររៀមច្បងតំណាងមកពីគ្រប់ដេប៉ាតឺម៉ង់នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា រួមគ្នាផ្ទេរចំណេះដឹងវិស្វកម្ម។
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">ចក្ខុវិស័យ (Vision)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ក្លាយជាសហគមន៍សិក្សាគំរូនៅ ITC ដែលផ្សារភ្ជាប់ទំនាក់ទំនងរវាងនិស្សិតរៀមច្បង និងនិស្សិតប្អូន តាមរយៈការផ្ទេរបទពិសោធន៍ និងបច្ចេកវិទ្យាទំនើប។
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">បេសកកម្ម (Mission)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  រៀបចំថ្នាក់បង្រៀនបន្ថែមដោយឥតគិតថ្លៃលើមុខវិជ្ជាស្នូល ដូចជា Programming, Math, Physics, និង Chemistry ដើម្បីជួយពង្រឹងសមត្ថភាពសិក្សាជាក់ស្តែង។
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">គុណតម្លៃ (Values)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  សាមគ្គីភាព ការគោរពវិន័យ ភាពស្មោះត្រង់ក្នុងការស្រង់វត្តមាន និងការលើកកម្ពស់ស្មារតីចែករំលែកដោយឥតអាត្មានិយម។
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Philosophy details with Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>ទស្សនវិជ្ជានៃការបង្រៀន (Teaching Philosophy)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                រៀនកាន់តែច្បាស់ តាមរយៈការចែករំលែកទៅកាន់អ្នកដទៃ
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                នៅ STJ យើងជឿជាក់ថាវិធីសាស្ត្រល្អបំផុតក្នុងការយល់ដឹងស៊ីជម្រៅលើមុខវិជ្ជាវិស្វកម្ម គឺការបង្រៀនទៅកាន់អ្នកដទៃ។ និស្សិតរៀមច្បងដែលទទួលបានពិន្ទុល្អ និងមានជំនាញគរុកោសល្យ ត្រូវបានជ្រើសរើសដើម្បីដឹកនាំក្រុមសិក្សា។ ពួកគេមិនត្រឹមតែបង្រៀនទ្រឹស្តីប៉ុណ្ណោះទេ ប៉ុន្តែថែមទាំងចែករំលែកតិចនិកនៃការប្រឡង និងការដោះស្រាយលំហាត់ស្មុគស្មាញផងដែរ។
              </p>
              <div className="space-y-2 pt-2 text-xs text-foreground font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ការបណ្តុះបណ្តាលអនុវត្តកូដ និងរូបមន្តដោយផ្ទាល់</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ការតាមដានវត្តមាន និងវឌ្ឍនភាពសិក្សាប្រកបដោយតម្លាភាព</span>
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full border border-border shadow-md bg-muted">
              <Image
                src="/images/gallery/IMG_2905.JPG"
                alt="Classroom Mentoring at ITC"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                <p className="font-bold">បរិយាកាសសិក្សាដោយផ្ទាល់</p>
                <p className="text-[10px] text-white/80 font-sans">អគារ B, បន្ទប់សិក្សា ITC</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
