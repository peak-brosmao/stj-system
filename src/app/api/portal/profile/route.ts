import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const profileUpdateSchema = z.object({
  displayName: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
  telegram: z.string().max(50).optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  gender: z.enum(["M", "F", "OTHER"]).optional().nullable(),
  preferredLanguage: z.enum(["km", "en", "fr"]).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: {
        member: {
          include: {
            department: true,
            academicYear: true,
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        },
        courseLeaders: {
          include: {
            course: true,
          },
        },
        userRoles: {
          include: {
            role: true,
          },
        },
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const profile = {
      ...user,
      roles: session.roles,
    };

    // Calculate profile completeness
    let completedFields = 0;
    const totalFields = 6;
    if (profile.displayName) completedFields++;
    if (profile.phone) completedFields++;
    if (profile.telegram) completedFields++;
    if (profile.bio) completedFields++;
    if (profile.address) completedFields++;
    if (profile.profileImage) completedFields++;

    const completionPercentage = Math.round((completedFields / totalFields) * 100);

    return NextResponse.json({
      success: true,
      profile,
      completeness: completionPercentage,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load profile";
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
    const validated = profileUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { displayName, phone, telegram, bio, address, gender, preferredLanguage } = validated.data;

    await prisma.user.update({
      where: { id: session.id },
      data: {
        displayName,
        phone,
        telegram,
        bio,
        address,
        gender,
        preferredLanguage,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: session.id,
        action: "PROFILE_UPDATED",
        entityType: "USER",
        entityId: session.id,
        details: JSON.stringify({ displayName, phone, telegram, preferredLanguage }),
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        userAgent: req.headers.get("user-agent"),
      },
    });

    return NextResponse.json({
      success: true,
      message: "ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ (Profile updated successfully)",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
