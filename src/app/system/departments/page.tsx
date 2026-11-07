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
      if (!res.ok) throw new Error(data.error || "Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢");

      setSuccessMsg(
        editingDept
          ? `Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ ${formData.code} Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢`
          : `Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ ${formData.code} Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾ËœÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢`
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
    if (!confirm(`Ã¡Å¾ÂÃ¡Å¾Â¾Ã¡Å¾â€ºÃ¡Å¸â€žÃ¡Å¾â‚¬Ã¡Å¾Â¢Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€ºÃ¡Å¾Â»Ã¡Å¾â€ Ã¡Å¾Â¬Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ ${dept.code} (${dept.nameKh}) Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¸Â?`)) return;
    try {
      const res = await fetch(`/api/system/departments?id=${dept.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      alert(data.message || "Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Â¢Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾â€¡Ã¡Å¸â€žÃ¡Å¾â€šÃ¡Å¾â€¡Ã¡Å¸ÂÃ¡Å¾â„¢");
      loadDepartments();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error deleting department");
    }
  };

  return (
    <PortalLayout portalType="system" userRole="STJ President" userName="Ã¡Å¾â€¢Ã¡Å¾â€º Ã¡Å¾Å Ã¡Å¾Â¶Ã¡Å¾Å“Ã¡Å¾Â¸Ã¡Å¾Â">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Building2 className="w-4 h-4" />
              <span>ITC Engineering Faculties & Departments Registry</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ (ITC Departments)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾Ëœ Ã¡Å¾Â¬Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾Å“Ã¡Å¸ÂÃ¡Å¾â€ºÃ¡Å¾Â¶ Ã¡Å¾Å Ã¡Å¾Â¾Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¸Ã¡Å¾Å Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾Â¾Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾Å“Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â„¢
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
              Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â€žÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€°
            </Button>
            <Button size="sm" onClick={openCreateModal} className="space-x-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾ËœÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸</span>
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
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å  (Code)</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡</th>
                  <th className="py-3 px-4 font-semibold">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Â¢Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾Å¸ / Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹</th>
                  <th className="py-3 px-4 font-semibold text-center">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“</th>
                  <th className="py-3 px-4 font-semibold text-right">Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€“Ã¡Å¾Â¸ Backend API...
                    </td>
                  </tr>
                ) : departments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢Ã¡Å¸â€
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
                          <span>{d.membersCount} Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹</span>
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={d.isActive ? "success" : "secondary"} className="text-[10px]">
                          {d.isActive ? "Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ (Active)" : "Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â‚¬ (Inactive)"}
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
                            {d.isActive ? "Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â‚¬" : "Ã¡Å¾â€Ã¡Å¾Â¾Ã¡Å¾â‚¬"}
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
                  {editingDept ? `Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ (${editingDept.code})` : "Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾ËœÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸"}
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
                  <label className="block font-medium mb-1">Ã¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ (Department Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ã¡Å¾Â§. GIC, GIM, GEE..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡ *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ã¡Å¾Â§. Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾â€ž"
                    value={formData.nameKh}
                    onChange={(e) => setFormData({ ...formData, nameKh: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾Â¢Ã¡Å¾â€žÃ¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾Å¸ *</label>
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
                    <label className="block font-medium mb-1">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â€ž</label>
                    <input
                      type="text"
                      placeholder="e.g. GÃƒÂ©nie Informatique et Communication"
                      value={formData.nameFr}
                      onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¾Â·Ã¡Å¾â€“Ã¡Å¾Å½Ã¡Å¸Å’Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾Ëœ (Description)</label>
                  <textarea
                    rows={2}
                    placeholder="Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸â€šÃ¡Å¾ËœÃ¡Å¾Â¢Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹..."
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
                    Ã¡Å¾â€Ã¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€¹
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â»Ã¡Å¾â‚¬..." : editingDept ? "Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€º" : "Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾â‚¬Ã¡Å¾Â¾Ã¡Å¾ÂÃ¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹"}
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
