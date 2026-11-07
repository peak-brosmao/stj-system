"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Calendar, Globe, X, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";

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
        throw new Error(data.error || "បរាជ័យក្នុងការបង្កើតសេចក្តីជូនដំណឹង");
      }
      setSuccess("បានបង្កើតសេចក្តីជូនដំណឹងជោគជ័យ");
      setForm({ titleKh: "", contentKh: "", scope: "GLOBAL" });
      setIsModalOpen(false);
      loadAnnouncements();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "មានបញ្ហាក្នុងការរក្សាទុក");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ (President)" userName="ផល ដាវីត">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Megaphone className="w-4 h-4" />
              <span>សេចក្តីជូនដំណឹងប្រព័ន្ធ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              សេចក្តីជូនដំណឹងទូទៅ (Announcements)
            </h1>
            <p className="text-xs text-muted-foreground">
              ផ្សព្វផ្សាយដំណឹងផ្លូវការចេញពីប្រព័ន្ធទិន្នន័យ (Database) ជូនដល់សមាជិក និងប្រធានមុខវិជ្ជា
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
              ផ្ទុកឡើងវិញ
            </Button>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              បង្កើតសេចក្តីជូនដំណឹង
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
            កំពុងទាញយកទិន្នន័យពី Database...
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground text-xs">
              ពុំទាន់មានសេចក្តីជូនដំណឹងក្នុង Database នៅឡើយទេ។ សូមចុច &quot;បង្កើតសេចក្តីជូនដំណឹង&quot; ដើម្បីបញ្ចូល។
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
                បង្កើតសេចក្តីជូនដំណឹងផ្លូវការ (New Announcement)
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
                  ចំណងជើងសេចក្តីជូនដំណឹង (Title)
                </label>
                <input
                  type="text"
                  required
                  value={form.titleKh}
                  onChange={(e) => setForm({ ...form, titleKh: e.target.value })}
                  placeholder="ឧ. ការស្រង់វត្តមានសប្តាហ៍ទី១..."
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  វិសាលភាព (Scope)
                </label>
                <select
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="GLOBAL">ទូទៅទូទាំងប្រព័ន្ធ (GLOBAL)</option>
                  <option value="COURSE">តាមមុខវិជ្ជា (COURSE)</option>
                  <option value="DEPARTMENT">តាមដេប៉ាតឺម៉ង់ (DEPARTMENT)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">
                  ខ្លឹមសារសេចក្តីជូនដំណឹង (Content)
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.contentKh}
                  onChange={(e) => setForm({ ...form, contentKh: e.target.value })}
                  placeholder="សរសេរខ្លឹមសារលម្អិត..."
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
                  បោះបង់
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="text-xs bg-primary text-primary-foreground font-semibold"
                >
                  {submitting ? "កំពុងរក្សាទុក..." : "រក្សាទុកចូល Database"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}