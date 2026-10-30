import Link from "next/link";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono font-bold tracking-widest uppercase text-primary">
            404 • Not Found
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            រកមិនឃើញទំព័រដែលអ្នកស្នើសុំឡើយ
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            ទំព័រដែលអ្នកព្យាយាមបើកមើលមិនមាន ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។ សូមពិនិត្យមើលតំណភ្ជាប់ឡើងវិញ។
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href="/">
            <Button size="sm" className="space-x-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>ត្រឡប់ទៅទំព័រដើម</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

