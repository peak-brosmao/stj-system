"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Plus,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Trash2,
  X,
  Lock,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { PortalLayout } from "@/ui/layout/PortalLayout";
import { Card, CardContent } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";

interface ShareItem {
  id: string;
  token: string;
  title: string;
  isRevoked: boolean;
  accessCount: number;
  createdAt: string;
  expiresAt?: string | null;
  course: { code: string; titleKh: string };
  session?: { title: string } | null;
}

export default function LeaderShareLinksPage() {
  const [links, setLinks] = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);

  // New Link form
  const [newLink, setNewLink] = useState({
    title: "របាយការណ៍វត្តមាន Programming សប្តាហ៍ទី១",
    courseId: "c-prog",
    sessionId: "session-1",
    password: "",
    expiresAt: "",
    showStats: true,
  });

  const loadLinks = () => {
    setLoading(true);
    fetch("/api/system/share-links")
      .then((res) => res.json())
      .then((data) => {
        if (data.links) setLinks(data.links);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/system/share-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLink),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadLinks();
      }
    } catch {
      // ignore
    }
  };

  const handleCopy = (token: string, id: string) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបចោលតំណភ្ជាប់នេះមែនទេ? (Revoke Share Link)")) return;
    try {
      await fetch(`/api/system/share-links?id=${id}`, { method: "DELETE" });
      loadLinks();
    } catch {
      // ignore
    }
  };

  return (
    <PortalLayout
      portalType="leader"
      userRole="Course Leader"
      userName="លាង ជីងហេង"
      userEmail="leang.jingheng@itc.edu.kh"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Share2 className="w-4 h-4" />
              <span>Cryptographic Share Links</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              តំណភ្ជាប់ចែករំលែកវត្តមាន (Shareable Attendance Links)
            </h1>
            <p className="text-xs text-muted-foreground">
              បង្កើតតំណភ្ជាប់ ឬកូដ QR សុវត្ថិភាពដើម្បីចែករំលែករបាយការណ៍វត្តមាន (Read-Only)
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បង្កើតតំណភ្ជាប់ថ្មី (New Share Link)</span>
          </Button>
        </div>

        {/* Security Alert Banner */}
        <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              តំណភ្ជាប់ទាំងអស់ត្រូវបានការពារដោយ Token Hash និងមិនបង្ហាញព័ត៌មានផ្ទាល់ខ្លួនរសើប (ដូចជាលេខទូរស័ព្ទ ឬអ៊ីមែល) ឡើយ។
            </span>
          </div>
        </div>

        {/* Links Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ចំណងជើងរបាយការណ៍</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជា / វគ្គ</th>
                  <th className="py-3 px-4 font-semibold text-center">ចូលមើល</th>
                  <th className="py-3 px-4 font-semibold text-center">ស្ថានភាព</th>
                  <th className="py-3 px-4 font-semibold text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{link.title}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        Token: {(link.token || "").slice(0, 12)}...
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-primary">{link.course?.code || "STJ"}</div>
                      <div className="text-[10px] text-muted-foreground">{link.session?.title || "គ្រប់វគ្គសិក្សា"}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-foreground">
                      {link.accessCount ?? 0} ដង
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={link.isRevoked ? "destructive" : "success"}>
                        {link.isRevoked ? "បានលុបចោល" : "សកម្ម"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setQrToken(link.token)}
                          className="h-7 text-xs"
                          title="Show QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(link.token, link.id)}
                          className="h-7 text-xs"
                          title="Copy URL"
                        >
                          {copiedId === link.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Link href={`/share/${link.token}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" title="Open Link">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        {!link.isRevoked && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(link.id)}
                            className="h-7 text-xs text-destructive hover:bg-destructive/10"
                            title="Revoke Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Link Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
            <Card className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm">បង្កើតតំណភ្ជាប់ចែករំលែកថ្មី</h3>
                  <button onClick={() => setIsModalOpen(false)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium mb-1">ចំណងជើងរបាយការណ៍ *</label>
                    <input
                      type="text"
                      required
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">លេខសម្ងាត់ការពារ (ស្រេចចិត្ត)</label>
                    <input
                      type="password"
                      placeholder="ទុកនៅទំនេរ ប្រសិនបើមិនត្រូវការ"
                      value={newLink.password}
                      onChange={(e) => setNewLink({ ...newLink, password: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">កាលបរិច្ឆេទផុតកំណត់ (ស្រេចចិត្ត)</label>
                    <input
                      type="date"
                      value={newLink.expiresAt}
                      onChange={(e) => setNewLink({ ...newLink, expiresAt: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="showStats"
                      checked={newLink.showStats}
                      onChange={(e) => setNewLink({ ...newLink, showStats: e.target.checked })}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <label htmlFor="showStats" className="font-medium cursor-pointer">
                      បង្ហាញផ្ទាំងស្ថិតិវត្តមានសរុប (Show Statistics Summary)
                    </label>
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
                    <Button type="submit" size="sm">
                      បង្កើតតំណភ្ជាប់
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* QR Code Modal */}
        {qrToken && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setQrToken(null); }}>
            <Card className="max-w-sm w-full text-center max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="font-bold text-sm">កូដ QR សម្រាប់ចែករំលែក</h3>
                  <button onClick={() => setQrToken(null)}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      `${typeof window !== "undefined" ? window.location.origin : ""}/share/${qrToken}`
                    )}`}
                    alt="QR Code"
                    className="w-44 h-44"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  ស្កេនដើម្បីចូលមើលរបាយការណ៍វត្តមានផ្លូវការនៅលើទូរស័ព្ទដៃ
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrToken(null)}
                  className="w-full"
                >
                  បិទផ្ទាំង
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
