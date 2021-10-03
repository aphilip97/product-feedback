import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
};

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  db = global.prisma;
}

export default db;
