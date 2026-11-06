import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeamManager } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireTeamManager();

    const courses = await prisma.course.findMany({
      orderBy: { code: "asc" },
      include: {
        leaders: {
          include: {
            user: {
              select: {
                id: true,
                fullNameKh: true,
                fullNameEn: true,
                email: true,
                studentId: true,
                member: {
                  select: {
                    academicYear: true,
                    department: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            sessions: true,
          },
        },
      },
    });

    const formatted = courses.map((c) => {
      const leader = c.leaders[0]?.user;
      let leaderLabel = "មិនទាន់ចាត់តាំង";
      if (leader) {
        const year = leader.member?.academicYear?.code || "";
        const dept = leader.member?.department?.code || "";
        const badge = year && dept ? ` (${year}-${dept})` : "";
        leaderLabel = `${leader.fullNameKh || leader.fullNameEn}${badge}`.trim();
      }

      return {
        id: c.id,
        code: c.code,
        slug: c.slug,
        titleKh: c.titleKh,
        titleEn: c.titleEn,
        category: c.category || "មូលដ្ឋានគ្រឹះវិស្វកម្ម",
        term: c.academicTerm || "ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
        status: c.status,
        leaders: leaderLabel,
        enrolled: c._count.enrollments,
        sessionsCount: c._count.sessions,
      };
    });

    return NextResponse.json({
      success: true,
      courses: formatted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading courses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
