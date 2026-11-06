import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { calculateAttendanceRate } from "@/lib/utils";
import { AttendanceStatus } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

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

    // 1. Query Prisma database directly (Primary single-source-of-truth)
    let shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        course: true,
        session: true,
      },
    });

    // If not found in Prisma, try Laravel API
    if (!shareLink && LARAVEL_API_BASE) {
      try {
        const remote = await fetchFromLaravel(`share/${token}`, {
          method: "POST",
          body: JSON.stringify({ password }),
        });
        if (remote && remote.ok) {
          const remoteData = await remote.json();
          return NextResponse.json(remoteData);
        }
      } catch (err) {
        console.warn("[Laravel Share Fallback Warning]", err);
      }
    }

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
          ipAddress: ip,
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {
      // Non-blocking
    }

    // 1. Fetch all members enrolled in this course (excluding leadership members like STJ001 & STJ002 if non-teaching)
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId: shareLink.courseId },
      include: {
        member: {
          include: {
            department: true,
            academicYear: true,
          },
        },
      },
      orderBy: {
        member: {
          memberId: "asc",
        },
      },
    });

    // 2. Fetch recorded attendance for this session or course
    const sessionWhere = shareLink.sessionId
      ? { sessionId: shareLink.sessionId }
      : { session: { courseId: shareLink.courseId } };

    const records = await prisma.attendanceRecord.findMany({
      where: sessionWhere,
      include: {
        member: true,
      },
    });

    const recordMap = new Map<string, string>();
    for (const r of records) {
      recordMap.set(r.memberId, r.status);
    }

    let present = 0;
    let late = 0;
    let absent = 0;
    let excused = 0;
    let pending = 0;

    const formattedMembers = enrollments.map((enr, index) => {
      const status = recordMap.get(enr.member.id) || (records.length > 0 ? "ABSENT" : "PENDING");
      if (status === "PRESENT") present++;
      else if (status === "LATE") late++;
      else if (status === "ABSENT") absent++;
      else if (status === "EXCUSED") excused++;
      else pending++;

      return {
        no: index + 1,
        memberId: enr.member.memberId,
        studentId: enr.member.studentId || null,
        fullNameKh: enr.member.fullNameKh,
        fullNameEn: enr.member.fullNameEn,
        department: enr.member.department?.code ?? "",
        year: enr.member.academicYear?.code ?? "",
        status,
      };
    });

    const total = formattedMembers.length;
    const markedTotal = present + late + absent + excused;
    const effective = Math.max(0, markedTotal - excused);
    const rate = effective > 0 ? calculateAttendanceRate(present, late, markedTotal, excused) : 100;

    const reportType = shareLink.sessionId ? "SESSION" : "COURSE";

    return NextResponse.json({
      title: shareLink.title,
      reportType,
      courseName: shareLink.course.titleKh,
      courseCode: shareLink.course.code,
      sessionTitle: shareLink.session?.title,
      sessionDate: shareLink.session?.sessionDate
        ? new Date(shareLink.session.sessionDate).toISOString().split("T")[0]
        : undefined,
      sessionRoom: shareLink.session?.room || undefined,
      sessionTime: shareLink.session?.startTime && shareLink.session?.endTime
        ? `${shareLink.session.startTime} - ${shareLink.session.endTime}`
        : undefined,
      showStats: shareLink.showStats,
      stats: { total, present, late, absent, excused, pending, rate },
      members: formattedMembers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
