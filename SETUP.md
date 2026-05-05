# 🚀 Setup Guide - Mitralabs.id

Panduan lengkap untuk setup dan deployment proyek Mitralabs.id.

## 📋 Prerequisites

- Node.js 18+ dan npm/yarn
- PostgreSQL database (atau akun Supabase)
- Akun Supabase (untuk storage & auth)
- Akun EmailJS (untuk contact form)
- Akun hCaptcha (untuk spam protection)

---

## 🔧 Installation

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd mitralabs-web
npm install
```

### 2. Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan kredensial Anda:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxx

# hCaptcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=xxxxx
HCAPTCHA_SECRET_KEY=xxxxx
```

### 3. Database Setup

#### A. Jalankan Prisma Migration

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### B. Setup Supabase Tables (Manual)

Buka Supabase SQL Editor dan jalankan:

```sql
-- Enable Row Level Security
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_messages ENABLE ROW LEVEL SECURITY;

-- Policies untuk admin_logs (hanya admin yang bisa akses)
CREATE POLICY "Admin can view logs" ON admin_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can insert logs" ON admin_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policies untuk newsletter_subs
CREATE POLICY "Anyone can subscribe" ON newsletter_subs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view subscribers" ON newsletter_subs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policies untuk site_messages
CREATE POLICY "Anyone can send message" ON site_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view messages" ON site_messages
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 4. Supabase Storage Setup

#### A. Buat Storage Bucket

1. Buka Supabase Dashboard → Storage
2. Klik "New bucket"
3. Nama: `site-assets`
4. Public bucket: **Yes** ✅
5. Klik "Create bucket"

#### B. Setup Storage Policies

```sql
-- Policy untuk upload (authenticated users only)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets');

-- Policy untuk public access
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

-- Policy untuk delete (authenticated users only)
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets');
```

### 5. Supabase Auth Setup

#### A. Buat Admin User

1. Buka Supabase Dashboard → Authentication → Users
2. Klik "Add user" → "Create new user"
3. Email: `admin@mitralabs.id`
4. Password: (buat password yang kuat)
5. Auto Confirm User: **Yes** ✅

#### B. Setup Email Templates (Optional)

Customize email templates di Authentication → Email Templates:
- Confirm signup
- Reset password
- Magic link

---

## 🎨 Initial Data Setup

### Seed Data ke Supabase

Buka Supabase SQL Editor dan insert data awal:

```sql
-- Insert initial site data
INSERT INTO "SiteData" (id, json_content, updated_at)
VALUES (1, '{
  "settings": {
    "siteName": "Mitralabs.id",
    "waNumber": "6281234567890",
    "email": "hello@mitralabs.id"
  },
  "navbar": {
    "logo": "Mitralabs",
    "buttonText": "Konsultasi Gratis",
    "links": [
      {"label": "Beranda", "href": "/"},
      {"label": "Layanan", "href": "/layanan"},
      {"label": "Portfolio", "href": "/portfolio"},
      {"label": "Blog", "href": "/blog"},
      {"label": "Tentang", "href": "/tentang"},
      {"label": "Kontak", "href": "/kontak"}
    ]
  },
  "footer": {
    "description": "Semua hak dilindungi.",
    "links": [
      {"label": "Beranda", "href": "/"},
      {"label": "Layanan", "href": "/layanan"},
      {"label": "Portfolio", "href": "/portfolio"},
      {"label": "Blog", "href": "/blog"}
    ]
  },
  "testimonials": [],
  "faqs": []
}', NOW())
ON CONFLICT (id) DO NOTHING;
```

---

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 🔐 Admin Panel Access

1. Buka [http://localhost:3000/login](http://localhost:3000/login)
2. Login dengan kredensial admin yang sudah dibuat di Supabase
3. Setelah login, akses admin panel di [http://localhost:3000/admin](http://localhost:3000/admin)

### Admin Features:
- **Dashboard**: Analytics & overview
- **Blog**: Kelola artikel blog
- **Portfolio**: Kelola project portfolio
- **Layanan**: Kelola paket layanan
- **Konten**: Kelola konten homepage
- **FAQ**: Kelola frequently asked questions
- **Testimonials**: Kelola testimoni klien
- **Pesan**: Lihat pesan dari contact form
- **Logs**: Activity logs admin
- **Settings**: Pengaturan website

---

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables di Vercel Dashboard
4. Deploy!

### Environment Variables di Vercel

Tambahkan semua variable dari `.env.local` ke Vercel:
- Settings → Environment Variables
- Copy-paste semua variable
- Pilih environment: Production, Preview, Development

### Post-Deployment Checklist

- [ ] Test login admin
- [ ] Test upload gambar
- [ ] Test contact form
- [ ] Test newsletter subscription
- [ ] Verify Supabase connection
- [ ] Check analytics (Vercel Analytics)
- [ ] Test responsive design
- [ ] Run Lighthouse audit
- [ ] Setup custom domain (optional)

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Sudah terintegrasi! Lihat di Vercel Dashboard → Analytics

### Vercel Speed Insights

Sudah terintegrasi! Lihat di Vercel Dashboard → Speed Insights

### Supabase Logs

Monitor database & storage di Supabase Dashboard → Logs

---

## 🛠️ Troubleshooting

### Error: "Supabase client not initialized"

**Solusi**: Pastikan environment variables sudah benar di `.env.local`

### Error: "Storage bucket not found"

**Solusi**: Buat bucket `site-assets` di Supabase Storage

### Error: "Unauthorized" saat upload gambar

**Solusi**: Pastikan user sudah login dan storage policies sudah di-setup

### Error: Prisma migration failed

**Solusi**: 
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

### Error: Module not found

**Solusi**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Email**: EmailJS
- **Captcha**: hCaptcha
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Testing**: Vitest + Testing Library
- **Validation**: Zod
- **Deployment**: Vercel

---

## 🤝 Support

Butuh bantuan? Hubungi:
- Email: hello@mitralabs.id
- WhatsApp: +62 812-3456-7890

---

## 📝 License

© 2024 Mitralabs.id. All rights reserved.
