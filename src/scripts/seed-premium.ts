import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Premium & Realistic Data...');

  // Clear existing data
  await prisma.invoice.deleteMany();
  await prisma.project.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.siteMessage.deleteMany();

  // Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        slug: 'sujailake-toba-tourism',
        title: 'Sujailake Toba: Digital Tourism Ecosystem',
        category: 'Web Development',
        image_url: 'https://images.unsplash.com/photo-1536735397559-3a4ef888a709?auto=format&fit=crop&q=80&w=1200',
        description: 'Transformasi digital platform pariwisata Danau Toba dengan sistem reservasi paket tour dan manajemen armada bus terintegrasi.',
        challenge: 'Membangun ekosistem yang mampu menangani ribuan transaksi reservasi sambil mempertahankan performa loading yang sangat cepat di daerah dengan koneksi terbatas.',
        solution: 'Implementasi arsitektur Next.js dengan ISR (Incremental Static Regeneration) dan integrasi Supabase untuk sinkronisasi data real-time.',
        results: ['Peningkatan reservasi sebesar 45%', 'Load time di bawah 1.5 detik', 'Sistem manajemen inventaris otomatis'],
        client_name: 'PT. Sujailake Toba Utama',
        project_date: '2025',
        live_link: 'https://sujailaketoba.com',
        tech_stack: ['Next.js', 'PostgreSQL', 'Tailwind CSS', 'Alpine.js'],
        status: 'Published'
      }
    }),
    prisma.project.create({
      data: {
        slug: 'bakery-joy-ecommerce',
        title: 'Bakery Joy: Premium Pastry E-Commerce',
        category: 'E-Commerce',
        image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200',
        description: 'Pengembangan toko online premium dengan fitur custom cake builder dan integrasi sistem pengiriman instan.',
        challenge: 'Klien membutuhkan cara bagi pelanggan untuk mendesain kue secara visual sebelum melakukan checkout.',
        solution: 'Membangun UI interaktif menggunakan React State Management untuk visualisasi produk secara dinamis.',
        results: ['Konversi penjualan naik 30%', 'User engagement meningkat 2x lipat'],
        client_name: 'Joy Pastry & Bakery',
        project_date: '2024',
        live_link: 'https://bakeryjoy.id',
        tech_stack: ['React', 'Framer Motion', 'Stripe API'],
        status: 'Published'
      }
    })
  ]);

  // Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'tren-ui-ux-2026',
        title: 'Tren UI/UX 2026: Mengapa Minimalisme Tetap Menjadi Raja',
        excerpt: 'Eksplorasi mendalam tentang bagaimana desain yang bersih dapat meningkatkan konversi bisnis Anda secara signifikan.',
        content: '<h2>Desain yang Bernafas</h2><p>Di tahun 2026, pengguna semakin menghargai kecepatan dan kejelasan. Website yang terlalu ramai dengan animasi tidak lagi efektif...</p>',
        category: 'Design',
        author: 'Ridho Robbi',
        image_url: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1200'
      },
      {
        slug: 'keunggulan-nextjs-bisnis',
        title: 'Keunggulan Next.js untuk Performa Website Bisnis Skala Besar',
        excerpt: 'Mengenal framework yang digunakan oleh raksasa teknologi untuk skalabilitas dan SEO yang tak tertandingi.',
        content: '<h2>Kenapa Next.js?</h2><p>Next.js bukan sekadar framework, ini adalah standar baru dalam pengembangan web modern yang mengutamakan User Experience...</p>',
        category: 'Tech',
        author: 'Dev Team',
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'
      }
    ]
  });

  // Invoices
  await prisma.invoice.create({
    data: {
      project_id: projects[0].id,
      invoice_number: 'INV/2025/MITRA/001',
      amount: 12500000,
      status: 'Paid',
      due_date: new Date('2025-06-15'),
      items: [
        { desc: 'Digital Strategy & UI/UX Design', price: 4500000 },
        { desc: 'Full-stack Development (Phase 1)', price: 8000000 }
      ]
    }
  });

  // Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Ridho Robbi Pasi',
        role: 'Founder & Lead Architect',
        bio: 'Berpengalaman lebih dari 8 tahun dalam membangun ekosistem digital berskala enterprise.',
        image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        order: 1
      },
      {
        name: 'Siti Aminah',
        role: 'Senior UI/UX Designer',
        bio: 'Spesialis dalam menciptakan antarmuka yang intuitif dan berfokus pada konversi pengguna.',
        image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
        order: 2
      }
    ]
  });

  // Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Bapak Ahmad',
        role: 'CEO Sujailake Toba',
        content: 'Mitralabs berhasil mengubah visi kami menjadi kenyataan digital yang luar biasa. Sistem reservasi mereka sangat membantu operasional kami.',
        rating: 5,
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
      }
    ]
  });

  console.log('Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
