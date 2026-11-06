import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeamManager } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireTeamManager();

    const leaders = await prisma.courseLeader.findMany({
      include: {
        course: true,
        user: {
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
      orderBy: { course: { code: "asc" } },
    });

    const formatted = leaders.map((l) => ({
      id: l.id,
      userId: l.user.id,
      fullNameKh: l.user.fullNameKh || "",
      fullNameEn: l.user.fullNameEn || "",
      email: l.user.email,
      phone: l.user.phone || l.user.member?.phone || "-",
      studentId: l.user.studentId || l.user.member?.studentId || "-",
      status: l.user.status,
      courses: [`${l.course.code} - ${l.course.titleKh}`],
      department: l.user.member?.department?.code || "-",
      academicYear: l.user.member?.academicYear?.code || "-",
    }));

    return NextResponse.json({
      success: true,
      leaders: formatted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading leaders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

