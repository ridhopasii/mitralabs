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

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  status: string;
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
      { id: 1, title: "Wonderful Toba", category: "Travel", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800", status: "Published" },
      { id: 2, title: "Mitra Mart", category: "UMKM", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800", status: "Published" },
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
};

const DataContext = createContext<{
  data: AppData;
  updateData: (newData: AppData) => void;
} | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);

  useEffect(() => {
    // 1. Initial Load from LocalStorage (fastest)
    const saved = localStorage.getItem("mitralabs_final_cms_data_v7");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = { ...initialData };
        const merge = (target: any, source: any) => {
          for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              if (!target[key]) target[key] = {};
              merge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
        };
        merge(merged, parsed);
        setData(merged);
      } catch (e) { console.error(e); }
    }

    // 2. Fetch from Supabase (source of truth)
    const fetchFromSupabase = async () => {
      try {
        const { data: sbData, error } = await supabase
          .from('site_data')
          .select('json_content')
          .eq('id', 1)
          .single();

        if (sbData && sbData.json_content) {
          const merged = { ...initialData };
          const merge = (target: any, source: any) => {
            for (const key in source) {
              if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                merge(target[key], source[key]);
              } else {
                target[key] = source[key];
              }
            }
          };
          merge(merged, sbData.json_content);
          setData(merged);
          localStorage.setItem("mitralabs_final_cms_data_v7", JSON.stringify(merged));
        }
      } catch (e) {
        console.warn("Supabase fetch failed, using local data", e);
      }
    };

    if (isSupabaseConfigured()) {
      fetchFromSupabase();
    }
  }, []);

  const updateData = async (newData: AppData) => {
    setData(newData);
    localStorage.setItem("mitralabs_final_cms_data_v7", JSON.stringify(newData));

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('site_data')
          .upsert({ id: 1, json_content: newData });
        
        if (error) throw error;
      } catch (e) {
        console.error("Failed to save to Supabase", e);
      }
    }
  };

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
