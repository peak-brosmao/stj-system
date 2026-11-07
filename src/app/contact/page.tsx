import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { MapPin, Mail, Phone, Clock, Send } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ទំនាក់ទំនងមកកាន់ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              ការិយាល័យទំនាក់ទំនង និងសម្របសម្រួលកម្មវិធី Senior Teaching Junior នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Info */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-base">ព័ត៌មានទីតាំង & អាសយដ្ឋាន</h3>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        មហាវិថីសហព័ន្ធរុស្ស៊ី, សង្កាត់ទឹកល្អក់១, ខណ្ឌទួលគោក, រាជធានីភ្នំពេញ, វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <span>stj@itc.edu.kh</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <span>+855 (0)23 880 370 / +855 12 345 678</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>ថ្ងៃចន្ទ - ថ្ងៃសុក្រ៖ 07:30 - 17:00 • ថ្ងៃសៅរ៍-អាទិត្យ៖ ថ្នាក់បង្រៀន</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-5 rounded-xl border border-border bg-card/60 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">ចំណាំសម្រាប់និស្សិត:</p>
                <p>
                  សម្រាប់សំណួរទាក់ទងនឹងការចុះឈ្មោះរៀន ឬការសុំកែតម្រូវវត្តមាន សូមទាក់ទងផ្ទាល់ជាមួយប្រធានមុខវិជ្ជាទទួលបន្ទុក ឬអ្នកសម្របសម្រួលតាមដេប៉ាតឺម៉ង់របស់អ្នក។
                </p>
              </div>
            </div>

            {/* Message form */}
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-base">ផ្ញើសារសាកសួរព័ត៌មាន</h3>
                <form className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium mb-1 text-foreground">គោត្តនាម-នាម</label>
                    <input
                      type="text"
                      placeholder="ឈ្មោះរបស់អ្នក"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">អ៊ីមែលនិស្សិត / ផ្ទាល់ខ្លួន</label>
                    <input
                      type="email"
                      placeholder="example@itc.edu.kh"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">មុខវិជ្ជា ឬប្រធានបទ</label>
                    <input
                      type="text"
                      placeholder="ឧ. ការចុះឈ្មោះរៀន Programming"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">ខ្លឹមសារសារ</label>
                    <textarea
                      rows={4}
                      placeholder="សូមសរសេរសំណួររបស់អ្នកនៅទីនេះ..."
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button type="button" className="w-full space-x-2">
                    <Send className="w-3.5 h-3.5" />
                    <span>ផ្ញើសារ</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
