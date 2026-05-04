import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { DataProvider } from "@/context/DataContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  const title = "Mitralabs.id — Jasa Website Profesional Medan";
  const description = "Jasa pembuatan website profesional di Medan. Kami bantu UMKM, sekolah, travel, dan bisnis go-digital dengan website berkinerja tinggi. Harga terjangkau, kualitas premium.";

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

import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-background text-on-surface">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
          <ErrorBoundary>
            <DataProvider>
              <MaintenanceGuard>
                <Navbar />
                <main>{children}</main>
                <FloatingWhatsApp />
              </MaintenanceGuard>
            </DataProvider>
          </ErrorBoundary>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
