import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireTeamManager } from "@/lib/auth";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireTeamManager();

    const [courses, eligibleLeaders] = await Promise.all([
      prisma.course.findMany({
        orderBy: { code: "asc" },
        include: {
          leaders: {
            include: {
              user: {
                select: {
                  id: true,
                  fullNameKh: true,
                  fullNameEn: true,
                  email: true,
                  studentId: true,
                  member: {
                    select: {
                      id: true,
                      memberId: true,
                      academicYear: true,
                      department: true,
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
              sessions: true,
            },
          },
        },
      }),
      prisma.member.findMany({
        where: { status: "ACTIVE" },
        orderBy: { memberId: "asc" },
        select: {
          id: true,
          memberId: true,
          studentId: true,
          fullNameKh: true,
          fullNameEn: true,
          department: { select: { code: true } },
          academicYear: { select: { code: true } },
        },
      }),
    ]);

    const formatted = courses.map((c) => {
      const leader = c.leaders[0]?.user;
      let leaderLabel = "មិនទាន់ចាត់តាំង";
      let leaderMemberId = leader?.member?.id || null;
      let leaderStudentId = leader?.studentId || null;

      if (leader) {
        const year = leader.member?.academicYear?.code || "";
        const dept = leader.member?.department?.code || "";
        const badge = year && dept ? ` (${year}-${dept})` : "";
        leaderLabel = `${leader.fullNameKh || leader.fullNameEn}${badge}`.trim();
      }

      return {
        id: c.id,
        code: c.code,
        slug: c.slug,
        titleKh: c.titleKh,
        titleEn: c.titleEn,
        category: c.category || "មូលដ្ឋានគ្រឹះវិស្វកម្ម",
        term: c.academicTerm || "ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
        status: c.status,
        leaders: leaderLabel,
        leaderMemberId,
        leaderStudentId,
        enrolled: c._count.enrollments,
        sessionsCount: c._count.sessions,
      };
    });

    return NextResponse.json({
      success: true,
      courses: formatted,
      eligibleLeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading courses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const isPresident =
      user.roles.includes("SUPER_ADMIN") ||
      user.roles.includes("STJ_PRESIDENT") ||
      user.roles.includes("STJ_ADMIN");

    if (!isPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ ប៉ុណ្ណោះដែលអាចបង្កើតមុខវិជ្ជាថ្មីបាន (STJ President only)" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { code, titleKh, titleEn, category, term, leaderMemberId } = body;

    if (!code || !titleKh) {
      return NextResponse.json({ error: "កូដមុខវិជ្ជា និងឈ្មោះខ្មែរត្រូវតែបំពេញ" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanSlug = cleanCode.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Check duplicate code
    const existing = await prisma.course.findFirst({
      where: { OR: [{ code: cleanCode }, { slug: cleanSlug }] },
    });
    if (existing) {
      return NextResponse.json({ error: `មុខវិជ្ជាដែលមានកូដ ${cleanCode} មានក្នុងប្រព័ន្ធរួចហើយ` }, { status: 400 });
    }

    const created = await prisma.course.create({
      data: {
        code: cleanCode,
        slug: cleanSlug,
        titleKh: titleKh.trim(),
        titleEn: (titleEn || titleKh).trim(),
        titleFr: (titleEn || titleKh).trim(),
        descriptionKh: `មុខវិជ្ជា ${titleKh} នៃកម្មវិធី STJ`,
        descriptionEn: `${titleEn || titleKh} Course`,
        descriptionFr: `${titleEn || titleKh} Cours`,
        category: category || "Engineering Foundation",
        academicTerm: term || "ឆមាសទី១ ឆ្នាំសិក្សា ២០២៦-២០២៧",
        status: "ACTIVE",
      },
    });

    // Assign leader if selected
    let assignedStudentId: string | undefined = undefined;
    if (leaderMemberId) {
      const leaderMember = await prisma.member.findFirst({
        where: { OR: [{ id: leaderMemberId }, { memberId: leaderMemberId }, { studentId: leaderMemberId }] },
      });
      if (leaderMember) {
        assignedStudentId = leaderMember.studentId || undefined;
        const linkedUser = await prisma.user.findFirst({
          where: { OR: [{ memberRecordId: leaderMember.id }, { studentId: leaderMember.studentId }] },
        });
        if (linkedUser) {
          await prisma.courseLeader.create({
            data: {
              courseId: created.id,
              userId: linkedUser.id,
            },
          });
        }
      }
    }

    // Sync to Laravel API backend
    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel("courses", {
          method: "POST",
          body: JSON.stringify({
            code: cleanCode,
            titleKh: titleKh.trim(),
            titleEn: (titleEn || titleKh).trim(),
            category: category || "មូលដ្ឋានគ្រឹះវិស្វកម្ម",
            term: term || "2026-2027",
            leaderStudentId: assignedStudentId,
          }),
        });
      } catch (e) {
        console.warn("[Laravel Course Sync Warning]", e);
      }
    }

    return NextResponse.json({ success: true, course: created });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const isPresident =
      user.roles.includes("SUPER_ADMIN") ||
      user.roles.includes("STJ_PRESIDENT") ||
      user.roles.includes("STJ_ADMIN");

    if (!isPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ ប៉ុណ្ណោះដែលអាចកែប្រែមុខវិជ្ជាបាន (STJ President only)" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, titleKh, titleEn, category, term, status, leaderMemberId } = body;

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const targetCourse = await prisma.course.findFirst({
      where: {
        OR: [{ id }, { code: id }, { slug: id }, { code: id.replace(/^course[-_]?/i, "").toUpperCase() }],
      },
    });

    if (!targetCourse) {
      return NextResponse.json({ error: "រកមិនឃើញមុខវិជ្ជានេះឡើយ" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (titleKh) updateData.titleKh = titleKh.trim();
    if (titleEn) updateData.titleEn = titleEn.trim();
    if (category) updateData.category = category;
    if (term) updateData.academicTerm = term;
    if (status) updateData.status = status;

    const updated = await prisma.course.update({
      where: { id: targetCourse.id },
      data: updateData,
    });

    // Reassign leader if specified
    let assignedStudentId: string | undefined = undefined;
    if (leaderMemberId !== undefined) {
      await prisma.courseLeader.deleteMany({ where: { courseId: targetCourse.id } });
      if (leaderMemberId) {
        const leaderMember = await prisma.member.findFirst({
          where: { OR: [{ id: leaderMemberId }, { memberId: leaderMemberId }, { studentId: leaderMemberId }] },
        });
        if (leaderMember) {
          assignedStudentId = leaderMember.studentId || undefined;
          const linkedUser = await prisma.user.findFirst({
            where: { OR: [{ memberRecordId: leaderMember.id }, { studentId: leaderMember.studentId }] },
          });
          if (linkedUser) {
            await prisma.courseLeader.create({
              data: {
                courseId: targetCourse.id,
                userId: linkedUser.id,
              },
            });
          }
        }
      }
    }

    // Sync to Laravel API backend
    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel(`courses/${targetCourse.code}`, {
          method: "POST",
          body: JSON.stringify({
            titleKh: titleKh ? titleKh.trim() : undefined,
            titleEn: titleEn ? titleEn.trim() : undefined,
            category,
            term,
            status,
            leaderStudentId: assignedStudentId,
          }),
        });
      } catch (e) {
        console.warn("[Laravel Course Update Sync Warning]", e);
      }
    }

    return NextResponse.json({ success: true, course: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error updating course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireTeamManager();
    const isPresident =
      user.roles.includes("SUPER_ADMIN") ||
      user.roles.includes("STJ_PRESIDENT") ||
      user.roles.includes("STJ_ADMIN");

    if (!isPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ ប៉ុណ្ណោះដែលអាចលុបមុខវិជ្ជាបាន (STJ President only)" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Course ID required" }, { status: 400 });

    const targetCourse = await prisma.course.findFirst({
      where: {
        OR: [{ id }, { code: id }, { slug: id }],
      },
    });
    if (!targetCourse) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    await prisma.course.update({
      where: { id: targetCourse.id },
      data: { status: "ARCHIVED" },
    });

    if (LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel(`courses/${targetCourse.code}`, { method: "DELETE" });
      } catch (e) {
        console.warn("[Laravel Course Delete Warning]", e);
      }
    }

    return NextResponse.json({ success: true, message: "មុខវិជ្ជាត្រូវបានផ្អាក ឬលុបដោយជោគជ័យ" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting course";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
