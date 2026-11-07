import Link from "next/link";
import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/ui/Card";
import { Calendar, ArrowRight, Megaphone } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NewsPage() {
  const articles = [
    {
      slug: "launch-stj-management-system",
      title: "áž€áž¶ážšážŠáž¶áž€áŸ‹áž±áŸ’áž™ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž‡áž¶áž•áŸ’áž›áž¼ážœáž€áž¶ážšáž“áž¼ážœáž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážœážáŸ’ážáž˜áž¶áž“ STJ ážŒáž¸áž‡áž¸ážáž› áž“áŸ… ITC",
      date: "30 ážáž»áž›áž¶ 2026",
      summary: "áž”áŸ’ážšáž–áŸáž“áŸ’áž’ážŒáž¸áž‡áž¸ážáž›ážáŸ’áž˜áž¸áž‡áŸ†áž“áž½ážŸáž±áŸ’áž™áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“áž›áž¾áž€áŸ’ážšážŠáž¶ážŸ áž“áž·áž„áž•áŸ’ážáž›áŸ‹áž“áž¼ážœážáŸ†ážŽáž—áŸ’áž‡áž¶áž”áŸ‹áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€ážšáž”áž¶áž™áž€áž¶ážšážŽáŸážœážáŸ’ážáž˜áž¶áž“áž”áŸ’ážšáž€áž”ážŠáŸ„áž™ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–áŸ”",
    },
    {
      slug: "schedule-semester-1-2026",
      title: "áž€áž¶áž›ážœáž·áž—áž¶áž‚áž”áž„áŸ’ážšáŸ€áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ážŸáŸ’áž“áž¼áž› áž†áž˜áž¶ážŸáž‘áž¸áŸ¡ áž†áŸ’áž“áž¶áŸ†ážŸáž·áž€áŸ’ážŸáž¶ áŸ¢áŸ áŸ¢áŸ¦-áŸ¢áŸ áŸ¢áŸ§",
      date: "14 ážáž»áž›áž¶ 2026",
      summary: "ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ážŸáŸ’ážáž¸áž–áž¸áž€áž¶áž›ážœáž·áž—áž¶áž‚ážáŸ’áž“áž¶áž€áŸ‹ážšáŸ€áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ Programming, Mathematics, Physics áž“áž·áž„ Chemistry áž“áŸ… ITC Campus 1áŸ”",
    },
    {
      slug: "recruitment-senior-tutors-2026",
      title: "áž€áž¶ážšáž‡áŸ’ážšáž¾ážŸážšáž¾ážŸáž“áž·ážŸáŸ’ážŸáž·ážážšáŸ€áž˜áž…áŸ’áž”áž„áž”áž„áŸ’ážšáŸ€áž“áž”áŸ’áž¢áž¼áž“ (Senior Mentors) ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ GIC, AMS, GIM",
      date: "01 ážáž»áž›áž¶ 2026",
      summary: "áž±áž€áž¶ážŸážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·ážáž†áŸ’áž“áž¶áŸ†áž‘áž¸áŸ¤ áž“áž·áž„áž‘áž¸áŸ¥ áž“áŸƒážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ áž…áž¼áž›ážšáž½áž˜áž…áŸ‚áž€ážšáŸ†áž›áŸ‚áž€áž…áŸ†ážŽáŸáŸ‡ážŠáž¹áž„ áž“áž·áž„áž‘áž‘áž½áž›ážœáž·áž‰áŸ’áž‰áž¶áž”áž“áž”ážáŸ’ážšáž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž€áž¶ážšáž„áž¶ážšážŸáž„áŸ’áž‚áž˜áŸ”",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              áž–áŸážáŸŒáž˜áž¶áž“ & ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              áž–áŸážáŸŒáž˜áž¶áž“áž…áž»áž„áž€áŸ’ážšáŸ„áž™áž¢áŸ†áž–áž¸áž€áž¶áž›ážœáž·áž—áž¶áž‚ážŸáž·áž€áŸ’ážŸáž¶ áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ áž“áž·áž„ážŸáŸáž…áž€áŸ’ážáž¸áž”áŸ’ážšáž€áž¶ážŸáž•áŸ’áž›áž¼ážœáž€áž¶ážš
            </p>
          </div>

          <div className="space-y-4">
            {articles.map((art) => (
              <Card key={art.slug} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{art.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold hover:text-primary transition-colors">
                    <Link href={`/news/${art.slug}`}>{art.title}</Link>
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">{art.summary}</p>

                  <div className="pt-2">
                    <Link
                      href={`/news/${art.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>áž¢áž¶áž“ážŸáŸáž…áž€áŸ’ážáž¸áž›áž˜áŸ’áž¢áž·áž</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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

