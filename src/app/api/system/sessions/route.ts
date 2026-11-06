import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  requireTeamManager,
  getManageableCourseIds,
  assertCourseAccess,
} from "@/lib/auth";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

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

async function resolveDbUserId(user: { id: string; email?: string | null; studentId?: string | null }): Promise<string | null> {
  const dbUser = await prisma.user.findFirst({
    where: {
      OR: [
        { id: user.id },
        ...(user.email ? [{ email: user.email }] : []),
        ...(user.studentId ? [{ studentId: user.studentId }] : []),
      ],
    },
    select: { id: true },
  });
  if (dbUser) return dbUser.id;
  // Fallback: find any president/admin user in the DB
  const fallback = await prisma.user.findFirst({
    where: { userRoles: { some: { role: { name: { in: ["SUPER_ADMIN", "STJ_PRESIDENT", "STJ_ADMIN"] } } } } },
    select: { id: true },
  });
  return fallback?.id ?? null;
}

async function resolveCourseId(courseIdInput: string): Promise<string | null> {
  const course = await prisma.course.findFirst({
    where: {
      OR: [{ id: courseIdInput }, { code: courseIdInput }, { slug: courseIdInput }],
    },
    select: { id: true },
  });
  return course?.id || null;
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

    // Try fetching from persistent Laravel API first
    if (LARAVEL_API_BASE) {
      try {
        const endpoint = courseId ? `sessions?course=${encodeURIComponent(courseId)}` : "sessions";
        const remote = await fetchFromLaravel(endpoint);
        if (remote && remote.ok) {
          const remoteData = await remote.json();
          if (remoteData && Array.isArray(remoteData.sessions) && remoteData.sessions.length > 0) {
            let coursesList: any[] = [];
            try {
              coursesList = await prisma.course.findMany({
                where: manageable === null ? { status: "ACTIVE" } : { id: { in: manageable }, status: "ACTIVE" },
                orderBy: { code: "asc" },
                select: { id: true, code: true, titleKh: true, titleEn: true },
              });
            } catch {
              coursesList = Array.from(
                new Map(remoteData.sessions.map((s: any) => [s.courseId, s.course])).values()
              );
            }
            return NextResponse.json({ sessions: remoteData.sessions, courses: coursesList });
          }
        }
      } catch (err) {
        console.warn("[Laravel Sessions Fetch Fallback]", err);
      }
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
    const rawBody = await req.json();
    const parsed = createSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const effectiveCourseId = await resolveCourseId(data.courseId);
    if (!effectiveCourseId) {
      return NextResponse.json(
        { error: "រកមិនឃើញមុខវិជ្ជានេះឡើយ (Course not found in system)" },
        { status: 404 }
      );
    }

    await assertCourseAccess(user, effectiveCourseId);
    const creatorId = await resolveDbUserId(user);

    // Forward to persistent Laravel API
    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel("sessions", {
          method: "POST",
          body: JSON.stringify({
            courseId: effectiveCourseId,
            title: data.title,
            sessionDate: data.sessionDate,
            startTime: data.startTime,
            endTime: data.endTime,
            room: data.room,
            notes: data.notes,
            status: data.status || "SCHEDULED",
          }),
        });
      } catch (err) {
        console.warn("[Laravel Session Sync Warning]", err);
      }
    }

    const created = await prisma.teachingSession.create({
      data: {
        courseId: effectiveCourseId,
        title: data.title,
        sessionDate: new Date(data.sessionDate),
        startTime: data.startTime,
        endTime: data.endTime,
        room: data.room,
        notes: data.notes || null,
        status: data.status || "SCHEDULED",
        ...(creatorId ? { createdById: creatorId } : {}),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: creatorId,
          action: "SESSION_CREATED",
          entityType: "SESSION",
          entityId: created.id,
          details: JSON.stringify({ courseId: effectiveCourseId, title: data.title }),
        },
      });
    } catch {
      // non-blocking
    }

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

    let effectiveCourseId: string | undefined = undefined;
    if (fields.courseId) {
      const resolved = await resolveCourseId(fields.courseId);
      if (resolved) {
        effectiveCourseId = resolved;
        if (effectiveCourseId !== existing.courseId) {
          await assertCourseAccess(user, effectiveCourseId);
        }
      }
    }

    const creatorId = await resolveDbUserId(user);

    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel(`sessions/${id}`, {
          method: "PUT",
          body: JSON.stringify(fields),
        });
      } catch (err) {
        console.warn("[Laravel Session Update Sync Warning]", err);
      }
    }

    const updated = await prisma.teachingSession.update({
      where: { id },
      data: {
        ...(effectiveCourseId ? { courseId: effectiveCourseId } : {}),
        ...(fields.title ? { title: fields.title } : {}),
        ...(fields.sessionDate ? { sessionDate: new Date(fields.sessionDate) } : {}),
        ...(fields.startTime ? { startTime: fields.startTime } : {}),
        ...(fields.endTime ? { endTime: fields.endTime } : {}),
        ...(fields.room ? { room: fields.room } : {}),
        ...(fields.notes !== undefined ? { notes: fields.notes || null } : {}),
        ...(fields.status ? { status: fields.status } : {}),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: creatorId,
          action: "SESSION_UPDATED",
          entityType: "SESSION",
          entityId: id,
          details: JSON.stringify(fields),
        },
      });
    } catch {
      // non-blocking
    }

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

    const creatorId = await resolveDbUserId(user);

    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel(`sessions/${id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("[Laravel Session Delete Sync Warning]", err);
      }
    }

    await prisma.teachingSession.delete({ where: { id } });
    try {
      await prisma.auditLog.create({
        data: {
          userId: creatorId,
          action: "SESSION_DELETED",
          entityType: "SESSION",
          entityId: id,
          details: JSON.stringify({ title: existing.title }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, "Failed to delete session");
  }
}
