import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const count = await prisma.project.count();
  const invoices = await prisma.invoice.count();
  console.log(`Projects: ${count}`);
  console.log(`Invoices: ${invoices}`);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
