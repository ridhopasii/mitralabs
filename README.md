# Mitralabs.id - Digital Agency Platform 🚀

Platform digital agency premium yang dibangun dengan presisi teknis tinggi. Mitralabs.id melayani UMKM, Sekolah, dan Bisnis Travel di Indonesia dengan solusi website profesional.

## ✨ Features

### Public Features
- 🏠 **Landing Page** dengan hero section, stats, testimonials, FAQ
- 💼 **Portfolio Showcase** dengan detail project & case studies
- 📝 **Blog System** dengan kategori dan artikel lengkap
- 🛍️ **Service Packages** dengan pricing calculator
- 📞 **Contact Form** dengan EmailJS integration & hCaptcha
- 🌓 **Dark/Light Mode** dengan next-themes
- 📱 **Fully Responsive** design untuk semua device
- ⚡ **Performance Optimized** dengan Next.js 16 & Image optimization
- 🔍 **SEO-Friendly** dengan metadata & sitemap

### Admin Panel Features
- 📊 **Dashboard** dengan analytics & charts (Recharts)
- ✍️ **Blog Management** - CRUD artikel dengan rich editor
- 🖼️ **Portfolio Management** - Kelola project showcase
- 💰 **Service Management** - Kelola paket layanan
- ❓ **FAQ Management** - CRUD dengan accordion UI
- ⭐ **Testimonials Management** - Kelola review klien
- 📬 **Messages Inbox** - Lihat pesan dari contact form
- 📋 **Activity Logs** - Track semua aksi admin
- ⚙️ **Settings** - Konfigurasi website
- 🔐 **Secure Auth** dengan Supabase Authentication
- 🖼️ **Image Upload** dengan auto-compression

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + Material Design 3 colors
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Theme**: next-themes (dark/light mode)
- **Charts**: Recharts
- **Forms**: Zod validation
- **Image Compression**: browser-image-compression
- **Security**: isomorphic-dompurify, hCaptcha

### Backend & Database
- **Database**: PostgreSQL via Supabase
- **ORM**: Prisma
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Email**: EmailJS
- **Real-time**: Supabase Real-time subscriptions

### DevOps & Testing
- **Testing**: Vitest + @testing-library/react
- **Linting**: ESLint
- **Type Safety**: TypeScript
- **Analytics**: Vercel Analytics + Speed Insights
- **Deployment**: Vercel
- **Version Control**: Git

## 🔐 Security Features
- **Supabase Auth**: Admin panel protected by industry-standard authentication.
- **Environment Safety**: Secrets managed via Vercel/Supabase environment variables (excluded from Git).
- **Session Protection**: Real-time session verification in Admin Layout.

## 📁 Project Structure

```
mitralabs-web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   │   ├── blog/          # Blog management
│   │   │   ├── faq/           # FAQ management
│   │   │   ├── testimonials/  # Testimonials management
│   │   │   ├── pesan/         # Messages inbox
│   │   │   ├── logs/          # Activity logs
│   │   │   ├── portfolio/     # Portfolio management
│   │   │   ├── layanan/       # Services management
│   │   │   ├── konten/        # Content management
│   │   │   └── settings/      # Website settings
│   │   ├── blog/              # Public blog pages
│   │   ├── portfolio/         # Public portfolio pages
│   │   ├── layanan/           # Services page
│   │   ├── tentang/           # About page
│   │   ├── kontak/            # Contact page
│   │   └── login/             # Admin login
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin-specific components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingScreen.tsx
│   ├── sections/              # Page sections
│   │   ├── home/              # Homepage sections
│   │   └── services/          # Services sections
│   ├── context/               # React Context
│   │   └── DataContext.tsx    # Global state management
│   ├── lib/                   # Utilities & configs
│   │   ├── supabase.ts        # Supabase client
│   │   ├── utils.ts           # Helper functions
│   │   └── __tests__/         # Test files
│   └── proxy.ts               # API proxy
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── docs/                      # Documentation files
├── .env.local                 # Environment variables (gitignored)
├── .env.example               # Environment template
├── vitest.config.ts           # Test configuration
├── SETUP.md                   # Setup guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ dan npm/yarn
- Akun Supabase (gratis)
- Akun EmailJS (gratis)
- Akun hCaptcha (gratis)

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd mitralabs-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dengan kredensial Anda (lihat [SETUP.md](./SETUP.md) untuk panduan lengkap)

4. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Buka browser**
   - Website: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

📖 **Panduan lengkap setup**: Lihat [SETUP.md](./SETUP.md)

## 🧪 Testing

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

## 🏗️ Build & Deploy

### Build for Production
```bash
npm run build
npm start
```

### Deploy ke Vercel
1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables
4. Deploy!

Lihat [SETUP.md](./SETUP.md) untuk deployment checklist lengkap.

## 🗺 Roadmap & Refactoring Plan (Next Steps)

### 1. Data Normalization
Currently, the site uses a single JSON blob for CMS data. To avoid bottlenecks as the platform grows, we plan to split this into:
- `services`: Normalized table for pricing and features.
- `portfolio`: Individual records with full case study support.
- `blog_posts`: Separate table for scalable content management.

### 2. Image Optimization
- Migrate all external Unsplash URLs to **Supabase Storage**.
- Implement Next.js `<Image />` component for automatic resizing and WebP conversion.

### 3. Advanced Validation
- Integrate **Zod** for schema-based validation in Admin forms.
- Add real-time field error feedback.

### 4. Testing Suite
- Implement **Vitest** for unit testing core logic.
- Add **Playwright** for end-to-end testing of the booking flow.

---
Built with ❤️ by [Mitralabs.id](https://mitralabs.id)

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- 🖼️ **Image Optimization**: Next.js Image component dengan auto WebP
- 📦 **Code Splitting**: Automatic route-based splitting
- 🎨 **CSS Optimization**: Tailwind CSS purging
- 🚀 **Edge Runtime**: Vercel Edge Functions
- 📈 **Analytics**: Real-time monitoring dengan Vercel Analytics

## 🎨 Design System

- **Colors**: Material Design 3 color system
- **Typography**: System fonts dengan fallback
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions dengan Framer Motion
- **Icons**: Lucide React (tree-shakeable)
- **Responsive**: Mobile-first approach
- **Dark Mode**: System preference + manual toggle

## 📝 Content Management

### Admin Panel Access
1. Login di `/login` dengan kredensial Supabase
2. Akses admin panel di `/admin`
3. Kelola semua konten dari dashboard

### Features:
- ✍️ **Blog**: Rich text editor, categories, tags, SEO metadata
- 🖼️ **Portfolio**: Project showcase dengan case studies
- 💰 **Services**: Pricing packages dengan calculator
- ❓ **FAQ**: Accordion-style Q&A management
- ⭐ **Testimonials**: Client reviews dengan star ratings
- 📬 **Messages**: Contact form submissions inbox
- 📋 **Logs**: Activity tracking untuk audit trail
- ⚙️ **Settings**: Website configuration (WA number, email, etc.)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

© 2024 Mitralabs.id. All rights reserved.

## 🆘 Support

Butuh bantuan? Hubungi kami:
- 📧 Email: hello@mitralabs.id
- 💬 WhatsApp: +62 812-3456-7890
- 🌐 Website: [mitralabs.id](https://mitralabs.id)

---

**Transforming Businesses Through Digital Innovation** 🚀
