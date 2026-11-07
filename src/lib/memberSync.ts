import { backendFetch } from "@/lib/backendProxy";

export interface LiveMemberRecord {
  id: string;
  memberId: string;
  studentId: string;
  fullNameKh: string;
  fullNameEn: string;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  status: string;
  departmentId?: string;
  academicYearId?: string;
  department?: { id?: string; code: string; nameKh?: string };
  academicYear?: { id?: string; code: string; label?: string };
  courseCode?: string | null;
  courseCodes?: string[];
  courses?: Array<{ id: string; code: string; titleKh: string; titleEn?: string }>;
  enrollments?: Array<{
    id?: string;
    courseId?: string;
    course: { id: string; code: string; titleKh: string; titleEn?: string };
  }>;
}

export interface LiveMembersLookup {
  list: LiveMemberRecord[];
  find: (criteria: {
    id?: string | null;
    memberId?: string | null;
    studentId?: string | null;
    email?: string | null;
    nameKh?: string | null;
    nameEn?: string | null;
  }) => LiveMemberRecord | undefined;
}

export async function fetchLiveMembersLookup(): Promise<LiveMembersLookup> {
  const list: LiveMemberRecord[] = [];
  const byId = new Map<string, LiveMemberRecord>();
  const byMemberId = new Map<string, LiveMemberRecord>();
  const byStudentId = new Map<string, LiveMemberRecord>();
  const byEmail = new Map<string, LiveMemberRecord>();

  const registerRecord = (rec: LiveMemberRecord) => {
    list.push(rec);
    if (rec.id) byId.set(rec.id.toLowerCase(), rec);
    if (rec.memberId) byMemberId.set(rec.memberId.toLowerCase(), rec);
    if (rec.studentId) byStudentId.set(rec.studentId.toLowerCase(), rec);
    if (rec.email) byEmail.set(rec.email.toLowerCase(), rec);
  };

  try {
    const res = await backendFetch("members");
    if (res.ok) {
      const data = await res.json().catch(() => null);
      const rawMembers = Array.isArray(data?.members) ? data.members : [];
      for (const m of rawMembers) {
        if (!m || typeof m !== "object") continue;
        registerRecord({
          id: String(m.id || m.memberId || ""),
          memberId: String(m.memberId || m.member_id || ""),
          studentId: String(m.studentId || m.student_id || ""),
          fullNameKh: String(m.fullNameKh || m.full_name_kh || ""),
          fullNameEn: String(m.fullNameEn || m.full_name_en || ""),
          gender: m.gender ?? null,
          phone: m.phone ?? null,
          email: m.email ?? null,
          status: String(m.status || "ACTIVE"),
          departmentId: m.departmentId,
          academicYearId: m.academicYearId,
          department:
            m.department ||
            (m.departmentCode
              ? { code: m.departmentCode, nameKh: m.departmentNameKh || m.departmentCode }
              : undefined),
          academicYear:
            m.academicYear ||
            (m.yearCode ? { code: m.yearCode, label: m.yearLabel || m.yearCode } : undefined),
          courseCode: m.courseCode ?? null,
          courseCodes: Array.isArray(m.courseCodes) ? m.courseCodes : [],
          courses: Array.isArray(m.courses) ? m.courses : [],
          enrollments: Array.isArray(m.enrollments) ? m.enrollments : [],
        });
      }
    }
  } catch {
    // Ignore and check hierarchy endpoint below if list is empty
  }

  return {
    list,
    find({ id, memberId, studentId, email, nameKh, nameEn }) {
      if (id && byId.has(id.toLowerCase())) return byId.get(id.toLowerCase());
      if (id && byMemberId.has(id.toLowerCase())) return byMemberId.get(id.toLowerCase());
      if (id && byStudentId.has(id.toLowerCase())) return byStudentId.get(id.toLowerCase());
      if (memberId && byMemberId.has(memberId.toLowerCase())) return byMemberId.get(memberId.toLowerCase());
      if (memberId && byId.has(memberId.toLowerCase())) return byId.get(memberId.toLowerCase());
      if (memberId && byStudentId.has(memberId.toLowerCase())) return byStudentId.get(memberId.toLowerCase());
      if (studentId && byStudentId.has(studentId.toLowerCase())) return byStudentId.get(studentId.toLowerCase());
      if (email && byEmail.has(email.toLowerCase())) return byEmail.get(email.toLowerCase());
      if (email) {
        const prefix = email.split("@")[0]?.toLowerCase();
        if (prefix && byStudentId.has(prefix)) return byStudentId.get(prefix);
      }
      if (nameKh) {
        const matchKh = list.find((m) => m.fullNameKh === nameKh);
        if (matchKh) return matchKh;
      }
      if (nameEn) {
        const matchEn = list.find((m) => m.fullNameEn.toLowerCase() === nameEn.toLowerCase());
        if (matchEn) return matchEn;
      }
      return undefined;
    },
  };
}
