import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GraduationCap, Target, Users, BookOpen, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
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
              <span>Institute of Technology of Cambodia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              អំពីកម្មវិធី STJ (Senior Teaching Junior)
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              ប្រវត្តិនៃការកកើត ចក្ខុវិស័យ និងរចនាសម្ព័ន្ធគ្រប់គ្រងការសិក្សារបស់ STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">ចក្ខុវិស័យ (Vision)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ក្លាយជាសហគមន៍សិក្សាគំរូនៅ ITC ដែលផ្សារភ្ជាប់ទំនាក់ទំនងរវាងនិស្សិតរៀមច្បង និងនិស្សិតប្អូន តាមរយៈការផ្ទេរបទពិសោធន៍ និងបច្ចេកវិទ្យាទំនើប។
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">បេសកកម្ម (Mission)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  រៀបចំថ្នាក់បង្រៀនបន្ថែមដោយឥតគិតថ្លៃលើមុខវិជ្ជាស្នូល ដូចជា Programming, Math, Physics, និង Chemistry ដើម្បីជួយពង្រឹងសមត្ថភាពសិក្សាជាក់ស្តែង។
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">គុណតម្លៃ (Values)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  សាមគ្គីភាព ការគោរពវិន័យ ភាពស្មោះត្រង់ក្នុងការស្រង់វត្តមាន និងការលើកកម្ពស់ស្មារតីចែករំលែកដោយឥតអាត្មានិយម។
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Philosophy details */}
          <div className="bg-card border border-border rounded-2xl p-8 space-y-4">
            <h2 className="text-xl font-bold">ទស្សនវិជ្ជានៃការបង្រៀន (Teaching Philosophy)</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              នៅ STJ យើងជឿជាក់ថាវិធីសាស្ត្រល្អបំផុតក្នុងការយល់ដឹងស៊ីជម្រៅលើមុខវិជ្ជាវិស្វកម្ម គឺការបង្រៀនទៅកាន់អ្នកដទៃ។ និស្សិតរៀមច្បងដែលទទួលបានពិន្ទុល្អ និងមានជំនាញគរុកោសល្យ ត្រូវបានជ្រើសរើសដើម្បីដឹកនាំក្រុមសិក្សា។ ពួកគេមិនត្រឹមតែបង្រៀនទ្រឹស្តីប៉ុណ្ណោះទេ ប៉ុន្តែថែមទាំងចែករំលែកតិចនិកនៃការប្រឡង និងការដោះស្រាយលំហាត់ស្មុគស្មាញផងដែរ។
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

