import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";

const REST_RESOURCE_ENDPOINTS = new Set([
  "courses",
  "members",
  "sessions",
  "share-links",
  "announcements",
  "departments",
  "academic-years",
]);

const globalForToken = globalThis as unknown as {
  __stjPublicShareReadToken?: string;
};

export function getPublicShareReadToken(): string | undefined {
  return process.env.BACKEND_API_TOKEN || globalForToken.__stjPublicShareReadToken;
}

function authHeaders(token: string | undefined, init: RequestInit): Headers {
  if (token) {
    globalForToken.__stjPublicShareReadToken = token;
  }
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export async function backendFetch(endpoint: string, init: RequestInit = {}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("stj_backend_token")?.value;

  return fetch(`${LARAVEL_API_BASE}/${endpoint.replace(/^\/+/, "")}`, {
    ...init,
    headers: authHeaders(token, init),
    cache: "no-store",
  });
}

export async function proxyToBackend(
  req: NextRequest,
  endpoint: string,
  init: RequestInit = {}
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("stj_backend_token")?.value;
  const headers = authHeaders(token, init);
  const contentType = req.headers.get("content-type");
  if (!headers.has("Content-Type") && contentType) {
    headers.set("Content-Type", contentType);
  }

  let method = (init.method || req.method || "GET").toUpperCase();
  let cleanEndpoint = endpoint.replace(/^\/+/, "");
  const searchParams = new URLSearchParams(req.nextUrl.searchParams);

  let rawBody: ArrayBuffer | BodyInit | undefined = init.body ?? undefined;
  let parsedBodyId: string | undefined;

  if (rawBody === undefined && method !== "GET" && method !== "HEAD") {
    const buffer = await req.arrayBuffer();
    rawBody = buffer;
    if (
      buffer.byteLength > 0 &&
      (contentType?.includes("application/json") ?? true)
    ) {
      try {
        const text = new TextDecoder().decode(buffer);
        const json = JSON.parse(text);
        if (json && (typeof json.id === "string" || typeof json.id === "number")) {
          parsedBodyId = String(json.id).trim();
        }
      } catch {
        // Not JSON body; ignore
      }
    }
  }

  // Map collection-level PUT/PATCH/DELETE (e.g. PUT /api/system/courses with { id } or DELETE ?id=)
  // to Laravel's RESTful /{resource}/{id} routes on api.itcstudent.space
  if (
    (method === "PUT" || method === "PATCH" || method === "DELETE") &&
    REST_RESOURCE_ENDPOINTS.has(cleanEndpoint)
  ) {
    const queryId = searchParams.get("id")?.trim();
    const targetId = queryId || parsedBodyId;
    if (targetId) {
      cleanEndpoint = `${cleanEndpoint}/${encodeURIComponent(targetId)}`;
    }
    // Laravel api.php defines Route::put('/{resource}/{id}') rather than PATCH
    if (method === "PATCH") {
      method = "PUT";
    }
  }

  const queryString = searchParams.toString();
  const url = `${LARAVEL_API_BASE}/${cleanEndpoint}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await fetch(url, {
      ...init,
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : rawBody,
      cache: "no-store",
    });

    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    console.error(`[proxyToBackend] Failed reaching ${url}:`, err);
    return NextResponse.json(
      {
        success: false,
        error: "មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ api.itcstudent.space បានឡើយ",
      },
      { status: 502 }
    );
  }
}
