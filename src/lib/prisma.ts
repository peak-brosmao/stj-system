import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

function getResolvedDatabaseUrl(): string {
  // If explicitly specified in environment and points to an existing file, honor it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:.")) {
    return process.env.DATABASE_URL;
  }

  const cwd = process.cwd();
  const prismaDir = path.join(cwd, "prisma");
  if (!fs.existsSync(prismaDir)) {
    try {
      fs.mkdirSync(prismaDir, { recursive: true });
    } catch {
      // non-blocking
    }
  }

  const primaryDb = path.join(prismaDir, "stj.db");
  const rootDb = path.join(cwd, "stj.db");

  // 1. If primary database already exists and has data, NEVER touch or overwrite it
  if (fs.existsSync(primaryDb) && fs.statSync(primaryDb).size > 1024) {
    return `file:${primaryDb.replace(/\\/g, "/")}`;
  }

  // 2. If root stj.db exists and has data, sync it to primary and use it
  if (fs.existsSync(rootDb) && fs.statSync(rootDb).size > 1024) {
    try {
      fs.copyFileSync(rootDb, primaryDb);
    } catch {
      // non-blocking
    }
    return `file:${primaryDb.replace(/\\/g, "/")}`;
  }

  // 3. Fallback for clean deployment environments (e.g., Hostinger fresh git clone):
  // Initialize stj.db from the committed template.sqlite so Error code 14 never happens
  const templateCandidates = [
    path.join(prismaDir, "template.sqlite"),
    path.join(cwd, "template.sqlite"),
    path.resolve(__dirname, "..", "..", "prisma", "template.sqlite"),
    path.resolve(__dirname, "..", "prisma", "template.sqlite"),
  ];

  for (const templatePath of templateCandidates) {
    if (fs.existsSync(templatePath) && fs.statSync(templatePath).size > 1024) {
      try {
        fs.copyFileSync(templatePath, primaryDb);
        console.log(`[prisma] Initialized fresh stj.db from template: ${templatePath}`);
        return `file:${primaryDb.replace(/\\/g, "/")}`;
      } catch (err) {
        console.error("[prisma] Failed copying template.sqlite:", err);
      }
    }
  }

  return `file:${primaryDb.replace(/\\/g, "/")}`;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getResolvedDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
