import type { Metadata } from "next";
import HeroSection from "@/sections/home/HeroSection";
import ProblemSection from "@/sections/home/ProblemSection";
import SolutionSection from "@/sections/home/SolutionSection";
import ProcessSection from "@/sections/home/ProcessSection";
import StatsSection from "@/sections/home/StatsSection";
import CTASection from "@/sections/home/CTASection";
import TestimonialsSection from "@/sections/home/TestimonialsSection";
import FAQSection from "@/sections/home/FAQSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mitralabs.id — Jasa Website Profesional Medan | Ubah Bisnis Jadi Mesin Penjualan 24/7",
  description:
    "Jasa pembuatan website profesional di Medan. Kami bantu UMKM, sekolah, travel, dan bisnis go-digital dengan website berkinerja tinggi. Harga terjangkau, kualitas premium.",
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Mitralabs.id",
    "image": "https://mitralabs.id/logo.png",
    "@id": "https://mitralabs.id",
    "url": "https://mitralabs.id",
    "telephone": "+6281234567890",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Gatot Subroto",
      "addressLocality": "Medan",
      "postalCode": "20123",
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
      "closes": "17:00"
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
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </>
  );
}
