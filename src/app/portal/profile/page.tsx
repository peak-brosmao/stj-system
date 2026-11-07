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
          <p className="text-xs text-muted-foreground animate-pulse">កំពុងទាញយកព័ត៌មានគណនី...</p>
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
  const department = profile?.member?.department?.nameKh || (isMember ? "-" : "គណៈគ្រប់គ្រងប្រព័ន្ធ (Administration)");
  const deptCode = profile?.member?.department?.code || (isMember ? "-" : "STJ Admin");
  const year = profile?.member?.academicYear?.label || (isMember ? "-" : "-");
  const phone = profile?.phone || "-";
  const email = profile?.email || "";
  const telegram = profile?.telegram || "-";
  const address = profile?.address || "-";
  const bio = profile?.bio || "មិនទាន់មានជីវប្រវត្តិសង្ខេបនៅឡើយ (No biography added yet)";
  const gender = profile?.gender === "M" ? "ប្រុស (Male)" : profile?.gender === "F" ? "ស្រី (Female)" : "-";
  const isPresident = profile?.userRoles?.some((r: any) => r.role?.name === "SUPER_ADMIN" || r.role?.name === "STJ_PRESIDENT") || memberId === "STJ002";
  const userRole = isPresident
    ? "ប្រធាន STJ"
    : profile?.userRoles?.some((r: any) => r.role?.name === "COURSE_LEADER")
    ? "ប្រធានក្រុម"
    : (isMember ? "សមាជិក STJ" : "គណៈគ្រប់គ្រង");

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
                      {profile?.status === "ACTIVE" ? "សកម្ម (Active)" : profile?.status || "Active"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ឈ្មោះពេញក្រៅ: <strong className="text-foreground">{displayName}</strong>
                    {isMember && (
                      <>
                        {" "}• អត្តសញ្ញាណនិស្សិត: <strong className="text-foreground font-mono">{studentId}</strong>
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
                          ដេប៉ាតឺម៉ង់: {deptCode} ({year})
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
                    <span>កែសម្រួលព័ត៌មាន</span>
                  </Button>
                </Link>
                <Link href="/portal/security">
                  <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>សុវត្ថិភាព</span>
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
                <span className="text-xs font-bold text-foreground">កម្រិតនៃការបំពេញព័ត៌មាន (Profile Completeness): {completeness}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានបំពេញដោយស្វ័យប្រវត្តិ។ ព័ត៌មានស្របច្បាប់ត្រូវទាមទារការបញ្ជាក់ផ្លូវការ។
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
                <span>ព័ត៌មានផ្ទាល់ខ្លួន (Personal Information)</span>
              </CardTitle>
              <Link href="/portal/profile/edit" className="text-xs text-primary hover:underline flex items-center space-x-1">
                <Edit2 className="w-3 h-3" />
                <span>កែប្រែ</span>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
                <div>
                  <span className="text-muted-foreground text-[11px]">ឈ្មោះពេញ (ខ្មែរ):</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{nameKh || "-"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">FullName (English):</span>
                  <p className="font-semibold text-foreground text-sm mt-0.5">{nameEn || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border">
                <div>
                  <span className="text-muted-foreground text-[11px]">ឈ្មោះបង្ហាញ (Preferred Name):</span>
                  <p className="font-medium text-foreground mt-0.5">{displayName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">ភេទ (Gender):</span>
                  <p className="font-medium text-foreground mt-0.5">{gender}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-[11px]">ជីវប្រវត្តិសង្ខេប (Personal Biography):</span>
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
                <span>ព័ត៌មានទំនាក់ទំនង (Contact Information)</span>
              </CardTitle>
              <Link href="/portal/profile/edit" className="text-xs text-primary hover:underline flex items-center space-x-1">
                <Edit2 className="w-3 h-3" />
                <span>កែប្រែ</span>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2.5 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-[11px] text-muted-foreground">អ៊ីមែលស្ថាប័ន (Institutional Email):</span>
                    <p className="font-medium text-foreground">{email || "-"}</p>
                  </div>
                </div>
                <Badge variant="success" className="text-[10px]">ផ្ទៀងផ្ទាត់រួច</Badge>
              </div>
              <div className="flex items-center justify-between pb-2.5 border-b border-border">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-[11px] text-muted-foreground">លេខទូរស័ព្ទ (Phone Number):</span>
                    <p className="font-medium text-foreground font-mono">{phone}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">អាចទាក់ទងបាន</span>
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
                  <span className="text-[11px] text-muted-foreground">អាសយដ្ឋានបច្ចុប្បន្ន (Current Address):</span>
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
                  <span>ព័ត៌មានសិក្សាផ្លូវការ (Official Academic Records)</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  កំណត់ត្រាផ្លូវការរបស់វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា។ ការកែប្រែទាមទារការស្នើសុំ និងការយល់ព្រមពីគណៈគ្រប់គ្រង STJ។
                </p>
              </div>
              <Link href="/portal/profile/edit#correction-request">
                <Button variant="outline" size="sm" className="space-x-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>ស្នើសុំកែប្រែទិន្នន័យផ្លូវការ</span>
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/30 border border-border">
                <div>
                  <span className="text-[11px] text-muted-foreground">លេខកូដសមាជិក STJ:</span>
                  <p className="font-bold text-primary font-mono text-sm mt-0.5">{memberId}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">អត្តសញ្ញាណនិស្សិត:</span>
                  <p className="font-bold text-foreground font-mono text-sm mt-0.5">{studentId}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">ដេប៉ាតឺម៉ង់ (Department):</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{deptCode} ({department})</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">កម្រិតសិក្សា (Year):</span>
                  <p className="font-semibold text-foreground text-xs mt-0.5">{year}</p>
                </div>
              </div>

              {enrolledCourses && (
                <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-foreground">មុខវិជ្ជាទទួលខុសត្រូវបង្រៀន (Enrolled Course Team):</span>
                    <p className="text-muted-foreground">{enrolledCourses}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">ឆ្នាំសិក្សា ២០២៦-២០២៧</span>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>តួនាទីគ្រប់គ្រងប្រព័ន្ធ (System Administrative Role)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              គណនីនេះជាគណនីថ្នាក់ដឹកនាំ STJ (STJ Leadership Account)។
            </CardContent>
          </Card>
        )}

        {/* Section D: Account & Security Overview */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>ព័ត៌មានគណនី និងសុវត្ថិភាព (Account Information)</span>
            </CardTitle>
            <Link href="/portal/security" className="text-xs text-primary hover:underline">
              ការកំណត់សុវត្ថិភាព
            </Link>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[11px] text-muted-foreground">ស្ថានភាពគណនី:</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">សកម្ម (Active)</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">ភាសាពេញចិត្ត:</span>
              <p className="font-medium text-foreground mt-0.5">ភាសាខ្មែរ (km)</p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">ការចូលប្រើចុងក្រោយ:</span>
              <p className="font-medium text-muted-foreground mt-0.5">
                {profile?.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString("km-KH") : "ថ្មីៗនេះ"}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-muted-foreground">ការផ្ទៀងផ្ទាត់ ២ ជំហាន (2FA):</span>
              <p className="font-medium text-muted-foreground mt-0.5">មិនទាន់បើក (Optional)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}