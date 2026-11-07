import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { backendFetch } from "@/lib/backendProxy";
import { LARAVEL_API_BASE } from "@/lib/laravelApi";
import { isVaultSession, VAULT_MARKER_ROOM, VAULT_MARKER_TITLE } from "@/lib/richContent";

export interface VaultEntry {
  identifier: string; // normalized studentId or email prefix
  email: string;
  newPasswordHash: string;
  backendAuthPassword: string;
  updatedAt: string;
}

interface VaultStore {
  entries: Record<string, VaultEntry>;
  serviceToken?: string;
}

const VAULT_PREFIX = "STJ_VAULT_V1:";

declare global {
  // eslint-disable-next-line no-var
  var __stjPasswordVault: VaultStore | undefined;
}

function getKey(): Buffer {
  const secret =
    process.env.JWT_SECRET || "stj_secure_fallback_secret_key_itc_2026_min_32_chars";
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

function encryptVault(store: VaultStore): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(store), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return (
    VAULT_PREFIX +
    Buffer.concat([iv, tag, encrypted]).toString("base64")
  );
}

function decryptVault(raw: string | null | undefined): VaultStore | null {
  if (!raw || typeof raw !== "string" || !raw.startsWith(VAULT_PREFIX)) return null;
  try {
    const buf = Buffer.from(raw.slice(VAULT_PREFIX.length), "base64");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ciphertext = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      "utf8"
    );
    const parsed = JSON.parse(decrypted);
    if (parsed && typeof parsed.entries === "object") {
      return parsed as VaultStore;
    }
    return null;
  } catch {
    return null;
  }
}

function getLocalFilePath(): string {
  return path.join(os.tmpdir(), "stj-password-vault.json");
}

function readLocalStore(): VaultStore {
  if (globalThis.__stjPasswordVault) {
    return globalThis.__stjPasswordVault;
  }
  try {
    const p = getLocalFilePath();
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const dec = decryptVault(raw);
      if (dec) {
        globalThis.__stjPasswordVault = dec;
        return dec;
      }
    }
  } catch {
    // ignore
  }
  const empty: VaultStore = { entries: {} };
  globalThis.__stjPasswordVault = empty;
  return empty;
}

function writeLocalStore(store: VaultStore) {
  globalThis.__stjPasswordVault = store;
  try {
    fs.writeFileSync(getLocalFilePath(), encryptVault(store), "utf8");
  } catch {
    // ignore
  }
}

export function normalizeUserKey(emailOrStudentId: string): string {
  return String(emailOrStudentId || "")
    .trim()
    .toLowerCase()
    .replace(/@itc\.edu\.kh$/, "");
}

export function rememberServiceToken(token?: string | null) {
  if (!token) return;
  const store = readLocalStore();
  if (store.serviceToken !== token) {
    store.serviceToken = token;
    writeLocalStore(store);
  }
}

