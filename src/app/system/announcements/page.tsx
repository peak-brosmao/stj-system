"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Calendar, Globe, X, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";

interface AnnouncementItem {
  id: string;
  titleKh: string;
  contentKh: string;
  scope: string;
  date: string;
  published: boolean;
  course?: string | null;
}

export default function SystemAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    titleKh: "",
    contentKh: "",
    scope: "GLOBAL",
  });

  const loadAnnouncements = () => {
    setLoading(true);
    fetch("/api/system/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (data.announcements) {
          setAnnouncements(data.announcements);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/system/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "áž”ážšáž¶áž‡áŸáž™áž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áž„áŸ’áž€áž¾ážážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„");
      }
      setSuccess("áž”áž¶áž“áž”áž„áŸ’áž€áž¾ážážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž‡áŸ„áž‚áž‡áŸáž™");
      setForm({ titleKh: "", contentKh: "", scope: "GLOBAL" });
      setIsModalOpen(false);
      loadAnnouncements();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "áž˜áž¶áž“áž”áž‰áŸ’áž áž¶áž€áŸ’áž“áž»áž„áž€áž¶ážšážšáž€áŸ’ážŸáž¶áž‘áž»áž€");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalLayout portalType="system" userRole="áž”áŸ’ážšáž’áž¶áž“ STJ (President)" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-4 h-4" />
              <span>ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž‘áž¼áž‘áŸ… (Announcements)
            </h1>
            <p className="text-xs text-muted-foreground">
              áž•áŸ’ážŸáž–áŸ’ážœáž•áŸ’ážŸáž¶áž™ážŠáŸ†ážŽáž¹áž„áž•áŸ’áž›áž¼ážœáž€áž¶ážšáž…áŸáž‰áž–áž¸áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž‘áž·áž“áŸ’áž“áž“áŸáž™ (Database) áž‡áž¼áž“ážŠáž›áŸ‹ážŸáž˜áž¶áž‡áž·áž€ áž“áž·áž„áž”áŸ’ážšáž’áž¶áž“áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnnouncements}
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              áž•áŸ’áž‘áž»áž€áž¡áž¾áž„ážœáž·áž‰
            </Button>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              áž”áž„áŸ’áž€áž¾ážážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„
            </Button>
          </div>
        </div>

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-600 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-600 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-xs">
            áž€áŸ†áž–áž»áž„áž‘áž¶áž‰áž™áž€áž‘áž·áž“áŸ’áž“áž“áŸáž™áž–áž¸ Database...
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-xs">
              áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž€áŸ’áž“áž»áž„ Database áž“áŸ…áž¡áž¾áž™áž‘áŸáŸ” ážŸáž¼áž˜áž…áž»áž… &quot;áž”áž„áŸ’áž€áž¾ážážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„&quot; ážŠáž¾áž˜áŸ’áž”áž¸áž”áž‰áŸ’áž…áž¼áž›áŸ”
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <Card key={a.id} className="hover:border-primary/50 transition-all">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-semibold uppercase text-primary">
                        {a.scope}
                      </span>
                      {a.course && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {a.course}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {a.date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{a.titleKh}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {a.contentKh}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">
                áž”áž„áŸ’áž€áž¾ážážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„áž•áŸ’áž›áž¼ážœáž€áž¶ážš (New Announcement)
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">
                  áž…áŸ†ážŽáž„áž‡áž¾áž„ážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ (Title)
                </label>
                <input
                  type="text"
                  required
                  value={form.titleKh}
                  onChange={(e) => setForm({ ...form, titleKh: e.target.value })}
                  placeholder="áž§. áž€áž¶ážšážŸáŸ’ážšáž„áŸ‹ážœážáŸ’ážáž˜áž¶áž“ážŸáž”áŸ’ážáž¶áž áŸáž‘áž¸áŸ¡..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  ážœáž·ážŸáž¶áž›áž—áž¶áž– (Scope)
                </label>
                <select
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="GLOBAL">áž‘áž¼áž‘áŸ…áž‘áž¼áž‘áž¶áŸ†áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’ (GLOBAL)</option>
                  <option value="COURSE">ážáž¶áž˜áž˜áž»ážážœáž·áž‡áŸ’áž‡áž¶ (COURSE)</option>
                  <option value="DEPARTMENT">ážáž¶áž˜ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (DEPARTMENT)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  ážáŸ’áž›áž¹áž˜ážŸáž¶ážšážŸáŸáž…áž€áŸ’ážáž¸áž‡áž¼áž“ážŠáŸ†ážŽáž¹áž„ (Content)
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.contentKh}
                  onChange={(e) => setForm({ ...form, contentKh: e.target.value })}
                  placeholder="ážŸážšážŸáŸážšážáŸ’áž›áž¹áž˜ážŸáž¶ážšáž›áž˜áŸ’áž¢áž·áž..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="text-xs"
                >
                  áž”áŸ„áŸ‡áž”áž„áŸ‹
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="text-xs bg-primary text-primary-foreground font-semibold"
                >
                  {submitting ? "áž€áŸ†áž–áž»áž„ážšáž€áŸ’ážŸáž¶áž‘áž»áž€..." : "ážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž…áž¼áž› Database"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
