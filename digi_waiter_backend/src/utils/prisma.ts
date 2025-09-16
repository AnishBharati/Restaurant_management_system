import { PrismaClient } from "@prisma/client";
import logger from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['info', 'warn', 'error'], 
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function dbConnection() {
  try {
    await prisma.$connect();
    logger.info(`Database connected`);
  } catch (err) {
    logger.warn(`Failed to connect Database`);
    process.exit(1);
  }
}

