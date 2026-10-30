import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { RoleName } from "@/types";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  expectedPortal: z.enum(["system", "leader", "portal"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid email or password format", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, expectedPortal } = validated.data;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          courseLeaders: true,
        },
      });
    } catch {
      // Offline / Pre-flight Fallback Accounts for Official STJ Roles
      if (password === "ITC@STJ2026!") {
        if (email === "admin@itc.edu.kh") {
          const fallbackUser = {
            id: "system-admin-initial",
            email: "admin@itc.edu.kh",
            fullNameKh: "គណៈគ្រប់គ្រង STJ កណ្តាល",
            fullNameEn: "Central STJ Administrator",
            roles: ["SUPER_ADMIN" as RoleName],
            courseIds: [],
          };
          const token = await createSessionToken(fallbackUser);
          await setSessionCookie(token);
          return NextResponse.json({
            user: fallbackUser,
            redirectUrl: "/system/dashboard",
          });
        }

        if (email === "phal.david@itc.edu.kh") {
          const fallbackUser = {
            id: "stj-david-admin",
            email: "phal.david@itc.edu.kh",
            fullNameKh: "ផល ដាវីត",
            fullNameEn: "PHAL David",
            roles: ["STJ_ADMIN" as RoleName, "MEMBER" as RoleName],
            courseIds: [],
          };
          const token = await createSessionToken(fallbackUser);
          await setSessionCookie(token);
          return NextResponse.json({
            user: fallbackUser,
            redirectUrl: "/system/dashboard",
          });
        }

        if (email === "leang.jingheng@itc.edu.kh" || email === "leader.prog@itc.edu.kh") {
          const fallbackUser = {
            id: "leader-prog-jingheng",
            email: "leang.jingheng@itc.edu.kh",
            fullNameKh: "លាង ជីងហេង",
            fullNameEn: "LEANG JINGHENG",
            roles: ["COURSE_LEADER" as RoleName, "MEMBER" as RoleName],
            courseIds: ["c-prog"],
          };
          const token = await createSessionToken(fallbackUser);
          await setSessionCookie(token);
          return NextResponse.json({
            user: fallbackUser,
            redirectUrl: "/portal/leader",
          });
        }

        if (email === "peak.brosmao@itc.edu.kh") {
          const fallbackUser = {
            id: "member-peak-brosmao",
            email: "peak.brosmao@itc.edu.kh",
            fullNameKh: "ពាក់ ប្រុសម៉ៅ",
            fullNameEn: "PEAK BROSMAO",
            roles: ["MEMBER" as RoleName],
            courseIds: ["c-prog"],
          };
          const token = await createSessionToken(fallbackUser);
          await setSessionCookie(token);
          return NextResponse.json({
            user: fallbackUser,
            redirectUrl: "/portal/member",
          });
        }
      }

      return NextResponse.json(
        { error: "Database unreachable and credentials did not match official pre-configured accounts." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Account has been suspended or deactivated. Contact STJ Administration." },
        { status: 403 }
      );
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const roles = user.userRoles.map((ur) => ur.role.name as RoleName);
    const courseIds = user.courseLeaders.map((cl) => cl.courseId);

    // Validate expected portal
    if (expectedPortal === "system" && !roles.includes("SUPER_ADMIN") && !roles.includes("STJ_ADMIN")) {
      return NextResponse.json(
        { error: "Access denied. System administration credentials required." },
        { status: 403 }
      );
    }

    if (expectedPortal === "leader" && !roles.includes("COURSE_LEADER") && !roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Access denied. Course leader credentials required." },
        { status: 403 }
      );
    }

    // Update last login & create audit log
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "LOGIN_SUCCESS",
          entityType: "USER",
          entityId: user.id,
          details: JSON.stringify({ portal: expectedPortal, roles }),
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {
      // Non-blocking for audit logs
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      fullNameKh: user.fullNameKh,
      fullNameEn: user.fullNameEn,
      roles,
      courseIds,
    };

    const token = await createSessionToken(sessionPayload);
    await setSessionCookie(token);

    let redirectUrl = "/portal/member";
    if (expectedPortal === "system" || (!expectedPortal && (roles.includes("SUPER_ADMIN") || roles.includes("STJ_ADMIN")))) {
      redirectUrl = "/system/dashboard";
    } else if (expectedPortal === "leader" || (!expectedPortal && roles.includes("COURSE_LEADER"))) {
      redirectUrl = "/portal/leader";
    } else if (roles.includes("MEMBER")) {
      redirectUrl = "/portal/member";
    }

    return NextResponse.json({
      success: true,
      user: sessionPayload,
      redirectUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

