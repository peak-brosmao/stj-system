import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateAttendanceRate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("id");

    if (courseId) {
      const dbCourse = await prisma.course.findFirst({
        where: {
          OR: [{ id: courseId }, { code: courseId }, { slug: courseId }],
        },
        include: {
          leaders: { include: { user: true } },
          sessions: { orderBy: { sessionDate: "desc" } },
          enrollments: { include: { member: true } },
        },
      });

      if (dbCourse) {
        return NextResponse.json({
          success: true,
          course: {
            id: dbCourse.id,
            code: dbCourse.code,
            slug: dbCourse.slug,
            titleKh: dbCourse.titleKh,
            titleEn: dbCourse.titleEn,
            titleFr: dbCourse.titleFr,
            category: dbCourse.category,
            academicTerm: dbCourse.academicTerm || "",
            descriptionKh: dbCourse.descriptionKh,
            descriptionEn: dbCourse.descriptionEn,
            leaders: dbCourse.leaders.map((l) => ({
              fullNameKh: l.user.fullNameKh,
              fullNameEn: l.user.fullNameEn,
              email: l.user.email,
              phone: l.user.phone || "-",
            })),
            sessions: dbCourse.sessions.map((s) => ({
              id: s.id,
              title: s.title,
              date: s.sessionDate.toISOString().split("T")[0],
              time: `${s.startTime} - ${s.endTime}`,
              room: s.room,
              status: s.status,
            })),
            enrolledMembers: dbCourse.enrollments.map((e) => ({
              memberId: e.member.memberId,
              fullNameKh: e.member.fullNameKh,
              fullNameEn: e.member.fullNameEn,
            })),
          },
        });
      }
    }

    // Courses I belong to, read from the SQLite database (stj.db)
    const me = await prisma.user.findUnique({
      where: { id: session.id },
      select: { memberRecordId: true },
    });
    const memberId = me?.memberRecordId || "__none__";
    const isManager = session.roles.some((r) =>
      ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN", "STUDENT_ASSOCIATION"].includes(r)
    );

    const dbCourses = await prisma.course.findMany({
      where: {
        status: "ACTIVE",
        ...(isManager
          ? {}
          : {
              OR: [
                { enrollments: { some: { memberId } } },
                { leaders: { some: { userId: session.id } } },
              ],
            }),
      },
      include: {
        leaders: { include: { user: true } },
        enrollments: true,
        sessions: {
          where: { status: { not: "CANCELLED" } },
          include: { attendance: { where: { memberId } } },
        },
      },
      orderBy: { code: "asc" },
    });

    const courses = dbCourses.map((c) => {
      const leaderName =
        c.leaders.length > 0
          ? `${c.leaders[0].user.fullNameKh} (${c.leaders[0].user.fullNameEn})`
          : "-";

      const mine = c.sessions.flatMap((s) => s.attendance);
      const present = mine.filter((r) => r.status === "PRESENT").length;
      const late = mine.filter((r) => r.status === "LATE").length;
      const excused = mine.filter((r) => r.status === "EXCUSED").length;
      const isLeaderHere = c.leaders.some((l) => l.userId === session.id);

      return {
        id: c.id,
        code: c.code,
        slug: c.slug,
        titleKh: c.titleKh,
        titleEn: c.titleEn,
        category: c.category,
        academicTerm: c.academicTerm || "",
        description: c.descriptionKh,
        leaderName,
        enrolledMembersCount: c.enrollments.length,
        totalSessions: c.sessions.length,
        completedSessions: c.sessions.filter((s) => s.status === "COMPLETED").length,
        myAttendanceRate: mine.length > 0 ? calculateAttendanceRate(present, late, mine.length, excused) : null,
        roleInCourse: isLeaderHere ? "Course Leader" : "Team Tutor",
      };
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Portal courses error:", error);
    return NextResponse.json({ error: "Failed to load courses from database" }, { status: 500 });
  }
}
