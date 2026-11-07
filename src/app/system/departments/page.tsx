"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface DepartmentItem {
  id: string;
  code: string;
  nameKh: string;
  nameEn: string;
  nameFr: string;
  description?: string | null;
  isActive: boolean;
  membersCount: number;
}

export default function SystemDepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    nameKh: "",
    nameEn: "",
    nameFr: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadDepartments = () => {
    setLoading(true);
    fetch("/api/system/departments")
      .then((res) => res.json())
      .then((data) => {
        if (data.departments) setDepartments(data.departments);
      })
      .catch((err) => console.error("Error loading departments:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({ code: "", nameKh: "", nameEn: "", nameFr: "", description: "" });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: DepartmentItem) => {
    setEditingDept(dept);
    setFormData({
      code: dept.code,
      nameKh: dept.nameKh,
      nameEn: dept.nameEn,
      nameFr: dept.nameFr || "",
      description: dept.description || "",
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const url = "/api/system/departments";
      const method = editingDept ? "PUT" : "POST";
      const payload = editingDept ? { id: editingDept.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ការរក្សាទុកមិនជោគជ័យ");

      setSuccessMsg(
        editingDept
          ? `ដេប៉ាតឺម៉ង់ ${formData.code} ត្រូវបានកែសម្រួលដោយជោគជ័យ`
          : `ដេប៉ាតឺម៉ង់ ${formData.code} ត្រូវបានបន្ថែមថ្មីដោយជោគជ័យ`
      );
      setIsModalOpen(false);
      loadDepartments();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error saving department");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (dept: DepartmentItem) => {
    try {
      const res = await fetch("/api/system/departments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: dept.id, isActive: !dept.isActive }),
      });
      if (res.ok) {
        loadDepartments();
      }
    } catch {}
  };

  const handleDelete = async (dept: DepartmentItem) => {
    if (!confirm(`តើលោកអ្នកពិតជាចង់លុប ឬផ្អាកដេប៉ាតឺម៉ង់ ${dept.code} (${dept.nameKh}) មែនទេ?`)) return;
    try {
      const res = await fetch(`/api/system/departments?id=${dept.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      alert(data.message || "បានអនុវត្តជោគជ័យ");
      loadDepartments();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting department");
    }
  };

  return (
    <PortalLayout portalType="system" userRole="STJ President" userName="ផល ដាវីត">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Building2 className="w-4 h-4" />
              <span>ITC Engineering Faculties & Departments Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងដេប៉ាតឺម៉ង់ (ITC Departments)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ប្រធាន STJ អាចបន្ថែម ឬកែសម្រួលដេប៉ាតឺម៉ង់គ្រប់ពេលវេលា ដើម្បីដំណើរការទូទាំងប្រព័ន្ធវេបសាយ
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadDepartments}
              disabled={loading}
              className="text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              ទាញឡើងវិញ
            </Button>
            <Button size="sm" onClick={openCreateModal} className="space-x-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>បន្ថែមដេប៉ាតឺម៉ង់ថ្មី</span>
            </Button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Departments Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">កូដ (Code)</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះជាភាសាខ្មែរ</th>
                  <th className="py-3 px-4 font-semibold">ឈ្មោះជាភាសាអង់គ្លេស / បារាំង</th>
                  <th className="py-3 px-4 font-semibold text-center">សមាជិកក្នុងដេប៉ាតឺម៉ង់</th>
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      កំពុងទាញយកទិន្នន័យពី Backend API...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      ពុំទាន់មានដេប៉ាតឺម៉ង់ក្នុងប្រព័ន្ធឡើយ។
                    </td>
                  </tr>
                ) : (
                  departments.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary text-sm">{d.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{d.nameKh}</div>
                        {d.description && (
                          <div className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                            {d.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-foreground">{d.nameEn}</div>
                        <div className="text-[10px] text-muted-foreground italic">{d.nameFr}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="outline" className="font-mono text-[11px] space-x-1">
                          <Users className="w-3 h-3 text-muted-foreground inline" />
                          <span>{d.membersCount} នាក់</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={d.isActive ? "success" : "secondary"} className="text-[10px]">
                          {d.isActive ? "សកម្ម (Active)" : "ផ្អាក (Inactive)"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(d)}
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            title="Edit Department"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(d)}
                            className="h-7 text-[10px] text-muted-foreground hover:text-foreground"
                            title={d.isActive ? "Deactivate" : "Activate"}
                          >
                            {d.isActive ? "ផ្អាក" : "បើក"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(d)}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            title="Delete Department"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
            <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-bold text-base text-foreground">
                  {editingDept ? `កែសម្រួលដេប៉ាតឺម៉ង់ (${editingDept.code})` : "បន្ថែមដេប៉ាតឺម៉ង់ថ្មី"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-medium mb-1">កូដដេប៉ាតឺម៉ង់ (Department Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. GIC, GIM, GEE..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">ឈ្មោះដេប៉ាតឺម៉ង់ជាភាសាខ្មែរ *</label>
                  <input
                    type="text"
                    required
                    placeholder="ឧ. ដេប៉ាតឺម៉ង់ ព័ត៌មានវិទ្យា និងទំនាក់ទំនង"
                    value={formData.nameKh}
                    onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">ឈ្មោះជាភាសាអង់គ្លេស *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Information and Communication Engineering"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">ឈ្មោះជាភាសាបារាំង</label>
                    <input
                      type="text"
                      placeholder="e.g. Génie Informatique et Communication"
                      value={formData.nameFr}
                      onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">ការពិពណ៌នាបន្ថែម (Description)</label>
                  <textarea
                    rows={2}
                    placeholder="ព័ត៌មានបន្ថែមអំពីដេប៉ាតឺម៉ង់..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    បោះបង់
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "កំពុងរក្សាទុក..." : editingDept ? "កែសម្រួល" : "បង្កើតដេប៉ាតឺម៉ង់"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}