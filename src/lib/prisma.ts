import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

function getResolvedDatabaseUrl(): string {
  // If explicitly specified in environment and not a relative file URL, honor it
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:.")) {
    return process.env.DATABASE_URL;
  }

  // Potential SQLite paths in order of preference
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "prisma", "stj.db"),
    path.join(cwd, "stj.db"),
    path.resolve(__dirname, "..", "..", "prisma", "stj.db"),
    path.resolve(__dirname, "..", "prisma", "stj.db"),
    path.resolve(__dirname, "prisma", "stj.db"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).size > 0) {
      return `file:${candidate.replace(/\\/g, "/")}`;
    }
  }

  // Default to standard prisma/stj.db path
  const defaultPath = path.join(cwd, "prisma", "stj.db").replace(/\\/g, "/");
  return `file:${defaultPath}`;
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
