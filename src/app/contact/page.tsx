import { Navbar } from "@/ui/layout/Navbar";
import { Footer } from "@/ui/layout/Footer";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
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
              áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„áž˜áž€áž€áž¶áž“áŸ‹ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              áž€áž¶ážšáž·áž™áž¶áž›áŸáž™áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„ áž“áž·áž„ážŸáž˜áŸ’ážšáž”ážŸáž˜áŸ’ážšáž½áž›áž€áž˜áŸ’áž˜ážœáž·áž’áž¸ Senior Teaching Junior áž“áŸ…ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Info */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-base">áž–áŸážáŸŒáž˜áž¶áž“áž‘áž¸ážáž¶áŸ†áž„ & áž¢áž¶ážŸáž™ážŠáŸ’áž‹áž¶áž“</h3>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        áž˜áž áž¶ážœáž·ážáž¸ážŸáž áž–áŸáž“áŸ’áž’ážšáž»ážŸáŸ’ážŸáŸŠáž¸, ážŸáž„áŸ’áž€áž¶ážáŸ‹áž‘áž¹áž€áž›áŸ’áž¢áž€áŸ‹áŸ¡, ážážŽáŸ’ážŒáž‘áž½áž›áž‚áŸ„áž€, ážšáž¶áž‡áž’áž¶áž“áž¸áž—áŸ’áž“áŸ†áž–áŸáž‰, ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áž”áž…áŸ’áž…áŸáž€ážœáž·áž‘áŸ’áž™áž¶áž€áž˜áŸ’áž–áž»áž‡áž¶ (ITC)
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
                      <span>ážáŸ’áž„áŸƒáž…áž“áŸ’áž‘ - ážáŸ’áž„áŸƒážŸáž»áž€áŸ’ážšáŸ– 07:30 - 17:00 â€¢ ážáŸ’áž„áŸƒážŸáŸ…ážšáŸ-áž¢áž¶áž‘áž·ážáŸ’áž™áŸ– ážáŸ’áž“áž¶áž€áŸ‹áž”áž„áŸ’ážšáŸ€áž“</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-5 rounded-xl border border-border bg-card/60 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">áž…áŸ†ážŽáž¶áŸ†ážŸáž˜áŸ’ážšáž¶áž”áŸ‹áž“áž·ážŸáŸ’ážŸáž·áž:</p>
                <p>
                  ážŸáž˜áŸ’ážšáž¶áž”áŸ‹ážŸáŸ†ážŽáž½ážšáž‘áž¶áž€áŸ‹áž‘áž„áž“áž¹áž„áž€áž¶ážšáž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡ážšáŸ€áž“ áž¬áž€áž¶ážšážŸáž»áŸ†áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœážœážáŸ’ážáž˜áž¶áž“ ážŸáž¼áž˜áž‘áž¶áž€áŸ‹áž‘áž„áž•áŸ’áž‘áž¶áž›áŸ‹áž‡áž¶áž˜áž½áž™áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶áž‘áž‘áž½áž›áž”áž“áŸ’áž‘áž»áž€ áž¬áž¢áŸ’áž“áž€ážŸáž˜áŸ’ážšáž”ážŸáž˜áŸ’ážšáž½áž›ážáž¶áž˜ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áŸ”
                </p>
              </div>
            </div>

            {/* Message form */}
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-base">áž•áŸ’áž‰áž¾ážŸáž¶ážšážŸáž¶áž€ážŸáž½ážšáž–áŸážáŸŒáž˜áž¶áž“</h3>
                <form className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium mb-1 text-foreground">áž‚áŸ„ážáŸ’ážáž“áž¶áž˜-áž“áž¶áž˜</label>
                    <input
                      type="text"
                      placeholder="ážˆáŸ’áž˜áŸ„áŸ‡ážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">áž¢áŸŠáž¸áž˜áŸ‚áž›áž“áž·ážŸáŸ’ážŸáž·áž / áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“</label>
                    <input
                      type="email"
                      placeholder="example@itc.edu.kh"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ áž¬áž”áŸ’ážšáž’áž¶áž“áž”áž‘</label>
                    <input
                      type="text"
                      placeholder="áž§. áž€áž¶ážšáž…áž»áŸ‡ážˆáŸ’áž˜áŸ„áŸ‡ážšáŸ€áž“ Programming"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">ážáŸ’áž›áž¹áž˜ážŸáž¶ážšážŸáž¶ážš</label>
                    <textarea
                      rows={4}
                      placeholder="ážŸáž¼áž˜ážŸážšážŸáŸážšážŸáŸ†ážŽáž½ážšážšáž”ážŸáŸ‹áž¢áŸ’áž“áž€áž“áŸ…áž‘áž¸áž“áŸáŸ‡..."
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button type="button" className="w-full space-x-2">
                    <Send className="w-3.5 h-3.5" />
                    <span>áž•áŸ’áž‰áž¾ážŸáž¶ážš</span>
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

