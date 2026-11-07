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
              Ã¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾â€žÃ¡Å¾ËœÃ¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹ STJ
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
              Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾â€ž Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€™Ã¡Å¾Â¸ Senior Teaching Junior Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Contact Info */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-base">Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž & Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â„¢Ã¡Å¾Å Ã¡Å¸â€™Ã¡Å¾â€¹Ã¡Å¾Â¶Ã¡Å¾â€œ</h3>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        Ã¡Å¾ËœÃ¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Â¸Ã¡Å¾Å¸Ã¡Å¾Â Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¸Å Ã¡Å¾Â¸, Ã¡Å¾Å¸Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€ºÃ¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¸Â¡, Ã¡Å¾ÂÃ¡Å¾Å½Ã¡Å¸â€™Ã¡Å¾Å’Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€šÃ¡Å¸â€žÃ¡Å¾â‚¬, Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€”Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°, Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶ (ITC)
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
                      <span>Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¸Æ’Ã¡Å¾â€¦Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜ - Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¸Æ’Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€“ 07:30 - 17:00 Ã¢â‚¬Â¢ Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€žÃ¡Å¸Æ’Ã¡Å¾Å¸Ã¡Å¸â€¦Ã¡Å¾Å¡Ã¡Å¸Â-Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¸â€“ Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-5 rounded-xl border border-border bg-card/60 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">Ã¡Å¾â€¦Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â:</p>
                <p>
                  Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â½Ã¡Å¾Å¡Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾â€žÃ¡Å¾â€œÃ¡Å¾Â¹Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¸â€¡Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ Ã¡Å¾Â¬Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾ÂÃ¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Â½Ã¡Å¾â„¢Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬ Ã¡Å¾Â¬Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€
                </p>
              </div>
            </div>

            {/* Message form */}
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-base">Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾Å¸Ã¡Å¾Â½Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</h3>
                <form className="space-y-4 text-xs">
                  <div>
                    <label className="block font-medium mb-1 text-foreground">Ã¡Å¾â€šÃ¡Å¸â€žÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Ëœ-Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾Ëœ</label>
                    <input
                      type="text"
                      placeholder="Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â / Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â½Ã¡Å¾â€œ</label>
                    <input
                      type="email"
                      placeholder="example@itc.edu.kh"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶ Ã¡Å¾Â¬Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€˜</label>
                    <input
                      type="text"
                      placeholder="Ã¡Å¾Â§. Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¸â€¡Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ Programming"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-foreground">Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¹Ã¡Å¾ËœÃ¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡</label>
                    <textarea
                      rows={4}
                      placeholder="Ã¡Å¾Å¸Ã¡Å¾Â¼Ã¡Å¾ËœÃ¡Å¾Å¸Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â½Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡..."
                      required
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <Button type="button" className="w-full space-x-2">
                    <Send className="w-3.5 h-3.5" />
                    <span>Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Å¡</span>
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

