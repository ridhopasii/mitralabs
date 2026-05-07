import { supabase } from "../lib/supabase";

const initialData = {
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
      subtitle: "Jasa pembuatan website profesional untuk UMKM, Sekolah, dan Travel.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
      stats: { label: "Live Projects", value: "150+", desc: "Website Berhasil Online" }
    },
    // ... skipping some parts for brevity in seeding or I can include them
  },
  settings: {
    waNumber: "6282381118520",
    businessMode: "agresif",
    waPromoMessage: "🔥 Promo Bulan Ini!",
  },
  contact: {
    phone: "6282381118520",
    email: "ridhorobbipasi@gmail.com",
    instagram: "@mitralabs.id",
    address: "Medan, Indonesia",
    mapsUrl: "",
  }
};

async function seed() {
  console.log("Seeding new relational tables...");

  // 1. SiteConfig
  await supabase.from("SiteConfig").upsert({
    id: 1,
    logo_text: initialData.navbar.logo,
    navbar_button: initialData.navbar.buttonText,
    wa_number: initialData.settings.waNumber,
    business_mode: initialData.settings.businessMode,
    wa_promo_msg: initialData.settings.waPromoMessage,
    phone: initialData.contact.phone,
    email: initialData.contact.email,
    instagram: initialData.contact.instagram,
    address: initialData.contact.address,
  });

  // 2. HeroSection
  await supabase.from("HeroSection").upsert({
    id: 1,
    tagline: initialData.home.hero.tagline,
    promo: initialData.home.hero.promo,
    title: initialData.home.hero.title,
    subtitle: initialData.home.hero.subtitle,
    image_url: initialData.home.hero.image,
    stats_label: initialData.home.hero.stats.label,
    stats_value: initialData.home.hero.stats.value,
    stats_desc: initialData.home.hero.stats.desc,
  });

  console.log("Seed completed!");
}

seed();
