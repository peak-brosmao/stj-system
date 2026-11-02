import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrganizationTree } from "@/components/structure/OrganizationTree";
import { Layers, ShieldCheck, UserCheck, ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "រចនាសម្ព័ន្ធ និងមែកធាងដឹកនាំ STJ | Senior Teaching Junior",
  description: "រចនាសម្ព័ន្ធមែកធាងថ្នាក់ដឹកនាំ និងសមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្ត STJ តាមបណ្តាឆ្នាំសិក្សា នៃវិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (ITC)",
};

export default function StructurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl space-y-8">
          {/* Header Banner */}
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>រចនាសម្ព័ន្ធដឹកនាំ & សមាជិក (STJ Hierarchy & Member Tree)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              មែកធាងរចនាសម្ព័ន្ធ STJ តាមអាណត្តិ
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              ស្វែងយល់អំពីរចនាសម្ព័ន្ធគ្រប់គ្រងរបស់កម្មវិធី STJ ពីថ្នាក់ប្រធានកណ្តាល រហូតដល់ប្រធានក្រុមតាមមុខវិជ្ជា និងសមាជិកបង្រៀនទាំងអស់។ រាល់ទិន្នន័យត្រូវបានបែងចែកតាមឆ្នាំសិក្សានីមួយៗយ៉ាងច្បាស់លាស់។
            </p>
          </div>

          {/* Interactive Tree View */}
          <OrganizationTree />

          {/* Bottom Navigation CTA */}
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="space-x-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ត្រឡប់ទៅទំព័រដើម</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-3">
              <Link href="/portal/login">
                <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-primary" />
                  <span>ច្រកចូលសមាជិក (Member Portal)</span>
                </Button>
              </Link>
              <Link href="/system/login">
                <Button variant="default" size="sm" className="space-x-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ច្រកចូលប្រធាន STJ (Admin Portal)</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
