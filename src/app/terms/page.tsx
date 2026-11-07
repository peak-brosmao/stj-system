import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">លក្ខខណ្ឌនៃការប្រើប្រាស់ (Terms of Use)</h1>
          <p className="text-xs text-muted-foreground">ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ តុលា ២០២៦</p>
          <div className="prose dark:prose-invert text-xs sm:text-sm leading-relaxed space-y-4">
            <h3 className="font-bold text-base">១. សិទ្ធិ និងដែនកំណត់នៃការប្រើប្រាស់</h3>
            <p>
              ប្រព័ន្ធ STJ ត្រូវបានរចនាឡើងផ្តាច់មុខសម្រាប់ការគ្រប់គ្រង និងតាមដានការសិក្សារបស់សមាជិក STJ នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា។ ការប៉ុនប៉ងជ្រៀតចូលប្រព័ន្ធ កែប្រែកំណត់ត្រាវត្តមានដោយគ្មានសិទ្ធិ ឬប្រើប្រាស់គណនីរបស់អ្នកដទៃ ត្រូវបានហាមឃាត់ដាច់ខាត។
            </p>
            <h3 className="font-bold text-base">២. កាតព្វកិច្ចរបស់ប្រធានមុខវិជ្ជា (Leaders)</h3>
            <p>
              ប្រធានមុខវិជ្ជាត្រូវទទួលខុសត្រូវក្នុងការរក្សាសុវត្ថិភាពគណនីផ្ទាល់ខ្លួន តាមដានសមាជិកក្នុងបន្ទុក និងចែករំលែកតំណភ្ជាប់វត្តមានទៅកាន់បុគ្គលពាក់ព័ន្ធ។ ប្រធានមុខវិជ្ជាគ្មានសិទ្ធិកែប្រែវត្តមានដោយផ្ទាល់ឡើយ។
            </p>
            <h3 className="font-bold text-base">៣. ការកែតម្រូវវត្តមានផ្លូវការ</h3>
            <p>
              រាល់ការកែប្រែវត្តមានត្រូវតែឆ្លងកាត់ការស្នើសុំ និងការអនុម័តជាផ្លូវការពីគណៈគ្រប់គ្រង ឬអ្នកសម្របសម្រួល STJ កណ្តាល។
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
