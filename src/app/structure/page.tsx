import React from "react";
import Link from "next/link";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { OrganizationTree } from "@/ui/structure/OrganizationTree";
import { Layers, ArrowLeft } from "lucide-react";
import { Button } from "@/ui/ui/Button";

export const metadata = {
  title: "ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ áž“áž·áž„áž˜áŸ‚áž€áž’áž¶áž„ážŠáž¹áž€áž“áž¶áŸ† STJ | Senior Teaching Junior",
  description: "ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž˜áŸ‚áž€áž’áž¶áž„ážáŸ’áž“áž¶áž€áŸ‹ážŠáž¹áž€áž“áž¶áŸ† áž“áž·áž„ážŸáž˜áž¶áž‡áž·áž€ážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“ážŸáŸ’áž˜áŸáž‚áŸ’ážšáž…áž·ážáŸ’áž STJ ážáž¶áž˜áž”ážŽáŸ’ážáž¶áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áž“áŸƒážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ (ITC)",
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
              <span>ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ážŠáž¹áž€áž“áž¶áŸ† & ážŸáž˜áž¶áž‡áž·áž€ (STJ Hierarchy & Member Tree)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              áž˜áŸ‚áž€áž’áž¶áž„ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’ STJ ážáž¶áž˜áž¢áž¶ážŽážáŸ’ážáž·
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              ážŸáŸ’ážœáŸ‚áž„áž™áž›áŸ‹áž¢áŸ†áž–áž¸ážšáž…áž“áž¶ážŸáž˜áŸ’áž–áŸáž“áŸ’áž’áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážšáž”ážŸáŸ‹áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ STJ áž–áž¸ážáŸ’áž“áž¶áž€áŸ‹áž”áŸ’ážšáž’áž¶áž“áž€ážŽáŸ’ážáž¶áž› ážšáž áž¼ážážŠáž›áŸ‹áž”áŸ’ážšáž’áž¶áž“áž€áŸ’ážšáž»áž˜ážáž¶áž˜áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ áž“áž·áž„ážŸáž˜áž¶áž‡áž·áž€áž”áž„áŸ’ážšáŸ€áž“áž‘áž¶áŸ†áž„áž¢ážŸáŸ‹áŸ” ážšáž¶áž›áŸ‹áž‘áž·áž“áŸ’áž“áž“áŸáž™ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áŸ‚áž„áž…áŸ‚áž€ážáž¶áž˜áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶áž“áž¸áž˜áž½áž™áŸ—áž™áŸ‰áž¶áž„áž…áŸ’áž”áž¶ážŸáŸ‹áž›áž¶ážŸáŸ‹áŸ”
            </p>
          </div>

          {/* Interactive Tree View */}
          <OrganizationTree />

          {/* Bottom Navigation CTA */}
          <div className="pt-8 border-t border-border flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="space-x-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ážáŸ’ážšáž¡áž”áŸ‹áž‘áŸ…áž‘áŸ†áž–áŸážšážŠáž¾áž˜ (Back to Home)</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

