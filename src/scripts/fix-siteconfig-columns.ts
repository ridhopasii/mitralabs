import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== FIXING SITECONFIG COLUMNS ===");
  const config = await prisma.siteConfig.findFirst();
  if (config) {
    console.log("Current footer_desc:", config.footer_desc);
    await prisma.siteConfig.update({
      where: { id: config.id },
      data: {
        footer_desc: "Mitra Digital Bisnis Mu.",
        navbar_button: "💬 Chat Sekarang",
        address: "Medan, Sumatera Utara"
      }
    });
    console.log("SiteConfig columns updated successfully.");
  } else {
    console.log("No SiteConfig found to update!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
