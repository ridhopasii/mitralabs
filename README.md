# Mitralabs Master CMS v6 🚀

Digital Agency Platform built with technical precision. Mitralabs.id serves as a premium portal for UMKM, Schools, and Travel businesses in Indonesia.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 + Lucide Icons
- **Backend/DB**: Supabase (PostgreSQL + Real-time Storage)
- **State Management**: React Context API (DataContext)
- **Analytics**: Vercel Analytics + Speed Insights
- **Animations**: Framer Motion

## 🔐 Security Features
- **Supabase Auth**: Admin panel protected by industry-standard authentication.
- **Environment Safety**: Secrets managed via Vercel/Supabase environment variables (excluded from Git).
- **Session Protection**: Real-time session verification in Admin Layout.

## 📁 Project Structure
- `/src/app`: Next.js pages and layouts.
- `/src/components`: Reusable UI components.
- `/src/sections`: Page-specific sections (Hero, Services, etc.).
- `/src/context`: Global data and state management.
- `/src/lib`: External library configurations (Supabase, etc.).

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Run development server**:
   ```bash
   npm run dev
   ```

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
