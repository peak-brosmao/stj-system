/**
 * Hostinger & Local Self-Healing Database Synchronizer
 * Guarantees that stj.db exists, has all tables, and is synced across prisma/stj.db and root stj.db
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function ensureDatabase() {
  const cwd = process.cwd();
  const prismaDb = path.join(cwd, "prisma", "stj.db");
  const rootDb = path.join(cwd, "stj.db");

  const hasPrismaDb = fs.existsSync(prismaDb) && fs.statSync(prismaDb).size > 1024;
  const hasRootDb = fs.existsSync(rootDb) && fs.statSync(rootDb).size > 1024;

  if (hasPrismaDb && !hasRootDb) {
    console.log("[ensure-db] Syncing prisma/stj.db -> stj.db...");
    fs.copyFileSync(prismaDb, rootDb);
  } else if (!hasPrismaDb && hasRootDb) {
    console.log("[ensure-db] Syncing stj.db -> prisma/stj.db...");
    fs.copyFileSync(rootDb, prismaDb);
  } else if (hasPrismaDb && hasRootDb) {
    // Both exist - sync latest
    const prismaMtime = fs.statSync(prismaDb).mtimeMs;
    const rootMtime = fs.statSync(rootDb).mtimeMs;
    if (prismaMtime > rootMtime) {
      fs.copyFileSync(prismaDb, rootDb);
    } else {
      fs.copyFileSync(rootDb, prismaDb);
    }
  } else {
    console.log("[ensure-db] Initializing brand new database with prisma db push & seed...");
    try {
      execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
      execSync("node prisma/seed.js", { stdio: "inherit" });
      if (fs.existsSync(prismaDb) && !fs.existsSync(rootDb)) {
        fs.copyFileSync(prismaDb, rootDb);
      }
    } catch (e) {
      console.error("[ensure-db] Warning during db push:", e.message);
    }
  }

  console.log("[ensure-db] Database synchronization complete.");
}

ensureDatabase();

