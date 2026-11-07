import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { SessionUser, RoleName } from "@/types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "stj_secure_fallback_secret_key_itc_2026_min_32_chars"
);

const SESSION_COOKIE_NAME = "stj_session";
const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days in seconds

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    fullNameKh: user.fullNameKh,
    fullNameEn: user.fullNameEn,
    displayName: user.displayName || null,
    studentId: user.studentId || null,
    memberId: user.memberId || null,
    profileImage: user.profileImage || null,
    departmentCode: user.departmentCode || null,
    academicYearCode: user.academicYearCode || null,
    roles: user.roles,
    courseIds: user.courseIds || [],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      fullNameKh: payload.fullNameKh as string,
      fullNameEn: payload.fullNameEn as string,
      displayName: (payload.displayName as string) || null,
      studentId: (payload.studentId as string) || null,
      memberId: (payload.memberId as string) || null,
      profileImage: (payload.profileImage as string) || null,
      departmentCode: (payload.departmentCode as string) || null,
      academicYearCode: (payload.academicYearCode as string) || null,
      roles: (payload.roles as RoleName[]) || [],
      courseIds: (payload.courseIds as string[]) || [],
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Session required");
  }
  return session;
}

export async function requireRole(allowedRoles: RoleName[]): Promise<SessionUser> {
  const session = await requireAuth();
  const hasRole = session.roles.some((r) => allowedRoles.includes(r));
  if (!hasRole) {
    throw new Error("FORBIDDEN: Insufficient role permissions");
  }
  return session;
}

/** Roles with full management power over teams, schedules, sessions and attendance. */
export const FULL_MANAGER_ROLES: RoleName[] = ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN"];

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(FULL_MANAGER_ROLES);
}

/**
 * Only the STJ President (and system admins) may create academic years, assign
 * course leaders, assign team members and set weekly schedules.
 */
export async function requirePresident(): Promise<SessionUser> {
  return requireRole(FULL_MANAGER_ROLES);
}

/**
 * Attendance and lesson management: STJ President / admins (any course) and
 * Course Leaders (only their own course, see getManageableCourseIds).
 */
export async function requireTeamManager(): Promise<SessionUser> {
  return requireRole([...FULL_MANAGER_ROLES, "COURSE_LEADER"]);
}

/** Kept for backwards compatibility with older routes. */
export async function requireAttendanceAdmin(): Promise<SessionUser> {
  return requireTeamManager();
}

export function isFullManager(user: SessionUser): boolean {
  return user.roles.some((r) => FULL_MANAGER_ROLES.includes(r));
}

/**
 * Returns null when the user can manage every course (President/admin),
 * otherwise the list of course ids the user leads (read from the database).
 */
export async function getManageableCourseIds(user: SessionUser): Promise<string[] | null> {
  if (isFullManager(user)) return null;
  return user.courseIds ?? [];
}

/** Throws FORBIDDEN unless the user may manage the given course. */
export async function assertCourseAccess(user: SessionUser, courseId: string): Promise<void> {
  const ids = await getManageableCourseIds(user);
  if (ids !== null && !ids.includes(courseId)) {
    throw new Error("FORBIDDEN: You can only manage your own course");
  }
}

/**
 * Validate that a Course Leader is assigned to the specified course
 */
export async function verifyCourseLeaderAccess(userId: string, courseId: string): Promise<boolean> {
  const session = await getSession();
  return session?.id === userId && (session.courseIds ?? []).includes(courseId);
}
