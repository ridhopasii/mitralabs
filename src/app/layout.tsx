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
          
          {/* JSON-LD Structured Data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Mitralabs.id",
                "image": "https://mitralabs.id/logo.png",
                "@id": "https://mitralabs.id",
                "url": "https://mitralabs.id",
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
