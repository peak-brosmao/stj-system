import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isCurrentPresident = session.roles.includes("SUPER_ADMIN") || session.roles.includes("STJ_PRESIDENT");
    if (!isCurrentPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ បច្ចុប្បន្នប៉ុណ្ណោះដែលមានសិទ្ធិប្រគល់ ឬផ្ទេរតំណែងប្រធានបន្ត (Outgoing President Only)" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { nextAcademicYear, successorIdentifier, handoverNotes } = body;

    if (!nextAcademicYear || !successorIdentifier) {
      return NextResponse.json(
        { error: "សូមបញ្ចូលឆ្នាំសិក្សាថ្មី (ឧ. 2027-2028) និងអត្តសញ្ញាណប្រធានថ្មី" },
        { status: 400 }
      );
    }

    // Find successor user
    const successorNorm = successorIdentifier.trim().toLowerCase();
    const successorStudentId = successorNorm.replace("@itc.edu.kh", "");

    const successorUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: successorNorm },
          { studentId: successorNorm },
          { studentId: successorStudentId },
          { member: { studentId: successorStudentId } },
          { member: { email: successorNorm } },
        ],
      },
      include: { member: true },
    });

    if (!successorUser) {
      return NextResponse.json(
        { error: `រកមិនឃើញគណនីនិស្សិត "${successorIdentifier}" ដើម្បីតែងតាំងជាប្រធានបន្តឡើយ` },
        { status: 404 }
      );
    }

    // 1. Lock and archive the current active mandate
    const currentMandates = await prisma.stjMandate.findMany({
      where: { status: "ACTIVE" },
    });

    for (const m of currentMandates) {
      await prisma.stjMandate.update({
        where: { id: m.id },
        data: {
          status: "ARCHIVED",
          isLocked: true,
          handoverDate: new Date(),
          handoverNotes: handoverNotes || `បានផ្ទេរតំណែងទៅ ${successorUser.fullNameKh} (${successorUser.studentId}) សម្រាប់ឆ្នាំ ${nextAcademicYear}`,
          successorId: successorUser.id,
        },
      });
    }

    // 2. Grant STJ_PRESIDENT role to successor
    const presidentRole = await prisma.role.findUnique({ where: { name: "STJ_PRESIDENT" } });
    const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });

    if (presidentRole) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: successorUser.id, roleId: presidentRole.id } },
        update: {},
        create: { userId: successorUser.id, roleId: presidentRole.id },
      });
    }
    if (superAdminRole) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: successorUser.id, roleId: superAdminRole.id } },
        update: {},
        create: { userId: successorUser.id, roleId: superAdminRole.id },
      });
    }

    // 3. Create the new Mandate for nextAcademicYear
    const newMandate = await prisma.stjMandate.upsert({
      where: { academicYear: nextAcademicYear },
      update: {
        presidentId: successorUser.id,
        presidentNameKh: successorUser.fullNameKh,
        presidentStudentId: successorUser.studentId || "NEW_PRESIDENT",
        status: "ACTIVE",
        isLocked: false,
        startDate: new Date(),
      },
      create: {
        academicYear: nextAcademicYear,
        titleKh: `អាណត្តិដឹកនាំ STJ ឆ្នាំសិក្សា ${nextAcademicYear}`,
        presidentId: successorUser.id,
        presidentNameKh: successorUser.fullNameKh,
        presidentStudentId: successorUser.studentId || "NEW_PRESIDENT",
        status: "ACTIVE",
        isLocked: false,
        startDate: new Date(),
      },
    });

    // 4. Update system setting to active academic year
    await prisma.systemSetting.upsert({
      where: { key: "academic_year_current" },
      update: { value: nextAcademicYear },
      create: { key: "academic_year_current", value: nextAcademicYear },
    });

    await prisma.systemSetting.upsert({
      where: { key: "stj_current_president_id" },
      update: { value: successorUser.id },
      create: { key: "stj_current_president_id", value: successorUser.id },
    });

    await prisma.systemSetting.upsert({
      where: { key: "stj_current_president_name" },
      update: { value: successorUser.fullNameKh },
      create: { key: "stj_current_president_name", value: successorUser.fullNameKh },
    });

    // 5. Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "LEADERSHIP_HANDOVER",
          entityType: "SYSTEM",
          entityId: newMandate.id,
          details: JSON.stringify({
            outgoingPresident: session.email,
            incomingPresident: successorUser.email,
            nextAcademicYear,
            lockedPreviousMandates: currentMandates.map((m) => m.academicYear),
          }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: `ការផ្ទេរតំណែងប្រធាន STJ ទៅ ${successorUser.fullNameKh} សម្រាប់ឆ្នាំ ${nextAcademicYear} ត្រូវបានអនុវត្តដោយជោគជ័យ។ ទិន្នន័យឆ្នាំចាស់ត្រូវបានចាក់សោសុវត្ថិភាពជាប្រវត្តិសាស្ត្រ។`,
      newMandate,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error executing leadership handover";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
