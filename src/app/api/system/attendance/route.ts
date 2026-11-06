import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  requireTeamManager,
  getManageableCourseIds,
  assertCourseAccess,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Shared attendance endpoint (one database, one process) for the Leader portal
 * and the System portal.
 *  - STJ President / admins: any course
 *  - Course Leader: only members of the course they lead
 * Reading the roster and saving/editing attendance both happen here.
 */

const saveSchema = z.object({
  sessionId: z.string().min(1),
  finalize: z.boolean().optional(),
  records: z
    .array(
      z.object({
        memberId: z.string().min(1),
        status: z.enum(["PRESENT", "LATE", "ABSENT", "EXCUSED"]),
        remarks: z.string().optional().nullable(),
      })
    )
    .min(1),
});

function errorResponse(err: unknown, fallback: string) {
  const msg = err instanceof Error ? err.message : fallback;
  const status = msg.includes("FORBIDDEN") ? 403 : msg.includes("UNAUTHORIZED") ? 401 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const manageable = await getManageableCourseIds(user);
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const courseId = searchParams.get("courseId");

    const courses = await prisma.course.findMany({
      where: manageable === null ? { status: "ACTIVE" } : { id: { in: manageable }, status: "ACTIVE" },
      orderBy: { code: "asc" },
      include: { sessions: { orderBy: [{ sessionDate: "desc" }, { startTime: "desc" }] } },
    });

    if (sessionId) {
      const target = await prisma.teachingSession.findUnique({
        where: { id: sessionId },
        include: {
          course: {
            include: {
              enrollments: {
                include: { member: { include: { department: true, academicYear: true } } },
              },
            },
          },
          attendance: true,
        },
      });
      if (!target) return NextResponse.json({ error: "Session not found" }, { status: 404 });
      await assertCourseAccess(user, target.courseId);

      const enrolledMembers = target.course.enrollments
        .map((e) => ({
          id: e.member.id,
          memberId: e.member.memberId,
          fullNameKh: e.member.fullNameKh,
          fullNameEn: e.member.fullNameEn,
          department: { code: e.member.department?.code ?? "" },
          academicYear: { code: e.member.academicYear?.code ?? "" },
        }))
        .sort((a, b) => a.memberId.localeCompare(b.memberId));

      return NextResponse.json({
        courses,
        sessions: [],
        session: {
          id: target.id,
          title: target.title,
          courseId: target.courseId,
          sessionDate: target.sessionDate,
          startTime: target.startTime,
          endTime: target.endTime,
          room: target.room,
          status: target.status,
        },
        enrolledMembers,
        attendanceRecords: target.attendance.map((a) => ({
          id: a.id,
          memberId: a.memberId,
          status: a.status,
          remarks: a.remarks,
        })),
      });
    }

    if (courseId && manageable !== null && !manageable.includes(courseId)) {
      return NextResponse.json({ error: "FORBIDDEN: Not your course" }, { status: 403 });
    }

    const sessions = courseId
      ? await prisma.teachingSession.findMany({
          where: { courseId },
          orderBy: [{ sessionDate: "desc" }, { startTime: "desc" }],
        })
      : [];

    return NextResponse.json({ courses, sessions, enrolledMembers: [], attendanceRecords: [] });
  } catch (err) {
    return errorResponse(err, "Error fetching attendance");
  }
}

async function resolveDbUserId(user: { id: string; email?: string | null; studentId?: string | null }): Promise<string | null> {
  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user.id },
        ...(user.email ? [{ email: user.email }] : []),
        ...(user.studentId ? [{ studentId: user.studentId }] : []),
      ],
    },
    select: { id: true },
  });
  if (dbUser) return dbUser.id;
  const fallback = await prisma.user.findFirst({
    where: { userRoles: { some: { role: { name: { in: ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN"] } } } } },
    select: { id: true },
  });
  return fallback?.id ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const parsed = saveSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload. sessionId and records are required.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { sessionId, records, finalize } = parsed.data;

    const target = await prisma.teachingSession.findUnique({
      where: { id: sessionId },
      select: { courseId: true },
    });
    if (!target) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    await assertCourseAccess(user, target.courseId);

    const dbUserId = await resolveDbUserId(user);

    // Only members enrolled in this course may receive attendance
    const enrolled = await prisma.courseEnrollment.findMany({
      where: { courseId: target.courseId },
      select: { memberId: true },
    });
    const enrolledIds = new Set(enrolled.map((e) => e.memberId));
    const invalid = records.filter((r) => !enrolledIds.has(r.memberId));
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: "FORBIDDEN: Some members are not part of this course team" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const r of records) {
        await tx.attendanceRecord.upsert({
          where: { sessionId_memberId: { sessionId, memberId: r.memberId } },
          update: {
            status: r.status,
            remarks: r.remarks || null,
            ...(dbUserId ? { lastUpdatedById: dbUserId } : {}),
          },
          create: {
            sessionId,
            memberId: r.memberId,
            status: r.status,
            remarks: r.remarks || null,
            ...(dbUserId ? { markedById: dbUserId } : {}),
          },
        });
      }

      if (finalize) {
        await tx.teachingSession.update({ where: { id: sessionId }, data: { status: "COMPLETED" } });
      }

      try {
        await tx.auditLog.create({
          data: {
            userId: dbUserId,
            action: finalize ? "ATTENDANCE_FINALIZED" : "ATTENDANCE_SAVED",
            entityType: "ATTENDANCE",
            entityId: sessionId,
            details: JSON.stringify({ count: records.length, markedBy: user.fullNameEn, finalized: !!finalize }),
          },
        });
      } catch {
        // non-blocking
      }
    });

    return NextResponse.json({
      success: true,
      message: finalize
        ? "Attendance saved and lesson marked as completed."
        : "Attendance saved successfully.",
    });
  } catch (err) {
    return errorResponse(err, "Error saving attendance");
  }
}
