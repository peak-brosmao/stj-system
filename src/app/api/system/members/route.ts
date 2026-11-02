import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    if (searchParams.get("action") === "next-id") {
      const allMembers = await prisma.member.findMany({
        select: { memberId: true },
      });
      let maxSeq = 0;
      for (const m of allMembers) {
        const match = m.memberId.match(/^STJ(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxSeq) maxSeq = num;
        }
      }
      return NextResponse.json({ nextMemberId: `STJ${String(maxSeq + 1).padStart(3, "0")}` });
    }

    const search = searchParams.get("search") || "";
    const dept = searchParams.get("dept");
    const year = searchParams.get("year");
    const status = searchParams.get("status");
    const course = searchParams.get("course");
    const cohort = searchParams.get("cohort") || "2026-2027";

    const departments = await prisma.department.findMany({ where: { isActive: true } });
    const academicYears = await prisma.academicYear.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });

    const whereClause: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      whereClause.status = status;
    }
    if (cohort && cohort !== "ALL") {
      whereClause.cohortYear = cohort;
    }
    if (dept && dept !== "ALL") {
      whereClause.department = { code: dept };
    }
    if (year && year !== "ALL") {
      whereClause.academicYear = { code: year };
    }
    if (course && course !== "ALL") {
      whereClause.enrollments = {
        some: {
          course: {
            code: course,
          },
        },
      };
    }
    if (search) {
      whereClause.OR = [
        { memberId: { contains: search } },
        { fullNameKh: { contains: search } },
        { fullNameEn: { contains: search } },
        { studentId: { contains: search } },
      ];
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      include: {
        department: true,
        academicYear: true,
        enrollments: {
          include: {
            course: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            status: true,
            lastLoginAt: true,
          },
        },
      },
      orderBy: { memberId: "asc" },
    });

    return NextResponse.json({ members, departments, academicYears });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching members";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPresident = session.roles.includes("SUPER_ADMIN") || session.roles.includes("STJ_PRESIDENT");
    if (!isPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ (STJ President) ប៉ុណ្ណោះដែលអាចបង្កើត account និងចាត់ចែងសមាជិកថ្មីបាន។" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      memberId,
      studentId,
      fullNameKh,
      fullNameEn,
      phone,
      gender,
      departmentId,
      academicYearId,
      assignedCourse,
      cohortYear = "2026-2027",
      notes,
    } = body;

    if (!studentId || !fullNameKh || !fullNameEn || !departmentId || !academicYearId) {
      return NextResponse.json(
        { error: "សូមបំពេញព័ត៌មានចាំបាច់៖ Student ID, ឈ្មោះខ្មែរ-ឡាតាំង, ដេប៉ាតឺម៉ង់ និងកម្រិតសិក្សា" },
        { status: 400 }
      );
    }

    // Auto-redeem non-colliding STJ Member ID even across 10+ years
    let effectiveMemberId = memberId?.trim();
    if (!effectiveMemberId) {
      const allMembers = await prisma.member.findMany({
        select: { memberId: true },
      });
      let maxSeq = 0;
      for (const m of allMembers) {
        const match = m.memberId.match(/^STJ(\d+)$/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxSeq) maxSeq = num;
        }
      }
      let candidateNum = maxSeq + 1;
      let candidateId = `STJ${String(candidateNum).padStart(3, "0")}`;
      while (await prisma.member.findUnique({ where: { memberId: candidateId } })) {
        candidateNum++;
        candidateId = `STJ${String(candidateNum).padStart(3, "0")}`;
      }
      effectiveMemberId = candidateId;
    }

    // Check mandate lock: only active mandate allows member creation
    const mandate = await prisma.stjMandate.findUnique({
      where: { academicYear: cohortYear },
    });
    if (mandate && (mandate.isLocked || mandate.status !== "ACTIVE")) {
      return NextResponse.json(
        { error: `ឆ្នាំសិក្សា ${cohortYear} ត្រូវបានចាក់សោរជាប្រវត្តិសាស្ត្រ (Locked)। មិនអាចបន្ថែមសមាជិកក្នុងឆ្នាំចាស់បានឡើយ។` },
        { status: 403 }
      );
    }

    const studentEmail = `${studentId.trim().toLowerCase()}@itc.edu.kh`;
    const defaultPassword = `${studentId.trim().toLowerCase()}@ITC!`;
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const createdMember = await prisma.member.create({
      data: {
        memberId: effectiveMemberId,
        studentId,
        fullNameKh,
        fullNameEn,
        email: studentEmail,
        phone,
        gender,
        departmentId,
        academicYearId,
        cohortYear,
        notes: notes || `មុខវិជ្ជាទទួលខុសត្រូវ៖ ${assignedCourse || "ទូទៅ"}`,
        status: "ACTIVE",
      },
    });

    // Create user login account
    const userRole = await prisma.role.findUnique({ where: { name: "MEMBER" } });
    const createdUser = await prisma.user.create({
      data: {
        email: studentEmail,
        passwordHash,
        fullNameKh,
        fullNameEn,
        studentId,
        phone,
        gender,
        status: "ACTIVE",
        memberRecordId: createdMember.id,
      },
    });

    if (userRole) {
      await prisma.userRole.create({
        data: {
          userId: createdUser.id,
          roleId: userRole.id,
        },
      });
    }

    // Link Course Enrollment if assigned
    if (assignedCourse) {
      const targetCourse = await prisma.course.findFirst({
        where: { OR: [{ code: assignedCourse }, { slug: assignedCourse }] },
      });
      if (targetCourse) {
        await prisma.courseEnrollment.create({
          data: {
            courseId: targetCourse.id,
            memberId: createdMember.id,
          },
        });
      }
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "MEMBER_CREATED",
          entityType: "MEMBER",
          entityId: createdMember.id,
          details: JSON.stringify({ memberId, studentId, studentEmail, cohortYear }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      member: createdMember,
      user: { email: studentEmail, defaultPassword },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating member";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, notes, phone, email } = body;

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const targetMember = await prisma.member.findUnique({
      where: { id },
      include: { enrollments: true },
    });
    if (!targetMember) {
      return NextResponse.json({ error: "រកមិនឃើញសមាជិកនេះឡើយ" }, { status: 404 });
    }

    // Check mandate lock
    const mandate = await prisma.stjMandate.findUnique({
      where: { academicYear: targetMember.cohortYear || "2026-2027" },
    });
    if (mandate && mandate.isLocked) {
      return NextResponse.json(
        { error: `ទិន្នន័យនៃឆ្នាំសិក្សា ${targetMember.cohortYear} ត្រូវបានចាក់សោសុវត្ថិភាពជាប្រវត្តិសាស្ត្រ (Read-Only)។` },
        { status: 403 }
      );
    }

    const isPresident = session.roles.includes("SUPER_ADMIN") || session.roles.includes("STJ_PRESIDENT");
    const isCourseLeader = session.roles.includes("COURSE_LEADER");

    if (!isPresident && !isCourseLeader) {
      return NextResponse.json({ error: "មិនមានសិទ្ធិកែប្រែព័ត៌មានសមាជិកឡើយ" }, { status: 403 });
    }

    // If Course Leader: verify target member is in leader's assigned course
    if (isCourseLeader && !isPresident) {
      const leaderCourses = await prisma.courseLeader.findMany({
        where: { userId: session.id },
        select: { courseId: true },
      });
      const leaderCourseIds = leaderCourses.map((c) => c.courseId);
      const isEnrolledInLeaderCourse = targetMember.enrollments.some((e) => leaderCourseIds.includes(e.courseId));

      if (!isEnrolledInLeaderCourse) {
        return NextResponse.json(
          { error: "លោកអ្នកអាចកែប្រែបានតែសមាជិកគ្រូបង្រៀននៅក្នុងក្រុមមុខវិជ្ជារបស់ខ្លួនប៉ុណ្ណោះ។" },
          { status: 403 }
        );
      }
    }

    const updated = await prisma.member.update({
      where: { id },
      data: {
        ...(status && isPresident ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(email !== undefined && isPresident ? { email } : {}),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "MEMBER_UPDATED",
          entityType: "MEMBER",
          entityId: updated.id,
          details: JSON.stringify({ status, notes, phone }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating member";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPresident = session.roles.includes("SUPER_ADMIN") || session.roles.includes("STJ_PRESIDENT");
    if (!isPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ ប៉ុណ្ណោះដែលមានសិទ្ធិលុប ឬផ្អាកសមាជិក (STJ President only)" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check mandate lock
    const mandate = await prisma.stjMandate.findUnique({
      where: { academicYear: member.cohortYear || "2026-2027" },
    });
    if (mandate && mandate.isLocked) {
      return NextResponse.json(
        { error: "មិនអាចលុបទិន្នន័យនៃឆ្នាំសិក្សាដែលបានចាក់សោរទុកជាប្រវត្តិសាស្ត្រឡើយ" },
        { status: 403 }
      );
    }

    // Soft archive member & disable login account
    await prisma.member.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    const user = await prisma.user.findFirst({ where: { memberRecordId: id } });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: "SUSPENDED", isSuspended: true },
      });
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "MEMBER_ARCHIVED",
          entityType: "MEMBER",
          entityId: id,
          details: JSON.stringify({ memberId: member.memberId, studentId: member.studentId }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, message: "Member archived and login suspended" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error deleting member";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
