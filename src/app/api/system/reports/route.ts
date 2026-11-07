import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.search;
    const [reportsRes, sessionsRes] = await Promise.all([
      backendFetch(`reports${query}`),
      backendFetch("sessions").catch(() => null),
    ]);

    const data = await reportsRes.json().catch(() => null);
    if (!reportsRes.ok || !data) {
      return NextResponse.json(
        data || { error: "Failed to load reports" },
        { status: reportsRes.status || 500 }
      );
    }

    const sessionsData =
      sessionsRes && sessionsRes.ok ? await sessionsRes.json().catch(() => null) : null;
    const allSessions = Array.isArray(sessionsData?.sessions) ? sessionsData.sessions : [];

    // Count unmarked SCHEDULED sessions per courseCode so future lessons don't penalize tutors as ABSENT
    const unmarkedScheduledByCourse = new Map<string, number>();
    const totalNonCancelledByCourse = new Map<string, number>();
    let recordedSessionsTotal = 0;

    for (const s of allSessions) {
      if (!s || s.status === "CANCELLED") continue;
      const code = String(s.courseCode || s.course?.code || "");
      if (!code) continue;
      totalNonCancelledByCourse.set(code, (totalNonCancelledByCourse.get(code) || 0) + 1);
      const totalAtt = Number(s.totalAttendance ?? s._count?.attendance ?? 0);
      if (s.status === "SCHEDULED" && totalAtt === 0) {
        unmarkedScheduledByCourse.set(code, (unmarkedScheduledByCourse.get(code) || 0) + 1);
      } else {
        recordedSessionsTotal++;
      }
    }

    const rawMembers = Array.isArray(data.members) ? data.members : [];
    let totalAttended = 0;
    let totalEligible = 0;
    let membersWithSessionsCount = 0;
    let highPerformersCount = 0;

    const members = rawMembers.map((m: Record<string, any>) => {
      if (m.isExecutive) return m;

      const memberCourses: string[] = Array.isArray(m.courses)
        ? m.courses
        : m.course
        ? [String(m.course)]
        : [];

      const expectedAll = memberCourses.reduce(
        (sum, c) => sum + (totalNonCancelledByCourse.get(c) || 0),
        0
      );
      const unmarkedScheduled = memberCourses.reduce(
        (sum, c) => sum + (unmarkedScheduledByCourse.get(c) || 0),
        0
      );

      let present = Number(m.present || 0);
      let late = Number(m.late || 0);
      let absent = Number(m.absent || 0);
      let excused = Number(m.excused || 0);
      let total = Number(m.total || 0);

      // If backend ReportController included unmarked SCHEDULED sessions as ABSENT, deduct them
      if (unmarkedScheduled > 0 && total === expectedAll && absent >= unmarkedScheduled) {
        absent -= unmarkedScheduled;
        total -= unmarkedScheduled;
      }

      const eligible = Math.max(0, total - excused);
      let rate = 0;
      if (total > 0) {
        membersWithSessionsCount++;
        rate = eligible > 0 ? Math.round(((present + late * 0.5) / eligible) * 100) : 100;
        totalAttended += present + late * 0.5;
        totalEligible += eligible;
        if (rate >= 90) {
          highPerformersCount++;
        }
      }

      return {
        ...m,
        present,
        late,
        absent,
        excused,
        total,
        rate,
        hasSessions: total > 0,
      };
    });

    const averageRate =
      totalEligible > 0 ? Math.round((totalAttended / totalEligible) * 100) : 100;

    return NextResponse.json({
      ...data,
      summary: {
        ...(data.summary || {}),
        totalSessions: allSessions.length > 0 ? allSessions.length : data.summary?.totalSessions ?? 0,
        recordedSessions: recordedSessionsTotal,
        averageRate,
        highPerformers: highPerformersCount,
        membersWithSessionsCount,
      },
      members,
    });
  } catch {
    return proxyToBackend(req, "reports");
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "reports");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
