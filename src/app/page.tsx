import type { Metadata } from "next";
import HeroSection from "@/sections/home/HeroSection";
import ProblemSection from "@/sections/home/ProblemSection";
import SolutionSection from "@/sections/home/SolutionSection";
import ProcessSection from "@/sections/home/ProcessSection";
import StatsSection from "@/sections/home/StatsSection";
import CTASection from "@/sections/home/CTASection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mitralabs.id — Jasa Website Profesional Medan | Ubah Bisnis Jadi Mesin Penjualan 24/7",
  description:
    "Jasa pembuatan website profesional di Medan. Kami bantu UMKM, sekolah, travel, dan bisnis go-digital dengan website berkinerja tinggi. Harga terjangkau, kualitas premium.",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ProcessSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </>
  );
}
