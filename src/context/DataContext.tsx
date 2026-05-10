"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
  created_at: string;
  project_period_start?: string;
  project_period_end?: string;
  invoice_type?: "Invoice" | "Kwitansi";
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
    companyLogo: string;
    companyFavicon: string;
    businessMode: string;
    waPromoMessage: string;
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
      marketing?: string;
      owner?: string;
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

const DataContext = createContext<{
  data: AppData;
  updateData: (newData: AppData) => void;
  syncBooking: (booking: Booking) => Promise<void>;
  syncProject: (project: Project) => Promise<void>;
} | undefined>(undefined);

import LoadingScreen from "@/components/LoadingScreen";
import { AlertCircle, RefreshCcw } from "lucide-react";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => {
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSynced, setHasSynced] = useState(false);

  const mergeData = useCallback((target: any, source: any) => {
    const merged = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        merged[key] = mergeData(merged[key] || {}, source[key]);
      } else {
        merged[key] = source[key];
      }
    }
    return merged;
  }, []);

  useEffect(() => {
    if (hasSynced) return;

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

          if (configRes.data.json_content) {
            try {
              const structural = typeof configRes.data.json_content === 'string'
                ? JSON.parse(configRes.data.json_content)
                : configRes.data.json_content;

              if (structural.home) merged.home = mergeData(merged.home, structural.home);
              if (structural.services) merged.services = mergeData(merged.services, structural.services);
              if (structural.portfolio) merged.portfolio = mergeData(merged.portfolio, structural.portfolio);
              if (structural.about) merged.about = mergeData(merged.about, structural.about);
              if (structural.contact) merged.contact = mergeData(merged.contact, structural.contact);
              if (structural.footer) merged.footer = mergeData(merged.footer, structural.footer);
              if (structural.navbar) merged.navbar = mergeData(merged.navbar, structural.navbar);
              if (structural.invoiceSettings) merged.invoiceSettings = mergeData(merged.invoiceSettings, structural.invoiceSettings);
              if (structural.settings) merged.settings = mergeData(merged.settings, structural.settings);
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
        if (projectsRes.data?.length) {
          merged.portfolio.projects = projectsRes.data.map((p: any) => ({
            ...p,
            image: p.image_url,
            invoices: p.Invoice || []
          }));
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

  const updateData = async (newData: AppData) => {
    setData(newData);
    localStorage.setItem("mitralabs_final_cms_data_v7", JSON.stringify(newData));

    if (isSupabaseConfigured()) {
      try {
        // Global Config & Hero only on updateData
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
            json_content: {
              home: newData.home,
              services: newData.services,
              portfolio: newData.portfolio,
              about: newData.about,
              contact: newData.contact,
              footer: newData.footer,
              navbar: newData.navbar,
              invoiceSettings: newData.invoiceSettings,
              settings: newData.settings
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
    <DataContext.Provider value={{ data, updateData, syncBooking, syncProject }}>
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
