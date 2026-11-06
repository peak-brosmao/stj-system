"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Archive,
  RefreshCw,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
  FileSpreadsheet,
  BookOpen,
  ShieldCheck,
  Award,
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface CourseOption {
  id: string;
  code: string;
  titleKh: string;
  titleEn: string;
}

interface MemberItem {
  id: string;
  memberId: string;
  studentId?: string | null;
  fullNameKh: string;
  fullNameEn: string;
  email?: string | null;
  phone?: string | null;
  gender?: string | null;
  status: string;
  notes?: string | null;
  departmentId: string;
  academicYearId: string;
  department: { id: string; code: string; nameKh: string };
  academicYear: { id: string; code: string; label: string };
  enrollments?: Array<{
    id: string;
    courseId: string;
    course: { id: string; code: string; titleKh: string; titleEn: string };
  }>;
}

export default function SystemMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; code: string }>>([]);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; code: string }>>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [courseFilter, setCourseFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<{
    id: string;
    memberId: string;
    studentId: string;
    fullNameKh: string;
    fullNameEn: string;
    departmentId: string;
    academicYearId: string;
    courseIds: string[];
    phone: string;
    email: string;
    status: string;
  } | null>(null);

  // New member form
  const [newMember, setNewMember] = useState({
    memberId: "",
    studentId: "",
    fullNameKh: "",
    fullNameEn: "",
    email: "",
    phone: "",
    gender: "M",
    departmentId: "",
    academicYearId: "",
    assignedCourse: "",
    notes: "",
  });

  const loadMembers = () => {
    setLoading(true);
    fetch("/api/system/members")
      .then((res) => res.json())
      .then((data) => {
        if (data.members) setMembers(data.members);
        if (data.departments) {
          setDepartments(data.departments);
          if (data.departments[0]) {
            setNewMember((prev) => ({ ...prev, departmentId: data.departments[0].id }));
          }
        }
        if (data.academicYears) {
          setAcademicYears(data.academicYears);
          if (data.academicYears[0]) {
            setNewMember((prev) => ({ ...prev, academicYearId: data.academicYears[0].id }));
          }
        }
        if (data.courses) {
          setCourses(data.courses);
          if (data.courses[0]) {
            setNewMember((prev) => ({ ...prev, assignedCourse: data.courses[0].code }));
          }
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openAddModal = async () => {
    setIsAddModalOpen(true);
    try {
      const res = await fetch("/api/system/members?action=next-id");
      const data = await res.json();
      if (data.nextMemberId) {
        setNewMember((prev) => ({ ...prev, memberId: data.nextMemberId }));
      }
    } catch {}
  };

  const openEditModal = (m: MemberItem) => {
    const existingCourseCodes: string[] = [];
    if (m.enrollments && Array.isArray(m.enrollments)) {
      for (const e of m.enrollments) {
        if (e.course?.code) existingCourseCodes.push(e.course.code);
        if (e.course?.id) existingCourseCodes.push(e.course.id);
        if (e.courseId) existingCourseCodes.push(e.courseId);
      }
    }
    if ((m as any).courses && Array.isArray((m as any).courses)) {
      for (const c of (m as any).courses) {
        if (c.code) existingCourseCodes.push(c.code);
        if (c.id) existingCourseCodes.push(c.id);
      }
    }
    if ((m as any).courseCodes && Array.isArray((m as any).courseCodes)) {
      for (const code of (m as any).courseCodes) {
        existingCourseCodes.push(code);
      }
    }
    if ((m as any).courseCode) {
      existingCourseCodes.push((m as any).courseCode);
    }

    const mDeptCode = (m.department?.code || (m as any).departmentCode || (m.departmentId ? m.departmentId.replace(/^dept-/i, "").toUpperCase() : "")).toUpperCase();
    const matchedDept = departments.find((d) => d.id === m.departmentId || d.code.toUpperCase() === mDeptCode);

    const mYearCode = (m.academicYear?.code || (m as any).yearCode || (m.academicYearId ? m.academicYearId.replace(/^year-/i, "").toUpperCase() : "")).toUpperCase();
    const matchedYear = academicYears.find((y) => y.id === m.academicYearId || y.code.toUpperCase() === mYearCode);

    setEditingMember({
      id: m.id || m.memberId,
      memberId: m.memberId,
      studentId: m.studentId || "",
      fullNameKh: m.fullNameKh,
      fullNameEn: m.fullNameEn,
      departmentId: matchedDept?.id || m.departmentId || (departments[0]?.id || ""),
      academicYearId: matchedYear?.id || m.academicYearId || (academicYears[0]?.id || ""),
      courseIds: Array.from(new Set(existingCourseCodes)),
      phone: m.phone || "",
      email: m.email || "",
      status: m.status,
    });
    setIsEditModalOpen(true);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/system/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewMember({
          memberId: "",
          studentId: "",
          fullNameKh: "",
          fullNameEn: "",
          email: "",
          phone: "",
          gender: "M",
          departmentId: departments[0]?.id || "",
          academicYearId: academicYears[0]?.id || "",
          assignedCourse: courses[0]?.code || "",
          notes: "",
        });
        loadMembers();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create member");
      }
    } catch {
      alert("Error creating member");
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const res = await fetch("/api/system/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMember),
      });
      const data = await res.json();
      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingMember(null);
        loadMembers();
      } else {
        alert(data.error || "Failed to update member");
      }
    } catch {
      alert("Error updating member");
    }
  };

  const handleToggleArchive = async (member: MemberItem) => {
    const newStatus = member.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
    try {
      await fetch("/api/system/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: member.id, status: newStatus }),
      });
      loadMembers();
    } catch {
      // ignore
    }
  };

  const exportCSV = () => {
    const headers = ["Member ID,Student ID,Full Name Kh,Full Name En,Department,Year,Course,Status\n"];
    const rows = filteredMembers.map((m) => {
      const course = m.enrollments?.[0]?.course?.code || (m as any).courseCode || "Unassigned";
      const dept = m.department?.code || (m as any).departmentCode || "-";
      const year = m.academicYear?.code || (m as any).yearCode || "-";
      return `"${m.memberId}","${m.studentId || ""}","${m.fullNameKh || ""}","${m.fullNameEn || ""}","${dept}","${year}","${course}","${m.status || "ACTIVE"}"\n`;
    });
    const blob = new Blob(["\uFEFF" + headers + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `STJ_Official_Members_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMembers = members.filter((m) => {
    const memberId = m?.memberId || "";
    const studentId = m?.studentId || "";
    const fullNameKh = m?.fullNameKh || "";
    const fullNameEn = m?.fullNameEn || "";
    const matchesSearch =
      memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullNameKh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullNameEn.toLowerCase().includes(searchTerm.toLowerCase());

    const deptCode = m?.department?.code || (m as any)?.departmentCode || "";
    const matchesDept = deptFilter === "ALL" || deptCode === deptFilter;

    const yearCode = m?.academicYear?.code || (m as any)?.yearCode || "";
    const matchesYear = yearFilter === "ALL" || yearCode === yearFilter;

    const matchesStatus = statusFilter === "ALL" || m?.status === statusFilter;

    const memberCourses = [
      ...(m?.enrollments?.map((e) => e.course?.code) || []),
      ...((m as any)?.courseCodes || []),
      ...((m as any)?.courses?.map((c: any) => c.code) || []),
      ...((m as any)?.courseCode ? [(m as any).courseCode] : []),
    ];
    const matchesCourse = courseFilter === "ALL" || memberCourses.includes(courseFilter);

    return matchesSearch && matchesDept && matchesYear && matchesStatus && matchesCourse;
  });

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ (President)" userName="ផល ដាវីត">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-4 h-4" />
              <span>STJ Members Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              គ្រប់គ្រងសមាជិកបង្រៀនស្ម័គ្រចិត្ត (Tutors &amp; Leaders)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              បញ្ជីសមាជិកផ្លូវការទាំង {members.length} នាក់ នៃកម្មវិធី STJ ឆ្នាំសិក្សា ២០២៦-២០២៧
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="text-xs space-x-1.5 border-border"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={openAddModal}
              className="text-xs space-x-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>បញ្ចូលសមាជិកថ្មី</span>
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះ អត្តលេខ STJ ឬលេខនិស្សិត..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground font-medium"
            >
              <option value="ALL">គ្រប់មុខវិជ្ជា (All Courses)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.code}>
                  [{c.code}] {c.titleKh}
                </option>
              ))}
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground"
            >
              <option value="ALL">គ្រប់ដេប៉ាតឺម៉ង់ (All Depts)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.code}>
                  {d.code}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground"
            >
              <option value="ALL">គ្រប់កម្រិត (All Years)</option>
              {academicYears.map((y) => (
                <option key={y.id} value={y.code}>
                  {y.code}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground"
            >
              <option value="ALL">គ្រប់ស្ថានភាព</option>
              <option value="ACTIVE">សកម្ម (Active)</option>
              <option value="ARCHIVED">បណ្ណសារ (Archived)</option>
            </select>

            <Button variant="ghost" size="sm" onClick={loadMembers} className="h-8 px-2">
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Member Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">អត្តលេខ STJ</th>
                  <th className="py-3 px-4 font-semibold">អត្តលេខ ITC</th>
                  <th className="py-3 px-4 font-semibold">គោត្តនាម-នាម</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជា (Course)</th>
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់</th>
                  <th className="py-3 px-4 font-semibold">កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((m) => {
                  const assignedCourse = m.enrollments?.[0]?.course;
                  const courseBadge = assignedCourse?.code || (m as any)?.courseCode;
                  const deptBadge = m.department?.code || (m as any)?.departmentCode || "-";
                  const yearBadge = m.academicYear?.code || (m as any)?.yearCode || "-";
                  return (
                    <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">{m.memberId}</td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{m.studentId || "-"}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{m.fullNameKh}</div>
                        <div className="text-[10px] text-muted-foreground">{m.fullNameEn}</div>
                      </td>
                      <td className="py-3 px-4">
                        {m.memberId === "STJ001" ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            <span>សមាគមនិស្សិត</span>
                          </span>
                        ) : m.memberId === "STJ002" ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            <Award className="w-3 h-3" />
                            <span>ប្រធាន STJ</span>
                          </span>
                        ) : (
                          (() => {
                            const memberCourseList: Array<{ code: string; titleKh?: string }> = [];
                            if (m.enrollments && m.enrollments.length > 0) {
                              for (const e of m.enrollments) {
                                if (e.course && !memberCourseList.some(c => c.code === e.course.code)) {
                                  memberCourseList.push(e.course);
                                }
                              }
                            }
                            if ((m as any).courses && (m as any).courses.length > 0) {
                              for (const c of (m as any).courses) {
                                if (!memberCourseList.some(item => item.code === c.code)) {
                                  memberCourseList.push(c);
                                }
                              }
                            }
                            if (memberCourseList.length === 0 && (m as any).courseCode) {
                              memberCourseList.push({ code: (m as any).courseCode });
                            }

                            if (memberCourseList.length === 0) {
                              return <span className="text-[11px] text-muted-foreground italic">ពុំមានបង្រៀន</span>;
                            }

                            return (
                              <div className="flex flex-wrap gap-1">
                                {memberCourseList.map((c) => (
                                  <span
                                    key={c.code}
                                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded font-mono font-semibold text-[11px] bg-primary/10 text-primary border border-primary/20"
                                    title={c.titleKh || c.code}
                                  >
                                    <BookOpen className="w-3 h-3" />
                                    <span>{c.code}</span>
                                  </span>
                                ))}
                              </div>
                            );
                          })()
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{deptBadge}</td>
                      <td className="py-3 px-4 font-medium">{yearBadge}</td>
                      <td className="py-3 px-4">
                        <Badge variant={m.status === "ACTIVE" ? "success" : "secondary"}>
                          {m.status === "ACTIVE" ? "សកម្ម" : "បណ្ណសារ"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(m)}
                            className="h-7 text-[11px] px-2 text-primary border-primary/30 hover:bg-primary/10 space-x-1"
                            title="កែប្រែព័ត៌មាន និងប្តូរមុខវិជ្ជា (Edit & Reassign Course)"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>កែប្រែ</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!confirm(`តើលោកអ្នកចង់កំណត់ពាក្យសម្ងាត់សមាជិក ${m.fullNameKh} ឡើងវិញមែនទេ?`)) return;
                              try {
                                const res = await fetch("/api/system/members/reset-password", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ memberId: m.id }),
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || "Reset failed");
                                alert(`ពាក្យសម្ងាត់របស់ ${m.fullNameKh} ត្រូវបានកំណត់ឡើងវិញជោគជ័យ: ${data.defaultPassword}`);
                              } catch (err: unknown) {
                                alert(err instanceof Error ? err.message : "Error resetting password");
                              }
                            }}
                            className="h-7 text-[11px] px-2 text-muted-foreground hover:bg-muted"
                          >
                            Reset Pass
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleArchive(m)}
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            title={m.status === "ACTIVE" ? "Archive" : "Restore"}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-xs">
                      {loading ? "កំពុងទាញយកទិន្នន័យ..." : "ពុំមានសមាជិកត្រូវបង្ហាញឡើយ"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Member & Course Reassignment Modal */}
        {isEditModalOpen && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-lg w-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      កែប្រែព័ត៌មាន និងប្តូរមុខវិជ្ជា (Edit Member &amp; Course)
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {editingMember.memberId} • {editingMember.studentId}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingMember(null);
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUpdateMember} className="space-y-3 text-xs">
                  {/* MULTI-COURSE ASSIGNMENT CHECKBOXES */}
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-semibold text-primary">
                        មុខវិជ្ជាទទួលបន្ទុកបង្រៀន (ជ្រើសរើសបានច្រើនមុខវិជ្ជា)
                      </label>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {courses.filter((c) =>
                          editingMember.courseIds.some(
                            (item) => item === c.id || item === c.code || item.toUpperCase().includes(c.code.toUpperCase())
                          )
                        ).length} មុខវិជ្ជា
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {courses.map((c) => {
                        const isChecked = editingMember.courseIds.some(
                          (item) => item === c.id || item === c.code || item.toUpperCase().includes(c.code.toUpperCase())
                        );
                        return (
                          <label
                            key={c.id}
                            className={`flex items-center space-x-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isChecked
                                ? "bg-primary/10 border-primary text-primary font-semibold"
                                : "bg-background border-border text-foreground hover:bg-muted/30"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditingMember({
                                    ...editingMember,
                                    courseIds: Array.from(new Set([...editingMember.courseIds, c.code, c.id])),
                                  });
                                } else {
                                  setEditingMember({
                                    ...editingMember,
                                    courseIds: editingMember.courseIds.filter(
                                      (item) => item !== c.id && item !== c.code && !item.toUpperCase().includes(c.code.toUpperCase())
                                    ),
                                  });
                                }
                              }}
                              className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                            />
                            <span className="font-mono">[{c.code}]</span>
                            <span className="truncate">{c.titleKh}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed pt-1">
                      សមាជិកម្នាក់អាចទទួលបន្ទុកបង្រៀន ២ ទៅ ៣ មុខវិជ្ជាដំណាលគ្នាបាន។ ប្រសិនបើជាថ្នាក់ដឹកនាំមិនបង្រៀន (ដូចជា STJ001 ឬ STJ002) សូមដោះធីកទាំងអស់។
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">គោត្តនាម-នាម (ខ្មែរ) *</label>
                      <input
                        type="text"
                        required
                        value={editingMember.fullNameKh}
                        onChange={(e) => setEditingMember({ ...editingMember, fullNameKh: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">ឈ្មោះឡាតាំង *</label>
                      <input
                        type="text"
                        required
                        value={editingMember.fullNameEn}
                        onChange={(e) => setEditingMember({ ...editingMember, fullNameEn: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">ដេប៉ាតឺម៉ង់ *</label>
                      <select
                        value={editingMember.departmentId}
                        onChange={(e) => setEditingMember({ ...editingMember, departmentId: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                        required
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">កម្រិតសិក្សា *</label>
                      <select
                        value={editingMember.academicYearId}
                        onChange={(e) => setEditingMember({ ...editingMember, academicYearId: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                        required
                      >
                        {academicYears.map((y) => (
                          <option key={y.id} value={y.id}>
                            {y.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">លេខទូរស័ព្ទ</label>
                      <input
                        type="text"
                        placeholder="+855 ..."
                        value={editingMember.phone}
                        onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">អ៊ីមែលផ្លូវការ</label>
                      <input
                        type="email"
                        value={editingMember.email}
                        onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end space-x-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingMember(null);
                      }}
                    >
                      បោះបង់
                    </Button>
                    <Button type="submit" size="sm">
                      រក្សាទុកការកែប្រែ
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Member Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="max-w-lg w-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm">បញ្ចូលសមាជិកសិក្សាថ្មី (Add Member)</h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">អត្តលេខ STJ (Auto-Redeem ស្វ័យប្រវត្ត)</label>
                      <input
                        type="text"
                        readOnly
                        value={newMember.memberId || "ស្វ័យប្រវត្ត (Auto-Generated)"}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-muted/60 font-mono font-bold text-primary cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">អត្តលេខនិស្សិត ITC (Student ID) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e2025xxxx"
                        value={newMember.studentId}
                        onChange={(e) => setNewMember({ ...newMember, studentId: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">គោត្តនាម-នាម (ខ្មែរ) *</label>
                      <input
                        type="text"
                        required
                        placeholder="ជា វិសិដ្ឋ"
                        value={newMember.fullNameKh}
                        onChange={(e) => setNewMember({ ...newMember, fullNameKh: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">ឈ្មោះឡាតាំង *</label>
                      <input
                        type="text"
                        required
                        placeholder="Chea Viseth"
                        value={newMember.fullNameEn}
                        onChange={(e) => setNewMember({ ...newMember, fullNameEn: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">មុខវិជ្ជាទទួលខុសត្រូវ (Assigned Course) *</label>
                    <select
                      value={newMember.assignedCourse}
                      onChange={(e) => setNewMember({ ...newMember, assignedCourse: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background font-medium"
                      required
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.code}>
                          [{c.code}] {c.titleKh}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">ដេប៉ាតឺម៉ង់ *</label>
                      <select
                        value={newMember.departmentId}
                        onChange={(e) => setNewMember({ ...newMember, departmentId: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      >
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.code}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium mb-1">កម្រិតសិក្សា *</label>
                      <select
                        value={newMember.academicYearId}
                        onChange={(e) => setNewMember({ ...newMember, academicYearId: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      >
                        {academicYears.map((y) => (
                          <option key={y.id} value={y.id}>
                            {y.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium mb-1">លេខទូរស័ព្ទ</label>
                      <input
                        type="text"
                        placeholder="+855 ..."
                        value={newMember.phone}
                        onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">អ៊ីមែល</label>
                      <input
                        type="email"
                        placeholder="student@itc.edu.kh"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-input bg-background"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      បោះបង់
                    </Button>
                    <Button type="submit" size="sm">
                      រក្សាទុក
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
