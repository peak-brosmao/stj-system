import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
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

export async function requireAdmin(): Promise<SessionUser> {
  return requireRole(["SUPER_ADMIN", "STJ_ADMIN"]);
}

/**
 * Strict rule: ONLY Super Admin or STJ Administrator can mark, edit, or delete attendance.
 * Course Leaders are strictly forbidden.
 */
export async function requireAttendanceAdmin(): Promise<SessionUser> {
  return requireRole(["SUPER_ADMIN", "STJ_ADMIN"]);
}

/**
 * Validate that a Course Leader is assigned to the specified course
 */
export async function verifyCourseLeaderAccess(userId: string, courseId: string): Promise<boolean> {
  const assignment = await prisma.courseLeader.findUnique({
    where: {
      courseId_userId: {
        courseId,
        userId,
      },
    },
  });
  return !!assignment;
}
