"use client";

import Link from "next/link";
import { CheckCircle2, Star, Zap, Diamond, MessageCircle, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";

const plans = [
  {
    name: "Basic",
    tagline: "Usaha baru yang butuh online presence cepat",
    price: "Rp 1.500.000",
    period: "/project",
    icon: Zap,
    highlight: false,
    badge: null,
    features: [
      "1 Halaman (Landing Page)",
      "Desain Template",
      "Mobile Responsive",
      "Tombol WhatsApp",
      "Selesai dalam 3 Hari",
      "Garansi Bug 7 Hari",
    ],
    cta: "Pilih Basic",
    ctaHref: "/kontak?paket=basic",
  },
  {
    name: "Standard",
    tagline: "UMKM & Sekolah yang ingin tampil lengkap",
    price: "Rp 3.500.000",
    period: "/project",
    icon: Star,
    highlight: true,
    badge: "Paling Populer",
    features: [
      "3–5 Halaman",
      "Semi-custom Design",
      "Form Kontak & Google Maps",
      "Galeri Foto & SEO Dasar",
      "Selesai dalam 7 Hari",
      "Garansi Bug 7 Hari",
    ],
    cta: "Pilih Standard",
    ctaHref: "/kontak?paket=standard",
  },
  {
    name: "Premium",
    tagline: "Bisnis Travel & Usaha Premium",
    price: "Rp 7.000.000",
    period: "/project",
    icon: Diamond,
    highlight: false,
    badge: null,
    features: [
      "7–10 Halaman",
      "Full Custom Design",
      "Blog / Artikel & Sistem Booking",
      "Animasi Interaktif",
      "Domain .com & Hosting (1 Thn)",
      "1 Bulan Support Gratis",
      "Garansi Bug 7 Hari",
    ],
    cta: "Pilih Premium",
    ctaHref: "/kontak?paket=premium",
  },
];

export default function PricingSection() {
  const { data } = useData();
  const { settings } = data;

  return (
    <section id="harga" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
            Paket Harga
          </div>
          <h2 className="font-manrope text-4xl md:text-5xl font-extrabold text-[#131b2e] leading-tight mb-6">
            Transparan,{" "}
            <span className="text-gradient">Terjangkau,</span>{" "}
            Berkualitas
          </h2>
          <p className="text-lg text-[#434656]">
            Pilih paket yang sesuai dengan kebutuhan bisnis kamu. Tidak ada biaya tersembunyi.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-minimal p-8 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-primary text-white border-primary shadow-lg scale-105"
                  : "bg-white text-[#131b2e] border-slate-100 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white text-[#1A5CFF] rounded-full text-xs font-bold shadow-lg border border-blue-100">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.highlight ? "bg-white/20" : "bg-[#1A5CFF]/10"
                  }`}
                >
                  <plan.icon
                    size={20}
                    className={plan.highlight ? "text-white" : "text-[#1A5CFF]"}
                  />
                </div>
                <div>
                  <h3
                    className={`font-manrope text-xl font-bold ${
                      plan.highlight ? "text-white" : "text-[#131b2e]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs ${plan.highlight ? "text-white/70" : "text-[#434656]"}`}
                  >
                    {plan.tagline}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <span
                  className={`font-manrope text-3xl font-extrabold ${
                    plan.highlight ? "text-white" : "text-[#1A5CFF]"
                  }`}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span
                    className={`text-sm ${plan.highlight ? "text-white/60" : "text-[#434656]"}`}
                  >
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-3">
                    <CheckCircle2
                      size={16}
                      className={`mt-0.5 flex-shrink-0 ${
                        plan.highlight ? "text-[#0ECFAA]" : "text-[#0ECFAA]"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlight ? "text-white/85" : "text-[#434656]"
                      }`}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-white text-[#1A5CFF] hover:bg-blue-50"
                    : "border-2 border-[#1A5CFF] text-[#1A5CFF] hover:bg-[#1A5CFF] hover:text-white"
                }`}
              >
                {plan.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-[#434656]">
          Tidak yakin pilih paket mana?{" "}
          <a
            href={`https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo, saya ingin konsultasi paket website yang cocok untuk bisnis saya.")}`}
            className="text-[#1A5CFF] font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi gratis dengan tim kami →
          </a>
        </div>
      </div>
    </section>
  );
}
