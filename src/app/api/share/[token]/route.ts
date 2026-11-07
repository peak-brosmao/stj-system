import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPublicShareReadToken } from "@/lib/backendProxy";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

const globalForShareCache = globalThis as unknown as {
  __stjShareReportCache?: Map<string, { data: any; updatedAt: number }>;
};

function getShareCache() {
  if (!globalForShareCache.__stjShareReportCache) {
    globalForShareCache.__stjShareReportCache = new Map();
  }
  return globalForShareCache.__stjShareReportCache;
}

async function handleShareRequest(
  _req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  if (!token) {
    return NextResponse.json({ error: "Missing share token" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userToken = cookieStore.get("stj_backend_token")?.value;
  const fallbackToken = getPublicShareReadToken();
  const url = `${LARAVEL_API_BASE}/share/${encodeURIComponent(token)}`;

  const tryFetch = async (bearer?: string) => {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (bearer) {
      headers.Authorization = `Bearer ${bearer}`;
    }
    // Always use GET against Laravel's /api/share/{token}
    return fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });
  };

  try {
    let res = await tryFetch(userToken || fallbackToken);

    // If userToken was expired or missing and fallbackToken differs, retry with fallbackToken
    if (res.status === 401 && userToken && fallbackToken && userToken !== fallbackToken) {
      res = await tryFetch(fallbackToken);
    }

    const data = await res.json().catch(() => null);

    if (res.ok && data) {
      getShareCache().set(token, { data, updatedAt: Date.now() });
      return NextResponse.json(data, { status: 200 });
    }

    // If unauthenticated visitor hits 401 before backend routes/api.php is redeployed, serve cached share report if available
    if (res.status === 401) {
      const cached = getShareCache().get(token);
      if (cached) {
        return NextResponse.json(cached.data, { status: 200 });
      }
    }

    return NextResponse.json(
      {
        error:
          data?.error ||
          data?.message ||
          "មិនអាចទាញយករបាយការណ៍វត្តមានបានទេ ឬតំណភ្ជាប់មិនត្រឹមត្រូវ",
      },
      { status: res.status || 500 }
    );
  } catch {
    const cached = getShareCache().get(token);
    if (cached) {
      return NextResponse.json(cached.data, { status: 200 });
    }
    return NextResponse.json(
      { error: "មិនអាចភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានឡើយ" },
      { status: 502 }
    );
  }
}

export const GET = handleShareRequest;
export const POST = handleShareRequest;
