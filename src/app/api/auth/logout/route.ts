import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { proxyToBackend } from "@/lib/backendProxy";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  await proxyToBackend(req, "auth/logout", { method: "POST" }).catch(() => null);
  await clearSessionCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.delete("stj_backend_token");
  return response;
}
