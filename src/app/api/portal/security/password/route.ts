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

    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "សូមបញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន និងពាក្យសម្ងាត់ថ្មី" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៨ តួអក្សរ (Minimum 8 characters required)" },
        { status: 400 }
      );
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "ពាក្យសម្ងាត់ថ្មី និងការផ្ទៀងផ្ទាត់មិនដូចគ្នាឡើយ" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
    const studentIdNorm = (user.studentId || "").toLowerCase();
    const isDefaultFallback = studentIdNorm && currentPassword === `${studentIdNorm}@ITC!`;

    if (!passwordMatches && !isDefaultFallback) {
      return NextResponse.json(
        { error: "ពាក្យសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវឡើយ (Incorrect current password)" },
        { status: 401 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    });

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "PASSWORD_CHANGED",
          entityType: "USER",
          entityId: user.id,
          details: JSON.stringify({ email: user.email }),
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {
      // non-blocking
    }

    return NextResponse.json({
      success: true,
      message: "ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ (Password updated successfully)",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error changing password";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

