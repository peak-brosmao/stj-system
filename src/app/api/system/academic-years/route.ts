import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Initial Operational Academic Years
let OPERATIONAL_YEARS = [
  {
    id: "ay-2025-2026",
    yearCode: "2025-2026",
    label: "ឆ្នាំសិក្សា ២០២៥~២០២៦",
    startDate: "2025-10-01",
    endDate: "2026-07-31",
    isCurrent: false,
    status: "ARCHIVED",
    membersCount: 32,
    sessionsCount: 24,
    attendanceRate: 93.5,
  },
  {
    id: "ay-2026-2027",
    yearCode: "2026-2027",
    label: "ឆ្នាំសិក្សា ២០២៦~២០២៧",
    startDate: "2026-10-01",
    endDate: "2027-07-31",
    isCurrent: true,
    status: "ACTIVE",
    membersCount: 39,
    sessionsCount: 12,
    attendanceRate: 91.4,
  },
  {
    id: "ay-2027-2028",
    yearCode: "2027-2028",
    label: "ឆ្នាំសិក្សា ២០២៧~២០២៨",
    startDate: "2027-10-01",
    endDate: "2028-07-31",
    isCurrent: false,
    status: "UPCOMING",
    membersCount: 0,
    sessionsCount: 0,
    attendanceRate: 0,
  },
];

const ENGINEERING_LEVELS = [
  { code: "I1", label: "Ingénieur 1ère Année (Year 1)", order: 1, membersCount: 0 },
  { code: "I2", label: "Ingénieur 2ème Année (Year 2)", order: 2, membersCount: 17 },
  { code: "I3", label: "Ingénieur 3ème Année (Year 3)", order: 3, membersCount: 16 },
  { code: "I4", label: "Ingénieur 4ème Année (Year 4)", order: 4, membersCount: 3 },
  { code: "I5", label: "Ingénieur 5ème Année (Year 5)", order: 5, membersCount: 3 },
];

export async function GET() {
  try {
    let currentSetting = null;
    try {
      currentSetting = await prisma.systemSetting.findUnique({
        where: { key: "academic_year_current" },
      });
    } catch {
      // offline fallback
    }

    const currentYearCode = currentSetting?.value || "2026-2027";

    const years = OPERATIONAL_YEARS.map((y) => ({
      ...y,
      isCurrent: y.yearCode === currentYearCode,
    }));

    return NextResponse.json({
      operationalYears: years,
      engineeringLevels: ENGINEERING_LEVELS,
      currentYearCode,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching academic years";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { yearCode, label, startDate, endDate } = body;

    if (!yearCode || !label) {
      return NextResponse.json({ error: "Year code and label are required" }, { status: 400 });
    }

    const exists = OPERATIONAL_YEARS.some((y) => y.yearCode === yearCode);
    if (exists) {
      return NextResponse.json({ error: "Academic year already exists" }, { status: 409 });
    }

    const newYear = {
      id: `ay-${yearCode}`,
      yearCode,
      label,
      startDate: startDate || `${yearCode.split("-")[0]}-10-01`,
      endDate: endDate || `${yearCode.split("-")[1]}-07-31`,
      isCurrent: false,
      status: "UPCOMING",
      membersCount: 0,
      sessionsCount: 0,
      attendanceRate: 0,
    };

    OPERATIONAL_YEARS.push(newYear);

    return NextResponse.json({ success: true, academicYear: newYear });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating academic year";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { yearCode, action } = body;

    if (action === "SET_CURRENT") {
      try {
        await prisma.systemSetting.upsert({
          where: { key: "academic_year_current" },
          update: { value: yearCode },
          create: { key: "academic_year_current", value: yearCode },
        });
      } catch {
        // offline fallback
      }

      OPERATIONAL_YEARS = OPERATIONAL_YEARS.map((y) => ({
        ...y,
        isCurrent: y.yearCode === yearCode,
        status: y.yearCode === yearCode ? "ACTIVE" : y.status,
      }));

      return NextResponse.json({ success: true, currentYearCode: yearCode });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating academic year";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
