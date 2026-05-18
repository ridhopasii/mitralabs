import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { DataProvider } from "@/context/DataContext";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

// Dynamic Metadata Generation
export async function generateMetadata(): Promise<Metadata> {
  const title = "Mitralabs.web.id — Digitalisasi Bisnis & Software House Medan";
  const description = "Software house terpercaya di Medan. Kami membantu perusahaan, institusi, dan UMKM melakukan transformasi digital dengan website profesional, aplikasi web, dan solusi cloud berkinerja tinggi.";

  return {
    metadataBase: new URL("https://mitralabs.web.id"),
    title: {
      default: title,
      template: "%s | Mitralabs.web.id",
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
      "Mitralabs.id",
      "Mitralabs.web.id"
    ],
    authors: [{ name: "Mitralabs.web.id Team" }],
    creator: "Mitralabs.web.id",
    openGraph: {
      title: title,
      description: description,
      url: "https://mitralabs.web.id",
      siteName: "Mitralabs.web.id",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 600,
          alt: "Mitralabs.web.id - Software House Medan",
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
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-5CV42D125D"} />
          
          {/* JSON-LD Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Mitralabs.web.id",
                "image": "https://mitralabs.web.id/logo.png",
                "@id": "https://mitralabs.web.id",
                "url": "https://mitralabs.web.id",
                "telephone": "+6282381118520",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Medan",
                  "addressLocality": "Medan",
                  "addressRegion": "Sumatera Utara",
                  "postalCode": "20000",
                  "addressCountry": "ID"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": 3.5952,
                  "longitude": 98.6722
                },
                "openingHoursSpecification": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                  ],
                  "opens": "09:00",
                  "closes": "18:00"
                },
                "sameAs": [
                  "https://instagram.com/mitralabs.id",
                  "https://linkedin.com/company/mitralabs-id"
                ],
                "priceRange": "$$"
              })
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
