import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  requireTeamManager,
  getManageableCourseIds,
  assertCourseAccess,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Shared lesson (teaching session) management endpoint.
 * Used by BOTH the Leader portal and the System portal against the same database.
 *  - STJ President / admins: every course
 *  - Course Leader: only the course they lead
 * Members never use this endpoint; they only see lessons through /api/portal/*.
 */

const STATUSES = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

const createSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2),
  sessionDate: z.string().min(8),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  room: z.string().min(1),
  notes: z.string().optional().nullable(),
  status: z.enum(STATUSES).optional(),
});

const updateSchema = createSchema.partial().extend({ id: z.string().min(1) });

function errorResponse(err: unknown, fallback: string) {
  const msg = err instanceof Error ? err.message : fallback;
  const status = msg.includes("FORBIDDEN") ? 403 : msg.includes("UNAUTHORIZED") ? 401 : 500;
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const manageable = await getManageableCourseIds(user);
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (courseId && manageable !== null && !manageable.includes(courseId)) {
      return NextResponse.json({ error: "FORBIDDEN: Not your course" }, { status: 403 });
    }

    const where = courseId
      ? { courseId }
      : manageable === null
      ? {}
      : { courseId: { in: manageable } };

    const [sessions, courses] = await Promise.all([
      prisma.teachingSession.findMany({
        where,
        include: {
          course: true,
          _count: { select: { attendance: true } },
        },
        orderBy: [{ sessionDate: "desc" }, { startTime: "desc" }],
      }),
      prisma.course.findMany({
        where: manageable === null ? { status: "ACTIVE" } : { id: { in: manageable }, status: "ACTIVE" },
        orderBy: { code: "asc" },
        select: { id: true, code: true, titleKh: true, titleEn: true },
      }),
    ]);

    return NextResponse.json({ sessions, courses });
  } catch (err) {
    return errorResponse(err, "Failed to load sessions");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;
    await assertCourseAccess(user, data.courseId);

    const created = await prisma.teachingSession.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        sessionDate: new Date(data.sessionDate),
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room,
        notes: data.notes || null,
        status: data.status || "SCHEDULED",
        createdById: user.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SESSION_CREATED",
        entityType: "SESSION",
        entityId: created.id,
        details: JSON.stringify({ courseId: data.courseId, title: data.title }),
      },
    });

    return NextResponse.json({ success: true, session: created }, { status: 201 });
  } catch (err) {
    return errorResponse(err, "Failed to create session");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { id, ...fields } = parsed.data;

    const existing = await prisma.teachingSession.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    await assertCourseAccess(user, existing.courseId);
    // A leader cannot move a lesson into another course
    if (fields.courseId && fields.courseId !== existing.courseId) {
      await assertCourseAccess(user, fields.courseId);
    }

    const updated = await prisma.teachingSession.update({
      where: { id },
      data: {
        ...(fields.courseId ? { courseId: fields.courseId } : {}),
        ...(fields.title ? { title: fields.title } : {}),
        ...(fields.sessionDate ? { sessionDate: new Date(fields.sessionDate) } : {}),
        ...(fields.startTime ? { startTime: fields.startTime } : {}),
        ...(fields.endTime ? { endTime: fields.endTime } : {}),
        ...(fields.room ? { room: fields.room } : {}),
        ...(fields.notes !== undefined ? { notes: fields.notes || null } : {}),
        ...(fields.status ? { status: fields.status } : {}),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SESSION_UPDATED",
        entityType: "SESSION",
        entityId: id,
        details: JSON.stringify(fields),
      },
    });

    return NextResponse.json({ success: true, session: updated });
  } catch (err) {
    return errorResponse(err, "Failed to update session");
  }
}

/**
 * Lessons that already have attendance recorded are never deleted (history is
 * preserved). Use PATCH with status CANCELLED instead.
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const existing = await prisma.teachingSession.findUnique({
      where: { id },
      include: { _count: { select: { attendance: true } } },
    });
    if (!existing) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    await assertCourseAccess(user, existing.courseId);

    if (existing._count.attendance > 0) {
      return NextResponse.json(
        { error: "This lesson already has attendance records. Mark it as CANCELLED instead of deleting." },
        { status: 409 }
      );
    }

    await prisma.teachingSession.delete({ where: { id } });
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "SESSION_DELETED",
        entityType: "SESSION",
        entityId: id,
        details: JSON.stringify({ title: existing.title }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, "Failed to delete session");
  }
}
