import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
            academicTerm: dbCourse.academicTerm || "2026-2027 Semester 1",
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

    // Return list of courses from SQLite database (stj.db)
    const dbCourses = await prisma.course.findMany({
      where: { status: "ACTIVE" },
      include: {
        leaders: { include: { user: true } },
        enrollments: true,
        sessions: true,
      },
      orderBy: { code: "asc" },
    });

    const courses = dbCourses.map((c) => {
      const leaderName = c.leaders.length > 0
        ? `${c.leaders[0].user.fullNameKh} (${c.leaders[0].user.fullNameEn})`
        : "គណៈដឹកនាំ STJ";

      return {
        id: c.id,
        code: c.code,
        slug: c.slug,
        titleKh: c.titleKh,
        titleEn: c.titleEn,
        category: c.category,
        academicTerm: c.academicTerm || "2026-2027 Semester 1",
        description: c.descriptionKh,
        leaderName,
        enrolledMembersCount: c.enrollments.length,
        totalSessions: Math.max(c.sessions.length, 12),
        completedSessions: c.sessions.filter((s) => s.status === "COMPLETED").length,
        myAttendanceRate: 100,
        roleInCourse: session.roles.includes("COURSE_LEADER") ? "Course Leader" : "គ្រូបង្រៀនស្ម័គ្រចិត្ត",
      };
    });

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    console.error("Portal courses error:", error);
    return NextResponse.json({ error: "Failed to load courses from database" }, { status: 500 });
  }
}
