import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== CHECK SITE CONFIG ===");
  const config = await prisma.siteConfig.findFirst();
  if (config) {
    console.log("ID:", config.id);
    console.log("Logo Text:", config.logo_text);
    console.log("Navbar Button:", config.navbar_button);
    console.log("Address:", config.address);
    console.log("JSON Content:");
    console.log(JSON.stringify(config.json_content, null, 2));
  } else {
    console.log("No SiteConfig found!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
