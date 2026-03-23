import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function makePrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL is not set. Prisma will not be able to connect.");
    return new PrismaClient();
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || makePrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
