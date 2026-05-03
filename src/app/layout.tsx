import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { DataProvider } from "@/context/DataContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { supabase } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

// Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  let title = "Mitralabs.id — Jasa Website Profesional Medan";
  let description = "Mitralabs.id adalah jasa pembuatan website profesional di Medan. Kami membangun website UMKM, sekolah, travel, dan bisnis dengan standar global.";

  try {
    const { data: sbData } = await supabase
      .from('site_data')
      .select('json_content')
      .eq('id', 1)
      .single();

    if (sbData?.json_content?.home?.hero) {
      const hero = sbData.json_content.home.hero;
      title = `${hero.title} | Mitralabs.id`;
      description = hero.subtitle;
    }
  } catch (e) {
    console.error("Failed to fetch metadata from Supabase", e);
  }

  return {
    title: {
      default: title,
      template: "%s | Mitralabs.id",
    },
    description: description,
    keywords: [
      "jasa buat website Medan",
      "jasa website UMKM Medan",
      "web developer Medan",
      "Mitralabs",
    ],
    openGraph: {
      title: title,
      description: description,
      url: "https://mitralabs.id",
      siteName: "Mitralabs.id",
      locale: "id_ID",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <DataProvider>
          <MaintenanceGuard>
            <Navbar />
            <main>{children}</main>
            <FloatingWhatsApp />
          </MaintenanceGuard>
        </DataProvider>
      </body>
    </html>
  );
}
