import { NextRequest, NextResponse } from "next/server";
import { backendFetch, proxyToBackend } from "@/lib/backendProxy";
import { fetchLiveMembersLookup, LiveMembersLookup } from "@/lib/memberSync";
import { decodeRichNotes, isSyllabusSession } from "@/lib/richContent";

export const dynamic = "force-dynamic";

function normalizeCourse(
  raw: Record<string, any>,
  membersLookup: LiveMembersLookup,
  allBackendSessions: Record<string, any>[]
) {
  const courseCode = String(raw.code || "").toUpperCase();
  const courseId = String(raw.id || "");

  const rawLeaders = Array.isArray(raw.leaders) ? raw.leaders : [];
  const leaders = rawLeaders.map((l: Record<string, any>) => {
    const rawKh = l.fullNameKh || l.full_name_kh || "";
    const rawEn = l.fullNameEn || l.full_name_en || "";
    const email = l.email || "";
    const studentId = l.studentId || l.student_id || email.split("@")[0] || "";
    const memberId = l.memberId || l.member_id || "";

    const liveMatch = membersLookup.find({
      id: memberId,
      memberId,
      studentId,
      email,
      nameKh: rawKh,
      nameEn: rawEn,
    });

    return {
      fullNameKh: liveMatch?.fullNameKh || rawKh || "ប្រធានក្រុម",
      fullNameEn: liveMatch?.fullNameEn || rawEn || "Course Leader",
      email: liveMatch?.email || email || "",
      phone: liveMatch?.phone || l.phone || "",
      studentId: liveMatch?.studentId || studentId || "",
      department: liveMatch?.department?.code || l.department || "ITC",
      year: liveMatch?.academicYear?.code || l.year || "",
    };
  });

  const rawMembers = Array.isArray(raw.enrolledMembers) ? raw.enrolledMembers : [];
  const enrolledMembers = rawMembers.map((m: Record<string, any>, idx: number) => {
    const rawMemberId = String(m.memberId || m.member_id || "");
    const rawStudentId = String(m.studentId || m.student_id || "");
    const rawKh = String(m.fullNameKh || m.full_name_kh || "");
    const rawEn = String(m.fullNameEn || m.full_name_en || "");

    const liveMatch = membersLookup.find({
      id: rawMemberId,
      memberId: rawMemberId,
      studentId: rawStudentId,
      nameKh: rawKh,
      nameEn: rawEn,
    });

    return {
      memberId: liveMatch?.memberId || rawMemberId || `STJ-${idx + 1}`,
      studentId: liveMatch?.studentId || rawStudentId || rawMemberId || "",
      fullNameKh: liveMatch?.fullNameKh || rawKh || "សមាជិក STJ",
      fullNameEn: liveMatch?.fullNameEn || rawEn || "STJ Member",
      department: liveMatch?.department?.code || m.department || "",
      year: liveMatch?.academicYear?.code || m.year || "",
    };
  });

  const leaderName =
    leaders[0]?.fullNameKh ||
    leaders[0]?.fullNameEn ||
    raw.leaderName ||
    "មិនទាន់ចាត់តាំង";

  // Match backend sessions for this course to enrich with Rich Text & R2 attachments
  const matchingBackendSessions = allBackendSessions.filter((bs) => {
    const bCode = String(bs.courseCode || bs.course?.code || "").toUpperCase();
    const bId = String(bs.courseId || bs.course?.id || "");
    return (courseCode && bCode === courseCode) || (courseId && bId === courseId);
  });

  const sessionMap = new Map<string, Record<string, any>>();
  let syllabusData: {
    notes: string;
    richContent: string;
    attachments: any[];
  } | null = null;

  for (const bs of matchingBackendSessions) {
    const decoded = decodeRichNotes(bs.notes);
    if (isSyllabusSession(bs)) {
      syllabusData = decoded;
      continue;
    }
    sessionMap.set(String(bs.id), {
      ...bs,
      notes: decoded.notes,
      richContent: decoded.richContent,
      attachments: decoded.attachments,
    });
  }

  const rawSessions = Array.isArray(raw.sessions) ? raw.sessions : [];
  const combinedSessionsMap = new Map<string, Record<string, any>>();

  for (const s of rawSessions) {
    if (isSyllabusSession(s)) continue;
    combinedSessionsMap.set(String(s.id), s);
  }
  for (const [id, bs] of sessionMap.entries()) {
    if (!combinedSessionsMap.has(id)) {
      combinedSessionsMap.set(id, {
        id: bs.id,
        title: bs.title,
        date: String(bs.sessionDate || bs.date || "").slice(0, 10),
        time:
          bs.time ||
          (bs.startTime && bs.endTime ? `${bs.startTime} - ${bs.endTime}` : "11:30 - 13:00"),
        room: bs.room || "SF1 & SF2",
        status: bs.status || "SCHEDULED",
        notes: bs.notes,
        richContent: bs.richContent,
        attachments: bs.attachments,
      });
    }
  }

  const sessions = Array.from(combinedSessionsMap.values()).map((s: Record<string, any>) => {
    const enriched = sessionMap.get(String(s.id));
    const decoded = enriched
      ? {
          notes: enriched.notes,
          richContent: enriched.richContent,
          attachments: enriched.attachments,
        }
      : decodeRichNotes(s.notes);

    return {
      ...s,
      date: String(s.date || s.sessionDate || "").slice(0, 10),
      time:
        s.time ||
        (s.startTime && s.endTime ? `${s.startTime} - ${s.endTime}` : "11:30 - 13:00"),
      room: s.room || "SF1 & SF2",
      notes: decoded.notes,
      richContent: decoded.richContent,
      attachments: decoded.attachments,
    };
  });

  return {
    ...raw,
    slug: raw.slug || courseCode.toLowerCase(),
    leaderName,
    leaders,
    enrolledMembers,
    enrolledMembersCount: Number(raw.enrolledMembersCount ?? enrolledMembers.length),
    sessions,
    totalLessons: sessions.length,
    syllabus: syllabusData || { notes: "", richContent: "", attachments: [] },
  };
}

