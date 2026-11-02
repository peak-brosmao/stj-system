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

    const mandates = await prisma.stjMandate.findMany({
      include: {
        president: {
          select: {
            id: true,
            fullNameKh: true,
            fullNameEn: true,
            studentId: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { academicYear: "desc" },
    });

    const currentYearSetting = await prisma.systemSetting.findUnique({
      where: { key: "academic_year_current" },
    });

    return NextResponse.json({
      mandates,
      activeAcademicYear: currentYearSetting?.value || "2026-2027",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching mandates";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

