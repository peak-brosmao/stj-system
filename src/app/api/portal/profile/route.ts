import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { OFFICIAL_STJ_ROSTER } from "@/lib/officialRoster";
import { LARAVEL_API_BASE, fetchFromLaravel } from "@/lib/laravelApi";

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

    let user = null;
    try {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: session.id },
            ...(session.email ? [{ email: session.email }] : []),
            ...(session.studentId ? [{ studentId: session.studentId }] : []),
          ],
        },
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
    } catch {
      // Database query failed, use session and official roster
    }

    const rosterMatch = OFFICIAL_STJ_ROSTER.find(
      (m) =>
        (session.studentId && m.studentId.toLowerCase() === session.studentId.toLowerCase()) ||
        (session.email && m.email.toLowerCase() === session.email.toLowerCase()) ||
        (user?.studentId && m.studentId.toLowerCase() === user.studentId.toLowerCase()) ||
        (user?.email && m.email.toLowerCase() === user.email.toLowerCase())
    );

    const profile = user
      ? {
          ...user,
          fullNameKh: user.fullNameKh || rosterMatch?.nameKh || session.fullNameKh || "សមាជិក STJ",
          fullNameEn: user.fullNameEn || rosterMatch?.nameEn || session.fullNameEn || "",
          studentId: user.studentId || rosterMatch?.studentId || session.studentId,
          member: user.member || (rosterMatch ? {
            memberId: rosterMatch.memberId,
            studentId: rosterMatch.studentId,
            department: { code: rosterMatch.dept, nameKh: rosterMatch.dept },
            enrollments: [],
          } : null),
          roles: session.roles && session.roles.length > 0 ? session.roles : user.userRoles?.map((ur) => ur.role.name) || [],
        }
      : {
          id: session.id,
          email: session.email || rosterMatch?.email || "user@itc.edu.kh",
          fullNameKh: session.fullNameKh || rosterMatch?.nameKh || "សមាជិក STJ",
          fullNameEn: session.fullNameEn || rosterMatch?.nameEn || "",
          displayName: session.displayName || rosterMatch?.nameKh || session.fullNameKh || "សមាជិក STJ",
          studentId: session.studentId || rosterMatch?.studentId || null,
          status: "ACTIVE",
          profileImage: session.profileImage || null,
          phone: null,
          telegram: null,
          address: null,
          bio: null,
          member: {
            memberId: session.memberId || rosterMatch?.memberId || "STJ",
            studentId: session.studentId || rosterMatch?.studentId,
            department: {
              code: session.departmentCode || rosterMatch?.dept || "ITC",
              nameKh: session.departmentCode || rosterMatch?.dept || "ITC",
            },
            enrollments: [],
          },
          roles: session.roles || (rosterMatch?.isLeader ? ["COURSE_LEADER", "MEMBER"] : ["MEMBER"]),
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
      user: profile,
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

    // Find the user safely using ID, email, or studentId
    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: session.id },
          ...(session.email ? [{ email: session.email }] : []),
          ...(session.studentId ? [{ studentId: session.studentId }] : []),
        ],
      },
      include: { member: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "រកមិនឃើញគណនីអ្នកប្រើប្រាស់ (User not found)" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: targetUser.id },
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

    // Update Member table phone if exists
    if (targetUser.memberRecordId || targetUser.studentId || targetUser.member?.memberId) {
      await prisma.member.updateMany({
        where: {
          OR: [
            ...(targetUser.memberRecordId ? [{ id: targetUser.memberRecordId }] : []),
            ...(targetUser.member?.memberId ? [{ memberId: targetUser.member.memberId }] : []),
            ...(targetUser.studentId ? [{ studentId: targetUser.studentId }] : []),
          ],
        },
        data: {
          ...(phone ? { phone } : {}),
        },
      });
    }

    // Direct persistence in Laravel database (stj.db)
    const targetMemberIdentifier =
      targetUser.member?.id || targetUser.member?.memberId || targetUser.studentId || session.studentId;
    if (targetMemberIdentifier && LARAVEL_API_BASE) {
      try {
        await fetchFromLaravel(`members/${targetMemberIdentifier}`, {
          method: "PUT",
          body: JSON.stringify({ phone }),
        });
      } catch (err) {
        console.warn("[Laravel Member Sync Warning]", err);
      }
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId: targetUser.id,
          action: "PROFILE_UPDATED",
          entityType: "USER",
          entityId: targetUser.id,
          details: JSON.stringify({ displayName, phone, telegram, preferredLanguage }),
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: "ព័ត៌មានផ្ទាល់ខ្លួនត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ (Profile updated successfully)",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
