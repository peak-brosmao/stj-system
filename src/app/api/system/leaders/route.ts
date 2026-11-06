import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeamManager } from "@/lib/auth";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireTeamManager();

    // 1. Try Laravel API first if configured
    if (LARAVEL_API_BASE) {
      try {
        const remote = await fetchFromLaravel("leaders");
        if (remote && remote.ok) {
          const remoteData = await remote.json();
          if (remoteData && Array.isArray(remoteData.leaders) && remoteData.leaders.length > 0) {
            const normalized = remoteData.leaders.map((l: any) => ({
              id: l.id,
              userId: l.userId || l.id,
              fullNameKh: l.nameKh || l.fullNameKh || "",
              fullNameEn: l.nameEn || l.fullNameEn || "",
              email: l.email || "",
              phone: l.phone || "-",
              studentId: l.studentId || "-",
              status: l.status || "ACTIVE",
              courses: Array.isArray(l.courses) ? l.courses : [l.course || "-"],
              department: l.department || "-",
              academicYear: l.year || l.academicYear || "-",
            }));
            return NextResponse.json({ success: true, leaders: normalized });
          }
        }
      } catch (err) {
        console.warn("[Laravel Leaders Fetch Fallback]", err);
      }
    }

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

