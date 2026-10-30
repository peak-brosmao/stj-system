import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">គោលការណ៍ឯកជនភាព (Privacy Policy)</h1>
          <p className="text-xs text-muted-foreground">ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ តុលា ២០២៦</p>
          <div className="prose dark:prose-invert text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              ប្រព័ន្ធគ្រប់គ្រង STJ (Senior Teaching Junior) នៅវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC) ប្តេជ្ញាការពារទិន្នន័យផ្ទាល់ខ្លួនរបស់និស្សិត និងបុគ្គលិកអប់រំទាំងអស់។
            </p>
            <h3 className="font-bold text-base">១. ការប្រមូលទិន្នន័យ</h3>
            <p>
              យើងប្រមូលទិន្នន័យចាំបាច់សម្រាប់ការគ្រប់គ្រងការសិក្សា រួមមាន៖ អត្តលេខនិស្សិត ឈ្មោះជាភាសាខ្មែរ និងឡាតាំង ដេប៉ាតឺម៉ង់ កម្រិតសិក្សា អ៊ីមែល លេខទូរស័ព្ទ និងកំណត់ត្រាវត្តមានសិក្សា។
            </p>
            <h3 className="font-bold text-base">២. ការប្រើប្រាស់ និងការចែករំលែកទិន្នន័យ</h3>
            <p>
              ទិន្នន័យវត្តមានដែលត្រូវបានចែករំលែកជាសាធារណៈតាមរយៈតំណភ្ជាប់ (Share Links) នឹងមិនបង្ហាញព័ត៌មានផ្ទាល់ខ្លួនរសើប ដូចជាលេខទូរស័ព្ទ ឬអ៊ីមែលឡើយ។ តំណភ្ជាប់ត្រូវបានការពារដោយកូដសម្ងាត់ ឬកាលបរិច្ឆេទផុតកំណត់តាមការកំណត់របស់អ្នកបង្កើត។
            </p>
            <h3 className="font-bold text-base">៣. សុវត្ថិភាពទិន្នន័យ</h3>
            <p>
              ពាក្យសម្ងាត់ត្រូវបានរក្សាទុកដោយការ Hash ជាមួយក្បួនដោះស្រាយសុវត្ថិភាពខ្ពស់។ រាល់សកម្មភាពកែប្រែទិន្នន័យវត្តមានត្រូវបានកត់ត្រាក្នុង Audit Logs ដើម្បីធានាតម្លាភាព។
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

