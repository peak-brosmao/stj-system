import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { calculateAttendanceRate } from "@/lib/utils";
import { AttendanceStatus } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const ip = getClientIp(req.headers);
    const rateCheck = checkRateLimit(`share-link:${ip}`, { limit: 45, windowMs: 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "សំណើច្រើនហួសកំណត់ សូមរង់ចាំមួយរយៈខ្លីសិន (Too many requests)" },
        { status: 429 }
      );
    }

    const { token } = await params;
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        course: true,
        session: true,
      },
    });

    if (!shareLink) {
      return NextResponse.json({ error: "Share link not found or expired." }, { status: 404 });
    }

    if (shareLink.isRevoked) {
      return NextResponse.json(
        { error: "This share link has been revoked by STJ Administration." },
        { status: 410 }
      );
    }

    if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This share link has expired." },
        { status: 410 }
      );
    }

    // Password check
    if (shareLink.passwordHash) {
      if (!password) {
        return NextResponse.json({ requiresPassword: true }, { status: 401 });
      }
      const match = await bcrypt.compare(password, shareLink.passwordHash);
      if (!match) {
        return NextResponse.json({ error: "Incorrect passcode." }, { status: 403 });
      }
    }

    // Log access
    try {
      await prisma.shareLink.update({
        where: { id: shareLink.id },
        data: { accessCount: { increment: 1 } },
      });
      await prisma.shareLinkAccess.create({
        data: {
          shareLinkId: shareLink.id,
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {
      // Non-blocking — access logging failure should not block the response
    }

    // Retrieve attendance records from the database
    const sessionWhere = shareLink.sessionId
      ? { sessionId: shareLink.sessionId }
      : { session: { courseId: shareLink.courseId } };

    const records = await prisma.attendanceRecord.findMany({
      where: sessionWhere,
      include: {
        member: {
          include: {
            department: true,
            academicYear: true,
          },
        },
        session: true,
      },
      orderBy: {
        member: {
          memberId: "asc",
        },
      },
    });

    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;

    const formattedMembers = records.map((r, index) => {
      const st = r.status as AttendanceStatus;
      if (st === "PRESENT") present++;
      else if (st === "LATE") late++;
      else if (st === "ABSENT") absent++;
      else if (st === "EXCUSED") excused++;

      return {
        no: index + 1,
        memberId: r.member.memberId,
        fullNameKh: r.member.fullNameKh,
        fullNameEn: r.member.fullNameEn,
        department: r.member.department?.code ?? "",
        year: r.member.academicYear?.code ?? "",
        status: r.status,
      };
    });

    const total = records.length;
    const rate = calculateAttendanceRate(present, late, total, excused);

    return NextResponse.json({
      title: shareLink.title,
      courseName: shareLink.course.titleKh,
      courseCode: shareLink.course.code,
      sessionTitle: shareLink.session?.title,
      sessionDate: shareLink.session?.sessionDate
        ? new Date(shareLink.session.sessionDate).toISOString().split("T")[0]
        : undefined,
      showStats: shareLink.showStats,
      stats: { total, present, late, absent, excused, rate },
      members: formattedMembers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
