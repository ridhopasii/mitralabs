import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { DataProvider } from "@/context/DataContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  const title = "Mitralabs.id — Digitalisasi Bisnis & Software House Medan";
  const description = "Software house terpercaya di Medan. Kami membantu perusahaan, institusi, dan UMKM melakukan transformasi digital dengan website profesional, aplikasi web, dan solusi cloud berkinerja tinggi.";

  return {
    metadataBase: new URL("https://mitralabs.id"),
    title: {
      default: title,
      template: "%s | Mitralabs.id",
    },
    description: description,
    keywords: [
      "software house medan",
      "jasa pembuatan website medan",
      "web developer medan",
      "bikin web medan",
      "jasa IT medan",
      "digital agency medan",
      "Mitralabs",
      "Mitralabs.id"
    ],
    authors: [{ name: "Mitralabs.id Team" }],
    creator: "Mitralabs.id",
    openGraph: {
      title: title,
      description: description,
      url: "https://mitralabs.id",
      siteName: "Mitralabs.id",
      images: [
        {
          url: "/logo.png", // Assuming logo.png is in the public directory
          width: 800,
          height: 600,
          alt: "Mitralabs.id - Software House Medan",
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/logo.png"],
    },
    robots: {
      index: true,
      follow: true,
    }
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
    <html lang="id" suppressHydrationWarning>
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
