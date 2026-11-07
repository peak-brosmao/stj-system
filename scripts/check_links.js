const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const links = await prisma.shareLink.findMany();
  console.log("Prisma Share Links count:", links.length);
  for (const l of links) {
    console.log({
      id: l.id,
      token: l.token,
      title: l.title,
      courseId: l.courseId,
      sessionId: l.sessionId
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
