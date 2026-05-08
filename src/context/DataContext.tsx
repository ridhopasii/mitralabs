"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Plan {
  id: number;
  name: string;
  price: string;
  tier: string;
  pages: string;
  duration: string;
  features: string[];
  missing: string[];
  highlight?: boolean;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  amount: number;
  status: "Unpaid" | "Partial" | "Paid" | "Cancelled";
  due_date: string;
  items: { desc: string; price: number; qty: number }[];
  client_name: string;
  client_email: string;
  created_at: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  plan_name: string;
  project_brief: string;
  desired_domain?: string;
  business_industry?: string;
  reference_websites?: string;
  organization_name?: string;
  position?: string;
  target_audience?: string;
  primary_cta?: string;
  competitors_list?: string;
  integrations_needed?: string;
  biggest_expectation?: string;
  status: "Pending" | "Confirmed" | "In-Progress" | "Completed" | "Cancelled";
  created_at: string;
  scheduled_date?: string;
  total_price: number;
  invoices?: Invoice[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  status: string;
  client_name?: string;
  project_date?: string;
  live_link?: string;
  github_link?: string;
  tech_stack?: string[];
  gallery_urls?: string[];
  invoices?: Invoice[];
  role?: string;
  scope?: string[];
  feedback?: {
    name: string;
    avatar?: string;
    comment: string;
    rating: number;
  };
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

interface AppData {
  navbar: {
    logo: string;
    links: { label: string; href: string }[];
    buttonText: string;
  };
  home: {
    hero: {
      tagline: string;
      promo: string;
      title: string;
      subtitle: string;
      image: string;
      stats: { label: string; value: string; desc: string };
    };
    problem: {
      title: string;
      subtitle: string;
      items: { id: number; title: string; desc: string }[];
    };
    solution: {
      tagline: string;
      title: string;
      subtitle: string;
      cards: {
        umkm: { tag?: string; title: string; desc: string; image?: string };
        travel: { tag?: string; title: string; desc: string; image?: string };
        school: { tag?: string; title: string; desc: string; image?: string };
        business: { tag?: string; title: string; desc: string; image?: string };
      };
    };
    process: {
      title: string;
      subtitle: string;
      steps: { id: number; title: string; desc: string }[];
    };
    stats: { id: number; label: string; value: string; desc: string }[];
    cta: {
      title: string;
      subtitle: string;
      buttonText: string;
      promoText: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    plans: Plan[];
    notes: string[];
    comparisonTitle: string;
    comparisonSubtitle: string;
  };
  portfolio: {
    title: string;
    subtitle: string;
    categories: string[];
    projects: Project[];
    cta: {
      title: string;
      subtitle: string;
      buttonText: string;
    };
  };
  about: {
    hero: {
      tagline: string;
      title: string;
      subtitle: string;
      image: string;
    };
    stats: { label: string; value: string }[];
    missionTitle: string;
    mission: string[];
    visionTitle: string;
    vision: string;
    teamTitle: string;
    teamSubtitle: string;
    team: { id: number; name: string; role: string; bio: string; image: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    instagram: string;
    address: string;
    mapsUrl: string;
  };
  footer: {
    description: string;
    links: { label: string; href: string }[];
    socials: { label: string; href: string }[];
  };
  settings: {
    waNumber: string;
    businessMode: string;
    waPromoMessage: string;
  };
  blog: {
    title: string;
    subtitle: string;
    posts: BlogPost[];
  };
  testimonials: {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string;
  }[];
  faqs: {
    id: number;
    question: string;
    answer: string;
    category: string;
  }[];
  bookings: Booking[];
}

const initialData: AppData = {
  navbar: {
    logo: "Mitralabs",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/layanan" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "About", href: "/tentang" },
      { label: "Contact", href: "/kontak" },
    ],
    buttonText: "Pesan Sekarang",
  },
  home: {
    hero: {
      tagline: "Precision Tech Agency",
      promo: "Special Launch Promo",
      title: "Solusi Digital Presisi Untuk Bisnis Anda.",
      subtitle: "Kami membangun infrastruktur digital yang tangguh untuk UMKM, Institusi Pendidikan, dan Industri Pariwisata. Fokus kami adalah fungsionalitas, kecepatan, dan konversi nyata.",
      image: "/mitralabs_hero_premium_1778227502346.png",
      stats: { label: "Success Projects", value: "240+", desc: "Digital Assets Live" }
    },
    problem: {
      title: "Masalah Umum Bisnis di Era Digital",
      subtitle: "Banyak bisnis kehilangan momentum karena infrastruktur digital yang dikelola secara amatir.",
      items: [
        { id: 1, title: "Kehilangan Trust", desc: "Calon klien ragu bertransaksi karena website terlihat ketinggalan zaman atau tidak aman." },
        { id: 2, title: "Konversi Rendah", desc: "Website hanya jadi pajangan tanpa sistem yang memudahkan pelanggan untuk membeli atau memesan." },
      ],
    },
    solution: {
      tagline: "Our Expertise",
      title: "Arsitektur Digital yang Menghasilkan Pertumbuhan",
      subtitle: "Setiap baris kode yang kami tulis bertujuan untuk memecahkan masalah spesifik di industri Anda.",
      cards: {
        umkm: {
          tag: "Most Requested",
          title: "Sistem Web UMKM",
          desc: "Integrasi WhatsApp, katalog produk dinamis, dan dashboard simpel untuk manajemen stok dan pesanan harian.",
          image: "/mitralabs_umkm_service_1778227528390.png"
        },
        travel: {
          title: "Portal Travel & Tour",
          desc: "Sistem manajemen paket wisata, kalender keberangkatan otomatis, dan formulir booking yang terintegrasi.",
          image: "/mitralabs_travel_service_1778227548373.png"
        },
        school: {
          title: "Platform Akademik",
          desc: "Pusat informasi sekolah, sistem PPDB Online, dan manajemen konten berita sekolah yang terstruktur.",
          image: "/mitralabs_school_service_1778227565941.png"
        },
        business: {
          title: "Corporate Identity",
          desc: "Company profile tingkat tinggi yang mencerminkan otoritas dan profesionalisme brand Anda di pasar global.",
          image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
        }
      }
    },
    process: {
      title: "Standard Operational Procedure",
      subtitle: "Kami bekerja dengan transparansi penuh untuk memastikan setiap ekspektasi Anda terpenuhi melampaui standar.",
      steps: [
        { id: 1, title: "Technical Onboarding", desc: "Pendalaman brief melalui form onboarding strategis untuk memetakan target audiens dan kompetitor." },
        { id: 2, title: "Agreement & Kickoff", desc: "Finalisasi kontrak, pembayaran DP 30%, dan penyusunan timeline pengerjaan yang ketat." },
        { id: 3, title: "Sprints & Updates", desc: "Proses development modular dengan laporan progres mingguan melalui grup koordinasi khusus." },
        { id: 4, title: "Quality Assurance", desc: "Pengujian performa (speed test), keamanan, dan responsivitas di berbagai perangkat." },
        { id: 5, title: "Handover & Warranty", desc: "Aktivasi website, serah terima aset, dan masa garansi bug untuk ketenangan pikiran Anda." },
      ],
    },
    stats: [
      { id: 1, label: "Live Projects", value: "240+", desc: "Digital Assets Live" },
      { id: 2, label: "Client Satisfaction", value: "4.9/5", desc: "Customer Rating" },
    ],
    cta: {
      title: "Mulai Transformasi Digital Anda Hari Ini",
      subtitle: "Tim ahli kami siap membantu Anda membangun kehadiran digital yang dominan di pasar.",
      buttonText: "Jadwalkan Konsultasi Gratis",
      promoText: "Sesi Strategi Digital Gratis (Terbatas untuk 5 Klien/Bulan)",
    },
  },
  services: {
    title: "Investasi Strategis Untuk Bisnis Anda",
    subtitle: "Kami menawarkan paket layanan yang fleksibel namun tetap mengedepankan kualitas teknis terbaik di kelasnya.",
    plans: [
      {
        id: 1,
        name: "Basic",
        price: "Rp 1.500.000",
        tier: "Essential",
        pages: "1 Halaman",
        duration: "3-5 Hari",
        features: ["Landing Page Modern", "Integrasi WhatsApp", "Domain & Hosting (1 Thn)", "Mobile Responsive", "SSL Security"],
        missing: ["Sistem Booking", "Dashboard Admin", "Custom Features"],
      },
      {
        id: 2,
        name: "Standard",
        price: "Rp 3.500.000",
        tier: "Professional",
        pages: "Sampai 5 Halaman",
        duration: "7-10 Hari",
        features: ["Multi-page Website", "Dashboard Admin", "Integrasi WhatsApp", "Sistem Galeri Pro", "SEO Basic", "Laporan Bulanan"],
        missing: ["Custom API Integrasi", "Prioritas Support 24/7"],
        highlight: true
      },
      {
        id: 3,
        name: "Premium",
        price: "Rp 7.000.000",
        tier: "Enterprise",
        pages: "Halaman Unlimited",
        duration: "14-21 Hari",
        features: ["Full Custom Website", "Sistem Booking/E-commerce", "High-End SEO", "Prioritas Support", "Custom Integrasi API", "Manual Book"],
        missing: [],
      }
    ],
    notes: ["Semua paket sudah termasuk GRATIS Domain .com/.id selama 1 tahun.", "Garansi maintenance bug selama 3 bulan pertama."],
    comparisonTitle: "Bandingkan Paket",
    comparisonSubtitle: "Pilih jalur investasi yang paling sesuai dengan skala pertumbuhan bisnis Anda saat ini."
  },
  portfolio: {
    title: "Karya Terpilih Kami",
    subtitle: "Lihat bagaimana kami membantu berbagai industri membangun otoritas digital mereka.",
    categories: ["All", "UMKM", "Travel", "School", "Corporate"],
    projects: [
      {
        id: 1,
        slug: "toba-dream-travel",
        title: "Toba Dream Travel Portal",
        category: "Travel",
        image: "/mitralabs_travel_service_1778227548373.png",
        description: "Modernisasi portal wisata Danau Toba dengan sistem booking otomatis dan kalender keberangkatan.",
        challenge: "Menampilkan puluhan paket wisata dengan navigasi yang simpel namun lengkap.",
        solution: "Membangun sistem filter dinamis berbasis kategori dan destinasi wisata.",
        results: ["Peningkatan booking online sebesar 40%", "Waktu load website di bawah 2 detik"],
        status: "Completed",
        client_name: "Bpk. Andi Wijaya",
        project_date: "Januari 2024",
        live_link: "#",
        tech_stack: ["Next.js", "Tailwind CSS", "Supabase"],
      },
      {
        id: 2,
        slug: "smk-penerbangan-medan",
        title: "Sistem Informasi SMK Penerbangan",
        category: "School",
        image: "/mitralabs_school_service_1778227565941.png",
        description: "Website profil sekolah yang dilengkapi sistem pendaftaran siswa baru (PPDB) terintegrasi.",
        challenge: "Mendigitalkan formulir pendaftaran yang kompleks agar mudah diakses wali murid.",
        solution: "Formulir multi-step dengan validasi real-time dan dashboard admin sekolah.",
        results: ["500+ Pendaftar online dalam 1 bulan", "Efisiensi admin sekolah meningkat 60%"],
        status: "Completed",
        client_name: "Ibu Siti Fatimah",
        project_date: "Februari 2024",
        tech_stack: ["React", "Firebase", "Bootstrap"],
      }
    ],
    cta: {
      title: "Ingin Portofolio Anda Ada di Sini?",
      subtitle: "Mari buat website yang bukan hanya sekadar online, tapi juga menghasilkan profit.",
      buttonText: "Mulai Diskusi Project",
    },
  },
  about: {
    hero: {
      tagline: "About Mitralabs",
      title: "Mendedikasikan Presisi Teknis Untuk Bisnis Anda.",
      subtitle: "Kami adalah tim yang percaya bahwa website adalah investasi, bukan sekadar biaya. Kami fokus pada hasil yang bisa diukur.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    },
    stats: [
      { label: "Year Founded", value: "2021" },
      { label: "Team Experts", value: "12+" },
    ],
    missionTitle: "Misi Kami",
    mission: [
      "Memberdayakan UMKM Indonesia dengan teknologi web berstandar global.",
      "Menyediakan solusi digital yang jujur, transparan, dan berorientasi hasil.",
      "Membangun kemitraan jangka panjang dengan klien melalui dukungan teknis yang andal."
    ],
    visionTitle: "Visi Kami",
    vision: "Menjadi mitra teknologi pilihan utama bagi bisnis yang ingin mendominasi pasar digital melalui presisi teknik dan desain.",
    teamTitle: "The Minds Behind Mitralabs",
    teamSubtitle: "Kombinasi antara kreativitas visual dan ketelitian kode.",
    team: [
      { id: 1, name: "Ridho Robbi", role: "CEO & Tech Lead", bio: "Fokus pada arsitektur sistem dan strategi pertumbuhan digital.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
      { id: 2, name: "Ghazy Muhalla", role: "Head of Operations", bio: "Memastikan setiap project berjalan tepat waktu dengan standar QA tertinggi.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
    ],
  },
  contact: {
    title: "Hubungi Kami",
    subtitle: "Siap mendiskusikan project Anda? Tim kami siap membantu 24/7.",
    phone: "6282381118520",
    email: "ridhorobbipasi@gmail.com",
    instagram: "@mitralabs.id",
    address: "Medan, Sumatera Utara, Indonesia",
    mapsUrl: "",
  },
  footer: {
    description: "Technical precision in every pixel.",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Contact Us", href: "/kontak" },
      { label: "Admin", href: "/admin" },
    ],
    socials: [
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
  settings: {
    waNumber: "6282381118520",
    businessMode: "agresif",
    waPromoMessage: "🔥 Promo Bulan Ini! Hubungi kami sekarang untuk penawaran spesial.",
  },
  blog: {
    title: "Edukasi & Wawasan",
    subtitle: "Tips, trik, dan artikel terbaru seputar dunia teknologi dan bisnis untuk membantu Anda tetap relevan di era digital.",
    posts: [
      {
        id: 1,
        slug: "kenapa-umkm-butuh-website",
        title: "Kenapa UMKM Butuh Website di Tahun 2024?",
        excerpt: "Media sosial saja tidak cukup. Pelajari kenapa website adalah aset terpenting bagi UMKM untuk naik kelas.",
        content: "Di era digital saat ini, memiliki kehadiran online bukan lagi pilihan, melainkan keharusan...",
        category: "Edukasi",
        author: "Ridho",
        date: "12 Mar 2024",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 2,
        slug: "5-ciri-website-bagus",
        title: "5 Ciri Website yang Bagus untuk Konversi Penjualan",
        excerpt: "Bukan hanya sekadar cantik, website yang bagus harus bisa merubah pengunjung menjadi pembeli.",
        content: "Banyak orang mengira website bagus adalah website yang penuh dengan animasi warna-warni...",
        category: "Tips",
        author: "Ghazy",
        date: "10 Mar 2024",
        image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800",
      }
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Bpk. Rahmat Hidayat",
      role: "Owner, Kopi Toba Signature",
      content: "Website buatan Mitralabs benar-benar mendongkrak penjualan kami. Sistem integrasi WA-nya sangat memudahkan pelanggan memesan kopi secara langsung.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Ibu Maya Kartika",
      role: "Direktur, Sekolah Al-Azhar Medan",
      content: "Proses pengerjaannya sangat transparan. Kami selalu dikasih update setiap minggu. Hasil akhirnya pun sangat elegan dan responsif di HP.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    }
  ],
  faqs: [
    {
      id: 1,
      question: "Apa saja yang perlu saya siapkan?",
      answer: "Anda hanya perlu menyiapkan Logo, foto produk/bisnis, dan rincian layanan Anda. Selebihnya akan kami bantu susun.",
      category: "Persiapan"
    },
    {
      id: 2,
      question: "Apakah website bisa saya edit sendiri nanti?",
      answer: "Tentu! Kami menyediakan Dashboard Admin yang sangat mudah digunakan bahkan bagi Anda yang tidak paham IT.",
      category: "Layanan"
    }
  ],
  bookings: [
    {
      id: 1,
      customer_name: "Budi Santoso",
      customer_email: "budi@kedaikopi.com",
      customer_phone: "6281234567890",
      service_type: "UMKM Website",
      plan_name: "Standard",
      project_brief: "Saya butuh website untuk kedai kopi saya di Medan. Ingin ada menu online dan tombol WA.",
      status: "Confirmed",
      created_at: new Date().toISOString(),
      total_price: 3500000,
    }
  ]
};

const DataContext = createContext<{
  data: AppData;
  updateData: (newData: AppData) => void;
} | undefined>(undefined);

import LoadingScreen from "@/components/LoadingScreen";
import { AlertCircle, RefreshCcw } from "lucide-react";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    // Instant load from localStorage on first render (no waiting)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem("mitralabs_final_cms_data_v7");
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...initialData, ...parsed };
        }
      } catch (e) { /* ignore */ }
    }
    return initialData;
  });
  const [isLoading, setIsLoading] = useState(false); // Never block render
  const [error, setError] = useState<string | null>(null);
  const [hasSynced, setHasSynced] = useState(false); // Track if we've synced

  // Deep merge helper
  const mergeData = (target: any, source: any) => {
    const merged = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        merged[key] = mergeData(merged[key] || {}, source[key]);
      } else {
        merged[key] = source[key];
      }
    }
    return merged;
  };

  useEffect(() => {
    if (hasSynced) return;

    const syncFromSupabase = async () => {
      if (!isSupabaseConfigured()) {
        setHasSynced(true);
        return;
      }

      try {
        // Fetch all relational data in parallel
        const [
          configRes,
          heroRes,
          plansRes,
          projectsRes,
          postsRes,
          teamRes,
          testimonialsRes,
          faqsRes,
          bookingsRes
        ] = await Promise.all([
          supabase.from("SiteConfig").select("*").eq("id", 1).maybeSingle(),
          supabase.from("HeroSection").select("*").eq("id", 1).maybeSingle(),
          supabase.from("ServicePlan").select("*").order("order", { ascending: true }),
          supabase.from("Project").select("*, Invoice(*)").order("created_at", { ascending: false }),
          supabase.from("BlogPost").select("*").order("published_at", { ascending: false }),
          supabase.from("TeamMember").select("*").order("order", { ascending: true }),
          supabase.from("Testimonial").select("*"),
          supabase.from("FAQ").select("*").order("order", { ascending: true }),
          supabase.from("Booking").select("*, Invoice(*)").order("created_at", { ascending: false }),
        ]);

        const merged = { ...initialData };

        // 1. Map Config & Global Structural Data
        if (configRes.data) {
          merged.navbar.logo = configRes.data.logo_text ?? initialData.navbar.logo;
          merged.navbar.buttonText = configRes.data.navbar_button ?? initialData.navbar.buttonText;
          merged.footer.description = configRes.data.footer_desc ?? initialData.footer.description;
          merged.settings.waNumber = configRes.data.wa_number ?? initialData.settings.waNumber;
          merged.settings.businessMode = configRes.data.business_mode ?? initialData.settings.businessMode;
          merged.settings.waPromoMessage = configRes.data.wa_promo_msg ?? initialData.settings.waPromoMessage;
          merged.contact.phone = configRes.data.phone ?? initialData.contact.phone;
          merged.contact.email = configRes.data.email ?? initialData.contact.email;
          merged.contact.instagram = configRes.data.instagram ?? initialData.contact.instagram;
          merged.contact.address = configRes.data.address ?? initialData.contact.address;
          merged.contact.mapsUrl = configRes.data.maps_url ?? initialData.contact.mapsUrl;

          // Merge complex structural data from json_content if available
          if (configRes.data.json_content) {
            try {
              const structural = typeof configRes.data.json_content === 'string' 
                ? JSON.parse(configRes.data.json_content) 
                : configRes.data.json_content;
              
              // Deep merge structural content to preserve defaults for new fields
              if (structural.home) merged.home = mergeData(merged.home, structural.home);
              if (structural.services) merged.services = mergeData(merged.services, structural.services);
              if (structural.portfolio) merged.portfolio = mergeData(merged.portfolio, structural.portfolio);
              if (structural.about) merged.about = mergeData(merged.about, structural.about);
              if (structural.contact) merged.contact = mergeData(merged.contact, structural.contact);
              if (structural.footer) merged.footer = mergeData(merged.footer, structural.footer);
              if (structural.navbar) merged.navbar = mergeData(merged.navbar, structural.navbar);
            } catch (e) {
              console.error("Failed to parse structural json_content", e);
            }
          }
        }

        // 2. Map Hero
        if (heroRes.data) {
          merged.home.hero.tagline = heroRes.data.tagline ?? initialData.home.hero.tagline;
          merged.home.hero.promo = heroRes.data.promo ?? initialData.home.hero.promo;
          merged.home.hero.title = heroRes.data.title ?? initialData.home.hero.title;
          merged.home.hero.subtitle = heroRes.data.subtitle ?? initialData.home.hero.subtitle;
          merged.home.hero.image = heroRes.data.image_url ?? initialData.home.hero.image;
          merged.home.hero.stats.label = heroRes.data.stats_label ?? initialData.home.hero.stats.label;
          merged.home.hero.stats.value = heroRes.data.stats_value ?? initialData.home.hero.stats.value;
          merged.home.hero.stats.desc = heroRes.data.stats_desc ?? initialData.home.hero.stats.desc;
        }

        // 3. Map Dynamic Lists
        if (plansRes.data && plansRes.data.length > 0) merged.services.plans = plansRes.data;
        if (projectsRes.data && projectsRes.data.length > 0) {
          merged.portfolio.projects = projectsRes.data.map((p: any) => ({
            ...p,
            image: p.image_url,
            invoices: p.Invoice || []
          }));
        }
        if (postsRes.data && postsRes.data.length > 0) {
          merged.blog.posts = postsRes.data.map((p: any) => ({
            ...p,
            image: p.image_url,
            date: new Date(p.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
          }));
        }
        if (teamRes.data && teamRes.data.length > 0) {
          merged.about.team = teamRes.data.map((t: any) => ({
            ...t,
            image: t.image_url
          }));
        }
        if (testimonialsRes.data && testimonialsRes.data.length > 0) {
          merged.testimonials = testimonialsRes.data.map((t: any) => ({
            ...t,
            image: t.image_url
          }));
        }
        if (faqsRes.data) merged.faqs = faqsRes.data;
        
        if (bookingsRes.data) {
          merged.bookings = bookingsRes.data.map((b: any) => ({
            ...b,
            invoices: b.Invoice || []
          }));
        }

        setData(merged);
        localStorage.setItem("mitralabs_final_cms_data_v7", JSON.stringify(merged));
        setHasSynced(true);
      } catch (err: any) {
        console.error("Relational sync critical error:", err.message);
        setHasSynced(true);
      }
    };

    const timeoutId = setTimeout(syncFromSupabase, 100);
    return () => clearTimeout(timeoutId);
  }, [hasSynced]);

  const updateData = async (newData: AppData) => {
    setData(newData);
    localStorage.setItem("mitralabs_final_cms_data_v7", JSON.stringify(newData));

    if (isSupabaseConfigured()) {
      try {
        const allInvoices = newData.bookings.flatMap(b => (b.invoices || []).map(inv => ({ ...inv, booking_id: b.id })));
        const allProjectInvoices = newData.portfolio.projects.flatMap(p => (p.invoices || []).map(inv => ({ ...inv, project_id: p.id })));

        const results = await Promise.all([
          supabase.from("SiteConfig").upsert({
            id: 1,
            logo_text: newData.navbar.logo,
            navbar_button: newData.navbar.buttonText,
            footer_desc: newData.footer.description,
            wa_number: newData.settings.waNumber,
            business_mode: newData.settings.businessMode,
            wa_promo_msg: newData.settings.waPromoMessage,
            phone: newData.contact.phone,
            email: newData.contact.email,
            instagram: newData.contact.instagram,
            address: newData.contact.address,
            maps_url: newData.contact.mapsUrl,
            json_content: {
              home: newData.home,
              services: newData.services,
              portfolio: newData.portfolio,
              about: newData.about,
              contact: newData.contact,
              footer: newData.footer,
              navbar: newData.navbar
            }
          }),
          supabase.from("HeroSection").upsert({
            id: 1,
            tagline: newData.home.hero.tagline,
            promo: newData.home.hero.promo,
            title: newData.home.hero.title,
            subtitle: newData.home.hero.subtitle,
            image_url: newData.home.hero.image,
            stats_label: newData.home.hero.stats.label,
            stats_value: newData.home.hero.stats.value,
            stats_desc: newData.home.hero.stats.desc,
          }),
          ...newData.portfolio.projects.map(p => supabase.from("Project").upsert({
            id: p.id > 1000000000 ? undefined : p.id,
            slug: p.slug,
            title: p.title,
            category: p.category,
            image_url: p.image,
            description: p.description,
            challenge: p.challenge,
            solution: p.solution,
            results: p.results,
            status: p.status
          })),
          ...newData.bookings.map(b => supabase.from("Booking").upsert({
            id: b.id > 1000000000 ? undefined : b.id,
            customer_name: b.customer_name,
            customer_email: b.customer_email,
            customer_phone: b.customer_phone,
            service_type: b.service_type,
            plan_name: b.plan_name,
            project_brief: b.project_brief,
            desired_domain: b.desired_domain,
            business_industry: b.business_industry,
            reference_websites: b.reference_websites,
            organization_name: b.organization_name,
            position: b.position,
            target_audience: b.target_audience,
            primary_cta: b.primary_cta,
            competitors_list: b.competitors_list,
            integrations_needed: b.integrations_needed,
            biggest_expectation: b.biggest_expectation,
            status: b.status,
            total_price: b.total_price,
            scheduled_date: b.scheduled_date
          })),
          ...allInvoices.map(inv => supabase.from("Invoice").upsert({
            id: inv.id > 1000000000 ? undefined : inv.id,
            invoice_number: inv.invoice_number,
            amount: inv.amount,
            status: inv.status,
            due_date: inv.due_date,
            items: inv.items,
            client_name: inv.client_name,
            client_email: inv.client_email,
            booking_id: inv.booking_id
          })),
          ...allProjectInvoices.map(inv => supabase.from("Invoice").upsert({
            id: inv.id > 1000000000 ? undefined : inv.id,
            invoice_number: inv.invoice_number,
            amount: inv.amount,
            status: inv.status,
            due_date: inv.due_date,
            items: inv.items,
            client_name: inv.client_name,
            client_email: inv.client_email,
            project_id: inv.project_id
          }))
        ]);

        const firstError = results.find(r => r.error);
        if (firstError) throw firstError.error;

        return results;
      } catch (e) {
        console.error("Supabase persistent update error:", e);
        throw e;
      }
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface-container-lowest p-10 rounded-[3rem] shadow-premium border border-surface-container-highest text-center space-y-6">
          <div className="w-20 h-20 bg-error/10 text-error rounded-3xl flex items-center justify-center mx-auto">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight uppercase">System Error</h2>
          <p className="text-on-surface-variant font-medium leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-primary text-on-primary rounded-2xl font-black flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <RefreshCcw size={20} /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
