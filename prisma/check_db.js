require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== DB CHECK ===");
  
  const siteConfig = await prisma.siteConfig.findFirst();
  console.log("SiteConfig Address:", siteConfig?.address);
  console.log("SiteConfig Phone:", siteConfig?.phone);
  console.log("SiteConfig LogoText:", siteConfig?.logo_text);
  
  const faqs = await prisma.fAQ.findMany();
  console.log("FAQs Count:", faqs.length);
  faqs.forEach(f => {
    console.log(`- Q: ${f.question} | A: ${f.answer} | Cat: ${f.category}`);
  });
  
  const plans = await prisma.servicePlan.findMany();
  console.log("Plans Count:", plans.length);
  plans.forEach(p => {
    console.log(`- Name: ${p.name} | Price: ${p.price} | Duration: ${p.duration} | Features:`, p.features);
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
