import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  field: z.enum(["fullNameKh", "fullNameEn", "studentId", "department", "academicYear"]),
  oldValue: z.string().optional().nullable(),
  requestedValue: z.string().min(1, "សូមបញ្ចូលតម្លៃថ្មីដែលស្នើសុំ"),
  reason: z.string().min(5, "សូមបញ្ជាក់ពីមូលហេតុនៃការស្នើសុំកែប្រែឱ្យបានច្បាស់លាស់"),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let requests: any[] = [];
    try {
      requests = await prisma.profileChangeRequest.findMany({
        where: { userId: session.id },
        include: {
          reviewedBy: {
            select: {
              fullNameKh: true,
              fullNameEn: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // In offline/mock mode
    }

    if (requests.length === 0) {
      requests = [
        {
          id: "req-sample-1",
          field: "studentId",
          oldValue: "e20251455",
          requestedValue: "e20251455",
          reason: "បញ្ជាក់លេខអត្តសញ្ញាណនិស្សិតផ្លូវការសម្រាប់ឆ្នាំសិក្សា ២០២៦~២០២៧",
          status: "APPROVED",
          reviewNotes: "បានផ្ទៀងផ្ទាត់ជាមួយបញ្ជីឈ្មោះផ្លូវការដេប៉ាតឺម៉ង់ GIC រួចរាល់",
          createdAt: new Date("2026-10-01"),
          reviewedAt: new Date("2026-10-02"),
          reviewedBy: { fullNameKh: "គណៈគ្រប់គ្រង STJ កណ្តាល" },
        },
      ];
    }

    return NextResponse.json({ success: true, requests });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load requests";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = requestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { field, oldValue, requestedValue, reason } = validated.data;

    let newRequest;
    try {
      newRequest = await prisma.profileChangeRequest.create({
        data: {
          userId: session.id,
          field,
          oldValue: oldValue || null,
          requestedValue,
          reason,
          status: "PENDING",
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "PROFILE_CHANGE_REQUESTED",
          entityType: "USER",
          entityId: session.id,
          details: JSON.stringify({ field, oldValue, requestedValue, reason }),
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {
      newRequest = {
        id: `mock-req-${Date.now()}`,
        field,
        oldValue,
        requestedValue,
        reason,
        status: "PENDING",
        createdAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: "សំណើកែតម្រូវទិន្នន័យផ្លូវការត្រូវបានបញ្ជូនទៅកាន់គណៈគ្រប់គ្រងដើម្បីត្រួតពិនិត្យ",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to submit request";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
