import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  console.log("Checking DB Contents:");
  const siteConfigCount = await prisma.siteConfig.count();
  const heroCount = await prisma.heroSection.count();
  const servicePlansCount = await prisma.servicePlan.count();
  const faqCount = await prisma.fAQ.count();
  const projectCount = await prisma.project.count();
  const testimonialCount = await prisma.testimonial.count();
  
  console.log(`- SiteConfig row count: ${siteConfigCount}`);
  console.log(`- HeroSection row count: ${heroCount}`);
  console.log(`- ServicePlan row count: ${servicePlansCount}`);
  console.log(`- FAQ row count: ${faqCount}`);
  console.log(`- Project row count: ${projectCount}`);
  console.log(`- Testimonial row count: ${testimonialCount}`);

  if (siteConfigCount > 0) {
    const config = await prisma.siteConfig.findFirst();
    console.log("SiteConfig:", JSON.stringify(config, null, 2));
  }

  if (faqCount > 0) {
    const faqs = await prisma.fAQ.findMany();
    console.log("FAQs in DB:", JSON.stringify(faqs, null, 2));
  }

  if (servicePlansCount > 0) {
    const plans = await prisma.servicePlan.findMany();
    console.log("ServicePlans in DB:", JSON.stringify(plans, null, 2));
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
