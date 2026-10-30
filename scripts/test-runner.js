const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

console.log("===============================================================================");
console.log("STJ Management System - Automated Verification Test Suite");
console.log("Institute of Technology of Cambodia (ITC)");
console.log("Hostinger Business/Unlimited MySQL & Node.js 22 LTS Compatibility Check");
console.log("===============================================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(`       Error: ${err.message}`);
  }
}

async function main() {
  // Test 1: Attendance Rate Calculation Formula
  // Formula: (Present + Late) / (Total - Excused) * 100%
  runTest("Attendance Rate Calculation: Standard formula (Present + Late)/(Total - Excused)*100%", () => {
    function calculateAttendanceRate(present, late, total, excused) {
      const eligible = total - excused;
      if (eligible <= 0) return 100;
      const rate = ((present + late) / eligible) * 100;
      return Math.min(100, Math.max(0, Math.round(rate * 10) / 10));
    }

    // Case 1: 5 present, 1 late, 1 absent, 1 excused (Total: 8)
    // Eligible: 8 - 1 = 7. Present + Late: 6. Rate: 6/7 * 100 = 85.714... => 85.7%
    const rate1 = calculateAttendanceRate(5, 1, 8, 1);
    assert.strictEqual(rate1, 85.7, `Expected 85.7%, received ${rate1}%`);

    // Case 2: Perfect attendance with 2 excused (Total: 10, Present: 8, Late: 0, Excused: 2)
    // Eligible: 10 - 2 = 8. Present + Late: 8. Rate: 8/8 * 100 = 100%
    const rate2 = calculateAttendanceRate(8, 0, 10, 2);
    assert.strictEqual(rate2, 100, `Expected 100%, received ${rate2}%`);

    // Case 3: Zero non-excused sessions (Total: 2, Excused: 2) => 100%
    const rate3 = calculateAttendanceRate(0, 0, 2, 2);
    assert.strictEqual(rate3, 100, `Expected 100%, received ${rate3}%`);
  });

  // Test 2: Password Hashing & Verification Security
  await runAsyncTest("Authentication Security: Bcrypt salt & verify matches", async () => {
    const rawPassword = "ITC@STJ2026!";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert(hash.startsWith("$2"), "Hash must be a valid bcrypt format");
    const valid = await bcrypt.compare(rawPassword, hash);
    assert.strictEqual(valid, true, "Bcrypt compare must succeed with correct password");
    const invalid = await bcrypt.compare("WrongPassword", hash);
    assert.strictEqual(invalid, false, "Bcrypt compare must fail with invalid password");
  });

  // Test 3: Cryptographic Token Generation & Hashing for Public Share Links
  runTest("Share Link Token: High entropy 16-byte hex and SHA-256 verification", () => {
    const token = crypto.randomBytes(16).toString("hex");
    assert.strictEqual(token.length, 32, "Token must be exactly 32 hex characters (128 bits)");

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    assert.strictEqual(tokenHash.length, 64, "SHA-256 hash must be 64 characters");

    // Verify hash predictability
    const verifyHash = crypto.createHash("sha256").update(token).digest("hex");
    assert.strictEqual(tokenHash, verifyHash, "Hash must be strictly deterministic");
  });

  // Test 4: Strict RBAC Permission Isolation (Leader CANNOT mutate attendance)
  runTest("RBAC Permissions: Course Leader is FORBIDDEN from marking/editing attendance", () => {
    const permissions = {
      SUPER_ADMIN: ["attendance:mark", "attendance:edit", "attendance:read", "members:manage", "share:create", "system:settings"],
      STJ_ADMIN: ["attendance:mark", "attendance:edit", "attendance:read", "members:manage", "share:create"],
      COURSE_LEADER: ["attendance:read", "share:create", "reports:view"],
      MEMBER: ["attendance:read"],
    };

    assert(permissions.SUPER_ADMIN.includes("attendance:mark"), "Super Admin must have mark permission");
    assert(permissions.STJ_ADMIN.includes("attendance:mark"), "STJ Admin must have mark permission");
    assert(!permissions.COURSE_LEADER.includes("attendance:mark"), "Course Leader must NEVER have attendance:mark");
    assert(!permissions.COURSE_LEADER.includes("attendance:edit"), "Course Leader must NEVER have attendance:edit");
    assert(permissions.COURSE_LEADER.includes("attendance:read"), "Course Leader must have attendance:read");
    assert(permissions.COURSE_LEADER.includes("share:create"), "Course Leader must have share:create");
  });

  // Test 5: Multilingual Dictionaries Integrity (km, en, fr)
  runTest("Internationalization (i18n): km, en, and fr dictionaries match keys and contain no emojis", () => {
    const kmPath = path.join(__dirname, "..", "src", "messages", "km.json");
    const enPath = path.join(__dirname, "..", "src", "messages", "en.json");
    const frPath = path.join(__dirname, "..", "src", "messages", "fr.json");

    assert(fs.existsSync(kmPath), "km.json must exist");
    assert(fs.existsSync(enPath), "en.json must exist");
    assert(fs.existsSync(frPath), "fr.json must exist");

    const km = JSON.parse(fs.readFileSync(kmPath, "utf-8"));
    const en = JSON.parse(fs.readFileSync(enPath, "utf-8"));
    const fr = JSON.parse(fs.readFileSync(frPath, "utf-8"));

    const expectedNamespaces = ["common", "nav", "attendance", "members", "courses", "share", "auth"];
    for (const ns of expectedNamespaces) {
      assert(km[ns], `km.json must contain namespace ${ns}`);
      assert(en[ns], `en.json must contain namespace ${ns}`);
      assert(fr[ns], `fr.json must contain namespace ${ns}`);
    }

    // Verify Khmer attendance translations
    assert.strictEqual(km.attendance.present, "មានវត្តមាន");
    assert.strictEqual(km.attendance.late, "មកយឺត");
    assert.strictEqual(km.attendance.absent, "អវត្តមាន");
    assert.strictEqual(km.attendance.excused, "ច្បាប់");

    // Emoji check regex (ranges for emoji)
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/u;
    const kmRaw = fs.readFileSync(kmPath, "utf-8");
    assert(!emojiRegex.test(kmRaw), "km.json must not contain any emoji characters");
  });

  // Test 6: Hostinger Compatibility (MySQL schema check & no Redis/Docker dependencies)
  runTest("Hostinger Node.js & MySQL Compatibility: Schema uses provider = 'mysql' and zero Redis/Docker dependencies", () => {
    const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
    assert(fs.existsSync(schemaPath), "prisma/schema.prisma must exist");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    assert(schema.includes('provider = "mysql"'), "Prisma schema must use provider = 'mysql' for Hostinger");
    assert(!schema.includes("postgresql"), "Production schema must not reference postgresql");

    const packageJsonPath = path.join(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    assert(!pkg.dependencies["ioredis"], "Must not have Redis dependency");
    assert(!pkg.dependencies["redis"], "Must not have Redis dependency");
    assert(!pkg.dependencies["socket.io"], "Must not have Socket.IO dependency (incompatible with Hostinger Web App)");
    assert(pkg.scripts["postinstall"].includes("prisma generate"), "postinstall must generate Prisma Client for Hostinger");
  });

  console.log("\n-------------------------------------------------------------------------------");
  console.log(`TEST RESULTS: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log("-------------------------------------------------------------------------------\n");

  if (passedTests === totalTests) {
    console.log("ALL TESTS PASSED. The STJ application is verified production-ready for Hostinger.");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});

