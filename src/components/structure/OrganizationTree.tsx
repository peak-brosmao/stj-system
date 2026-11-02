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
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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
  isCurrentUser: boolean;
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
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("2026-2027");
  const [availableYears, setAvailableYears] = useState<YearOption[]>([]);
  const [hierarchy, setHierarchy] = useState<HierarchyData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({
    PROG101: true,
    MATH101: true,
    PHYS101: true,
    CHEM101: true,
  });
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");

  const fetchHierarchy = async (year?: string) => {
    setLoading(true);
    try {
      const url = year ? `/api/organization/hierarchy?year=${year}` : `/api/organization/hierarchy`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setHierarchy(data.hierarchy);
        setSelectedYear(data.selectedYear);
        setAvailableYears(data.availableYears || []);
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

  return (
    <div className="space-y-8">
      {/* TOP CONTROLS BAR: YEAR SELECTOR & SEARCH */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Year Switcher (Mandate Selector) */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">
                ជ្រើសរើសឆ្នាំសិក្សា / អាណត្តិដឹកនាំ (Academic Mandate)
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="relative inline-block">
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="appearance-none bg-background border border-primary/30 text-foreground font-semibold text-sm rounded-xl px-3.5 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm"
                  >
                    {availableYears.map((y) => (
                      <option key={y.academicYear} value={y.academicYear}>
                        ឆ្នាំសិក្សា {y.academicYear} {y.isCurrent ? "★ (សកម្មបច្ចុប្បន្ន)" : "(បណ្ណសារចាស់)"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {selectedYear === "2026-2027" ? "អាណត្តិបច្ចុប្បន្ន (Active)" : "ទិន្នន័យអតីតកាល (Archived)"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center space-x-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ស្វែងរកតាមឈ្មោះ, អត្តលេខ, ដេប៉ាតឺម៉ង់..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="inline-flex rounded-xl border border-border p-0.5 bg-muted/40">
              <button
                onClick={() => setViewMode("tree")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "tree"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                មែកធាង (Tree)
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                កាត (Grid)
              </button>
            </div>
          </div>
        </div>

        {/* Quick summary stats */}
        {hierarchy && (
          <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
            <div className="flex items-center space-x-4">
              <span>
                ប្រធានដឹកនាំ: <strong className="text-foreground">{hierarchy.president.nameKh}</strong>
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
            <div className="text-[11px] text-primary font-medium">
              * ចាប់ពីឆ្នាំនេះទៅ រាល់ទិន្នន័យប្រធាន និងសមាជិកត្រូវបានចាក់សោតាមឆ្នាំនីមួយៗដោយស្វ័យប្រវត្តិ
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">កំពុងទាញយករចនាសម្ព័ន្ធមែកធាង STJ...</p>
        </div>
      )}

      {!loading && hierarchy && (
        <div className="space-y-12">
          {/* LEVEL 1: APEX NODE — STJ PRESIDENT */}
          <div className="flex flex-col items-center">
            <div className="relative group max-w-md w-full">
              {/* Glow effect */}
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
            <div className="w-0.5 h-12 bg-gradient-to-b from-primary via-primary/60 to-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
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
                            className={`p-3 rounded-xl border transition-all text-xs space-y-1.5 ${
                              member.isCurrentUser
                                ? "bg-primary/10 border-primary ring-2 ring-primary/30 shadow-sm"
                                : "bg-card/70 border-border hover:border-primary/40 hover:bg-card"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground flex items-center space-x-1.5">
                                <span>{member.nameKh}</span>
                                {member.isCurrentUser && (
                                  <span className="px-1.5 py-0.2 rounded bg-primary text-primary-foreground text-[9px] font-bold">
                                    ខ្ញុំ (You)
                                  </span>
                                )}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
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
    </div>
  );
}