export async function GET(req: NextRequest) {
  try {
    const requestedId = (req.nextUrl.searchParams.get("id") || "").trim();
    const query = req.nextUrl.search;
    const [res, membersLookup, sessionsRes, allCoursesRes] = await Promise.all([
      backendFetch(`portal/courses${query}`),
      fetchLiveMembersLookup(),
      backendFetch("sessions").catch(() => null),
      requestedId ? backendFetch("courses").catch(() => null) : Promise.resolve(null),
    ]);
    const data = await res.json().catch(() => null);
    const sessionsData =
      sessionsRes && sessionsRes.ok ? await sessionsRes.json().catch(() => null) : null;
    const allBackendSessions: Record<string, any>[] = Array.isArray(sessionsData?.sessions)
      ? sessionsData.sessions
      : [];

    if (!res.ok || !data) {
      return NextResponse.json(
        {
          success: false,
          courses: [],
          course: null,
          error: data?.error || "Failed to load courses",
        },
        { status: res.status || 500 }
      );
    }

    if (requestedId) {
      let targetCourse = data.course && typeof data.course === "object" ? data.course : null;

      if (!targetCourse) {
        const lowerTarget = requestedId.toLowerCase();
        // Fallback 1: check portal/courses list without ?id=
        const listRes = await backendFetch("portal/courses").catch(() => null);
        const listData = listRes && listRes.ok ? await listRes.json().catch(() => null) : null;
        const enrolledList: Record<string, any>[] = Array.isArray(listData?.courses)
          ? listData.courses
          : [];
        targetCourse =
          enrolledList.find(
            (c) =>
              String(c.slug || "").toLowerCase() === lowerTarget ||
              String(c.code || "").toLowerCase() === lowerTarget ||
              String(c.id || "").toLowerCase() === lowerTarget
          ) || null;
      }

      if (!targetCourse && allCoursesRes && allCoursesRes.ok) {
        const lowerTarget = requestedId.toLowerCase();
        const sysData = await allCoursesRes.json().catch(() => null);
        const sysCourses: Record<string, any>[] = Array.isArray(sysData?.courses)
          ? sysData.courses
          : [];
        const matchedSys = sysCourses.find(
          (c) =>
            String(c.slug || "").toLowerCase() === lowerTarget ||
            String(c.code || "").toLowerCase() === lowerTarget ||
            String(c.id || "").toLowerCase() === lowerTarget
        );
        if (matchedSys) {
          targetCourse = {
            id: matchedSys.id,
            code: matchedSys.code,
            slug: matchedSys.slug || String(matchedSys.code || "").toLowerCase(),
            titleKh: matchedSys.titleKh || matchedSys.title_kh || matchedSys.name_kh || matchedSys.code,
            titleEn: matchedSys.titleEn || matchedSys.title_en || matchedSys.name_en || matchedSys.code,
            description: matchedSys.description || matchedSys.titleEn || matchedSys.title_en || "",
            descriptionKh: matchedSys.descriptionKh || matchedSys.titleKh || matchedSys.title_kh || "",
            academicTerm: matchedSys.academicYear || matchedSys.academic_year || "2026-2027",
            leaders: matchedSys.leaders || [],
            enrolledMembers: matchedSys.enrolledMembers || matchedSys.members || [],
            sessions: matchedSys.sessions || [],
          };
        }
      }

      if (targetCourse) {
        return NextResponse.json({
          ...data,
          success: true,
          course: normalizeCourse(targetCourse, membersLookup, allBackendSessions),
        });
      }

      return NextResponse.json({
        success: false,
        course: null,
        error: "Course not found",
      });
    }

    const courses = Array.isArray(data.courses)
      ? data.courses.map((c: Record<string, any>) =>
          normalizeCourse(c, membersLookup, allBackendSessions)
        )
      : [];
    return NextResponse.json({
      ...data,
      success: true,
      courses,
    });
  } catch {
    return NextResponse.json({ success: false, courses: [], course: null }, { status: 500 });
  }
}

async function forward(req: NextRequest) {
  return proxyToBackend(req, "portal/courses");
}

export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;
