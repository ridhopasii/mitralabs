import type { Metadata } from "next";
import HeroSection from "@/sections/home/HeroSection";
import ProblemSection from "@/sections/home/ProblemSection";
import SolutionSection from "@/sections/home/SolutionSection";
import ProcessSection from "@/sections/home/ProcessSection";
import StatsSection from "@/sections/home/StatsSection";
import CTASection from "@/sections/home/CTASection";
import TestimonialsSection from "@/sections/home/TestimonialsSection";
import FAQSection from "@/sections/home/FAQSection";
import PricingSection from "@/sections/home/PricingSection";
import PortfolioSection from "@/sections/home/PortfolioSection";
import InstagramSection from "@/sections/home/InstagramSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mitralabs.web.id — Jasa Website Profesional Medan | Ubah Bisnis Jadi Mesin Penjualan 24/7",
  description:
    "Jasa pembuatan website profesional di Medan. Kami bantu UMKM, sekolah, travel, dan bisnis go-digital dengan website berkinerja tinggi. Harga terjangkau, kualitas premium.",
};

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  const jsonLd = {
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
      "https://instagram.com/mitralabs.id"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <PricingSection />
      <PortfolioSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <InstagramSection />
      <Footer />
    </>
  );
}
