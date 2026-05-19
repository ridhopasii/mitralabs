import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami | Hubungi Mitralabs.web.id",
  description: "Ada yang ingin ditanyakan atau ingin langsung konsultasi pembuatan website gratis? Hubungi tim Mitralabs Medan via email, Instagram, atau WhatsApp resmi kami.",
  keywords: ["kontak mitralabs", "hubungi software house medan", "whatsapp mitralabs", "konsultasi website gratis medan"],
};

export default function KontakLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