async function syncFromBackendSqlite(): Promise<VaultStore> {
  const local = readLocalStore();
  try {
    let res = await backendFetch("sessions").catch(() => null);
    if ((!res || !res.ok) && local.serviceToken) {
      res = await fetch(`${LARAVEL_API_BASE}/sessions`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${local.serviceToken}`,
        },
        cache: "no-store",
      }).catch(() => null);
    }
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      const sessions: any[] = Array.isArray(data?.sessions) ? data.sessions : [];
      const vaultRecord = sessions.find((s) => isVaultSession(s));
      if (vaultRecord?.notes) {
        const remoteStore = decryptVault(vaultRecord.notes);
        if (remoteStore) {
          const merged: VaultStore = {
            entries: { ...remoteStore.entries, ...local.entries },
            serviceToken: local.serviceToken || remoteStore.serviceToken,
          };
          writeLocalStore(merged);
          return merged;
        }
      }
    }
  } catch {
    // ignore
  }
  return local;
}

async function persistToBackendSqlite(store: VaultStore) {
  writeLocalStore(store);
  try {
    const encryptedNotes = encryptVault(store);
    const listRes = await backendFetch("sessions");
    if (!listRes.ok) return;
    const listData = await listRes.json().catch(() => null);
    const sessions: any[] = Array.isArray(listData?.sessions) ? listData.sessions : [];
    const courses: any[] = Array.isArray(listData?.courses) ? listData.courses : [];
    const existing = sessions.find((s) => isVaultSession(s));

    if (existing?.id) {
      await backendFetch(`sessions/${encodeURIComponent(existing.id)}`, {
        method: "PUT",
        body: JSON.stringify({
          title: VAULT_MARKER_TITLE,
          room: VAULT_MARKER_ROOM,
          status: "CREDENTIAL_VAULT",
          notes: encryptedNotes,
        }),
      });
      return;
    }

    const firstCourseId = courses[0]?.id || "PROG101";
    await backendFetch("sessions", {
      method: "POST",
      body: JSON.stringify({
        courseId: firstCourseId,
        title: VAULT_MARKER_TITLE,
        sessionDate: "2026-09-01",
        startTime: "00:00",
        endTime: "00:01",
        room: VAULT_MARKER_ROOM,
        status: "CREDENTIAL_VAULT",
        notes: encryptedNotes,
      }),
    });
  } catch {
    // ignore
  }
}

export async function getVaultEntry(emailOrStudentId: string): Promise<VaultEntry | null> {
  const key = normalizeUserKey(emailOrStudentId);
  if (!key) return null;
  const store = await syncFromBackendSqlite();
  return store.entries[key] || null;
}

export async function saveVaultPasswordChange(params: {
  emailOrStudentId: string;
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = normalizeUserKey(params.emailOrStudentId);
  if (!key) {
    return { ok: false, error: "រកមិនឃើញគណនីអ្នកប្រើប្រាស់" };
  }

  const store = await syncFromBackendSqlite();
  const existing = store.entries[key];

  let backendAuthPassword = params.currentPassword;

  if (existing) {
    // Verify against existing vault hash first
    const validVault = await verifyPassword(params.currentPassword, existing.newPasswordHash);
    if (!validVault) {
      return {
        ok: false,
        error: "លេខកូដសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ (Current password is incorrect)",
      };
    }
    backendAuthPassword = existing.backendAuthPassword;
  } else {
    // Verify currentPassword against Laravel backend /auth/login
    const checkRes = await fetch(`${LARAVEL_API_BASE}/auth/login`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        email: params.emailOrStudentId,
        password: params.currentPassword,
      }),
      cache: "no-store",
    }).catch(() => null);

    if (!checkRes || !checkRes.ok) {
      return {
        ok: false,
        error: "លេខកូដសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវទេ (Current password is incorrect)",
      };
    }

    const loginData = await checkRes.json().catch(() => null);
    if (loginData?.token) {
      store.serviceToken = loginData.token;
    }
    backendAuthPassword = params.currentPassword;
  }

  const newPasswordHash = await hashPassword(params.newPassword);
  store.entries[key] = {
    identifier: key,
    email: `${key}@itc.edu.kh`,
    newPasswordHash,
    backendAuthPassword,
    updatedAt: new Date().toISOString(),
  };

  await persistToBackendSqlite(store);
  return { ok: true };
}

export async function clearVaultPasswordForReset(
  studentIdOrEmail: string,
  defaultPassword: string
): Promise<void> {
  const key = normalizeUserKey(studentIdOrEmail);
  if (!key) return;
  const store = await syncFromBackendSqlite();
  const existing = store.entries[key];

  if (existing) {
    const newPasswordHash = await hashPassword(defaultPassword);
    store.entries[key] = {
      ...existing,
      newPasswordHash,
      updatedAt: new Date().toISOString(),
    };
    await persistToBackendSqlite(store);
  }
}

