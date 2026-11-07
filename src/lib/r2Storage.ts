import crypto from "crypto";

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

export function getR2Config(): {
  configured: boolean;
  config: R2Config;
  missingKeys: string[];
} {
  const accountId = (process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID || "").trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = (
    process.env.R2_SECRET_ACCESS_KEY ||
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
    ""
  ).trim();
  const bucketName = (
    process.env.R2_BUCKET_NAME ||
    process.env.CLOUDFLARE_R2_BUCKET_NAME ||
    "stj-materials"
  ).trim();
  const publicUrl = (
    process.env.R2_PUBLIC_URL ||
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
    ""
  )
    .trim()
    .replace(/\/+$/, "");

  const missingKeys: string[] = [];
  if (!accountId) missingKeys.push("R2_ACCOUNT_ID");
  if (!accessKeyId) missingKeys.push("R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missingKeys.push("R2_SECRET_ACCESS_KEY");
  if (!bucketName) missingKeys.push("R2_BUCKET_NAME");
  if (!publicUrl) missingKeys.push("R2_PUBLIC_URL");

  return {
    configured:
      Boolean(accountId) &&
      Boolean(accessKeyId) &&
      Boolean(secretAccessKey) &&
      Boolean(bucketName),
    config: {
      accountId,
      accessKeyId,
      secretAccessKey,
      bucketName,
      publicUrl,
    },
    missingKeys,
  };
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function sha256Hex(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function getSignatureKey(
  secretAccessKey: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Buffer {
  const kDate = hmacSha256("AWS4" + secretAccessKey, dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, "aws4_request");
}

function encodeRfc3986(str: string): string {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

export function sanitizeObjectKey(courseCode: string, originalFileName: string): string {
  const safeCourse = (courseCode || "general").replace(/[^a-zA-Z0-9_-]/g, "").toUpperCase() || "STJ";
  const extMatch = originalFileName.match(/(\.[a-zA-Z0-9]{1,8})$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "";
  const baseName = originalFileName
    .slice(0, originalFileName.length - ext.length)
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "material";
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex");
  return `courses/${safeCourse}/${timestamp}-${random}-${baseName}${ext}`;
}

export function buildPublicObjectUrl(config: R2Config, objectKey: string): string {
  if (config.publicUrl) {
    return `${config.publicUrl}/${objectKey}`;
  }
  return `https://${config.accountId}.r2.cloudflarestorage.com/${config.bucketName}/${objectKey}`;
}

/**
 * Generates an AWS Signature V4 Presigned PUT URL for uploading large files (PDF, Video, etc.)
 * directly from the browser to Cloudflare R2 without consuming hosting storage.
 */
export function createR2PresignedPutUrl(
  config: R2Config,
  objectKey: string,
  contentType: string,
  expiresInSeconds = 3600
): { uploadUrl: string; publicUrl: string; key: string } {
  const region = "auto";
  const service = "s3";
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const credential = `${config.accessKeyId}/${credentialScope}`;

  const encodedKey = objectKey.split("/").map(encodeRfc3986).join("/");
  const canonicalUri = `/${encodeRfc3986(config.bucketName)}/${encodedKey}`;

  const queryParams: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
    "X-Amz-Credential": credential,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresInSeconds),
    "X-Amz-SignedHeaders": "host",
  };

  const canonicalQueryString = Object.keys(queryParams)
    .sort()
    .map((k) => `${encodeRfc3986(k)}=${encodeRfc3986(queryParams[k])}`)
    .join("&");

  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(config.secretAccessKey, dateStamp, region, service);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  const uploadUrl = `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
  const publicUrl = buildPublicObjectUrl(config, objectKey);

  return {
    uploadUrl,
    publicUrl,
    key: objectKey,
  };
}

/**
 * Uploads a Buffer directly from the server to Cloudflare R2 using AWS Signature V4.
 */
export async function uploadBufferToR2(
  config: R2Config,
  objectKey: string,
  buffer: Buffer,
  contentType: string
): Promise<{ publicUrl: string; key: string }> {
  const region = "auto";
  const service = "s3";
  const host = `${config.accountId}.r2.cloudflarestorage.com`;
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const encodedKey = objectKey.split("/").map(encodeRfc3986).join("/");
  const canonicalUri = `/${encodeRfc3986(config.bucketName)}/${encodedKey}`;
  const payloadHash = sha256Hex(buffer);

  const canonicalHeaders = [
    `content-type:${contentType}`,
    `host:${host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
  ].join("\n") + "\n";

  const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "PUT",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(config.secretAccessKey, dateStamp, region, service);
  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const endpoint = `https://${host}${canonicalUri}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorizationHeader,
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Cloudflare R2 upload failed (${res.status}): ${errText.slice(0, 200)}`);
  }

  return {
    publicUrl: buildPublicObjectUrl(config, objectKey),
    key: objectKey,
  };
}

