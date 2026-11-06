import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Binary Magic Numbers Check
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 4) return false;

  // JPEG magic: FF D8 FF
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  // PNG magic: 89 50 4E 47 (0x89 'PNG')
  if (mimeType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  // WebP magic: 'RIFF' .... 'WEBP'
  if (mimeType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "ទំហំរូបភាពលើសកម្រិតកំណត់ (អតិបរមា 2MB)" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "ទម្រង់រូបភាពមិនត្រឹមត្រូវ។ អនុញ្ញាតតែ JPG, PNG ឬ WebP ប៉ុណ្ណោះ" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "ទិន្នន័យឯកសារមិនត្រូវគ្នានឹងទម្រង់រូបភាពដែលបានបញ្ជាក់" },
        { status: 400 }
      );
    }

    const extMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };
    const extension = extMap[file.type] || ".png";

    // Safe random filename: avatar_<random16hex>.<ext>
    const randomHex = crypto.randomBytes(16).toString("hex");
    const safeFileName = `avatar_${session.id.slice(-6)}_${Date.now()}_${randomHex}${extension}`;

    let publicUrl = `/uploads/avatars/${safeFileName}`;

    // Upload directly to datastj.peakbrosmao.me central storage
    if (LARAVEL_API_BASE) {
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        if (session.id) uploadFormData.append("userId", session.id);
        if (session.studentId) uploadFormData.append("studentId", session.studentId);
        if (session.email) uploadFormData.append("email", session.email);

        const remoteRes = await fetch(`${LARAVEL_API_BASE}/upload/profile-photo`, {
          method: "POST",
          body: uploadFormData,
        });

        if (remoteRes.ok) {
          const remoteJson = await remoteRes.json();
          if (remoteJson.url) {
            publicUrl = remoteJson.url;
          }
        }
      } catch (err) {
        console.warn("[Remote Upload Warning]", err);
      }
    }

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, safeFileName);
      await fs.writeFile(filePath, buffer);
    } catch {
      // Non-blocking in serverless environments
    }

    try {
      await prisma.user.update({
        where: { id: session.id },
        data: { profileImage: publicUrl },
      });

      await prisma.auditLog.create({
        data: {
          userId: session.id,
          action: "AVATAR_UPLOADED",
          entityType: "USER",
          entityId: session.id,
          details: JSON.stringify({ url: publicUrl, size: file.size }),
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
          userAgent: req.headers.get("user-agent"),
        },
      });
    } catch {
      // In offline/mock mode
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "រូបថតផ្ទាល់ខ្លួនត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to upload image";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await prisma.user.update({
        where: { id: session.id },
        data: { profileImage: null },
      });
    } catch {
      // In offline/mock mode
    }

    return NextResponse.json({
      success: true,
      message: "រូបថតផ្ទាល់ខ្លួនត្រូវបានលុបចេញរួចរាល់",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete avatar";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

