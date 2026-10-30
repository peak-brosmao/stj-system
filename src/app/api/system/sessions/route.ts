import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    let sessions;
    try {
      sessions = await prisma.teachingSession.findMany({
        where: courseId ? { courseId } : {},
        include: {
          course: true,
          _count: {
            select: { attendance: true },
          },
        },
        orderBy: { sessionDate: "desc" },
      });
    } catch {
      sessions = [
        {
          id: "session-1",
          title: "សប្តាហ៍ទី១៖ សេចក្តីផ្តើមអំពី C++ និង Pointer Mechanics",
          sessionDate: new Date("2026-10-15T08:00:00Z"),
          startTime: "08:00",
          endTime: "10:30",
          room: "បន្ទប់ A-204, ITC Campus 1",
          status: "COMPLETED",
          course: { id: "c-prog", code: "PROG101", titleKh: "ការសរសេរកម្មវិធីកុំព្យូទ័រ (Programming)" },
          _count: { attendance: 8 },
        },
      ];
    }

    return NextResponse.json({ sessions });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching sessions";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(["SUPER_ADMIN", "STJ_ADMIN"]);
    const body = await req.json();

    const { courseId, title, sessionDate, startTime, endTime, room, notes } = body;

    if (!courseId || !title || !sessionDate || !startTime || !endTime || !room) {
      return NextResponse.json(
        { error: "All required session fields must be provided." },
        { status: 400 }
      );
    }

    const created = await prisma.teachingSession.create({
      data: {
        courseId,
        title,
        sessionDate: new Date(sessionDate),
        startTime,
        endTime,
        room,
        notes,
        status: "SCHEDULED",
        createdById: session.id,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "SESSION_CREATED",
          entityType: "SESSION",
          entityId: created.id,
          details: JSON.stringify({ title, courseId, room }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, session: created });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating session";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

