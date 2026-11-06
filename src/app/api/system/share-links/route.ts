import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const isSuperOrAdmin =
      user.roles.includes("SUPER_ADMIN") ||
      user.roles.includes("STJ_ADMIN") ||
      user.roles.includes("STJ_PRESIDENT") ||
      user.roles.includes("STUDENT_ASSOCIATION");

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

    const isSuperOrAdmin =
      user.roles.includes("SUPER_ADMIN") ||
      user.roles.includes("STJ_ADMIN") ||
      user.roles.includes("STJ_PRESIDENT") ||
      user.roles.includes("STUDENT_ASSOCIATION");

    // Resolve course by code or id to ensure foreign key validity
    const courseRecord = await prisma.course.findFirst({
      where: {
        OR: [{ id: courseId }, { code: courseId }],
      },
    });

    const resolvedCourseId = courseRecord?.id || courseId;

    if (!isSuperOrAdmin && !user.courseIds?.includes(resolvedCourseId) && !user.courseIds?.includes(courseId)) {
      return NextResponse.json(
        { error: "Forbidden: Leaders can only generate share links for assigned courses." },
        { status: 403 }
      );
    }

    // Reuse existing active share link for this session if one exists
    if (sessionId) {
      const existingLink = await prisma.shareLink.findFirst({
        where: { sessionId, isRevoked: false },
        orderBy: { createdAt: "desc" },
      });
      if (existingLink) {
        return NextResponse.json({
          success: true,
          token: existingLink.token,
          shareLink: existingLink,
          shareUrl: `/share/${existingLink.token}`,
        });
      }
    }

    // Generate random secure token (32 hex characters)
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
        courseId: resolvedCourseId,
        sessionId: sessionId || null,
        title,
        passwordHash,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        showStats: showStats ?? true,
        createdById: user.id,
      },
    });

    // Also persist to Laravel API backend if configured
    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel("share-links", {
          method: "POST",
          body: JSON.stringify({
            courseId: resolvedCourseId,
            sessionId: sessionId || null,
            title,
            showStats: showStats ?? true,
          }),
        });
      } catch (err) {
        console.warn("[Laravel Share Link Sync Warning]", err);
      }
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "SHARE_LINK_CREATED",
          entityType: "SHARE_LINK",
          entityId: created.id,
          details: JSON.stringify({ token, courseId: resolvedCourseId, sessionId }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      token: created.token,
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

    const isSuperOrAdmin =
      user.roles.includes("SUPER_ADMIN") ||
      user.roles.includes("STJ_ADMIN") ||
      user.roles.includes("STJ_PRESIDENT") ||
      user.roles.includes("STUDENT_ASSOCIATION");

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

