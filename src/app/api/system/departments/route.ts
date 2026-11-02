import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { code: "asc" },
    });

    const formatted = departments.map((d) => ({
      id: d.id,
      code: d.code,
      nameKh: d.nameKh,
      nameEn: d.nameEn,
      nameFr: d.nameFr,
      description: d.description,
      isActive: d.isActive,
      membersCount: d._count.members,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));

    return NextResponse.json({ departments: formatted });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching departments";
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
        { error: "មានតែប្រធាន STJ (STJ President) ប៉ុណ្ណោះដែលអាចបន្ថែមដេប៉ាតឺម៉ង់ថ្មីបាន។" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { code, nameKh, nameEn, nameFr, description } = body;

    if (!code || !nameKh || !nameEn) {
      return NextResponse.json(
        { error: "សូមបញ្ចូលព័ត៌មានចាំបាច់៖ កូដដេប៉ាតឺម៉ង់ (Code), ឈ្មោះខ្មែរ និងឈ្មោះឡាតាំង" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    const existing = await prisma.department.findUnique({
      where: { code: normalizedCode },
    });
    if (existing) {
      return NextResponse.json(
        { error: `ដេប៉ាតឺម៉ង់កូដ "${normalizedCode}" មានរួចហើយក្នុងប្រព័ន្ធ។` },
        { status: 400 }
      );
    }

    const created = await prisma.department.create({
      data: {
        code: normalizedCode,
        nameKh: nameKh.trim(),
        nameEn: nameEn.trim(),
        nameFr: (nameFr || nameEn).trim(),
        description: description?.trim() || null,
        isActive: true,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "DEPARTMENT_CREATED",
          entityType: "SYSTEM",
          entityId: created.id,
          details: JSON.stringify({ code: created.code, nameKh: created.nameKh }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, department: created });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error creating department";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isPresident = session.roles.includes("SUPER_ADMIN") || session.roles.includes("STJ_PRESIDENT");
    if (!isPresident) {
      return NextResponse.json(
        { error: "មានតែប្រធាន STJ (STJ President) ប៉ុណ្ណោះដែលអាចកែប្រែដេប៉ាតឺម៉ង់បាន។" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, code, nameKh, nameEn, nameFr, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Department ID is required" }, { status: 400 });
    }

    const existing = await prisma.department.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "រកមិនឃើញដេប៉ាតឺម៉ង់នេះឡើយ" }, { status: 404 });
    }

    const updated = await prisma.department.update({
      where: { id },
      data: {
        ...(code ? { code: code.trim().toUpperCase() } : {}),
        ...(nameKh ? { nameKh: nameKh.trim() } : {}),
        ...(nameEn ? { nameEn: nameEn.trim() } : {}),
        ...(nameFr !== undefined ? { nameFr: nameFr.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "DEPARTMENT_UPDATED",
          entityType: "SYSTEM",
          entityId: updated.id,
          details: JSON.stringify({ code: updated.code, isActive: updated.isActive }),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({ success: true, department: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating department";
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
        { error: "មានតែប្រធាន STJ ប៉ុណ្ណោះដែលអាចលុប ឬផ្អាកដេប៉ាតឺម៉ង់បាន។" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Department ID required" }, { status: 400 });
    }

    const dept = await prisma.department.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });

    if (!dept) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    // If members are linked to this department, soft-deactivate instead of hard deleting
    if (dept._count.members > 0) {
      await prisma.department.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: `ដេប៉ាតឺម៉ង់ ${dept.code} មានសមាជិក ${dept._count.members} នាក់ ដូច្នេះត្រូវបានផ្អាកដំណើរការ (Deactivated) ដោយរក្សាទុកទិន្នន័យដើមដដែល។`,
      });
    }

    // No members linked, can delete safely
    await prisma.department.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `ដេប៉ាតឺម៉ង់ ${dept.code} ត្រូវបានលុបចេញពីប្រព័ន្ធដោយជោគជ័យ។`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error deleting department";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

