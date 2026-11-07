import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "stj_secure_fallback_secret_key_itc_2026_min_32_chars"
);

const SESSION_COOKIE_NAME = "stj_session";

const ADMIN_ROLES = ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN", "STUDENT_ASSOCIATION"];
const LEADER_ROLES = ["COURSE_LEADER", ...ADMIN_ROLES];
const ATTENDANCE_ROLES = ["STJ_PRESIDENT", "STUDENT_ASSOCIATION", "COURSE_LEADER"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Static and public assets pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/organization") ||
    pathname.startsWith("/api/share") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/logo") ||
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/programs" ||
    pathname === "/activities" ||
    pathname === "/news" ||
    pathname === "/structure" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname.startsWith("/share")
  ) {
    return NextResponse.next();
  }

  // 2. Decode session
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let sessionPayload: any = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      sessionPayload = payload;
    } catch {
      sessionPayload = null;
    }
  }

  const isAuthenticated = !!sessionPayload;
  const roles: string[] = sessionPayload?.roles || [];
  const isAdmin = roles.some((r) => ADMIN_ROLES.includes(r));
  const isLeader = roles.some((r) => LEADER_ROLES.includes(r));

  // 3. Login routes: /portal/login, /system/login, /leader/login
  if (pathname === "/portal/login" || pathname === "/system/login" || pathname === "/leader/login") {
    // If accessing legacy login URLs, redirect to unified /portal/login
    if (pathname !== "/portal/login") {
      return NextResponse.redirect(new URL("/portal/login", req.url));
    }
    // If already authenticated on /portal/login, redirect to appropriate home
    if (isAuthenticated) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/system/dashboard", req.url));
      } else if (isLeader) {
        return NextResponse.redirect(new URL("/leader/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/portal/member", req.url));
      }
    }
    return NextResponse.next();
  }

  // 4. Unauthenticated users cannot access any protected routes
  if (!isAuthenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. System administration routes (/system/* and /api/system/*)
  if (pathname.startsWith("/system") || pathname.startsWith("/api/system")) {
    const isAttendanceRoute =
      pathname === "/system/attendance" ||
      pathname.startsWith("/api/system/attendance");

    if (isAttendanceRoute) {
      if (!roles.some((role) => ATTENDANCE_ROLES.includes(role))) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json(
            { error: "Forbidden: Attendance management privileges required" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(
          new URL(isAuthenticated ? "/portal/member" : "/portal/login", req.url)
        );
      }
      return NextResponse.next();
    }

    // API endpoints that course leaders are authorized to read for team management
    const leaderAllowedApis = [
      "/api/system/members",
      "/api/system/share-links",
      "/api/system/sessions",
      "/api/system/attendance",
      "/api/system/stats",
    ];
    const isLeaderAllowedApi = leaderAllowedApis.some((api) => pathname.startsWith(api));

    if (pathname.startsWith("/api/")) {
      if (isLeaderAllowedApi) {
        if (!isLeader) {
          return NextResponse.json({ error: "Forbidden: Member is read-only" }, { status: 403 });
        }
      } else {
        if (!isAdmin) {
          return NextResponse.json({ error: "Forbidden: System Admin privileges required" }, { status: 403 });
        }
      }
      return NextResponse.next();
    }

    // Web UI: only actual Admins can access /system/*
    if (!isAdmin) {
      const target = isLeader ? "/leader/dashboard" : "/portal/member";
      return NextResponse.redirect(new URL(target, req.url));
    }
    return NextResponse.next();
  }

  // 6. Leader routes (/leader/*) and duplicate /portal/leader
  if (pathname.startsWith("/leader") || pathname === "/portal/leader") {
    if (!isLeader) {
      // Regular members strictly blocked from leader desk
      return NextResponse.redirect(new URL("/portal/member", req.url));
    }
    // If a leader visits /portal/leader, canonical destination is /leader/dashboard
    if (pathname === "/portal/leader") {
      return NextResponse.redirect(new URL("/leader/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 7. General /portal/dashboard route: route dynamically based on role
  if (pathname === "/portal/dashboard") {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/system/dashboard", req.url));
    } else if (isLeader) {
      return NextResponse.redirect(new URL("/leader/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/portal/member", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
