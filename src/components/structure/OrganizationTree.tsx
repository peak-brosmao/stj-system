"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Award,
  BookOpen,
  ChevronDown,
  Search,
  Sparkles,
  Calendar,
  Lock,
  ArrowRight,
  GraduationCap,
  Layers,
  CheckCircle2,
  Mail,
  UserCheck,
  Building2,
  Phone,
  LayoutGrid,
  Network,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";

function buildInitialHierarchy(): HierarchyData {
  const david = OFFICIAL_STJ_ROSTER.find((m) => m.studentId === "e20221334") || OFFICIAL_STJ_ROSTER[1];
  const president = {
    nameKh: david.nameKh,
    nameEn: david.nameEn,
    roleKh: "ប្រធាន STJ កណ្តាល (STJ President)",
    roleEn: "Overall STJ President & Central Administrator",
    studentId: david.studentId,
    memberId: david.memberId,
    department: david.dept,
    generation: david.year,
    email: david.email,
    phone: david.phone,
    avatar: null,
    status: "ACTIVE",
    academicYear: "2026-2027",
  };

  const courseDefs = [
    { code: "PROG101", titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ និងក្បួនដោះស្រាយ (Programming)", titleEn: "Computer Programming & Algorithms", leaderStudentId: "e20240704" },
    { code: "MATH101", titleKh: "គណិតវិទ្យាវិស្វកម្ម (Mathematics)", titleEn: "Engineering Mathematics", leaderStudentId: "e20221423" },
    { code: "PHYS101", titleKh: "រូបវិទ្យាវិស្វកម្ម (Physics)", titleEn: "Engineering Physics", leaderStudentId: "e20240096" },
    { code: "CHEM101", titleKh: "គីមីវិទ្យាទូទៅ (Chemistry)", titleEn: "General Chemistry", leaderStudentId: "e20240046" },
  ];

  const courses = courseDefs.map((c) => {
    const leaderMember = OFFICIAL_STJ_ROSTER.find((m) => m.studentId === c.leaderStudentId) || OFFICIAL_STJ_ROSTER[0];
    const members = OFFICIAL_STJ_ROSTER.filter((m) => m.assignedCourse === c.code);

    return {
      id: `course-${c.code.toLowerCase()}`,
      code: c.code,
      nameKh: c.titleKh,
      nameEn: c.titleEn,
      leader: {
        nameKh: leaderMember.nameKh,
        nameEn: leaderMember.nameEn,
        roleKh: `ប្រធានក្រុម ${c.titleKh} (Leader)`,
        roleEn: `${c.titleEn} Team Leader`,
        studentId: leaderMember.studentId,
        department: leaderMember.dept,
        email: leaderMember.email,
        avatar: null,
      },
      memberCount: members.length,
      members: members.map((m) => ({
        id: `member-${m.memberId.toLowerCase()}`,
        memberId: m.memberId,
        studentId: m.studentId,
        nameKh: m.nameKh,
        nameEn: m.nameEn,
        gender: m.gender,
        department: m.dept,
        generation: m.year,
        email: m.email,
        phone: m.phone,
        avatar: null,
        roleKh: "សមាជិកបង្រៀន (Senior Tutor)",
      })),
    };
  });

  return {
    president,
    courses,
    totalTutors: courses.reduce((acc, c) => acc + c.memberCount, 0),
    totalCourses: courses.length,
  };
}

interface MemberItem {
  id: string;
  memberId: string;
  studentId: string;
  nameKh: string;
  nameEn: string;
  gender: string | null;
  department: string;
  generation: string;
  email: string | null;
  phone: string | null;
  avatar: string | null;
  roleKh: string;
}

interface CourseNode {
  id: string;
  code: string;
  nameKh: string;
  nameEn: string;
  leader: {
    nameKh: string;
    nameEn: string;
    roleKh: string;
    roleEn: string;
    studentId: string;
    department: string;
    email: string;
    avatar: string | null;
  };
  memberCount: number;
  members: MemberItem[];
}

interface HierarchyData {
  president: {
    nameKh: string;
    nameEn: string;
    roleKh: string;
    roleEn: string;
    studentId: string;
    memberId: string;
    department: string;
    generation: string;
    email: string;
    phone: string;
    avatar: string | null;
    status: string;
    academicYear: string;
  };
  courses: CourseNode[];
  totalTutors: number;
  totalCourses: number;
}

interface YearOption {
  academicYear: string;
  themeKh: string;
  presidentName: string;
  status: string;
  isCurrent: boolean;
  isLocked: boolean;
}

export function OrganizationTree() {
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("2026-2027");
  const [availableYears, setAvailableYears] = useState<YearOption[]>([
    {
      academicYear: "2026-2027",
      themeKh: "អាណត្តិ STJ 2026-2027",
      presidentName: "ផល ដាវីត",
      status: "ACTIVE",
      isCurrent: true,
      isLocked: false,
    },
  ]);
  const [hierarchy, setHierarchy] = useState<HierarchyData>(buildInitialHierarchy);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCourseFilter, setActiveCourseFilter] = useState<string>("ALL");
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({
    PROG101: true,
    MATH101: true,
    PHYS101: true,
    CHEM101: true,
  });
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");

  const fetchHierarchy = async (year?: string) => {
    if (year) setLoading(true);
    try {
      const url = year ? `/api/organization/hierarchy?year=${year}` : `/api/organization/hierarchy`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.hierarchy) {
        setHierarchy(data.hierarchy);
        setSelectedYear(data.selectedYear);
        if (data.availableYears && data.availableYears.length > 0) {
          setAvailableYears(data.availableYears);
        }
      }
    } catch (err) {
      console.error("Failed to load hierarchy:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHierarchy();
  }, []);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    fetchHierarchy(year);
  };

  const toggleCourse = (code: string) => {
    setExpandedCourses((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  // Filter members based on search
  const filteredCourses = hierarchy?.courses.map((course) => {
    if (!searchQuery.trim()) return course;
    const q = searchQuery.toLowerCase();
    const matchesLeader =
      course.leader.nameKh.toLowerCase().includes(q) ||
      course.leader.nameEn.toLowerCase().includes(q) ||
      course.leader.studentId.toLowerCase().includes(q);

    const matchedMembers = course.members.filter(
      (m) =>
        m.nameKh.toLowerCase().includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.studentId.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q)
    );

    return {
      ...course,
      members: matchesLeader ? course.members : matchedMembers,
      isLeaderMatch: matchesLeader,
    };
  });

  // Flat list for Grid View
  const allGridMembers = React.useMemo(() => {
    if (!hierarchy) return [];
    let list: Array<MemberItem & { courseCode: string; courseName: string }> = [];
    hierarchy.courses.forEach((c) => {
      c.members.forEach((m) => {
        list.push({
          ...m,
          courseCode: c.code,
          courseName: c.nameKh,
        });
      });
    });

    if (activeCourseFilter !== "ALL") {
      list = list.filter((item) => item.courseCode === activeCourseFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.nameKh.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          item.studentId.toLowerCase().includes(q) ||
          item.memberId.toLowerCase().includes(q) ||
          item.department.toLowerCase().includes(q) ||
          item.courseCode.toLowerCase().includes(q)
      );
    }

    return list;
  }, [hierarchy, activeCourseFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* TOP CONTROLS BAR: YEAR SELECTOR, SEARCH & VIEW MODE */}
      <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Year Switcher (Mandate Selector) */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
                អាណត្តិសិក្សា (Academic Mandate)
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="relative inline-block">
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="appearance-none bg-background border border-primary/40 text-foreground font-bold text-sm rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm hover:border-primary transition-colors"
                  >
                    {availableYears.map((y) => (
                      <option key={y.academicYear} value={y.academicYear}>
                        ឆ្នាំសិក្សា {y.academicYear} {y.isCurrent ? "★ (សកម្មបច្ចុប្បន្ន)" : "(បណ្ណសារចាស់)"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {selectedYear === "2026-2027" ? "អាណត្តិបច្ចុប្បន្ន (Active)" : "ទិន្នន័យអតីតកាល (Archived)"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ស្វែងរកឈ្មោះ, អត្តលេខ, ដេប៉ាតឺម៉ង់..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
              />
            </div>

            {/* View Mode Toggle: Tree vs Grid */}
            <div className="inline-flex rounded-xl border border-border p-1 bg-muted/60 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "tree"
                    ? "bg-card text-foreground shadow-sm font-bold text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>មែកធាង (Tree)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-sm font-bold text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>កាត (Grid)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick summary stats */}
        {hierarchy && (
          <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>
                ប្រធាន STJ: <strong className="text-foreground">{hierarchy.president.nameKh}</strong>
              </span>
              <span>•</span>
              <span>
                មុខវិជ្ជាស្នូល: <strong className="text-foreground">{hierarchy.totalCourses} មុខវិជ្ជា</strong>
              </span>
              <span>•</span>
              <span>
                សមាជិករៀមច្បង: <strong className="text-foreground">{hierarchy.totalTutors} នាក់</strong>
              </span>
            </div>
            <div className="text-[11px] text-primary font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>រាល់ទិន្នន័យត្រូវបានចាក់សោតាមឆ្នាំនីមួយៗការពារការកែប្រែឆ្លងអាណត្តិ</span>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">កំពុងទាញយករចនាសម្ព័ន្ធមែកធាង STJ...</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 1: ORGANIZATIONAL TREE (មែកធាង) */}
      {/* ========================================================================= */}
      {!loading && hierarchy && viewMode === "tree" && (
        <div className="space-y-12">
          {/* LEVEL 1: APEX NODE — STJ PRESIDENT */}
          <div className="flex flex-col items-center">
            <div className="relative group max-w-md w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-indigo-500 to-primary rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500" />

              <div className="relative bg-card border-2 border-primary/40 rounded-2xl p-6 shadow-xl text-center space-y-4">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>ថ្នាក់ដឹកនាំកំពូល (Apex Leadership)</span>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent p-1 ring-4 ring-primary/30 shadow-md">
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center font-bold text-2xl text-primary overflow-hidden">
                      {hierarchy.president.avatar ? (
                        <Image
                          src={hierarchy.president.avatar}
                          alt={hierarchy.president.nameKh}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        hierarchy.president.nameKh.charAt(0)
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {hierarchy.president.nameKh}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {hierarchy.president.nameEn}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1 text-xs">
                  <div className="font-semibold text-primary">
                    {hierarchy.president.roleKh}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {hierarchy.president.studentId} • {hierarchy.president.memberId} • ដេប៉ាតឺម៉ង់ {hierarchy.president.department} ({hierarchy.president.generation})
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{hierarchy.president.email}</span>
                </div>
              </div>
            </div>

            {/* Connecting Vertical Stem down from President */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-primary via-primary/60 to-primary/30" />
            <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
            <div className="w-0.5 h-6 bg-border" />
          </div>

          {/* LEVEL 2 & 3: COURSE LEADERS & MEMBERS (HIERARCHY TREE BUS) */}
          <div className="relative">
            {/* Horizontal Bus Line connecting all 4 courses on desktop */}
            <div className="hidden lg:block absolute top-0 left-[12%] right-[12%] h-0.5 bg-border -translate-y-px" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses?.map((course) => {
                const isExpanded = expandedCourses[course.code] ?? true;

                return (
                  <div key={course.code} className="flex flex-col items-center space-y-4">
                    {/* Vertical Connector from bus down to Course Leader */}
                    <div className="hidden lg:block w-0.5 h-6 bg-border" />

                    {/* COURSE LEADER CARD */}
                    <div className="w-full bg-card border-2 border-border hover:border-primary/50 transition-all rounded-2xl p-5 shadow-sm space-y-4">
                      {/* Course badge */}
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {course.code}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {course.memberCount} សមាជិក
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-foreground leading-tight">
                          {course.nameKh}
                        </h4>
                        <p className="text-[11px] text-muted-foreground">
                          {course.nameEn}
                        </p>
                      </div>

                      {/* Course Leader Profile */}
                      <div className="pt-3 border-t border-border flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-primary/20">
                          {course.leader.nameKh.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                            ប្រធានក្រុម (Course Leader)
                          </div>
                          <div className="font-bold text-xs text-foreground truncate">
                            {course.leader.nameKh}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {course.leader.studentId} • {course.leader.department}
                          </div>
                        </div>
                      </div>

                      {/* Toggle Members Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCourse(course.code)}
                        className="w-full text-xs justify-between h-8 mt-2"
                      >
                        <span>
                          {isExpanded ? "បិទបញ្ជីសមាជិក" : "បើកមើលសមាជិក"} ({course.members.length})
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Connecting Stem to Members */}
                    {isExpanded && course.members.length > 0 && (
                      <div className="w-0.5 h-4 bg-border" />
                    )}

                    {/* MEMBERS BRANCH */}
                    {isExpanded && (
                      <div className="w-full space-y-2.5">
                        {course.members.map((member) => (
                          <div
                            key={member.id}
                            className="p-3 rounded-xl border border-border bg-card/80 hover:border-primary/40 hover:bg-card transition-all text-xs space-y-1.5 shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {member.nameKh}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-medium">
                                {member.memberId}
                              </span>
                            </div>

                            <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                              <span>{member.nameEn}</span>
                              <span className="font-mono text-foreground font-medium">
                                {member.studentId}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                              <span className="px-1.5 py-0.5 rounded bg-muted/60 font-semibold text-foreground">
                                {member.department}
                              </span>
                              <span>{member.roleKh}</span>
                            </div>
                          </div>
                        ))}

                        {course.members.length === 0 && (
                          <div className="p-4 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                            មិនមានសមាជិកត្រូវនឹងពាក្យស្វែងរក
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: INTERACTIVE GRID VIEW (កាត GRID) */}
      {/* ========================================================================= */}
      {!loading && hierarchy && viewMode === "grid" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Filter Pills for Courses */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCourseFilter("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCourseFilter === "ALL"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              សមាជិកទាំងអស់ ({hierarchy.totalTutors})
            </button>
            {hierarchy.courses.map((c) => (
              <button
                key={c.code}
                onClick={() => setActiveCourseFilter(c.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCourseFilter === c.code
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {c.code} • {c.nameKh} ({c.members.length})
              </button>
            ))}
          </div>

          {/* Leaders Showcase Bar */}
          {activeCourseFilter === "ALL" && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                គណៈដឹកនាំកម្មវិធី STJ (Executive & Course Leaders)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* President */}
                <div className="bg-gradient-to-br from-primary/10 via-card to-card border-2 border-primary/40 rounded-2xl p-4 shadow-sm space-y-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-primary-foreground">
                    ប្រធាន STJ កណ្តាល
                  </span>
                  <div className="font-bold text-sm text-foreground">{hierarchy.president.nameKh}</div>
                  <div className="text-[11px] text-muted-foreground">{hierarchy.president.nameEn}</div>
                  <div className="text-[11px] font-mono text-primary">{hierarchy.president.studentId} • {hierarchy.president.department}</div>
                </div>

                {/* Course Leaders */}
                {hierarchy.courses.map((c) => (
                  <div key={c.code} className="bg-card border border-border hover:border-primary/40 rounded-2xl p-4 shadow-sm space-y-2 transition-all">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      Leader {c.code}
                    </span>
                    <div className="font-bold text-sm text-foreground truncate">{c.leader.nameKh}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{c.leader.nameEn}</div>
                    <div className="text-[11px] font-mono text-muted-foreground">{c.leader.studentId} • {c.leader.department}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                បញ្ជីសមាជិករៀមច្បងបង្រៀន ({allGridMembers.length} នាក់)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allGridMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl p-4 border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {member.nameKh.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground leading-snug">
                          {member.nameKh}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {member.nameEn}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">អត្តលេខ STJ</span>
                      <span className="font-mono font-semibold text-foreground">{member.memberId}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">អត្តលេខនិស្សិត</span>
                      <span className="font-mono font-medium text-foreground">{member.studentId}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-semibold text-[10px]">
                      {member.department} ({member.generation})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px]">
                      {member.courseCode}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {allGridMembers.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-border rounded-2xl space-y-2">
                <p className="text-sm font-semibold text-foreground">មិនមានសមាជិកត្រូវនឹងពាក្យស្វែងរកឡើយ</p>
                <p className="text-xs text-muted-foreground">សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬជ្រើសរើសមុខវិជ្ជាផ្សេង។</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
