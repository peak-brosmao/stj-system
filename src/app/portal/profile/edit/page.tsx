"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Upload,
  Trash2,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  GraduationCap,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/ui/Card";
import { Button } from "@/ui/ui/Button";
import { Badge } from "@/ui/ui/Badge";

export default function ProfileEditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);

  // Editable fields
  const [displayName, setDisplayName] = useState("");
  const [fullNameKh, setFullNameKh] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("km");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Official data correction request form
  const [correctField, setCorrectField] = useState("studentId");
  const [requestedValue, setRequestedValue] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile;
          setProfile(p);
          setDisplayName(p.displayName || "");
          setFullNameKh(p.fullNameKh || "");
          setPhone(p.phone || "");
          setTelegram(p.telegram || "");
          setBio(p.bio || "");
          setAddress(p.address || "");
          setPreferredLanguage(p.preferredLanguage || "km");
          setProfileImage(p.profileImage || null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/portal/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          fullNameKh,
          phone,
          telegram,
          bio,
          address,
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setSuccessMsg("áž–áŸážáŸŒáž˜áž¶áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž’áŸ’ážœáž¾áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“áž—áž¶áž–ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "áž€áŸ†áž áž»ážŸáž€áŸ’áž“áž»áž„áž€áž¶ážšážšáž€áŸ’ážŸáž¶áž‘áž»áž€";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/portal/profile/photo", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšáž•áŸ’áž‘áž»áž€ážšáž¼áž”áž—áž¶áž–áž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setProfileImage(data.url);
      setSuccessMsg("ážšáž¼áž”áž—áž¶áž–áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž•áŸ’áž›áž¶ážŸáŸ‹áž”áŸ’ážáž¼ážšážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "áž€áŸ†áž áž»ážŸáž€áŸ’áž“áž»áž„áž€áž¶ážšáž•áŸ’áž‘áž»áž€ážšáž¼áž”áž—áž¶áž–";
      setErrorMsg(msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm("ážáž¾áž¢áŸ’áž“áž€áž–áž·ážáž‡áž¶áž…áž„áŸ‹áž›áž»áž”ážšáž¼áž”áž—áž¶áž–áž‚ážŽáž“áž¸áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“áž“áŸáŸ‡áž˜áŸ‚áž“áž‘áŸ?")) return;

    try {
      await fetch("/api/portal/profile/photo", { method: "DELETE" });
      setProfileImage(null);
      setSuccessMsg("ážšáž¼áž”áž—áž¶áž–áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ážáŸ’ážšáž¼ážœáž”áž¶áž“áž›áž»áž”ážšáž½áž…ážšáž¶áž›áŸ‹");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch {
      // ignore
    }
  };

  const handleSubmitCorrectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestSuccess(null);

    try {
      const res = await fetch("/api/portal/profile/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field: correctField,
          oldValue:
            correctField === "studentId"
              ? profile?.member?.studentId
              : correctField === "fullNameKh"
              ? profile?.fullNameKh
              : correctField === "fullNameEn"
              ? profile?.fullNameEn
              : correctField === "department"
              ? profile?.member?.department?.code
              : profile?.member?.academicYear?.code,
          requestedValue,
          reason: correctionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“ážŸáŸ†ážŽáž¾áž˜áž·áž“áž‡áŸ„áž‚áž‡áŸáž™");

      setRequestSuccess("ážŸáŸ†ážŽáž¾áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœáž‘áž·áž“áŸ’áž“áž“áŸáž™áž•áŸ’áž›áž¼ážœáž€áž¶ážšážáŸ’ážšáž¼ážœáž”áž¶áž“áž”áž‰áŸ’áž‡áž¼áž“áž‘áŸ…áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ ážŠáŸ„áž™áž‡áŸ„áž‚áž‡áŸáž™");
      setRequestedValue("");
      setCorrectionReason("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "áž€áŸ†áž áž»ážŸáž€áŸ’áž“áž»áž„áž€áž¶ážšáž”áž‰áŸ’áž‡áž¼áž“ážŸáŸ†ážŽáž¾");
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <PortalLayout portalType="portal">
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <Link
              href="/portal/profile"
              className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ážáŸ’ážšáž¡áž”áŸ‹áž‘áŸ…áž€áž¶áž“áŸ‹áž–áŸážáŸŒáž˜áž¶áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›áž‚ážŽáž“áž¸áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ (Edit Profile)
            </h1>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Avatar Uploader Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">ážšáž¼áž”ážážáž‚ážŽáž“áž¸áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ (Profile Picture)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative w-24 h-24 rounded-2xl bg-muted border-2 border-border overflow-hidden flex items-center justify-center font-bold text-2xl text-primary shadow-sm">
                {profileImage ? (
                  <Image src={profileImage} alt="Profile" fill className="object-cover" />
                ) : (
                  <span>{(profile?.fullNameEn || "P").charAt(0)}</span>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={uploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="space-x-1.5 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPhoto ? "áž€áŸ†áž–áž»áž„áž•áŸ’áž‘áž»áž€áž¡áž¾áž„..." : "áž”áŸ’ážáž¼ážšážšáž¼áž”ážážážáŸ’áž˜áž¸ (Upload)"}</span>
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleRemovePhoto}
                      className="text-xs text-destructive hover:bg-destructive/10 space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>áž›áž»áž”ážšáž¼áž”</span>
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  áž¢áž“áž»áž‰áŸ’áž‰áž¶ážážáŸ‚ JPG, PNG áž¬ WebPáŸ” áž‘áŸ†áž áŸ†áž¢ážáž·áž”ážšáž˜áž¶ 2MBáŸ” ážšáž¼áž”ážážážáŸ’ážšáž¼ážœáž”áž¶áž“ážšáž€áŸ’ážŸáž¶áž‘áž»áž€ážŠáŸ„áž™ážŸáž»ážœážáŸ’ážáž·áž—áž¶áž–áŸ”
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form: Editable Fields */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">áž–áŸážáŸŒáž˜áž¶áž“áž•áŸ’áž‘áž¶áž›áŸ‹ážáŸ’áž›áž½áž“ & áž‘áŸ†áž“áž¶áž€áŸ‹áž‘áŸ†áž“áž„</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    ážˆáŸ’áž˜áŸ„áŸ‡áž”áž„áŸ’áž áž¶áž‰ážŠáŸ‚áž›áž–áŸáž‰áž…áž·ážáŸ’áž (Preferred Display Name)
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="áž§. áž—áŸ’áž“áŸ†áž–áŸáž‰"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    ážˆáŸ’áž˜áŸ„áŸ‡áž‡áž¶áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš (Khmer Name)
                  </label>
                  <input
                    type="text"
                    value={fullNameKh}
                    onChange={(e) => setFullNameKh(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="áž§. áž–áŸ€áž€ áž”áŸ’ážšáž»ážŸáž˜áŸ‰áŸ…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    áž›áŸážáž‘áž¼ážšážŸáŸáž–áŸ’áž‘ (Phone Number)
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="099661460"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Telegram Username (ážŸáŸ’ážšáŸáž…áž…áž·ážáŸ’áž)
                  </label>
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    áž—áž¶ážŸáž¶ážŠáŸ‚áž›áž–áŸáž‰áž…áž·ážáŸ’ážáž€áŸ’áž“áž»áž„áž”áŸ’ážšáž–áŸáž“áŸ’áž’ (Language)
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="km">áž—áž¶ážŸáž¶ážáŸ’áž˜áŸ‚ážš (Khmer - km)</option>
                    <option value="en">English (en)</option>
                    <option value="fr">FranÃ§ais (fr)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  áž¢áž¶ážŸáž™ážŠáŸ’áž‹áž¶áž“áž”áž…áŸ’áž…áž»áž”áŸ’áž”áž“áŸ’áž“ (Current Address)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ážšáž¶áž‡áž’áž¶áž“áž¸áž—áŸ’áž“áŸ†áž–áŸáž‰..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  áž‡áž¸ážœáž”áŸ’ážšážœážáŸ’ážáž· áž“áž·áž„áž…áŸ†ážŽáž¶áž”áŸ‹áž¢áž¶ážšáž˜áŸ’áž˜ážŽáŸážŸáž·áž€áŸ’ážŸáž¶ (Biography)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  placeholder="ážšáŸ€áž”ážšáž¶áž”áŸ‹ážŸáž„áŸ’ážáŸáž”áž¢áŸ†áž–áž¸áž‚áŸ„áž›áž”áŸ†ážŽáž„ážŸáž·áž€áŸ’ážŸáž¶ áž“áž·áž„áž‡áŸ†áž“áž¶áž‰ážœáž·ážŸáŸ’ážœáž€áž˜áŸ’áž˜..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={saving} className="space-x-1.5 text-xs">
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "áž€áŸ†áž–áž»áž„ážšáž€áŸ’ážŸáž¶áž‘áž»áž€..." : "ážšáž€áŸ’ážŸáž¶áž‘áž»áž€áž€áž¶ážšáž€áŸ‚áž”áŸ’ážšáŸ‚"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Section: Official Data Correction Request */}
        <Card id="correction-request" className="border-amber-500/30">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-sm font-semibold text-foreground">
                ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚ážáž˜áŸ’ážšáž¼ážœáž‘áž·áž“áŸ’áž“áž“áŸáž™áž•áŸ’áž›áž¼ážœáž€áž¶ážš (Official Data Correction Desk)
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ážˆáŸ’áž˜áŸ„áŸ‡áž•áŸ’áž›áž¼ážœáž€áž¶ážš (ážáŸ’áž˜áŸ‚ážš/áž¢áž„áŸ‹áž‚áŸ’áž›áŸážŸ) áž›áŸážáž¢ážáŸ’ážážŸáž‰áŸ’áž‰áž¶ážŽáž“áž·ážŸáŸ’ážŸáž·áž ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ áž“áž·áž„áž€áž˜áŸ’ážšáž·ážážŸáž·áž€áŸ’ážŸáž¶ ážáŸ’ážšáž¼ážœáž”áž¶áž“áž€áž¶ážšáž–áž¶ážšáž‡áž¶áž‘áž·áž“áŸ’áž“áž“áŸáž™áž•áŸ’áž›áž¼ážœáž€áž¶ážšážšáž”ážŸáŸ‹ážœáž·áž‘áŸ’áž™áž¶ážŸáŸ’ážáž¶áž“áŸ” áž€áž¶ážšáž€áŸ‚áž”áŸ’ážšáŸ‚áž“áž¹áž„ážáŸ’ážšáž¼ážœáž”áž‰áŸ’áž‡áž¼áž“áž‘áŸ…áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„ STJ ážŠáž¾áž˜áŸ’áž”áž¸ážáŸ’ážšáž½ážáž–áž·áž“áž·ážáŸ’áž™ áž“áž·áž„áž¢áž“áž»áž˜áŸážáŸ”
            </p>
          </CardHeader>
          <CardContent>
            {requestSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{requestSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCorrectionRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    áž‘áž·áž“áŸ’áž“áž“áŸáž™ážŠáŸ‚áž›ážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚ážŸáž˜áŸ’ážšáž½áž›:
                  </label>
                  <select
                    value={correctField}
                    onChange={(e) => setCorrectField(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="studentId">áž›áŸážáž¢ážáŸ’ážážŸáž‰áŸ’áž‰áž¶ážŽáž“áž·ážŸáŸ’ážŸáž·áž (Student ID)</option>
                    <option value="fullNameKh">áž‚áŸ„ážáŸ’ážáž“áž¶áž˜-áž“áž¶áž˜ ážáŸ’áž˜áŸ‚ážš (Khmer Full Name)</option>
                    <option value="fullNameEn">FullName English (English Name)</option>
                    <option value="department">ážŠáŸáž”áŸ‰áž¶ážážºáž˜áŸ‰áž„áŸ‹ (Department)</option>
                    <option value="academicYear">áž€áž˜áŸ’ážšáž·ážážŸáž·áž€áŸ’ážŸáž¶ (Academic Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    ážáž˜áŸ’áž›áŸƒážáŸ’ážšáž¹áž˜ážáŸ’ážšáž¼ážœážáŸ’áž˜áž¸ (Requested Value):
                  </label>
                  <input
                    type="text"
                    required
                    value={requestedValue}
                    onChange={(e) => setRequestedValue(e.target.value)}
                    placeholder="áž”áž‰áŸ’áž…áž¼áž›ážáž˜áŸ’áž›áŸƒážáŸ’áž˜áž¸..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  áž˜áž¼áž›áž áŸážáž»áž“áŸƒáž€áž¶ážšážŸáŸ’áž“áž¾ážŸáž»áŸ†áž€áŸ‚áž”áŸ’ážšáŸ‚ (Reason):
                </label>
                <textarea
                  rows={2}
                  required
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="áž”áž‰áŸ’áž‡áž¶áž€áŸ‹áž–áž¸áž˜áž¼áž›áž áŸážáž»áž“áŸƒáž€áž¶ážšážáž»ážŸáž†áŸ’áž‚áž„ áž¬áž—áŸ’áž‡áž¶áž”áŸ‹áž›áŸážáž™áŸ„áž„..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={requestSubmitting}
                  variant="outline"
                  className="space-x-1.5 text-xs border-amber-500/40 text-foreground hover:bg-amber-500/10"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{requestSubmitting ? "áž€áŸ†áž–áž»áž„áž”áž‰áŸ’áž‡áž¼áž“ážŸáŸ†ážŽáž¾..." : "ážŠáž¶áž€áŸ‹ážŸáŸ†ážŽáž¾áž‘áŸ…áž‚ážŽáŸˆáž‚áŸ’ážšáž”áŸ‹áž‚áŸ’ážšáž„"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
