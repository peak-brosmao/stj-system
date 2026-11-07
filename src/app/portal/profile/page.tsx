"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Send,
  MapPin,
  GraduationCap,
  Calendar,
  Shield,
  Edit2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Building2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/portal/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.profile) {
          setProfile(data.profile);
          setCompleteness(data.completeness || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PortalLayout portalType="portal">
        <div className="min-h-[500px] flex flex-col items-center justify-center space-y-3">
          <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse">Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€°Ã¡Å¾â„¢Ã¡Å¾â‚¬Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸...</p>
        </div>
      </PortalLayout>
    );
  }

  const nameKh = profile?.fullNameKh || "";
  const nameEn = profile?.fullNameEn || "";
  const displayName = profile?.displayName || "-";
  const isMember = !!profile?.member;
  const memberId = profile?.member?.memberId || "-";
  const studentId = profile?.member?.studentId || profile?.studentId || "-";
  const department = profile?.member?.department?.nameKh || (isMember ? "-" : "Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™ (Administration)");
  const deptCode = profile?.member?.department?.code || (isMember ? "-" : "STJ Admin");
  const year = profile?.member?.academicYear?.label || (isMember ? "-" : "-");
  const phone = profile?.phone || "-";
  const email = profile?.email || "";
  const telegram = profile?.telegram || "-";
  const address = profile?.address || "-";
  const bio = profile?.bio || "Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¡Ã¡Å¾Â¸Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸ÂÃ¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€¦Ã¡Å¾Â¡Ã¡Å¾Â¾Ã¡Å¾â„¢ (No biography added yet)";
  const gender = profile?.gender === "M" ? "Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Å¸ (Male)" : profile?.gender === "F" ? "Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¸ (Female)" : "-";
  const isPresident = profile?.userRoles?.some((r: any) => r.role?.name === "SUPER_ADMIN" || r.role?.name === "STJ_PRESIDENT") || memberId === "STJ002";
  const userRole = isPresident
    ? "Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œ STJ"
    : profile?.userRoles?.some((r: any) => r.role?.name === "COURSE_LEADER")
    ? "Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€™Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â»Ã¡Å¾Ëœ"
    : (isMember ? "Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ STJ" : "Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€ž");

  const enrolledCourses = profile?.member?.enrollments?.map((e: any) => `${e.course?.code} - ${e.course?.titleKh}`).join(", ");

  return (
    <PortalLayout
      portalType={profile?.userRoles?.some((r: any) => r.role?.name === "SUPER_ADMIN" || r.role?.name === "STJ_ADMIN") ? "system" : "portal"}
      userRole={userRole}
      userName={nameKh}
      userMemberId={isMember ? memberId : undefined}
      userEmail={email}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Profile Header Hero Card */}
        <Card className="overflow-hidden border-border">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5" />
          <CardContent className="relative px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-12">
              <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-card border-4 border-card shadow-md overflow-hidden flex items-center justify-center text-primary font-bold text-3xl">
                  {profile?.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={nameEn || "Avatar"}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover object-center"
                      unoptimized={profile.profileImage.startsWith("https://api.itcstudent.space")}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold">
                      {nameEn ? nameEn.charAt(0) : "U"}
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">{nameKh}</h1>
                    {nameEn && <span className="text-sm font-semibold text-muted-foreground font-sans">({nameEn})</span>}
                    <Badge variant={profile?.status === "ACTIVE" ? "success" : "info"}>
                      {profile?.status === "ACTIVE" ? "Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ (Active)" : profile?.status || "Active"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€¦: <strong className="text-foreground">{displayName}</strong>
                    {isMember && (
                      <>
                        {" "}Ã¢â‚¬Â¢ Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¶Ã¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â: <strong className="text-foreground font-mono">{studentId}</strong>
                      </>
                    )}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    {isMember ? (
                      <>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                          STJ Member: {memberId}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹: {deptCode} ({year})
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                        {userRole}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Link href="/portal/profile/edit">
                  <Button size="sm" className="space-x-1.5 text-xs">
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ</span>
                  </Button>
                </Link>
                <Link href="/portal/security">
                  <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completeness Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾â€œÃ¡Å¸Æ’Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œ (Profile Completeness): {completeness}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â½Ã¡Å¾â€œÃ¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°Ã¡Å¾Å Ã¡Å¸â€žÃ¡Å¾â„¢Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å“Ã¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¸â€ Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¸â€
              </p>
            </div>
            <div className="w-full sm:w-48 bg-muted rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section Grid: Personal & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section A: Personal Information */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <User className="w-4 h-4 text-primary" />
                <span>Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â½Ã¡Å¾â€œ (Personal Information)</span>
              </CardTitle>
              <Link href="/portal/profile/edit" className="text-xs text-primary hover:underline flex items-center space-x-1">
                <Edit2 className="w-3 h-3" />
                <span>Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€š</span>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
                <div>
                  <span className="text-muted-foreground text-[11px]">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€° (Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡):</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{nameKh || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">FullName (English):</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{nameEn || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
                <div>
                  <span className="text-muted-foreground text-[11px]">Ã¡Å¾Ë†Ã¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€žÃ¡Å¸â€¡Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€° (Preferred Name):</span>
                  <p className="font-medium text-foreground mt-0.5">{displayName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Ã¡Å¾â€”Ã¡Å¸ÂÃ¡Å¾â€˜ (Gender):</span>
                  <p className="font-medium text-foreground mt-0.5">{gender}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">Ã¡Å¾â€¡Ã¡Å¾Â¸Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¸ÂÃ¡Å¾â€ (Personal Biography):</span>
                <p className="text-muted-foreground leading-relaxed mt-1 p-2.5 rounded-lg bg-muted/40 text-[11px]">
                  {bio}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section B: Contact Information */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¸â€ Ã¡Å¾â€œÃ¡Å¾â€ž (Contact Information)</span>
              </CardTitle>
              <Link href="/portal/profile/edit" className="text-xs text-primary hover:underline flex items-center space-x-1">
                <Edit2 className="w-3 h-3" />
                <span>Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€š</span>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-[11px] text-muted-foreground">Ã¡Å¾Â¢Ã¡Å¸Å Ã¡Å¾Â¸Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾â€ºÃ¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€Ã¡Å¸ÂÃ¡Å¾â€œ (Institutional Email):</span>
                    <p className="font-medium text-foreground">{email || "-"}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Å¡Ã¡Å¾Â½Ã¡Å¾â€¦</Badge>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-[11px] text-muted-foreground">Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â€˜Ã¡Å¾Â¼Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸ÂÃ¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾â€˜ (Phone Number):</span>
                    <p className="font-medium text-foreground font-mono">{phone}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾â€¦Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾â€˜Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¾Â¶Ã¡Å¾â€œ</span>
              </div>
              <div className="flex items-center space-x-2.5 pb-2.5 border-b border-border">
                <Send className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-[11px] text-muted-foreground">Telegram Username:</span>
                  <p className="font-medium text-primary font-mono">{telegram}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-muted-foreground">Ã¡Å¾Â¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾â„¢Ã¡Å¾Å Ã¡Å¸â€™Ã¡Å¾â€¹Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€Ã¡Å¸â€™Ã¡Å¾â€Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œ (Current Address):</span>
                  <p className="font-medium text-foreground mt-0.5">{address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section C: Official Academic Information (Read-only with Correction Desk) */}
        {isMember ? (
          <Card className="border-border">
            <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡ (Official Academic Records)</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¶Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¾Å¸Ã¡Å¸â€¹Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€Ã¡Å¾â€¦Ã¡Å¸â€™Ã¡Å¾â€¦Ã¡Å¸ÂÃ¡Å¾â‚¬Ã¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€˜Ã¡Å¸â€™Ã¡Å¾â„¢Ã¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾â€“Ã¡Å¾Â»Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€šÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ËœÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¸â€  Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â„¢Ã¡Å¾â€ºÃ¡Å¸â€¹Ã¡Å¾â€“Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾ËœÃ¡Å¾â€“Ã¡Å¾Â¸Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¸Ë†Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€ž STJÃ¡Å¸â€
                </p>
              </div>
              <Link href="/portal/profile/edit#correction-request">
                <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¾Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¸â€ Ã¡Å¾â‚¬Ã¡Å¸â€šÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€šÃ¡Å¾â€˜Ã¡Å¾Â·Ã¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾â€œÃ¡Å¸ÂÃ¡Å¾â„¢Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€ºÃ¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground">Ã¡Å¾â€ºÃ¡Å¸ÂÃ¡Å¾ÂÃ¡Å¾â‚¬Ã¡Å¾Â¼Ã¡Å¾Å Ã¡Å¾Å¸Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€¡Ã¡Å¾Â·Ã¡Å¾â‚¬ STJ:</span>
                  <p className="font-bold text-primary font-mono text-sm mt-0.5">{memberId}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Ã¡Å¾Â¢Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾â€°Ã¡Å¸â€™Ã¡Å¾â€°Ã¡Å¾Â¶Ã¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾Â:</span>
                  <p className="font-bold text-foreground font-mono text-sm mt-0.5">{studentId}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Ã¡Å¾Å Ã¡Å¸ÂÃ¡Å¾â€Ã¡Å¸â€°Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¾ÂºÃ¡Å¾ËœÃ¡Å¸â€°Ã¡Å¾â€žÃ¡Å¸â€¹ (Department):</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{deptCode} ({department})</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ (Year):</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{year}</p>
                </div>
              </div>

              {enrolledCourses && (
                <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">Ã¡Å¾ËœÃ¡Å¾Â»Ã¡Å¾ÂÃ¡Å¾Å“Ã¡Å¾Â·Ã¡Å¾â€¡Ã¡Å¸â€™Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾â€˜Ã¡Å¾Â½Ã¡Å¾â€ºÃ¡Å¾ÂÃ¡Å¾Â»Ã¡Å¾Å¸Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¼Ã¡Å¾Å“Ã¡Å¾â€Ã¡Å¾â€žÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â‚¬Ã¡Å¾â€œ (Enrolled Course Team):</span>
                    <p className="text-muted-foreground">{enrolledCourses}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">Ã¡Å¾â€ Ã¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€ Ã¡Å¾Å¸Ã¡Å¾Â·Ã¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¸Ã¡Å¾Â¶ Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â¦-Ã¡Å¸Â¢Ã¡Å¸Â Ã¡Å¸Â¢Ã¡Å¸Â§</span>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Ã¡Å¾ÂÃ¡Å¾Â½Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â€˜Ã¡Å¾Â¸Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€Ã¡Å¸â€¹Ã¡Å¾â€šÃ¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€žÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€œÃ¡Å¸â€™Ã¡Å¾â€™ (System Administrative Role)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡Ã¡Å¾â€¡Ã¡Å¾Â¶Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¾â‚¬Ã¡Å¸â€¹Ã¡Å¾Å Ã¡Å¾Â¹Ã¡Å¾â‚¬Ã¡Å¾â€œÃ¡Å¾Â¶Ã¡Å¸â€  STJ (STJ Leadership Account)Ã¡Å¸â€
            </CardContent>
          </Card>
        )}

        {/* Section D: Account & Security Overview */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾ÂÃ¡Å¸Å’Ã¡Å¾ËœÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸ Ã¡Å¾â€œÃ¡Å¾Â·Ã¡Å¾â€žÃ¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“ (Account Information)</span>
            </CardTitle>
            <Link href="/portal/security" className="text-xs text-primary hover:underline">
              Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â‚¬Ã¡Å¸â€ Ã¡Å¾Å½Ã¡Å¾ÂÃ¡Å¸â€¹Ã¡Å¾Å¸Ã¡Å¾Â»Ã¡Å¾Å“Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â·Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“
            </Link>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground">Ã¡Å¾Å¸Ã¡Å¸â€™Ã¡Å¾ÂÃ¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¾â€šÃ¡Å¾Å½Ã¡Å¾â€œÃ¡Å¾Â¸:</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Ã¡Å¾Å¸Ã¡Å¾â‚¬Ã¡Å¾ËœÃ¡Å¸â€™Ã¡Å¾Ëœ (Active)</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾â€“Ã¡Å¸ÂÃ¡Å¾â€°Ã¡Å¾â€¦Ã¡Å¾Â·Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾Â:</span>
              <p className="font-medium text-foreground mt-0.5">Ã¡Å¾â€”Ã¡Å¾Â¶Ã¡Å¾Å¸Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¸â€šÃ¡Å¾Å¡ (km)</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¦Ã¡Å¾Â¼Ã¡Å¾â€ºÃ¡Å¾â€Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¾Â¾Ã¡Å¾â€¦Ã¡Å¾Â»Ã¡Å¾â€žÃ¡Å¾â‚¬Ã¡Å¸â€™Ã¡Å¾Å¡Ã¡Å¸â€žÃ¡Å¾â„¢:</span>
              <p className="font-medium text-muted-foreground mt-0.5">
                {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString("km-KH") : "Ã¡Å¾ÂÃ¡Å¸â€™Ã¡Å¾ËœÃ¡Å¾Â¸Ã¡Å¸â€”Ã¡Å¾â€œÃ¡Å¸ÂÃ¡Å¸â€¡"}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">Ã¡Å¾â‚¬Ã¡Å¾Â¶Ã¡Å¾Å¡Ã¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¸â‚¬Ã¡Å¾â€žÃ¡Å¾â€¢Ã¡Å¸â€™Ã¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾ÂÃ¡Å¸â€¹ Ã¡Å¸Â¢ Ã¡Å¾â€¡Ã¡Å¸â€ Ã¡Å¾Â Ã¡Å¾Â¶Ã¡Å¾â€œ (2FA):</span>
              <p className="font-medium text-muted-foreground mt-0.5">Ã¡Å¾ËœÃ¡Å¾Â·Ã¡Å¾â€œÃ¡Å¾â€˜Ã¡Å¾Â¶Ã¡Å¾â€œÃ¡Å¸â€¹Ã¡Å¾â€Ã¡Å¾Â¾Ã¡Å¾â‚¬ (Optional)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
