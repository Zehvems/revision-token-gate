import { PrismaClient } from "@prisma/client";

// prosty cache na globalnym obiekcie
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// jeśli już istnieje → użyj
// jeśli nie → utwórz nową instancję
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// w dev zapamiętujemy instancję
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
