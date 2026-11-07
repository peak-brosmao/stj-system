import { NextRequest, NextResponse } from "next/server";
import { resolveLeaderScope } from "@/lib/leaderScope";
import {
  getR2Config,
  sanitizeObjectKey,
  createR2PresignedPutUrl,
  uploadBufferToR2,
} from "@/lib/r2Storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { configured, config, missingKeys } = getR2Config();
  return NextResponse.json({
    success: true,
    configured,
    bucketName: config.bucketName,
    publicUrlBase: config.publicUrl,
    missingKeys,
  });
}

export async function POST(req: NextRequest) {
  const scope = await resolveLeaderScope();
  if (!scope.authenticated || (!scope.isSystemAdmin && !scope.isCourseLeader)) {
    return NextResponse.json(
      { error: "អ្នកមិនមានសិទ្ធិបង្ហោះឯកសារមេរៀនឡើយ (Unauthorized)" },
      { status: 403 }
    );
  }

  const { configured, config, missingKeys } = getR2Config();
  if (!configured) {
    return NextResponse.json(
      {
        error: `Cloudflare R2 មិនទាន់បានកំណត់ក្នុង Environment Variables នៅឡើយទេ (${missingKeys.join(
          ", "
        )})។ សូមបន្ថែម R2 keys ក្នុង .env ឬប្រើតំណភ្ជាប់ URL ឯកសារដោយផ្ទាល់។`,
        missingKeys,
        configured: false,
      },
      { status: 400 }
    );
  }

  const contentTypeHeader = req.headers.get("content-type") || "";

  // 1. JSON request for Presigned PUT URL (ideal for large PDFs & Videos)
  if (contentTypeHeader.includes("application/json")) {
    const body = await req.json().catch(() => null);
    const fileName = String(body?.fileName || "document.pdf");
    const fileType = String(body?.fileType || "application/octet-stream");
    const courseCode = String(body?.courseCode || "STJ");

    if (scope.isCourseLeader && courseCode !== "STJ" && !scope.matchesCourse(courseCode)) {
      return NextResponse.json(
        { error: "អ្នកអាចបង្ហោះឯកសារសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
        { status: 403 }
      );
    }

    const objectKey = sanitizeObjectKey(courseCode, fileName);
    const presigned = createR2PresignedPutUrl(config, objectKey, fileType, 3600);

    return NextResponse.json({
      success: true,
      uploadUrl: presigned.uploadUrl,
      publicUrl: presigned.publicUrl,
      key: presigned.key,
    });
  }

  // 2. Multipart FormData direct upload to Cloudflare R2
  if (contentTypeHeader.includes("multipart/form-data")) {
    try {
      const formData = await req.formData();
      const file = formData.get("file");
      const courseCode = String(formData.get("courseCode") || "STJ");

      if (scope.isCourseLeader && courseCode !== "STJ" && !scope.matchesCourse(courseCode)) {
        return NextResponse.json(
          { error: "អ្នកអាចបង្ហោះឯកសារសម្រាប់តែមុខវិជ្ជារបស់អ្នកប៉ុណ្ណោះ" },
          { status: 403 }
        );
      }

      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "សូមជ្រើសរើសឯកសារ (File required)" }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const objectKey = sanitizeObjectKey(courseCode, file.name);
      const contentType = file.type || "application/octet-stream";

      const uploaded = await uploadBufferToR2(config, objectKey, buffer, contentType);
      return NextResponse.json({
        success: true,
        publicUrl: uploaded.publicUrl,
        key: uploaded.key,
        name: file.name,
        size: file.size,
        mimeType: contentType,
      });
    } catch (err: unknown) {
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "បរាជ័យក្នុងការបង្ហោះឯកសារទៅកាន់ Cloudflare R2",
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Unsupported request format" }, { status: 400 });
}
