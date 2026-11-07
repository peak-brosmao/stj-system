"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Users, Calendar, AlertCircle, Plus, Pencil, X, Check, ShieldCheck } from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import { useI18n } from "@/ui/i18n/I18nProvider";

interface CourseItem {
  id: string;
  code: string;
  slug: string;
  titleKh: string;
  titleEn: string;
  category: string;
  term: string;
  status: string;
  leaders: string;
  leaderMemberId?: string | null;
  leaderStudentId?: string | null;
  enrolled: number;
  sessionsCount: number;
}

interface LeaderOption {
  id: string;
  memberId: string;
  studentId: string;
  fullNameKh: string;
  fullNameEn: string;
  department?: { code: string };
  academicYear?: { code: string };
}

interface CourseFormData {
  id?: string;
  code: string;
  titleKh: string;
  titleEn: string;
  category: string;
  term: string;
  status: string;
  leaderMemberId: string;
}

export default function SystemCoursesPage() {
  const { t } = useI18n();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [eligibleLeaders, setEligibleLeaders] = useState<LeaderOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseFormData | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/system/courses");
      if (res.status === 401) {
        window.location.href = `/system/login?callbackUrl=${encodeURIComponent("/system/courses")}`;
        return;
      }
      if (!res.ok) {
        const responseData = await res.json().catch(() => null);
        throw new Error(responseData?.error || "មិនអាចទាញយកទិន្នន័យមុខវិជ្ជាពី Database បានឡើយ");
      }
      const data = await res.json();
      setCourses(data.courses || []);
      setEligibleLeaders(data.eligibleLeaders || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading courses";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openCreateModal = () => {
    setFormError("");
    setEditingCourse({
      code: "",
      titleKh: "",
      titleEn: "",
      category: "Engineering Foundation",
      term: "ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
      status: "ACTIVE",
      leaderMemberId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: CourseItem) => {
    setFormError("");
    const matchedLeader = eligibleLeaders.find(
      (m) =>
        (c.leaderMemberId && (m.id === c.leaderMemberId || m.memberId === c.leaderMemberId)) ||
        (c.leaderStudentId && m.studentId.toLowerCase() === c.leaderStudentId.toLowerCase()) ||
        (c.leaders && (m.fullNameKh === c.leaders || m.fullNameEn === c.leaders))
    );
    setEditingCourse({
      id: c.id,
      code: c.code,
      titleKh: c.titleKh,
      titleEn: c.titleEn,
      category: c.category || "Engineering Foundation",
      term: c.term || "ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
      status: c.status || "ACTIVE",
      leaderMemberId: matchedLeader?.id || c.leaderMemberId || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setSaving(true);
    setFormError("");
    try {
      const isEdit = !!editingCourse.id;
      const selectedLeader = eligibleLeaders.find(
        (m) =>
          m.id === editingCourse.leaderMemberId ||
          m.memberId === editingCourse.leaderMemberId ||
          m.studentId === editingCourse.leaderMemberId
      );
      const payload = {
        ...editingCourse,
        leaderMemberId: selectedLeader?.memberId || editingCourse.leaderMemberId || "",
        leaderStudentId: selectedLeader?.studentId || "",
      };
      const res = await fetch("/api/system/courses", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setFormError(data?.error || data?.message || "បរាជ័យក្នុងការរក្សាទុកមុខវិជ្ជា");
        return;
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      await loadCourses();
    } catch {
      setFormError("មានបញ្ហាក្នុងការភ្ជាប់បណ្តាញ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ" userName="ផល ដាវីត">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <BookOpen className="w-4 h-4" />
              <span>{t("courses.title")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("courses.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("courses.assignedLeaders")} · {t("courses.enrolledMembers")}
            </p>
          </div>

          <Button size="sm" onClick={openCreateModal} className="text-xs space-x-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>{t("courses.addCourse")}</span>
          </Button>
        </div>

        {loading && (
          <div className="p-8 text-center text-xs text-muted-foreground">
            កំពុងទាញយកទិន្នន័យពី Database...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl">
            ពុំមានមុខវិជ្ជានៅក្នុងប្រព័ន្ធឡើយ។ សូមចុច &quot;បង្កើតមុខវិជ្ជាថ្មី&quot;។
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {c.code}
                    </span>
                    <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>
                      {c.status === "ACTIVE" ? "សកម្ម" : "អសកម្ម"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(c)}
                    className="h-7 text-xs space-x-1 border-primary/30 text-primary hover:bg-primary/10"
                    title="កែប្រែព័ត៌មាន និងចាត់តាំងប្រធានមុខវិជ្ជា"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>កែប្រែ</span>
                  </Button>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground leading-snug">{c.titleKh}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.titleEn || c.category}</p>
                </div>

                <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-1.5 text-muted-foreground">
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>សិស្សចុះឈ្មោះ៖ <strong className="text-foreground">{c.enrolled} នាក់</strong></span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{c.term}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground flex items-center justify-between">
                  <div>
                    ប្រធានមុខវិជ្ជា៖ <strong className="text-foreground">{c.leaders}</strong>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 ml-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create / Edit Course Modal */}
        {isModalOpen && editingCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) { setIsModalOpen(false); setEditingCourse(null); } }}>
            <Card className="max-w-md w-full shadow-2xl border-primary/30 max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {editingCourse.id ? "កែប្រែមុខវិជ្ជាសិក្សា (Edit Course)" : "បង្កើតមុខវិជ្ជាថ្មី (New Course)"}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        រក្សាទុកផ្ទាល់ក្នុង Database SQLite &amp; Backend API
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCourse(null);
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {formError && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSaveCourse} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1">កូដមុខវិជ្ជា (Course Code) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. MATH101, PROG101, ELEC101"
                      disabled={!!editingCourse.id}
                      value={editingCourse.code}
                      onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value.toUpperCase() })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">ឈ្មោះមុខវិជ្ជាជាភាសាខ្មែរ *</label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. គណិតវិទ្យាវិស្វកម្ម..."
                      value={editingCourse.titleKh}
                      onChange={(e) => setEditingCourse({ ...editingCourse, titleKh: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">ឈ្មោះជាភាសាអង់គ្លេស / ឡាតាំង</label>
                    <input
                      type="text"
                      placeholder="ឧ. Engineering Mathematics"
                      value={editingCourse.titleEn}
                      onChange={(e) => setEditingCourse({ ...editingCourse, titleEn: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">ប្រភេទមុខវិជ្ជា (Category)</label>
                      <select
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      >
                        <option value="Engineering Foundation">Engineering Foundation</option>
                        <option value="Natural Sciences">Natural Sciences</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="General Engineering">General Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">ឆមាស / ឆ្នាំសិក្សា (Term)</label>
                      <input
                        type="text"
                        value={editingCourse.term}
                        onChange={(e) => setEditingCourse({ ...editingCourse, term: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  {/* Leader Assignment */}
                  <div>
                    <label className="block font-medium mb-1">ចាត់តាំងប្រធានមុខវិជ្ជា (Assign Course Leader)</label>
                    <select
                      value={editingCourse.leaderMemberId}
                      onChange={(e) => setEditingCourse({ ...editingCourse, leaderMemberId: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                    >
                      <option value="">-- មិនទាន់ចាត់តាំង (None) --</option>
                      {eligibleLeaders.map((m) => {
                        const year = m.academicYear?.code || "";
                        const dept = m.department?.code || "";
                        const badge = year && dept ? ` (${year}-${dept})` : "";
                        return (
                          <option key={m.id} value={m.id}>
                            {m.memberId} • {m.fullNameKh} ({m.fullNameEn}){badge}
                          </option>
                        );
                      })}
                    </select>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      ប្រធានមុខវិជ្ជាដែលត្រូវបានចាត់តាំង នឹងមានសិទ្ធិចូលគ្រប់គ្រងមេរៀន និងវត្តមានសម្រាប់មុខវិជ្ជានេះ។
                    </p>
                  </div>

                  {editingCourse.id && (
                    <div>
                      <label className="block font-medium mb-1">ស្ថានភាពមុខវិជ្ជា (Status)</label>
                      <select
                        value={editingCourse.status}
                        onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      >
                        <option value="ACTIVE">សកម្ម (ACTIVE)</option>
                        <option value="INACTIVE">អសកម្ម (INACTIVE)</option>
                        <option value="ARCHIVED">បណ្ណសារ (ARCHIVED)</option>
                      </select>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsModalOpen(false);
                        setEditingCourse(null);
                      }}
                    >
                      បោះបង់
                    </Button>
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកក្នុង Database"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}