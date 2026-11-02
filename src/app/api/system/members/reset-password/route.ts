import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPresident = session.roles.includes("SUPER_ADMIN") || session.roles.includes("STJ_PRESIDENT");
    const isLeader = session.roles.includes("COURSE_LEADER");

    if (!isPresident && !isLeader) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ និងប្រធានក្រុមបង្រៀន (Leader) ប៉ុណ្ណោះដែលអាចកំណត់ពាក្យសម្ងាត់សមាជិកឡើងវិញបាន។" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { memberId, newPassword } = body;

    if (!memberId) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        enrollments: { include: { course: true } },
        user: true,
      },
    });

    if (!member) {
      return NextResponse.json({ error: "រកមិនឃើញសមាជិកនេះក្នុងប្រព័ន្ធឡើយ" }, { status: 404 });
    }

    // Check mandate lock
    const mandate = await prisma.stjMandate.findUnique({
      where: { academicYear: member.cohortYear || "2026-2027" },
    });
    if (mandate && mandate.isLocked) {
      return NextResponse.json(
        { error: "មិនអាចកែប្រែទិន្នន័យនៃឆ្នាំសិក្សាដែលបានចាក់សោរទុកជាប្រវត្តិសាស្ត្រឡើយ" },
        { status: 403 }
      );
    }

    // If Leader (not President), enforce strict course-scoping:
    // Leader can ONLY reset password for tutors in their course!
    if (isLeader && !isPresident) {
      const leaderCourses = await prisma.courseLeader.findMany({
        where: { userId: session.id },
        select: { courseId: true },
      });
      const leaderCourseIds = leaderCourses.map((c) => c.courseId);
      const isEnrolledInCourse = member.enrollments.some((e) => leaderCourseIds.includes(e.courseId));

      if (!isEnrolledInCourse) {
        return NextResponse.json(
          { error: "លោកអ្នកអាចកំណត់ពាក្យសម្ងាត់ឡើងវិញបានតែសមាជិកក្នុងក្រុមមុខវិជ្ជារបស់ខ្លួនប៉ុណ្ណោះ។" },
          { status: 403 }
        );
      }
    }

    const targetUser = member.user || (await prisma.user.findFirst({
      where: {
        OR: [
          { memberRecordId: member.id },
          { studentId: member.studentId || "" },
          { email: member.email || "" },
        ],
      },
    }));

    if (!targetUser) {
      return NextResponse.json({ error: "សមាជិកនេះមិនទាន់មានគណនី Login ឡើយ" }, { status: 404 });
    }

    // Default password format: e202xxxxx@ITC!
    const effectivePassword = newPassword || `${(member.studentId || "stj").toLowerCase()}@ITC!`;
    const passwordHash = await bcrypt.hash(effectivePassword, 10);

    await prisma.user.update({
      where: { id: targetUser.id },
      data: { passwordHash },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "PASSWORD_RESET_BY_ADMIN",
          entityType: "USER",
          entityId: targetUser.id,
          details: JSON.stringify({
            memberId: member.memberId,
            studentId: member.studentId,
            resetBy: session.email,
          }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: `ពាក្យសម្ងាត់របស់សមាជិក ${member.fullNameKh} ត្រូវបានកំណត់ឡើងវិញជោគជ័យ។`,
      defaultPassword: effectivePassword,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error resetting password";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

