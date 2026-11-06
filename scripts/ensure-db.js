/**
 * Hostinger & Local Self-Healing Database Synchronizer
 * Guarantees that stj.db exists, has all tables, and is synced across prisma/stj.db and root stj.db
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function ensureDatabase() {
  const cwd = process.cwd();

  // 1. Ensure .env file exists for Prisma CLI in clean deployment environments
  const envPath = path.join(cwd, ".env");
  const envProd = path.join(cwd, ".env.production");
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envProd)) {
      console.log("[ensure-db] Creating .env from .env.production...");
      fs.copyFileSync(envProd, envPath);
    } else {
      console.log("[ensure-db] Creating fallback .env...");
      fs.writeFileSync(
        envPath,
        'DATABASE_URL="file:./prisma/stj.db"\nJWT_SECRET="stj_jwt_secret_production_key_itc_cambodia_random_secure_hex_2026"\n'
      );
    }
  }

  // 2. Set environment variables in process
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./prisma/stj.db";
  }

  const prismaDir = path.join(cwd, "prisma");
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }

  const prismaDb = path.join(prismaDir, "stj.db");
  const rootDb = path.join(cwd, "stj.db");
  const templateDb = path.join(prismaDir, "template.sqlite");

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
    // Neither exists: initialize from template.sqlite if available
    if (fs.existsSync(templateDb) && fs.statSync(templateDb).size > 1024) {
      console.log("[ensure-db] Initializing stj.db from template.sqlite...");
      fs.copyFileSync(templateDb, prismaDb);
      fs.copyFileSync(templateDb, rootDb);
    } else {
      console.log("[ensure-db] Initializing brand new database with prisma db push & seed...");
      try {
        const execEnv = {
          ...process.env,
          DATABASE_URL: "file:./prisma/stj.db",
        };
        execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: execEnv });
        execSync("node prisma/seed.js", { stdio: "inherit", env: execEnv });
        if (fs.existsSync(prismaDb) && !fs.existsSync(rootDb)) {
          fs.copyFileSync(prismaDb, rootDb);
        }
      } catch (e) {
        console.error("[ensure-db] Warning during db push:", e.message);
      }
    }
  }

  console.log("[ensure-db] Database synchronization complete.");
}

ensureDatabase();
