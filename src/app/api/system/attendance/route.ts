import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAttendanceAdmin, getSession } from "@/lib/auth";
import { AttendanceStatus } from "@/types";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve sessions and attendance sheet for a given session or course.
 * All data comes from the SQLite database — no static array fallbacks.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const courseId = searchParams.get("courseId");

    // Load all active courses with their sessions
    const courses = await prisma.course.findMany({
      where: { status: "ACTIVE" },
      orderBy: { code: "asc" },
      include: {
        sessions: {
          orderBy: { sessionDate: "desc" },
        },
      },
    });

    let sessions: Array<{
      id: string;
      title: string;
      courseId: string;
      sessionDate: Date;
      status: string;
    }> = [];

    let attendanceRecords: Array<{
      id: string;
      memberId: string;
      status: string;
      remarks?: string | null;
    }> = [];

    let enrolledMembers: Array<{
      id: string;
      memberId: string;
      fullNameKh: string;
      fullNameEn: string;
      department: { code: string };
      academicYear: { code: string };
    }> = [];

    if (sessionId) {
      // Load the specific session's enrolled members and existing attendance records
      const targetSession = await prisma.teachingSession.findUnique({
        where: { id: sessionId },
        include: {
          course: {
            include: {
              enrollments: {
                orderBy: { enrolledAt: "asc" },
                include: {
                  member: {
                    include: {
                      department: true,
                      academicYear: true,
                    },
                  },
                },
              },
            },
          },
          attendance: true,
        },
      });

      if (targetSession) {
        enrolledMembers = targetSession.course.enrollments.map((e) => ({
          id: e.member.id,
          memberId: e.member.memberId,
          fullNameKh: e.member.fullNameKh,
          fullNameEn: e.member.fullNameEn,
          department: { code: e.member.department?.code ?? "" },
          academicYear: { code: e.member.academicYear?.code ?? "" },
        }));

        attendanceRecords = targetSession.attendance.map((a) => ({
          id: a.id,
          memberId: a.memberId,
          status: a.status,
          remarks: a.remarks,
        }));
      }
    } else if (courseId) {
      // Load sessions for a specific course
      sessions = await prisma.teachingSession.findMany({
        where: { courseId },
        orderBy: { sessionDate: "desc" },
      });
    }

    return NextResponse.json({
      courses,
      sessions,
      enrolledMembers,
      attendanceRecords,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching attendance";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * POST: Mark or save attendance for an entire session.
 * Only Super Admin, STJ Admin, and STJ President can use this endpoint.
 * Course Leaders use /api/leader/attendance instead.
 */
export async function POST(req: NextRequest) {
  try {
    const adminUser = await requireAttendanceAdmin();
    const body = await req.json();

    const { sessionId, records, finalize } = body as {
      sessionId: string;
      records: Array<{ memberId: string; status: AttendanceStatus; remarks?: string }>;
      finalize?: boolean;
    };

    if (!sessionId || !Array.isArray(records)) {
      return NextResponse.json(
        { error: "Invalid request payload. sessionId and records are required." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      for (const r of records) {
        await tx.attendanceRecord.upsert({
          where: {
            sessionId_memberId: {
              sessionId,
              memberId: r.memberId,
            },
          },
          update: {
            status: r.status,
            remarks: r.remarks,
            lastUpdatedById: adminUser.id,
          },
          create: {
            sessionId,
            memberId: r.memberId,
            status: r.status,
            remarks: r.remarks,
            markedById: adminUser.id,
          },
        });
      }

      if (finalize) {
        await tx.teachingSession.update({
          where: { id: sessionId },
          data: { status: "COMPLETED" },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: adminUser.id,
          action: finalize ? "ATTENDANCE_FINALIZED" : "ATTENDANCE_SAVED",
          entityType: "ATTENDANCE",
          entityId: sessionId,
          details: JSON.stringify({
            count: records.length,
            markedBy: adminUser.fullNameEn,
            finalized: !!finalize,
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: finalize
        ? "Attendance successfully saved and session marked as completed."
        : "Attendance records saved successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error saving attendance";
    const status = msg.includes("FORBIDDEN") ? 403 : msg.includes("UNAUTHORIZED") ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
