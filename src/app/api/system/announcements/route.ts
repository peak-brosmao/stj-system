import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireTeamManager } from "@/lib/auth";
import { sanitizeString } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  titleKh: z.string().min(3).max(200),
  contentKh: z.string().min(5).max(5000),
  scope: z.enum(["GLOBAL", "COURSE", "DEPARTMENT"]).default("GLOBAL"),
  courseId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      include: {
        course: {
          select: { code: true, titleKh: true },
        },
      },
    });

    const formatted = announcements.map((a) => ({
      id: a.id,
      titleKh: a.titleKh,
      contentKh: a.contentKh,
      scope: a.scope,
      date: a.publishedAt.toISOString().slice(0, 10),
      published: a.isPublished,
      course: a.course ? `${a.course.code} - ${a.course.titleKh}` : null,
    }));

    return NextResponse.json({
      success: true,
      announcements: formatted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading announcements";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const body = await req.json().catch(() => ({}));
    const validated = createSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { titleKh, contentKh, scope, courseId } = validated.data;

    const created = await prisma.announcement.create({
      data: {
        titleKh: sanitizeString(titleKh),
        titleEn: sanitizeString(titleKh),
        titleFr: sanitizeString(titleKh),
        contentKh: sanitizeString(contentKh),
        contentEn: sanitizeString(contentKh),
        contentFr: sanitizeString(contentKh),
        scope,
        courseId: courseId || null,
        createdById: user.id,
        isPublished: true,
      },
    });

    return NextResponse.json({
      success: true,
      announcement: created,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

