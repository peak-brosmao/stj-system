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
    return NextResponse.json(await response.json().catch(() => ({ error: "Invalid credentials" })), {
      status: response.status,
    });
  }

  const data = await response.json();
  const token = await createSessionToken(data.user);
  await setSessionCookie(token);
  const result = NextResponse.json({ success: true, user: data.user });
  result.cookies.set("stj_backend_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return result;
}
