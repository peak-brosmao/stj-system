"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Plus,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Trash2,
  X,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface ShareItem {
  id: string;
  token: string;
  title: string;
  isRevoked: boolean;
  accessCount: number;
  createdAt: string;
  expiresAt?: string | null;
  course: { code: string; titleKh: string };
  session?: { title: string } | null;
}

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
}

interface SessionOption {
  id: string;
  courseId: string;
  courseCode?: string;
  title: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
}

export default function LeaderShareLinksPage() {
  const [links, setLinks] = useState<ShareItem[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [newLink, setNewLink] = useState({
    title: "",
    courseId: "",
    sessionId: "",
    showStats: true,
  });

  const loadLinks = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/system/share-links").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/system/sessions").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([linksData, sessionsData]) => {
        if (linksData?.links) setLinks(linksData.links);
        const courseList: CourseOption[] = Array.isArray(sessionsData?.courses)
          ? sessionsData.courses
          : [];
        const sessionList: SessionOption[] = Array.isArray(sessionsData?.sessions)
          ? sessionsData.sessions
          : [];
        setCourses(courseList);
        setSessions(sessionList);
        if (courseList[0]) {
          const firstCourse = courseList[0];
          const firstSession = sessionList.find(
            (s) => s.courseId === firstCourse.id || s.courseCode === firstCourse.code
          );
          setNewLink((prev) => ({
            ...prev,
            courseId: prev.courseId || firstCourse.id,
            sessionId: prev.sessionId || firstSession?.id || "",
            title:
              prev.title ||
              `របាយការណ៍វត្តមាន ${firstCourse.titleKh || firstCourse.code}`,
          }));
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    const selectedCourse = courses.find(
      (c) => c.id === newLink.courseId || c.code === newLink.courseId
    );
    if (!selectedCourse) return true;
    return (
      s.courseId === selectedCourse.id ||
      s.courseCode === selectedCourse.code ||
      s.courseId === selectedCourse.code
    );
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCourseId = newLink.courseId || courses[0]?.id || courses[0]?.code || "";
    if (!targetCourseId) {
      setCreateError("សូមជ្រើសរើសមុខវិជ្ជាជាមុនសិន");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch("/api/system/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLink,
          courseId: targetCourseId,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setShowCreatePanel(false);
        loadLinks();
      } else {
        setCreateError(data?.error || data?.message || "មិនអាចបង្កើតតំណភ្ជាប់បានទេ");
      }
    } catch {
      setCreateError("មានបញ្ហាក្នុងការតភ្ជាប់បណ្តាញ");
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (token: string, id: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបចោលតំណភ្ជាប់នេះមែនទេ? (Revoke Share Link)")) return;
    try {
      await fetch(`/api/system/share-links?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      loadLinks();
    } catch {
      // ignore
    }
  };

  return (
    <PortalLayout portalType="leader" userRole="Course Leader">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Share2 className="w-4 h-4" />
              <span>Public Attendance Verification Links</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              តំណភ្ជាប់ចែករំលែកវត្តមានសាធារណៈ (Public Attendance Links)
            </h1>
            <p className="text-xs text-muted-foreground">
              បង្កើតតំណភ្ជាប់សាធារណៈ ឬកូដ QR សម្រាប់ឱ្យមើលរបាយការណ៍វត្តមានតែប៉ុណ្ណោះ (Read-Only Attendance Report)។
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setCreateError(null);
              setShowCreatePanel((v) => !v);
            }}
            className="text-xs space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {showCreatePanel
                ? "បិទផ្ទាំងបង្កើត (Close)"
                : "បង្កើតតំណភ្ជាប់វត្តមានថ្មី (New Attendance Link)"}
            </span>
          </Button>
        </div>

        {/* Security Alert Banner */}
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              តំណភ្ជាប់នេះសម្រាប់បង្ហាញតែតារាងវត្តមានផ្លូវការជាសាធារណៈប៉ុណ្ណោះ (មិនបង្ហាញមាតិកាមេរៀន Rich Text ឬព័ត៌មានផ្ទាល់ខ្លួនរបស់សមាជិកឡើយ)។
            </span>
          </div>
        </div>

        {/* Inline Professional Create Share Link Card (No Popup) */}
        {showCreatePanel && (
          <Card className="border-primary/40 shadow-md">
            <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-primary" />
                <span>បង្កើតតំណភ្ជាប់ចែករំលែករបាយការណ៍វត្តមានថ្មី (Create Public Attendance Link)</span>
              </CardTitle>
              <button
                type="button"
                onClick={() => setShowCreatePanel(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="p-5">
              {createError && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      មុខវិជ្ជា (Course) *
                    </label>
                    <select
                      required
                      value={newLink.courseId}
                      disabled={courses.length <= 1}
                      onChange={(e) => {
                        const cid = e.target.value;
                        const c = courses.find((x) => x.id === cid || x.code === cid);
                        const firstSess = sessions.find(
                          (s) => s.courseId === cid || (c && s.courseCode === c.code)
                        );
                        setNewLink({
                          ...newLink,
                          courseId: cid,
                          sessionId: firstSess?.id || "",
                          title: c ? `របាយការណ៍វត្តមាន ${c.titleKh}` : newLink.title,
                        });
                      }}
                      className="w-full p-2.5 rounded-xl border border-input bg-background disabled:opacity-70"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      ជ្រើសរើសមេរៀន / ថ្ងៃបង្រៀន (Lesson Session)
                    </label>
                    <select
                      value={newLink.sessionId}
                      onChange={(e) => setNewLink({ ...newLink, sessionId: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-input bg-background"
                    >
                      <option value="">គ្រប់មេរៀនទាំងអស់ក្នុងមុខវិជ្ជា (Full Course Attendance)</option>
                      {filteredSessions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.sessionDate} ({s.startTime}-{s.endTime}) • {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1.5">
                      ចំណងជើងរបាយការណ៍វត្តមាន *
                    </label>
                    <input
                      type="text"
                      required
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="ឧ. របាយការណ៍វត្តមាន C PROGRAM"
                      className="w-full p-2.5 rounded-xl border border-input bg-background"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border">
                  <label
                    htmlFor="showStats"
                    className="inline-flex items-center space-x-2 font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id="showStats"
                      checked={newLink.showStats}
                      onChange={(e) => setNewLink({ ...newLink, showStats: e.target.checked })}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <span>បង្ហាញផ្ទាំងស្ថិតិវត្តមានសរុប (Show Attendance Statistics Summary)</span>
                  </label>

                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreatePanel(false)}
                    >
                      បោះបង់
                    </Button>
                    <Button type="submit" size="sm" disabled={creating}>
                      {creating ? "កំពុងបង្កើត..." : "បង្កើតតំណភ្ជាប់វត្តមាន"}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Inline QR Code Preview Panel */}
        {qrToken && (
          <Card className="border-primary/30 bg-card">
            <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      `${typeof window !== "undefined" ? window.location.origin : ""}/share/${qrToken}`
                    )}`}
                    alt="QR Code"
                    className="w-28 h-28"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <Badge variant="info">QR Code សម្រាប់មើលវត្តមានសាធារណៈ</Badge>
                  <p className="font-bold text-sm text-foreground">
                    ស្កេនកូដ QR ឬចម្លងតំណភ្ជាប់ខាងក្រោមដើម្បីមើលវត្តមាន
                  </p>
                  <p className="font-mono text-[11px] text-primary break-all">
                    {typeof window !== "undefined" ? window.location.origin : ""}/share/{qrToken}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setQrToken(null)}>
                បិទ QR Code
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Links Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ចំណងជើងរបាយការណ៍វត្តមាន</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជា / មេរៀន</th>
                  <th className="py-3 px-4 font-semibold">តំណភ្ជាប់សាធារណៈ (Public URL)</th>
                  <th className="py-3 px-4 font-semibold text-center">ចូលមើល</th>
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{link.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        បង្កើតនៅ៖ {new Date(link.createdAt).toISOString().split("T")[0]}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-primary">
                        {link.course?.code || "STJ"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {link.session?.title || "គ្រប់មេរៀនទាំងអស់"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/share/${link.token}`}
                        target="_blank"
                        className="font-mono text-[11px] text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>/share/{(link.token || "").slice(0, 14)}...</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-foreground">
                      {link.accessCount ?? 0} ដង
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={link.isRevoked ? "destructive" : "success"}>
                        {link.isRevoked ? "បានលុបចោល" : "សកម្ម"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(link.token, link.id)}
                          className="h-7 text-xs space-x-1"
                          title="ចម្លងតំណភ្ជាប់វត្តមាន (Copy Attendance URL)"
                        >
                          {copiedId === link.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">បានចម្លង</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>ចម្លង Link</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setQrToken((cur) => (cur === link.token ? null : link.token))
                          }
                          className="h-7 text-xs"
                          title="Show QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5 text-primary" />
                        </Button>
                        <Link href={`/share/${link.token}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" title="Open Link">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {!link.isRevoked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(link.id)}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            title="Revoke Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {links.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      {loading
                        ? "កំពុងទាញយកទិន្នន័យ..."
                        : "ពុំទាន់មានតំណភ្ជាប់ចែករំលែកវត្តមាននៅឡើយទេ"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
