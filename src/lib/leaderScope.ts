import { getSession } from "@/lib/auth";
import { backendFetch } from "@/lib/backendProxy";

export interface LeaderScope {
  authenticated: boolean;
  isSystemAdmin: boolean;
  isCourseLeader: boolean;
  userId?: string;
  studentId?: string | null;
  memberId?: string | null;
  assignedCourseIds: Set<string>;
  assignedCourseCodes: Set<string>;
  matchesCourse: (courseIdOrCode: string | null | undefined) => boolean;
}

const ADMIN_ROLES = new Set([
  "SUPER_ADMIN",
  "STJ_PRESIDENT",
  "STJ_ADMIN",
  "STUDENT_ASSOCIATION",
]);

export async function resolveLeaderScope(): Promise<LeaderScope> {
  const session = await getSession();
  const assignedCourseIds = new Set<string>();
  const assignedCourseCodes = new Set<string>();

  const addCourseRef = (idOrCode?: string | null) => {
    if (!idOrCode) return;
    const trimmed = String(idOrCode).trim();
    if (!trimmed) return;
    assignedCourseIds.add(trimmed);
    assignedCourseIds.add(trimmed.toLowerCase());
    assignedCourseIds.add(trimmed.toUpperCase());
    if (/^[A-Za-z]{3,6}\d{2,4}$/.test(trimmed)) {
      assignedCourseCodes.add(trimmed.toUpperCase());
      assignedCourseIds.add(`course-${trimmed.toLowerCase()}`);
    } else if (trimmed.toLowerCase().startsWith("course-")) {
      const code = trimmed.slice("course-".length).toUpperCase();
      assignedCourseCodes.add(code);
      assignedCourseIds.add(code);
    }
  };

  if (session?.courseIds) {
    for (const cid of session.courseIds) {
      addCourseRef(cid);
    }
  }

  const roles: string[] = Array.isArray(session?.roles) ? session.roles : [];
  let isSystemAdmin = roles.some((r) => ADMIN_ROLES.has(r));
  let isCourseLeader = !isSystemAdmin && roles.includes("COURSE_LEADER");

  // Query backend attendance / overview to get live assigned courses from course_leaders table
  if (!isSystemAdmin) {
    try {
      const attRes = await backendFetch("attendance");
      if (attRes.ok) {
        const attData = await attRes.json().catch(() => null);
        const courses = Array.isArray(attData?.courses) ? attData.courses : [];
        // If a non-admin has < 4 courses returned from /api/attendance, or session says COURSE_LEADER
        if (courses.length > 0 && (isCourseLeader || courses.length < 4)) {
          isCourseLeader = true;
          for (const c of courses) {
            addCourseRef(c?.id);
            addCourseRef(c?.code);
          }
        }
      }
    } catch {
      // ignore
    }

    if (assignedCourseCodes.size === 0) {
      try {
        const ovRes = await backendFetch("portal/overview");
        if (ovRes.ok) {
          const ovData = await ovRes.json().catch(() => null);
          const ovRoles: string[] = Array.isArray(ovData?.user?.roles) ? ovData.user.roles : [];
          if (ovRoles.some((r) => ADMIN_ROLES.has(r))) {
            isSystemAdmin = true;
            isCourseLeader = false;
          } else if (ovRoles.includes("COURSE_LEADER") || ovData?.leader?.courses) {
            isCourseLeader = true;
            const leaderCourses = Array.isArray(ovData?.leader?.courses)
              ? ovData.leader.courses
              : [];
            for (const c of leaderCourses) {
              addCourseRef(c?.id);
              addCourseRef(c?.code);
            }
          }
        }
      } catch {
        // ignore
      }
    }
  }

  const matchesCourse = (courseIdOrCode: string | null | undefined): boolean => {
    if (isSystemAdmin) return true;
    if (!courseIdOrCode) return false;
    const raw = String(courseIdOrCode).trim();
    if (!raw) return false;
    if (
      assignedCourseIds.has(raw) ||
      assignedCourseIds.has(raw.toLowerCase()) ||
      assignedCourseIds.has(raw.toUpperCase()) ||
      assignedCourseCodes.has(raw.toUpperCase())
    ) {
      return true;
    }
    return false;
  };

  return {
    authenticated: Boolean(session) || isSystemAdmin || isCourseLeader,
    isSystemAdmin,
    isCourseLeader,
    userId: session?.id,
    studentId: session?.studentId,
    memberId: session?.memberId,
    assignedCourseIds,
    assignedCourseCodes,
    matchesCourse,
  };
}

