export type Locale = "km" | "en" | "fr";

export type RoleName =
  | "SUPER_ADMIN"
  | "STJ_PRESIDENT"
  | "STJ_ADMIN"
  | "STUDENT_ASSOCIATION"
  | "COURSE_LEADER"
  | "MEMBER";

export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED";

export type MemberStatus = "ACTIVE" | "ARCHIVED" | "SUSPENDED";

export type CourseStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

export type SessionStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type CorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SessionUser {
  id: string;
  email: string;
  fullNameKh: string;
  fullNameEn: string;
  displayName?: string | null;
  studentId?: string | null;
  memberId?: string | null;
  profileImage?: string | null;
  departmentCode?: string | null;
  academicYearCode?: string | null;
  roles: RoleName[];
  courseIds?: string[];
}

export interface AttendanceSummary {
  total: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
  rate: number;
}

export interface ShareLinkPayload {
  token: string;
  courseTitle: string;
  courseCode: string;
  sessionTitle?: string;
  sessionDate?: string;
  expiresAt?: string | null;
  showStats: boolean;
  records: Array<{
    memberId: string;
    studentId?: string | null;
    fullNameKh: string;
    fullNameEn: string;
    departmentCode: string;
    academicYearCode: string;
    status: AttendanceStatus;
    remarks?: string | null;
  }>;
  stats: AttendanceSummary;
}

