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
} from "lucide-react";
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
  department: { id: string; code: string; nameKh: string };
  academicYear: { id: string; code: string; label: string };
}

export default function SystemMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [departments, setDepartments] = useState<Array<{ id: string; code: string }>>([]);
  const [academicYears, setAcademicYears] = useState<Array<{ id: string; code: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);

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
          notes: "",
        });
        loadMembers();
      }
    } catch {
      // ignore
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
    const headers = ["Member ID,Student ID,Full Name Kh,Full Name En,Department,Year,Status\n"];
    const rows = filteredMembers.map(
      (m) =>
        `"${m.memberId}","${m.studentId || ""}","${m.fullNameKh}","${m.fullNameEn}","${m.department.code}","${m.academicYear.code}","${m.status}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `STJ_Members_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullNameKh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fullNameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.studentId && m.studentId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = deptFilter === "ALL" || m.department.code === deptFilter;
    const matchesYear = yearFilter === "ALL" || m.academicYear.code === yearFilter;
    const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;
    return matchesSearch && matchesDept && matchesYear && matchesStatus;
  });

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ (President)" userName="ផល ដាវីត">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Users className="w-4 h-4" />
              <span>STJ Senior Volunteer Roster • វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងសមាជិករៀមច្បង (Member Management)
            </h1>
            <p className="text-xs text-muted-foreground">
              បញ្ជីសមាជិករៀមច្បងបង្រៀនស្ម័គ្រចិត្ត STJ ផ្លូវការ (សរុប ៣៩ នាក់ - សម្រាប់សមាជិក STJ តែប៉ុណ្ណោះ មិនសម្រាប់សិស្សប្អូនឡើយ)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="text-xs space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ទាញយក CSV</span>
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
          <div className="relative w-full md:w-80">
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
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs border border-input rounded-lg p-1.5 bg-background text-foreground"
            >
              <option value="ALL">ដេប៉ាតឺម៉ង់ទាំងអស់</option>
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
              <option value="ALL">កម្រិតសិក្សាទាំងអស់</option>
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
              <option value="ALL">ស្ថានភាពទាំងអស់</option>
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
                  <th className="py-3 px-4 font-semibold">ដេប៉ាតឺម៉ង់</th>
                  <th className="py-3 px-4 font-semibold">កម្រិត</th>
                  <th className="py-3 px-4 font-semibold">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{m.memberId}</td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{m.studentId || "-"}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{m.fullNameKh}</div>
                      <div className="text-[10px] text-muted-foreground">{m.fullNameEn}</div>
                    </td>
                    <td className="py-3 px-4 font-medium">{m.department.code}</td>
                    <td className="py-3 px-4 font-medium">{m.academicYear.code}</td>
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
                          className="h-7 text-[11px] px-2 text-primary hover:bg-primary/10"
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
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                      {loading ? "កំពុងទាញយកទិន្នន័យ..." : "ពុំមានសមាជិកត្រូវបង្ហាញឡើយ"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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

