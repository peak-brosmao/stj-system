import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendProxy";

export async function GET() {
  const response = await backendFetch("/auth/support-contact", { method: "GET" });
  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("content-type") || "application/json" },
  });
}
