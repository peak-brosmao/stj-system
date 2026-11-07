import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().min(3).max(100),
  password: z.string().min(6).max(128),
  expectedPortal: z.enum(["system", "leader", "portal"]).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const response = await fetch(`${LARAVEL_API_BASE}/auth/login`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error =
      response.status === 404
        ? "Backend authentication endpoint is unavailable. Please deploy the latest backend."
        : body && typeof body.error === "string"
          ? body.error
          : "Invalid credentials";
    return NextResponse.json({ error }, { status: response.status });
  }

  const data = await response.json();
  const token = await createSessionToken(data.user);
  await setSessionCookie(token);

  const roles: string[] = Array.isArray(data.user?.roles) ? data.user.roles : [];
  const adminRoles = ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN", "STUDENT_ASSOCIATION"];
  let redirectUrl = "/portal/member";
  if (roles.some((r) => adminRoles.includes(r))) {
    redirectUrl = "/system/dashboard";
  } else if (roles.includes("COURSE_LEADER")) {
    redirectUrl = "/leader/dashboard";
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };

  const result = NextResponse.json({
    success: true,
    user: data.user,
    redirectUrl,
  });
  result.cookies.set("stj_session", token, cookieOptions);
  if (data.token) {
    result.cookies.set("stj_backend_token", data.token, cookieOptions);
  }
  return result;
}
