import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const isSuperOrAdmin = user.roles.includes("SUPER_ADMIN") || user.roles.includes("STJ_ADMIN");

    let links;
    try {
      const whereClause = isSuperOrAdmin
        ? {}
        : { courseId: { in: user.courseIds || [] } };

      links = await prisma.shareLink.findMany({
        where: whereClause,
        include: {
          course: true,
          session: true,
          createdBy: {
            select: { fullNameEn: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      links = [
        {
          id: "link-demo",
          token: "stj-demo-token-2026",
          title: "របាយការណ៍វត្តមាន Programming សប្តាហ៍ទី១",
          course: { code: "PROG101", titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)" },
          session: { title: "សប្តាហ៍ទី១៖ សេចក្តីផ្តើមអំពី C++" },
          isRevoked: false,
          accessCount: 14,
          createdAt: new Date(),
          createdBy: { fullNameEn: "LEANG JINGHENG", email: "leang.jingheng@itc.edu.kh" },
        },
      ];
    }

    return NextResponse.json({ links });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching share links";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();

    const { courseId, sessionId, title, password, expiresAt, showStats } = body;

    if (!courseId || !title) {
      return NextResponse.json(
        { error: "Course and report title are required." },
        { status: 400 }
      );
    }

    // If course leader, verify assignment to this course
    const isSuperOrAdmin = user.roles.includes("SUPER_ADMIN") || user.roles.includes("STJ_ADMIN");
    if (!isSuperOrAdmin && !user.courseIds?.includes(courseId)) {
      return NextResponse.json(
        { error: "Forbidden: Leaders can only generate share links for assigned courses." },
        { status: 403 }
      );
    }

    // Generate random secure token
    const token = crypto.randomBytes(16).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    let passwordHash = null;
    if (password && password.trim().length > 0) {
      passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const created = await prisma.shareLink.create({
      data: {
        token,
        tokenHash,
        courseId,
        sessionId: sessionId || null,
        title,
        passwordHash,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        showStats: showStats ?? true,
        createdById: user.id,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SHARE_LINK_CREATED",
          entityType: "SHARE_LINK",
          entityId: created.id,
          details: JSON.stringify({ token, courseId, sessionId }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      shareLink: created,
      shareUrl: `/share/${token}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating share link";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("id");

    if (!linkId) {
      return NextResponse.json({ error: "Share link ID is required." }, { status: 400 });
    }

    const existing = await prisma.shareLink.findUnique({ where: { id: linkId } });
    if (!existing) {
      return NextResponse.json({ error: "Share link not found." }, { status: 404 });
    }

    const isSuperOrAdmin = user.roles.includes("SUPER_ADMIN") || user.roles.includes("STJ_ADMIN");
    if (!isSuperOrAdmin && existing.createdById !== user.id) {
      return NextResponse.json({ error: "Forbidden: You can only revoke your own share links." }, { status: 403 });
    }

    await prisma.shareLink.update({
      where: { id: linkId },
      data: { isRevoked: true },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SHARE_LINK_REVOKED",
          entityType: "SHARE_LINK",
          entityId: linkId,
          details: JSON.stringify({ token: existing.token }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, message: "Share link successfully revoked." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error revoking share link";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

