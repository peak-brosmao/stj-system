"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Share2, Trash2, ExternalLink, Copy, Check, ShieldAlert, Eye, RefreshCw } from "lucide-react";
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
  createdBy: { fullNameEn: string; email: string };
}

export default function SystemShareLinksPage() {
  const [links, setLinks] = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleRevoke = async (id: string) => {
    if (!confirm("តើអ្នកពិតជាចង់លុបចោលតំណភ្ជាប់ចែករំលែកនេះមែនទេ? (Revoke Share Link)")) return;
    try {
      await fetch(`/api/system/share-links?id=${id}`, { method: "DELETE" });
      loadLinks();
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

  return (
    <PortalLayout portalType="system" userRole="ប្រធាន STJ (President)" userName="ផល ដាវីត">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary mb-1">
              <Share2 className="w-4 h-4" />
              <span>Public Token Auditor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              ការគ្រប់គ្រងតំណភ្ជាប់ចែករំលែក (Share Links Audit)
            </h1>
            <p className="text-xs text-muted-foreground">
              ពិនិត្យ តាមដាន និងលុបចោលតំណភ្ជាប់របាយការណ៍វត្តមានជាសាធារណៈ
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={loadLinks} className="text-xs space-x-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ផ្ទុកឡើងវិញ</span>
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4 font-semibold">ចំណងជើងរបាយការណ៍</th>
                  <th className="py-3 px-4 font-semibold">មុខវិជ្ជា / វគ្គ</th>
                  <th className="py-3 px-4 font-semibold">អ្នកបង្កើត</th>
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
                      <div className="text-[10px] font-mono text-muted-foreground truncate max-w-xs">
                        Token: {link.token.slice(0, 12)}...
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-primary">{link.course.code}</div>
                      <div className="text-[10px] text-muted-foreground truncate max-w-xs">
                        {link.session?.title || "គ្រប់វគ្គសិក្សា"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">{link.createdBy.fullNameEn}</div>
                      <div className="text-[10px] text-muted-foreground">{link.createdBy.email}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-foreground">
                      {link.accessCount}
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
                          onClick={() => handleCopy(link.token, link.id)}
                          className="h-7 text-xs"
                          title="Copy Link"
                        >
                          {copiedId === link.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                        <Link href={`/share/${link.token}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" title="Open Link">
                            <ExternalLink className="w-3.5 h-3.5 text-primary" />
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
                {links.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                      {loading ? "កំពុងទាញយកទិន្នន័យ..." : "ពុំមានតំណភ្ជាប់ចែករំលែកឡើយ"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
