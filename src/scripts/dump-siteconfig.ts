import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function dump() {
  const config = await prisma.siteConfig.findFirst();
  console.log("FULL SITECONFIG OBJECT:");
  console.log(JSON.stringify(config, null, 2));
}

dump()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
