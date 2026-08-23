import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@velkora.com';
  const password = 'Admin@123';
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN', passwordHash }
    });
    console.log('Updated existing user to ADMIN');
  } else {
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email,
        passwordHash,
        role: 'ADMIN',
      }
    });
    console.log('Created new ADMIN user');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
