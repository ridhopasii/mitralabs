"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Plan {
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

interface Invoice {
  id: number;
  project_id: number;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  items: { desc: string; price: number }[];
}

interface Project {
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
  tech_stack?: string[];
  gallery_urls?: string[];
  invoices?: Invoice[];
}

interface BlogPost {
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
        umkm: { tag: string; title: string; desc: string; image: string };
        travel: { title: string; desc: string };
        school: { title: string; desc: string };
        business: { title: string; desc: string };
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
    buttonText: "Get Started",
  },
  home: {
    hero: {
      tagline: "Mitra Digital Bisnis Mu",
      promo: "Promo Aktif",
      title: "Tampil Profesional Tanpa Ribet.",
      subtitle: "Jasa pembuatan website profesional untuk UMKM, Sekolah, dan Travel. Setiap website dirancang untuk benar-benar bekerja — bukan sekadar terlihat bagus.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      stats: { label: "Live Projects", value: "150+", desc: "Website Berhasil Online" }
    },
    problem: {
      title: "Masalah yang Sering Dhadap UMKM",
      subtitle: "Banyak bisnis kehilangan potensi karena kehadiran digital yang kurang optimal.",
      items: [
        { id: 1, title: "Tidak Punya Website", desc: "Kehilangan kepercayaan dari calon pembeli." },
        { id: 2, title: "Website Lambat", desc: "Pengunjung kabur sebelum melihat produk." },
      ],
    },
    solution: {
      tagline: "Solusi Kami",
      title: "Website Profesional untuk Setiap Lini Bisnis",
      subtitle: "Kami menghadirkan website yang dirancang khusus sesuai karakteristik dan target market industri Anda.",
      cards: {
        umkm: {
          tag: "Terpopuler",
          title: "Website UMKM & Toko",
          desc: "Toko, warung, bengkel, laundry, dan usaha kecil lainnya. Solusi cepat dan tepat untuk go-digital dengan sistem pemesanan via WhatsApp.",
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
        },
        travel: {
          title: "Website Travel",
          desc: "Paket wisata, galeri, form booking, dan profil tourguide dalam satu platform interaktif."
        },
        school: {
          title: "Website Sekolah",
          desc: "Profil, pengumuman, galeri, dan info pendaftaran siswa baru secara online."
        },
        business: {
          title: "Website Bisnis",
          desc: "Company profile, portofolio, dan landing page promosi untuk tingkatkan trust klien."
        }
      }
    },
    process: {
      title: "Alur Kerja Profesional Kami",
      subtitle: "Kami mengikuti standar operasional yang terukur untuk memastikan kualitas dan ketepatan waktu setiap project.",
      steps: [
        { id: 1, title: "Onboarding", desc: "Pengisian form brief untuk memahami detail kebutuhan dan tujuan bisnis Anda." },
        { id: 2, title: "Proposal & Deal", desc: "Penyusunan penawaran harga, konfirmasi kesepakatan, dan pembayaran DP 30%." },
        { id: 3, title: "Pengerjaan", desc: "Proses development dengan update progres minimal 2x (saat 50% dan mendekati final)." },
        { id: 4, title: "Revisi", desc: "Pengecekan hasil dan perbaikan sesuai feedback (maksimal 2x revisi gratis)." },
        { id: 5, title: "Serah Terima", desc: "Pelunasan sisa pembayaran, penyerahan akses/file, dan aktivasi garansi bug 7 hari." },
      ],
    },
    stats: [
      { id: 1, label: "Live Projects", value: "150+", desc: "Website Berhasil Online" },
      { id: 2, label: "Client Puas", value: "99%", desc: "Rating Bintang 5" },
    ],
    cta: {
      title: "Siap Membuat Bisnis Anda Auto-Pilot?",
      subtitle: "Jangan biarkan keraguan menghambat pertumbuhan Anda. Mari diskusikan bagaimana teknologi bisa bekerja untuk Anda.",
      buttonText: "Hubungi Kami Sekarang",
      promoText: "Konsultasi pertama GRATIS senilai Rp 1.500.000",
    },
  },
  services: {
    title: "Pilihan Paket Website Sesuai Kebutuhan Anda",
    subtitle: "Kami menawarkan harga yang transparan dengan kualitas profesional untuk membantu bisnis Anda bertransformasi digital.",
    plans: [
      {
        id: 1,
        name: "Basic",
        price: "Rp 1.500.000",
        tier: "Essential",
        pages: "1 halaman",
        duration: "3 hari kerja",
        features: ["Landing page profesional", "Mobile responsive", "Tombol WhatsApp", "2x revisi", "Garansi bug 7 hari"],
        missing: ["Semi-custom design", "SEO dasar", "Domain & Hosting"],
      },
      {
        id: 2,
        name: "Standard",
        price: "Rp 3.500.000",
        tier: "Growth",
        pages: "3–5 halaman",
        duration: "7 hari kerja",
        highlight: true,
        features: ["Semi-custom design", "Form kontak", "Google Maps", "Galeri foto", "SEO dasar", "2x revisi", "Garansi bug 7 hari"],
        missing: ["Full custom design", "Domain & Hosting"],
      },
      {
        id: 3,
        name: "Premium",
        price: "Rp 7.000.000",
        tier: "Enterprise",
        pages: "7–10 halaman",
        duration: "14 hari kerja",
        features: ["Full custom design", "Blog / artikel", "Sistem booking", "Animasi interaktif", "Domain .com (1 thn)", "Hosting (1 thn)", "1 bulan support gratis", "2x revisi", "Garansi bug 7 hari"],
        missing: [],
      },
    ],
    notes: [
      "* Harga belum termasuk domain & hosting kecuali Paket Premium.",
      "* DP 30% sebelum mulai, pelunasan 70% sebelum serah terima.",
      "* Perbaikan bug setelah garansi: Rp 100.000 per sesi.",
    ],
    comparisonTitle: "Perbandingan Detail",
    comparisonSubtitle: "Transparansi penuh untuk setiap layanan teknis kami.",
  },
  portfolio: {
    title: "Precision-Crafted Solutions.",
    subtitle: "Explore our curated gallery of digital experiences designed for market leaders and local innovators across diverse sectors.",
    categories: ["All Works", "UMKM", "School", "Travel", "Business"],
    projects: [
      {
        id: 1,
        slug: "wonderful-toba",
        title: "Wonderful Toba",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
        description: "Platform pariwisata terintegrasi untuk Danau Toba.",
        challenge: "Membangun sistem booking yang kompleks dengan desain visual yang memanjakan mata.",
        solution: "Implementasi Next.js dengan optimasi gambar dan sistem manajemen konten yang dinamis.",
        results: ["Peningkatan traffic 300%", "User experience yang lebih smooth", "Booking rate naik 40%"],
        status: "Published"
      },
      {
        id: 2,
        slug: "mitra-mart",
        title: "Mitra Mart",
        category: "UMKM",
        image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800",
        description: "E-commerce lokal untuk kebutuhan sehari-hari.",
        challenge: "Sinkronisasi stok real-time dan kemudahan transaksi via WhatsApp.",
        solution: "Integrasi Supabase real-time database dengan checkout WhatsApp otomatis.",
        results: ["500+ transaksi per bulan", "Operasional lebih efisien", "Retensi pelanggan tinggi"],
        status: "Published"
      },
    ],
    cta: {
      title: "Punya Visi untuk Project Berikutnya?",
      subtitle: "Mari berkolaborasi membangun pengalaman digital yang mendefinisikan masa depan brand Anda.",
      buttonText: "Mulai Konsultasi",
    },
  },
  about: {
    hero: {
      tagline: "Tentang Kami",
      title: "Mitra Digital Bisnis Mu.",
      subtitle: "Mitralabs.id adalah digital agency yang bergerak di bidang jasa pembuatan website profesional untuk UMKM, sekolah, dan bisnis travel di Indonesia.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    },
    stats: [
      { label: "Tahun Berdiri", value: "2026" },
      { label: "Local Talent", value: "100%" },
    ],
    visionTitle: "Visi",
    vision: "Menjadi mitra digital terpercaya bagi pelaku usaha di Indonesia.",
    missionTitle: "Misi Kami",
    mission: [
      "Menyediakan jasa website yang profesional, terjangkau, dan tepat sasaran.",
      "Membangun hubungan jangka panjang berbasis kepercayaan dan transparansi.",
      "Mendukung pertumbuhan UMKM melalui kehadiran digital yang kuat.",
    ],
    teamTitle: "Tim Profesional Kami",
    teamSubtitle: "Dibalik setiap project sukses, ada tim yang berdedikasi tinggi.",
    team: [
      { id: 1, name: "Ridho Robbi Pasi", role: "Engineer & Founder", bio: "Pengembangan teknis dan kualitas website.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
      { id: 2, name: "Ghazy Muhalla", role: "Marketing", bio: "Strategi pemasaran dan relasi bisnis.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
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
      name: "Suryo Wijaya",
      role: "Owner, Toba Travel",
      content: "Mitralabs membantu kami mendigitalkan paket wisata kami. Sangat profesional!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
    },
    {
      id: 2,
      name: "Linda Kusuma",
      role: "Kepala Sekolah, SD Harapan",
      content: "Website sekolah kami sekarang sangat informatif dan mudah diakses orang tua murid.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400"
    }
  ],
  faqs: [
    {
      id: 1,
      question: "Berapa lama pengerjaan website?",
      answer: "Tergantung paket, biasanya 3-14 hari kerja.",
      category: "Umum"
    },
    {
      id: 2,
      question: "Apakah ada biaya bulanan?",
      answer: "Tidak ada biaya bulanan dari kami, hanya biaya tahunan untuk domain dan hosting.",
      category: "Harga"
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
          faqsRes
        ] = await Promise.all([
          supabase.from("SiteConfig").select("*").eq("id", 1).maybeSingle(),
          supabase.from("HeroSection").select("*").eq("id", 1).maybeSingle(),
          supabase.from("ServicePlan").select("*").order("order", { ascending: true }),
          supabase.from("Project").select("*, Invoice(*)").order("created_at", { ascending: false }),
          supabase.from("BlogPost").select("*").order("published_at", { ascending: false }),
          supabase.from("TeamMember").select("*").order("order", { ascending: true }),
          supabase.from("Testimonial").select("*"),
          supabase.from("FAQ").select("*").order("order", { ascending: true }),
        ]);

        const merged = { ...initialData };

        // 1. Map Config
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
        if (faqsRes.data && faqsRes.data.length > 0) merged.faqs = faqsRes.data;

        setData(merged);
        localStorage.setItem("mitralabs_final_cms_data_v7", JSON.stringify(merged));
        setHasSynced(true);
      } catch (err: any) {
        console.warn("Relational sync failed:", err.message);
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
        // Legacy support: We still keep a backup in json_content for emergency 
        // but we should ideally update each table. 
        // For now, let's update the Config and Hero as they are most critical.
        await Promise.all([
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
          // Bulk update projects (simplified for dev bypass)
          ...newData.portfolio.projects.map(p => supabase.from("Project").upsert({
            id: p.id > 1000000000 ? undefined : p.id, // Handle temporary IDs
            slug: p.slug,
            title: p.title,
            category: p.category,
            image_url: p.image,
            description: p.description,
            challenge: p.challenge,
            solution: p.solution,
            results: p.results,
            client_name: p.client_name,
            project_date: p.project_date,
            live_link: p.live_link,
            tech_stack: p.tech_stack,
            gallery_urls: p.gallery_urls,
            status: p.status
          }))
        ]);
      } catch (e) {
        console.error("Supabase relational update error", e);
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
