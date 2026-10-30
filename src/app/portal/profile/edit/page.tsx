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
import { PortalLayout } from "@/components/layout/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
          setDisplayName(p.displayName || "Brosmao");
          setPhone(p.phone || "099661460");
          setTelegram(p.telegram || "@brosmao_peak");
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
          phone,
          telegram,
          bio,
          address,
          preferredLanguage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ការរក្សាទុកមិនជោគជ័យ");

      setSuccessMsg("ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "កំហុសក្នុងការរក្សាទុក";
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
      if (!res.ok) throw new Error(data.error || "ការផ្ទុករូបភាពមិនជោគជ័យ");

      setProfileImage(data.url);
      setSuccessMsg("រូបភាពផ្ទាល់ខ្លួនត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "កំហុសក្នុងការផ្ទុករូបភាព";
      setErrorMsg(msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!confirm("តើអ្នកពិតជាចង់លុបរូបភាពគណនីផ្ទាល់ខ្លួននេះមែនទេ?")) return;

    try {
      await fetch("/api/portal/profile/photo", { method: "DELETE" });
      setProfileImage(null);
      setSuccessMsg("រូបភាពផ្ទាល់ខ្លួនត្រូវបានលុបរួចរាល់");
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
      if (!res.ok) throw new Error(data.error || "ការបញ្ជូនសំណើមិនជោគជ័យ");

      setRequestSuccess("សំណើកែតម្រូវទិន្នន័យផ្លូវការត្រូវបានបញ្ជូនទៅគណៈគ្រប់គ្រង STJ ដោយជោគជ័យ");
      setRequestedValue("");
      setCorrectionReason("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "កំហុសក្នុងការបញ្ជូនសំណើ");
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <PortalLayout
      portalType="portal"
      userRole="STJ Member"
      userName={profile?.fullNameKh || "ពាក់ ប្រុសម៉ៅ"}
      userMemberId={profile?.member?.memberId || "STJ033"}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-2">
          <div className="space-y-1">
            <Link
              href="/portal/profile"
              className="inline-flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ត្រឡប់ទៅកាន់ព័ត៌មានផ្ទាល់ខ្លួន</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              កែសម្រួលគណនីផ្ទាល់ខ្លួន (Edit Profile)
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
            <CardTitle className="text-sm font-semibold">រូបថតគណនីផ្ទាល់ខ្លួន (Profile Picture)</CardTitle>
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
                    <span>{uploadingPhoto ? "កំពុងផ្ទុកឡើង..." : "ប្តូររូបថតថ្មី (Upload)"}</span>
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
                      <span>លុបរូប</span>
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  អនុញ្ញាតតែ JPG, PNG ឬ WebP។ ទំហំអតិបរមា 2MB។ រូបថតត្រូវបានរក្សាទុកដោយសុវត្ថិភាព។
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form: Editable Fields */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">ព័ត៌មានផ្ទាល់ខ្លួន & ទំនាក់ទំនង</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    ឈ្មោះបង្ហាញដែលពេញចិត្ត (Preferred Display Name)
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Brosmao"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    លេខទូរស័ព្ទ (Phone Number)
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
                    Telegram Username (ស្រេចចិត្ត)
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
                    ភាសាដែលពេញចិត្តក្នុងប្រព័ន្ធ (Language)
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="km">ភាសាខ្មែរ (Khmer - km)</option>
                    <option value="en">English (en)</option>
                    <option value="fr">Français (fr)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  អាសយដ្ឋានបច្ចុប្បន្ន (Current Address)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="រាជធានីភ្នំពេញ..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  ជីវប្រវត្តិ និងចំណាប់អារម្មណ៍សិក្សា (Biography)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                  placeholder="រៀបរាប់សង្ខេបអំពីគោលបំណងសិក្សា និងជំនាញវិស្វកម្ម..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={saving} className="space-x-1.5 text-xs">
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "កំពុងរក្សាទុក..." : "រក្សាទុកការកែប្រែ"}</span>
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
                ស្នើសុំកែតម្រូវទិន្នន័យផ្លូវការ (Official Data Correction Desk)
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ឈ្មោះផ្លូវការ (ខ្មែរ/អង់គ្លេស) លេខអត្តសញ្ញាណនិស្សិត ដេប៉ាតឺម៉ង់ និងកម្រិតសិក្សា ត្រូវបានការពារជាទិន្នន័យផ្លូវការរបស់វិទ្យាស្ថាន។ ការកែប្រែនឹងត្រូវបញ្ជូនទៅគណៈគ្រប់គ្រង STJ ដើម្បីត្រួតពិនិត្យ និងអនុម័ត។
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
                    ទិន្នន័យដែលស្នើសុំកែសម្រួល:
                  </label>
                  <select
                    value={correctField}
                    onChange={(e) => setCorrectField(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="studentId">លេខអត្តសញ្ញាណនិស្សិត (Student ID)</option>
                    <option value="fullNameKh">គោត្តនាម-នាម ខ្មែរ (Khmer Full Name)</option>
                    <option value="fullNameEn">FullName English (English Name)</option>
                    <option value="department">ដេប៉ាតឺម៉ង់ (Department)</option>
                    <option value="academicYear">កម្រិតសិក្សា (Academic Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    តម្លៃត្រឹមត្រូវថ្មី (Requested Value):
                  </label>
                  <input
                    type="text"
                    required
                    value={requestedValue}
                    onChange={(e) => setRequestedValue(e.target.value)}
                    placeholder="បញ្ចូលតម្លៃថ្មី..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  មូលហេតុនៃការស្នើសុំកែប្រែ (Reason):
                </label>
                <textarea
                  rows={2}
                  required
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="បញ្ជាក់ពីមូលហេតុនៃការខុសឆ្គង ឬភ្ជាប់លេខយោង..."
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
                  <span>{requestSubmitting ? "កំពុងបញ្ជូនសំណើ..." : "ដាក់សំណើទៅគណៈគ្រប់គ្រង"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
