"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { initialData } from "./initialData";

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
  items: {
    desc: string;
    details?: string;
    price: number;
    qty: number;
  }[];
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  project_period_start?: string;
  project_period_end?: string;
  invoice_type?: string;
  created_at: string;
}

export interface Booking {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  client_address?: string;
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
  user_signature?: string;
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

export interface AppData {
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
      stats: { label: string; value: string; desc: string; statusLabel?: string; statusValue?: string };
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
    pricing?: {
      title: string;
      subtitle: string;
      badge: string;
    };
    faqLabels?: {
      title: string;
      subtitle: string;
      badge: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaButton: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    plans: Plan[];
    notes: string[];
    comparisonTitle: string;
    comparisonSubtitle: string;
    labels?: {
      tagline: string;
      comparisonTagline: string;
      featureColumn: string;
      durationLabel: string;
      pagesLabel: string;
      investmentLabel: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
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
      promoText: string;
    };
    faqLabels?: {
      title: string;
      subtitle: string;
      badge: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaButton: string;
    };
    labels?: {
      viewDetail: string;
      searchPlaceholder: string;
      emptyState: string;
      loadMore: string;
      tagline: string;
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
    labels?: {
      teamTagline: string;
      ctaTitle: string;
      ctaSubtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    instagram: string;
    address: string;
    mapsUrl: string;
    labels?: {
      tagline: string;
      successTitle: string;
      successSubtitle: string;
      sendAnother: string;
    };
  };
  footer: {
    description: string;
    links: { label: string; href: string }[];
    socials: { label: string; href: string }[];
  };
  brand: {
    name: string;
    tagline: string;
    logo: string;
    favicon: string;
    phone: string;
    whatsapp: string;
    email: string;
    website: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    npwp: string;
    linkedin: string;
    instagram: string;
    mapsUrl: string;
  };
  settings: {
    businessMode: string;
    waPromoMessage: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogImage: string;
  };
  invoiceSettings: {
    companyName: string;
    companyTagline: string;
    companyAddress: string;
    companyCity: string;
    companyProvince: string;
    companyPostalCode: string;
    companyPhone: string;
    companyEmail: string;
    companyWebsite: string;
    companyNPWP: string;
    companyLinkedin?: string;
    companyInstagram?: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    bankBranch: string;
    taxRate: number;
    taxLabel: string;
    footerNote: string;
    termsAndConditions: string;
    paymentInstructions: string;
    signatureFields?: {
      marketingName?: string;
      marketingTitle?: string;
      marketingSignature?: string;
      ownerName?: string;
      ownerTitle?: string;
      ownerSignature?: string;
    };
    stampDutyRequired?: boolean;
    stampDutyAmount?: number;
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
    is_published: boolean;
    image: string;
  }[];
  faqs: {
    id: number;
    question: string;
    answer: string;
    category: string;
  }[];
  bookings: Booking[];
  track?: {
    title: string;
    subtitle: string;
    loginInstructions: string;
    labels?: {
      secureBadge: string;
      emailLabel: string;
      passwordLabel: string;
      emailPlaceholder: string;
      submitButton: string;
      helpText: string;
      tabs: {
        progress: string;
        assets: string;
        documents: string;
        invoices: string;
        chat: string;
      };
      dashboard?: {
        header: {
          projectNum: string;
          lastUpdate: string;
          logoutTitle: string;
        };
        stats: {
          status: string;
          plan: string;
          service: string;
          orderDate: string;
          investment: string;
        };
        empty: {
          preparing: string;
        };
      };
    };
  };
  legal: {
    terms: string;
    privacy: string;
    lastUpdated: string;
  };
}

const DataContext = createContext<{
  data: AppData;
  updateData: (newData: AppData) => void;
  syncBooking: (booking: Booking) => Promise<void>;
  syncProject: (project: Project) => Promise<void>;
  syncBlogPost: (post: BlogPost) => Promise<void>;
} | undefined>(undefined);

import LoadingScreen from "@/components/LoadingScreen";
import { AlertCircle, RefreshCcw } from "lucide-react";

/**
 * Deep merge utility for AppData
 */
function mergeData(target: any, source: any): any {
  const merged = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      merged[key] = mergeData(merged[key] || {}, source[key]);
    } else {
      merged[key] = source[key];
    }
  }
  return merged;
}

export function sanitizeData(d: AppData): AppData {
  if (!d) return initialData;
  const sanitized = { ...d };

  // 1. Sanitize Navbar
  if (!sanitized.navbar) {
    sanitized.navbar = { ...initialData.navbar };
  } else {
    sanitized.navbar = {
      ...sanitized.navbar,
      buttonText: "💬 Chat Sekarang",
      links: [
        { label: "Beranda", href: "/" },
        { label: "Layanan", href: "/layanan" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Tentang", href: "/tentang" },
        { label: "Kontak", href: "/kontak" },
        { label: "Lacak Projek", href: "/track" },
      ]
    };
  }

  // 2. Sanitize Brand details
  if (!sanitized.brand) {
    sanitized.brand = { ...initialData.brand };
  } else {
    sanitized.brand = {
      ...sanitized.brand,
      phone: "6282381118520",
      whatsapp: "6282381118520",
      address: "Medan, Sumatera Utara",
      instagram: "@mitralabs.id",
    };
  }

  // 3. Sanitize Contact details
  if (!sanitized.contact) {
    sanitized.contact = { ...initialData.contact };
  } else {
    sanitized.contact = {
      ...sanitized.contact,
      phone: "6282381118520",
      address: "Medan, Sumatera Utara",
      instagram: "@mitralabs.id",
    };
  }

  // 4. Sanitize Footer
  if (!sanitized.footer) {
    sanitized.footer = { ...initialData.footer };
  } else {
    sanitized.footer = {
      ...sanitized.footer,
      description: "Mitra Digital Bisnis Mu. Mitralabs.id — Medan, Indonesia.",
      socials: [
        { label: "Instagram", href: "https://instagram.com/mitralabs.id" },
        { label: "WhatsApp", href: "https://wa.me/6282381118520" },
        { label: "Dibangun dengan ☕ & cinta di Medan, Sumatera Utara.", href: "#designed-by" },
      ]
    };
  }

  // 5. Sanitize Home Stats & Hero
  if (!sanitized.home) {
    sanitized.home = { ...initialData.home };
  } else {
    sanitized.home = {
      ...sanitized.home,
      hero: {
        ...sanitized.home.hero,
        title: "Website Profesional untuk Bisnis Kamu. Selesai Mulai 3 Hari. Harga Jelas. Tanpa Ribet."
      },
      stats: [
        { id: 1, label: "Live Projects", value: "10+", desc: "Digital Assets Live" },
        { id: 2, label: "Rating Kepuasan", value: "4.9/5.0", desc: "Berdasarkan ulasan mitra kami" },
      ]
    };
  }

  // 6. Sanitize Services
  if (!sanitized.services) {
    sanitized.services = { ...initialData.services };
  } else {
    const plans = sanitized.services.plans ? sanitized.services.plans.map(p => {
      if (p.name.toLowerCase() === "basic") {
        return {
          ...p,
          duration: "3-5 Hari",
          features: p.features.filter(f => !f.toLowerCase().includes("domain") && !f.toLowerCase().includes("hosting")),
          missing: Array.from(new Set([...p.missing, "Domain & Hosting"]))
        };
      }
      return p;
    }) : initialData.services.plans;

    sanitized.services = {
      ...sanitized.services,
      plans,
      notes: [
        "Paket Standard & Premium sudah termasuk GRATIS Domain .com/.id selama 1 tahun.",
        "Garansi maintenance & perbaikan bug selama 7 hari setelah serah terima.",
        "Semua harga sudah termasuk pajak. Tidak ada biaya tersembunyi."
      ]
    };
  }

  // 7. Sanitize Invoice settings
  if (!sanitized.invoiceSettings) {
    sanitized.invoiceSettings = { ...initialData.invoiceSettings };
  } else {
    sanitized.invoiceSettings = {
      ...sanitized.invoiceSettings,
      termsAndConditions: "1. Pembayaran DP 30% dilakukan sebelum proyek dimulai\n2. Pelunasan 70% dilakukan setelah website selesai dan sebelum serah terima\n3. Pembayaran dapat dilakukan melalui transfer bank\n4. Garansi bug & maintenance berlaku 7 hari setelah serah terima"
    };
  }

  // 8. Sanitize FAQs
  if (!sanitized.faqs || sanitized.faqs.length === 0) {
    sanitized.faqs = [...initialData.faqs];
  } else {
    sanitized.faqs = sanitized.faqs.map(faq => {
      if (faq.question.toLowerCase().includes("garansi") || faq.question.toLowerCase().includes("bug")) {
        return {
          ...faq,
          answer: "Ada. Garansi bug teknis 7 hari setelah serah terima. Kalau ada yang error dari sisi kami, langsung kami perbaiki tanpa biaya. Setelah masa garansi, perbaikan Rp 100.000 per sesi."
        };
      }
      return faq;
    });
  }

  return sanitized;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem("mitralabs_final_cms_data_v9");
        if (saved) {
          const parsed = JSON.parse(saved);
          return sanitizeData({ ...initialData, ...parsed });
        }
      } catch (e) { /* ignore */ }
    }
    return sanitizeData(initialData);
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    const syncFromSupabase = async () => {
      if (!isSupabaseConfigured()) {
        setHasSynced(true);
        return;
      }

      try {
        const [
          configRes,
          heroRes,
          plansRes,
          projectsRes,
          postsRes,
          teamRes,
          testimonialsRes,
          faqsRes,
          bookingsRes,
          publicClientProjectsRes
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
          supabase.from("ClientProject").select("*, booking:Booking(*), files:ProjectFile(*)").eq("is_public", true)
        ]);

        const merged = { ...initialData };

        if (configRes.data) {
          merged.brand = {
            name: configRes.data.company_name ?? initialData.brand.name,
            tagline: configRes.data.company_tagline ?? initialData.brand.tagline,
            logo: configRes.data.logo_url ?? initialData.brand.logo,
            favicon: configRes.data.favicon_url ?? initialData.brand.favicon,
            phone: configRes.data.phone ?? initialData.brand.phone,
            whatsapp: configRes.data.wa_number ?? initialData.brand.whatsapp,
            email: configRes.data.email ?? initialData.brand.email,
            website: configRes.data.company_website ?? initialData.brand.website,
            address: configRes.data.address ?? initialData.brand.address,
            city: configRes.data.city ?? initialData.brand.city,
            province: configRes.data.province ?? initialData.brand.province,
            postalCode: configRes.data.postal_code ?? initialData.brand.postalCode,
            npwp: configRes.data.company_npwp ?? initialData.brand.npwp,
            linkedin: configRes.data.linkedin_url ?? initialData.brand.linkedin,
            instagram: configRes.data.instagram ?? initialData.brand.instagram,
            mapsUrl: configRes.data.maps_url ?? initialData.brand.mapsUrl,
          };

          merged.navbar.logo = configRes.data.logo_text ?? initialData.navbar.logo;
          merged.navbar.buttonText = configRes.data.navbar_button ?? initialData.navbar.buttonText;
          merged.footer.description = configRes.data.footer_desc ?? initialData.footer.description;
          merged.settings.businessMode = configRes.data.business_mode ?? initialData.settings.businessMode;
          merged.settings.waPromoMessage = configRes.data.wa_promo_msg ?? initialData.settings.waPromoMessage;

          if (configRes.data.json_content) {
            try {
              const structural = typeof configRes.data.json_content === 'string'
                ? JSON.parse(configRes.data.json_content)
                : configRes.data.json_content;

              if (structural.brand) merged.brand = mergeData(merged.brand, structural.brand);
              if (structural.home) merged.home = mergeData(merged.home, structural.home);
              if (structural.services) merged.services = mergeData(merged.services, structural.services);
              if (structural.portfolio) merged.portfolio = mergeData(merged.portfolio, structural.portfolio);
              if (structural.about) merged.about = mergeData(merged.about, structural.about);
              if (structural.contact) merged.contact = mergeData(merged.contact, structural.contact);
              if (structural.footer) merged.footer = mergeData(merged.footer, structural.footer);
              if (structural.navbar) merged.navbar = mergeData(merged.navbar, structural.navbar);
              if (structural.invoiceSettings) merged.invoiceSettings = mergeData(merged.invoiceSettings, structural.invoiceSettings);
              if (structural.settings) merged.settings = mergeData(merged.settings, structural.settings);
              if (structural.legal) merged.legal = mergeData(merged.legal, structural.legal);
            } catch (e) {
              console.error("Failed to parse structural json_content", e);
            }
          }
        }

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

        if (plansRes.data?.length) merged.services.plans = plansRes.data;
        if (projectsRes.data?.length || publicClientProjectsRes?.data?.length) {
          const manualProjects = (projectsRes.data || []).map((p: any) => ({
            ...p,
            image: p.image_url,
            invoices: p.Invoice || []
          }));

          const categoryMap: Record<string, string> = {
            "UMKM Website": "UMKM",
            "School System": "Educational",
            "Corporate Website": "Corporate",
            "Landing Page": "Creative"
          };

          const automatedProjects = (publicClientProjectsRes?.data || []).map((p: any) => ({
            id: p.id,
            slug: p.project_name.toLowerCase().replace(/\s+/g, '-'),
            title: p.project_name,
            category: categoryMap[p.booking?.service_type] || "Creative",
            image: p.portfolio_image || (p.files?.find((f: any) => f.file_type?.startsWith('image'))?.file_url) || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
            description: p.description,
            challenge: "Proyek klien yang berhasil diselesaikan dengan standar kualitas Mitralabs.",
            solution: "Implementasi solusi digital kustom menggunakan teknologi modern.",
            results: ["100% Client Satisfaction", "On-time Delivery"],
            status: "Published",
            client_name: p.booking?.customer_name,
            project_date: new Date(p.created_at).getFullYear().toString(),
            created_at: p.created_at
          }));

          merged.portfolio.projects = [...manualProjects, ...automatedProjects].sort((a: any, b: any) => 
            new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          );
        }
        if (postsRes.data?.length) {
          merged.blog.posts = postsRes.data.map((p: any) => ({
            ...p,
            image: p.image_url,
            date: new Date(p.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
          }));
        }
        if (teamRes.data?.length) {
          merged.about.team = teamRes.data.map((t: any) => ({
            ...t,
            image: t.image_url
          }));
        }
        if (testimonialsRes.data?.length) {
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

        const sanitized = sanitizeData(merged);
        setData(sanitized);
        localStorage.setItem("mitralabs_final_cms_data_v9", JSON.stringify(sanitized));
        setHasSynced(true);
      } catch (err: any) {
        console.error("Relational sync critical error:", err.message);
        setHasSynced(true);
      }
    };

    const timeoutId = setTimeout(syncFromSupabase, 100);
    return () => clearTimeout(timeoutId);
  }, [hasSynced, mergeData]);

  // Granular Sync Functions
  const syncBooking = async (booking: Booking) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { id, invoices, ...bookingData } = booking;
      const isNew = id > 1000000000;
      
      const { data: bData, error } = await supabase
        .from("Booking")
        .upsert({
          ...(isNew ? {} : { id }),
          ...bookingData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (invoices?.length) {
        await Promise.all(invoices.map(inv => {
          const { id: invId, ...invData } = inv;
          return supabase.from("Invoice").upsert({
            ...(invId > 1000000000 ? {} : { id: invId }),
            ...invData,
            booking_id: bData.id,
            updated_at: new Date().toISOString()
          });
        }));
      }
    } catch (e) {
      console.error("Failed to sync booking:", e);
      throw e;
    }
  };

  const syncProject = async (project: Project) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { id, invoices, image, ...projectData } = project;
      const isNew = id > 1000000000;

      const { data: pData, error } = await supabase
        .from("Project")
        .upsert({
          ...(isNew ? {} : { id }),
          ...projectData,
          image_url: image,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      if (invoices?.length) {
        await Promise.all(invoices.map(inv => {
          const { id: invId, ...invData } = inv;
          return supabase.from("Invoice").upsert({
            ...(invId > 1000000000 ? {} : { id: invId }),
            ...invData,
            project_id: pData.id,
            updated_at: new Date().toISOString()
          });
        }));
      }
    } catch (e) {
      console.error("Failed to sync project:", e);
      throw e;
    }
  };

  const syncBlogPost = async (post: BlogPost) => {
    if (!isSupabaseConfigured()) return;
    try {
      const { id, image, date, ...postData } = post;
      const isNew = id > 1000000000;
      
      const { error } = await supabase
        .from("BlogPost")
        .upsert({
          ...(isNew ? {} : { id }),
          ...postData,
          image_url: image,
          published_at: new Date().toISOString()
        });
        
      if (error) throw error;
    } catch (e) {
      console.error("Failed to sync blog post:", e);
      throw e;
    }
  };

  const updateData = async (newData: AppData) => {
    const sanitized = sanitizeData(newData);
    setData(sanitized);
    localStorage.setItem("mitralabs_final_cms_data_v9", JSON.stringify(sanitized));

    if (isSupabaseConfigured()) {
      try {
        // Global Config & Hero only on updateData
        await Promise.all([
          supabase.from("SiteConfig").upsert({
            id: 1,
            company_name: newData.brand.name,
            company_tagline: newData.brand.tagline,
            logo_url: newData.brand.logo,
            favicon_url: newData.brand.favicon,
            phone: newData.brand.phone,
            wa_number: newData.brand.whatsapp,
            email: newData.brand.email,
            company_website: newData.brand.website,
            address: newData.brand.address,
            city: newData.brand.city,
            province: newData.brand.province,
            postal_code: newData.brand.postalCode,
            company_npwp: newData.brand.npwp,
            linkedin_url: newData.brand.linkedin,
            instagram: newData.brand.instagram,
            maps_url: newData.brand.mapsUrl,
            logo_text: newData.navbar.logo,
            navbar_button: newData.navbar.buttonText,
            footer_desc: newData.footer.description,
            business_mode: newData.settings.businessMode,
            wa_promo_msg: newData.settings.waPromoMessage,
            json_content: {
              brand: newData.brand,
              home: newData.home,
              services: newData.services,
              portfolio: newData.portfolio,
              about: newData.about,
              contact: newData.contact,
              footer: newData.footer,
              navbar: newData.navbar,
              invoiceSettings: newData.invoiceSettings,
              settings: newData.settings,
              legal: newData.legal
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
          })
        ]);
      } catch (e) {
        console.error("Persistent update error:", e);
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
    <DataContext.Provider value={{ data, updateData, syncBooking, syncProject, syncBlogPost }}>
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
