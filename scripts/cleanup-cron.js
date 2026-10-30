const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function runCleanup() {
  console.log(`[${new Date().toISOString()}] Starting Hostinger Scheduled Cleanup Job...`);

  try {
    const now = new Date();

    // 1. Mark expired share links as revoked
    const expiredLinks = await prisma.shareLink.updateMany({
      where: {
        expiresAt: {
          lt: now,
        },
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
    console.log(`Revoked ${expiredLinks.count} expired share links.`);

    // 2. Delete expired sessions older than 7 days
    const expiredSessions = await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
    console.log(`Cleaned up ${expiredSessions.count} expired user sessions.`);

    console.log(`[${new Date().toISOString()}] Cleanup job finished successfully.`);
  } catch (error) {
    console.error("Cleanup error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runCleanup();

