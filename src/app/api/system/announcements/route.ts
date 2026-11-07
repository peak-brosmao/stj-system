import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export const dynamic = "force-dynamic";

async function forward(req: NextRequest) {
  return proxyToBackend(req, "announcements");
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;