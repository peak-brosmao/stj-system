import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const correctionSchema = z.object({
  recordId: z.string().min(1, "សូមជ្រើសរើសវគ្គសិក្សា"),
  previousStatus: z.enum(["PRESENT", "LATE", "ABSENT", "EXCUSED"]).optional(),
  requestedStatus: z.enum(["PRESENT", "LATE", "ABSENT", "EXCUSED"]),
  reason: z.string().min(5, "សូមបញ្ជាក់មូលហេតុឱ្យបានច្បាស់លាស់"),
  attachmentUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const corrections = await prisma.attendanceCorrection.findMany({
      where: { requestedById: session.id },
      include: {
        record: { include: { session: { include: { course: true } } } },
        reviewedBy: { select: { fullNameKh: true, fullNameEn: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, corrections });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load corrections";
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
    const validated = correctionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { recordId, requestedStatus, reason, attachmentUrl } = validated.data;

    // The record must belong to the requesting member (own attendance only)
    const owner = await prisma.user.findUnique({
      where: { id: session.id },
      select: { memberRecordId: true },
    });
    const record = await prisma.attendanceRecord.findUnique({ where: { id: recordId } });
    if (!record || !owner?.memberRecordId || record.memberId !== owner.memberRecordId) {
      return NextResponse.json(
        { error: "You can only request corrections for your own attendance records." },
        { status: 403 }
      );
    }

    const correction = await prisma.attendanceCorrection.create({
      data: {
        recordId,
        requestedById: session.id,
        previousStatus: record.status,
        requestedStatus,
        reason,
        attachmentUrl: attachmentUrl || null,
        reviewStatus: "PENDING",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "ATTENDANCE_CORRECTION_REQUESTED",
        entityType: "ATTENDANCE",
        entityId: recordId,
        details: JSON.stringify({ previousStatus: record.status, requestedStatus, reason }),
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json({
      success: true,
      correction,
      message: "សំណើកែតម្រូវវត្តមានត្រូវបានបញ្ជូនទៅគណៈគ្រប់គ្រង STJ ដោយជោគជ័យ",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to submit correction";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
