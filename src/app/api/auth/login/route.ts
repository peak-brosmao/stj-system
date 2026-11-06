import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { RoleName } from "@/types";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeString } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().min(3).max(100),
  password: z.string().min(6).max(128),
  expectedPortal: z.enum(["system", "leader", "portal"]).optional(),
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req.headers);

  // 1. IP-level Abuse & Brute-Force Rate Limiting (5 attempts per 15 minutes)
  const ipRate = checkRateLimit(`login:ip:${clientIp}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!ipRate.success) {
    return NextResponse.json(
      {
        error: "ការប៉ុនប៉ងចូលច្រើនដងពេកត្រូវបានរារាំងដើម្បីសុវត្ថិភាព។ សូមព្យាយាមម្តងទៀតក្នុងរយៈពេល ១៥ នាទី។ (Too many login attempts. Please try again later.)",
        retryAfterSeconds: Math.ceil(ipRate.resetMs / 1000),
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(ipRate.resetMs / 1000)) },
      }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "ទម្រង់ Email ឬលេខសម្ងាត់មិនត្រឹមត្រូវ", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { email: rawIdentifier, password, expectedPortal } = validated.data;
    const identifier = sanitizeString(rawIdentifier).toLowerCase();
    const studentIdRaw = identifier.replace("@itc.edu.kh", "");

    // 2. Account-level Brute-Force Rate Limiting
    const accountRate = checkRateLimit(`login:account:${identifier}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!accountRate.success) {
      return NextResponse.json(
        {
          error: "គណនីនេះត្រូវបានចាក់សោរបណ្តោះអាសន្នដោយសារការប៉ុនប៉ងខុសច្រើនដង។ (Account temporarily locked due to repeated failed attempts.)",
          retryAfterSeconds: Math.ceil(accountRate.resetMs / 1000),
        },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(accountRate.resetMs / 1000)) },
        }
      );
    }

    // 3. Database lookup (Strict Parameterized Query - Zero SQL injection)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { studentId: identifier },
          { studentId: studentIdRaw },
          { email: `${studentIdRaw}@itc.edu.kh` },
          { member: { email: identifier } },
          { member: { studentId: identifier } },
          { member: { studentId: studentIdRaw } },
        ],
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        courseLeaders: true,
        member: {
          include: {
            department: true,
          },
        },
      },
    });

    // 4. Uniform Generic Error for Non-Existent User (Anti-Account Enumeration)
    if (!user) {
      try {
        await prisma.auditLog.create({
          data: {
            action: "LOGIN_FAILED",
            entityType: "AUTH",
            details: JSON.stringify({ identifier, reason: "USER_NOT_FOUND" }),
            ipAddress: clientIp,
            userAgent: req.headers.get("user-agent")?.slice(0, 255) || null,
          },
        });
      } catch {}

      return NextResponse.json(
        { error: "គណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ (Invalid credentials)" },
        { status: 401 }
      );
    }

    // 5. Account status enforcement
    if (user.status !== "ACTIVE" || user.isSuspended) {
      return NextResponse.json(
        { error: "គណនីនេះត្រូវបានផ្អាកជាបណ្តោះអាសន្ន។ សូមទាក់ទងប្រធាន STJ។ (Account suspended)" },
        { status: 403 }
      );
    }

    // 6. Cryptographic Password Verification via Bcrypt
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN_FAILED",
            entityType: "AUTH",
            entityId: user.id,
            details: JSON.stringify({ identifier, reason: "INVALID_PASSWORD" }),
            ipAddress: clientIp,
            userAgent: req.headers.get("user-agent")?.slice(0, 255) || null,
          },
        });
      } catch {}

      return NextResponse.json(
        { error: "គណនី ឬលេខសម្ងាត់មិនត្រឹមត្រូវ (Invalid credentials)" },
        { status: 401 }
      );
    }

    const roles = user.userRoles.map((ur) => ur.role.name as RoleName);
    const courseIds = user.courseLeaders.map((cl) => cl.courseId);

    // 7. Role-Based Access Control (RBAC) Enforcement
    if (
      expectedPortal === "system" &&
      !roles.includes("SUPER_ADMIN") &&
      !roles.includes("STJ_ADMIN") &&
      !roles.includes("STJ_PRESIDENT") &&
      !roles.includes("STUDENT_ASSOCIATION")
    ) {
      return NextResponse.json(
        { error: "មិនមានសិទ្ធិចូលកាន់ប្រព័ន្ធរដ្ឋបាលកណ្តាលឡើយ។ សិទ្ធិនេះសម្រាប់តែប្រធាន STJ ប៉ុណ្ណោះ។" },
        { status: 403 }
      );
    }

    if (
      expectedPortal === "leader" &&
      !roles.includes("COURSE_LEADER") &&
      !roles.includes("SUPER_ADMIN") &&
      !roles.includes("STJ_PRESIDENT")
    ) {
      return NextResponse.json(
        { error: "មិនមានសិទ្ធិចូលកាន់បន្ទប់ប្រធានក្រុមឡើយ។" },
        { status: 403 }
      );
    }

    // 8. Update Last Login Timestamp & Audit Log
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
          details: JSON.stringify({ portal: expectedPortal, roles, email: user.email }),
          ipAddress: clientIp,
          userAgent: req.headers.get("user-agent")?.slice(0, 255) || null,
        },
      });
    } catch {}

    // 9. Issue Authenticated Session Token
    const sessionPayload = {
      id: user.id,
      email: user.email,
      fullNameKh: user.fullNameKh || "",
      fullNameEn: user.fullNameEn || "",
      studentId: user.studentId || user.member?.studentId || null,
      memberId: user.member?.memberId || null,
      profileImage: user.profileImage || null,
      departmentCode: user.member?.department?.code || null,
      roles,
      courseIds,
    };

    const token = await createSessionToken(sessionPayload);
    await setSessionCookie(token);

    // 10. Automatic Portal Redirection
    let redirectUrl = "/portal/member";
    if (
      roles.includes("SUPER_ADMIN") ||
      roles.includes("STJ_PRESIDENT") ||
      roles.includes("STJ_ADMIN") ||
      roles.includes("STUDENT_ASSOCIATION")
    ) {
      redirectUrl = "/system/dashboard";
    } else if (roles.includes("COURSE_LEADER")) {
      redirectUrl = "/leader/dashboard";
    } else {
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
