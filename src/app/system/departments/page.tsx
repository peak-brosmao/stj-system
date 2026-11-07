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
import { Card, CardContent } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

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
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setSuccessMsg(
        editingDept
          ? `ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ ${formData.code} ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™`
          : `ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ ${formData.code} ážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž“áŸ’ážáŸ‚áž˜ážáŸ’áž˜áž¸ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™`
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
    if (!confirm(`ážáž¾áž›áŸ„áž€áž¢áŸ’áž“áž€áž–áž·ážáž‡áž¶áž…áž„áŸ‹áž›áž»áž” áž¬áž•áŸ’áž¢áž¶áž€ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ ${dept.code} (${dept.nameKh}) áž˜áŸ‚áž“áž‘áŸ?`)) return;
    try {
      const res = await fetch(`/api/system/departments?id=${dept.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      alert(data.message || "áž”áž¶áž“áž¢áž“áž»ážœážáŸ’ážáž‡áŸ„áž‚áž‡áŸáž™");
      loadDepartments();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting department");
    }
  };

  return (
    <PortalLayout portalType="system" userRole="STJ President" userName="áž•áž› ážŠáž¶ážœáž¸áž">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Building2 className="w-4 h-4" />
              <span>ITC Engineering Faculties & Departments Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              áž€áž¶ážšáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (ITC Departments)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              áž”áŸ’ážšáž’áž¶áž“ STJ áž¢áž¶áž…áž”áž“áŸ’ážáŸ‚áž˜ áž¬áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹áž‚áŸ’ážšáž”áŸ‹áž–áŸáž›ážœáŸáž›áž¶ ážŠáž¾áž˜áŸ’áž”áž¸ážŠáŸ†ážŽáž¾ážšáž€áž¶ážšáž‘áž¼áž‘áž¶áŸ†áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’ážœáŸáž”ážŸáž¶áž™
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
              áž‘áž¶áž‰áž¡áž¾áž„ážœáž·áž‰
            </Button>
            <Button size="sm" onClick={openCreateModal} className="space-x-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>áž”áž“áŸ’ážáŸ‚áž˜ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ážáŸ’áž˜áž¸</span>
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
                  <th className="py-3 px-4 font-semibold">áž€áž¼ážŠ (Code)</th>
                  <th className="py-3 px-4 font-semibold">ážˆáŸ’áž˜áŸ„áŸ‡áž‡áž¶áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš</th>
                  <th className="py-3 px-4 font-semibold">ážˆáŸ’áž˜áŸ„áŸ‡áž‡áž¶áž—áž¶ážŸáž¶áž¢áž„áŸ‹áž‚áŸ’áž›áŸážŸ / áž”áž¶ážšáž¶áŸ†áž„</th>
                  <th className="py-3 px-4 font-semibold text-center">ážŸáž˜áž¶áž‡áž·áž€áž€áŸ’áž“áž»áž„ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹</th>
                  <th className="py-3 px-4 font-semibold text-center">ážŸáŸ’ážáž¶áž“áž—áž¶áž–</th>
                  <th className="py-3 px-4 font-semibold text-right">ážŸáž€áž˜áŸ’áž˜áž—áž¶áž–</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      áž€áŸ†áž–áž»áž„áž‘áž¶áž‰áž™áž€áž‘áž·áž“áŸ’áž“áž“áŸáž™áž–áž¸ Backend API...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      áž–áž»áŸ†áž‘áž¶áž“áŸ‹áž˜áž¶áž“ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹áž€áŸ’áž“áž»áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’áž¡áž¾áž™áŸ”
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
                          <span>{d.membersCount} áž“áž¶áž€áŸ‹</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={d.isActive ? "success" : "secondary"} className="text-[10px]">
                          {d.isActive ? "ážŸáž€áž˜áŸ’áž˜ (Active)" : "áž•áŸ’áž¢áž¶áž€ (Inactive)"}
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
                            {d.isActive ? "áž•áŸ’áž¢áž¶áž€" : "áž”áž¾áž€"}
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
                  {editingDept ? `áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (${editingDept.code})` : "áž”áž“áŸ’ážáŸ‚áž˜ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ážáŸ’áž˜áž¸"}
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
                  <label className="block font-medium mb-1">áž€áž¼ážŠážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (Department Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="áž§. GIC, GIM, GEE..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">ážˆáŸ’áž˜áŸ„áŸ‡ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹áž‡áž¶áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš *</label>
                  <input
                    type="text"
                    required
                    placeholder="áž§. ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ áž–áŸážáŸŒáž˜áž¶áž“ážœáž·áž‘áŸ’áž™áž¶ áž“áž·áž„áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„"
                    value={formData.nameKh}
                    onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">ážˆáŸ’áž˜áŸ„áŸ‡áž‡áž¶áž—áž¶ážŸáž¶áž¢áž„áŸ‹áž‚áŸ’áž›áŸážŸ *</label>
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
                    <label className="block font-medium mb-1">ážˆáŸ’áž˜áŸ„áŸ‡áž‡áž¶áž—áž¶ážŸáž¶áž”áž¶ážšáž¶áŸ†áž„</label>
                    <input
                      type="text"
                      placeholder="e.g. GÃ©nie Informatique et Communication"
                      value={formData.nameFr}
                      onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">áž€áž¶ážšáž–áž·áž–ážŽáŸŒáž“áž¶áž”áž“áŸ’ážáŸ‚áž˜ (Description)</label>
                  <textarea
                    rows={2}
                    placeholder="áž–áŸážáŸŒáž˜áž¶áž“áž”áž“áŸ’ážáŸ‚áž˜áž¢áŸ†áž–áž¸ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹..."
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
                    áž”áŸ„áŸ‡áž”áž„áŸ‹
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "áž€áŸ†áž–áž»áž„ážšáž€áŸ’ážŸáž¶áž‘áž»áž€..." : editingDept ? "áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›" : "áž”áž„áŸ’áž€áž¾ážážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹"}
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
