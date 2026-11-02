const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  const u = await p.user.findUnique({
    where: { email: "e20251455@itc.edu.kh" },
    include: {
      member: { include: { enrollments: { include: { course: true } } } },
      userRoles: { include: { role: true } },
    },
  });
  console.log("Peak Brosmao user:");
  console.log({
    id: u.id,
    email: u.email,
    fullNameKh: u.fullNameKh,
    fullNameEn: u.fullNameEn,
    studentId: u.studentId,
    roles: u.userRoles.map((ur) => ur.role.name),
    memberId: u.member?.memberId,
    course: u.member?.enrollments.map((e) => e.course.code),
  });

  const david = await p.user.findUnique({
    where: { email: "e20221334@itc.edu.kh" },
    include: { userRoles: { include: { role: true } }, mandates: true },
  });
  console.log("\nDavid (STJ President):");
  console.log({
    id: david.id,
    email: david.email,
    fullNameKh: david.fullNameKh,
    roles: david.userRoles.map((ur) => ur.role.name),
    mandates: david.mandates,
  });

  const adminCheck = await p.user.findUnique({ where: { email: "admin@itc.edu.kh" } });
  console.log("\nadmin@itc.edu.kh exists:", !!adminCheck);
}

main().finally(() => p.$disconnect());
