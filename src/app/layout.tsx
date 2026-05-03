import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

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

export const metadata: Metadata = {
  title: {
    default: "Mitralabs.id — Jasa Website Profesional Medan",
    template: "%s | Mitralabs.id",
  },
  description:
    "Mitralabs.id adalah jasa pembuatan website profesional di Medan. Kami membangun website UMKM, sekolah, travel, dan bisnis dengan standar global. Konsultasi gratis via WhatsApp.",
  keywords: [
    "jasa buat website Medan",
    "jasa website UMKM Medan",
    "bikin website murah Medan",
    "web developer Medan",
    "pembuatan website profesional Medan",
    "Mitralabs",
  ],
  authors: [{ name: "Mitralabs.id" }],
  creator: "Mitralabs.id",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://mitralabs.id",
    siteName: "Mitralabs.id",
    title: "Mitralabs.id — Jasa Website Profesional Medan",
    description:
      "Website profesional untuk bisnis Anda. Kami bangun, Anda berkembang. Konsultasi gratis!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mitralabs.id",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mitralabs.id — Jasa Website Profesional Medan",
    description: "Website profesional untuk bisnis Anda. Konsultasi gratis!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { DataProvider } from "@/context/DataContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <DataProvider>
          <Navbar />
          <main>{children}</main>
          <FloatingWhatsApp />
        </DataProvider>
      </body>
    </html>
  );
}
