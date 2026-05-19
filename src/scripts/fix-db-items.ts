import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== FIXING DB ITEMS ===");

  // 1. Update the FAQ table directly
  const faqs = await prisma.fAQ.findMany();
  for (const faq of faqs) {
    if (faq.question.toLowerCase().includes("garansi") || faq.question.toLowerCase().includes("bug")) {
      console.log(`Updating FAQ ID ${faq.id} in DB...`);
      await prisma.fAQ.update({
        where: { id: faq.id },
        data: {
          answer: "Ada. Garansi bug teknis 7 hari setelah serah terima. Kalau ada yang error dari sisi kami, langsung kami perbaiki tanpa biaya. Setelah masa garansi, perbaikan Rp 100.000 per sesi."
        }
      });
    }
  }

  // 2. Update SiteConfig json_content
  const config = await prisma.siteConfig.findFirst();
  if (config) {
    console.log("Updating SiteConfig JSON Content...");
    let jsonContent: any = config.json_content;
    if (typeof jsonContent === 'string') {
      jsonContent = JSON.parse(jsonContent);
    }

    if (jsonContent) {
      // Fix FAQs inside json_content
      if (Array.isArray(jsonContent.faqs)) {
        jsonContent.faqs = jsonContent.faqs.map((faq: any) => {
          if (faq.question.toLowerCase().includes("garansi") || faq.question.toLowerCase().includes("bug")) {
            return {
              ...faq,
              answer: "Ada. Garansi bug teknis 7 hari setelah serah terima. Kalau ada yang error dari sisi kami, langsung kami perbaiki tanpa biaya. Setelah masa garansi, perbaikan Rp 100.000 per sesi."
            };
          }
          return faq;
        });
      }

      // Fix process steps inside json_content
      if (jsonContent.home?.process?.steps) {
        jsonContent.home.process.steps = jsonContent.home.process.steps.map((step: any) => {
          if (step.id === 5 || step.title.includes("Langkah 5")) {
            return {
              ...step,
              desc: "Lunas, akses diserahkan, website live. Garansi bug 7 hari aktif. Bisnis kamu resmi hadir di internet."
            };
          }
          return step;
        });
      }

      // Fix services notes inside json_content
      if (jsonContent.services?.notes) {
        jsonContent.services.notes = [
          "Paket Standard & Premium sudah termasuk GRATIS Domain .com/.id selama 1 tahun.",
          "Garansi maintenance & perbaikan bug selama 7 hari setelah serah terima.",
          "Semua harga sudah termasuk pajak. Tidak ada biaya tersembunyi."
        ];
      }

      // Fix invoice settings terms and conditions inside json_content
      if (jsonContent.invoiceSettings) {
        jsonContent.invoiceSettings.termsAndConditions = "1. Pembayaran DP 30% dilakukan sebelum proyek dimulai\n2. Pelunasan 70% dilakukan setelah website selesai dan sebelum serah terima\n3. Pembayaran dapat dilakukan melalui transfer bank\n4. Garansi bug & maintenance berlaku 7 hari setelah serah terima";
      }

      await prisma.siteConfig.update({
        where: { id: config.id },
        data: {
          json_content: jsonContent
        }
      });
      console.log("SiteConfig updated successfully.");
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
