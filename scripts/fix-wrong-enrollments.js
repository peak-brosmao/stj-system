/**
 * fix-wrong-enrollments.js
 * =====================================================================
 * One-time script to correct member course assignments that were
 * accidentally overwritten by an old version of seed.js.
 *
 * Run ONCE on the production database:
 *   node scripts/fix-wrong-enrollments.js
 *
 * Safe to re-run — uses upsert / findFirst logic, never deletes
 * enrollments that were intentionally set by admin.
 * =====================================================================
 */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Ground-truth course assignments from the official STJ 2026-2027 roster.
// memberId → correct course code
const CORRECT_ASSIGNMENTS = {
  STJ003: "PHYS101", // គ្រុយ អ៊ីខាង (Physics Leader)
  STJ004: "PHYS101", // ឈិន តុលា
  STJ005: "PHYS101", // ឡាន បូរិន
  STJ006: "CHEM101", // ប៉ាក់ ច័ន្ទបូរី
  STJ007: "PHYS101", // វី ពិទូរ្យ
  STJ008: "MATH101", // ពៅ ជុំរតនៈ
  STJ009: "PHYS101", // សុង ស្រីពេជ
  STJ010: "PHYS101", // សុខា អឺអឺង
  STJ011: "PHYS101", // តឹក ឈាវវិសាល
  STJ012: "MATH101", // អេង ស៊ូ យី   ← was wrongly shown as PHYS101
  STJ013: "MATH101", // គឹម រតនៈ (Math Leader)
  STJ014: "CHEM101", // ប៊ុន សុខបញ្ញា
  STJ015: "CHEM101", // ឡេង ច័ន្ទវង្សា
  STJ016: "CHEM101", // ជាតិ វិសាល
  STJ017: "PHYS101", // អិន សុជាតិ
  STJ018: "CHEM101", // ម៉ឹង ហាក់
  STJ019: "CHEM101", // សុំ សុធាវី
  STJ020: "CHEM101", // ហង់ សុជាតា
  STJ021: "MATH101", // ជាលី អមរិន្ទ
  STJ022: "MATH101", // ឈុំ បញ្ញា
  STJ024: "PHYS101", // លៀងលី សុខឡេង
  STJ025: "PROG101", // លាង ជឹងហេង (Prog Leader)
  STJ026: "PROG101", // ឃន វ៉ិចទ័រ
  STJ027: "PROG101", // ប៊ុន បុណ្ណាកា
  STJ028: "PROG101", // ស៊ឹង វិច្ឆិកា
  STJ029: "PROG101", // សេង ម៉ិញហាវ
  STJ030: "PROG101", // ណាំ ម៉េងហួត
  STJ031: "MATH101", // ចៃ ជីជូ
  STJ032: "PROG101", // ហាក់ ដូនីឡា
  STJ033: "PROG101", // ពៀក ប្រុសម៉ៅ
  STJ034: "PROG101", // ចំរើន ដែន
  STJ035: "CHEM101", // ខេង លីឧស្សាហ៍ (Chem Leader)
  STJ036: "MATH101", // ឈិត សុធារិទ្ធ
  STJ037: "CHEM101", // ឯល មូហាម៉ាត់សាហ្វី
  STJ038: "CHEM101", // ឈឿន ធារី
  STJ039: "PHYS101", // ហាប់ ស៊ីឈាង
  STJ040: "MATH101", // ឌិន ម៉េងហុង
  STJ041: "CHEM101", // ហួត សំណាង
};

async function main() {
  console.log("🔧 STJ Enrollment Correction Script");
  console.log("=====================================");

  // Load all courses into a map: code → id
  const courses = await prisma.course.findMany({ select: { id: true, code: true } });
  const courseMap = {};
  for (const c of courses) courseMap[c.code] = c.id;

  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  for (const [memberId, correctCourseCode] of Object.entries(CORRECT_ASSIGNMENTS)) {
    try {
      const member = await prisma.member.findUnique({ where: { memberId } });
      if (!member) {
        console.warn(`  ⚠️  ${memberId} not found in DB — skipping`);
        skipped++;
        continue;
      }

      const correctCourseId = courseMap[correctCourseCode];
      if (!correctCourseId) {
        console.warn(`  ⚠️  Course ${correctCourseCode} not found — skipping ${memberId}`);
        skipped++;
        continue;
      }

      // Check current enrollment(s)
      const currentEnrollments = await prisma.courseEnrollment.findMany({
        where: { memberId: member.id },
        include: { course: { select: { code: true } } },
      });

      const alreadyCorrect = currentEnrollments.some((e) => e.courseId === correctCourseId);

      if (alreadyCorrect) {
        console.log(`  ✅ ${memberId} already enrolled in ${correctCourseCode}`);
        skipped++;
        continue;
      }

      // Remove wrong enrollments and set the correct one
      const wrongOnes = currentEnrollments.filter((e) => e.courseId !== correctCourseId);
      for (const w of wrongOnes) {
        console.log(`  🗑️  ${memberId}: removing wrong enrollment [${w.course.code}]`);
        await prisma.courseEnrollment.delete({ where: { id: w.id } });
      }

      // Add correct enrollment
      await prisma.courseEnrollment.create({
        data: { courseId: correctCourseId, memberId: member.id },
      });
      console.log(`  ✅ ${memberId}: set to [${correctCourseCode}]`);
      fixed++;
    } catch (err) {
      console.error(`  ❌ ${memberId}: ${err.message}`);
      errors++;
    }
  }

  console.log("\n=====================================");
  console.log(`Done: ${fixed} fixed, ${skipped} already correct, ${errors} errors`);
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

