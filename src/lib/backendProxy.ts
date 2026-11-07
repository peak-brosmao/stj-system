import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";

export async function proxyToBackend(
  req: NextRequest,
  endpoint: string,
  init: RequestInit = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("stj_backend_token")?.value;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const contentType = req.headers.get("content-type");
  if (!headers.has("Content-Type") && contentType) headers.set("Content-Type", contentType);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const query = req.nextUrl.search;
  const response = await fetch(`${LARAVEL_API_BASE}/${endpoint.replace(/^\/+/, "")}${query}`, {
    ...init,
    method: init.method || req.method,
    headers,
    body: init.body ?? (req.method === "GET" ? undefined : await req.arrayBuffer()),
    cache: "no-store",
  });

  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
    },
  });
}
