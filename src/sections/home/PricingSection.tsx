"use client";

import Link from "next/link";
import { CheckCircle2, Star, Zap, Diamond, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function PricingSection() {
  const { data } = useData();
  const { brand } = data;
  const { plans } = data.services;

  const iconMap: Record<string, any> = {
    "Basic": Zap,
    "Standard": Star,
    "Premium": Diamond
  };

  const taglineMap: Record<string, string> = {
    "Basic": "Usaha baru yang butuh online presence cepat",
    "Standard": "UMKM & Sekolah yang ingin tampil lengkap",
    "Premium": "Bisnis Travel & Usaha Premium"
  };

  const badgeMap: Record<string, string | null> = {
    "Standard": "Paling Populer"
  };

  return (
    <section id="harga" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
            {data.home.pricing?.badge || "Paket Harga"}
          </div>
          <h2 className="font-manrope text-4xl md:text-5xl font-extrabold text-[#131b2e] leading-tight mb-6">
            {data.home.pricing?.title || "Transparan, Terjangkau, Berkualitas"}
          </h2>
          <p className="text-lg text-[#434656]">
            {data.home.pricing?.subtitle || "Pilih paket yang sesuai dengan kebutuhan bisnis kamu. Tidak ada biaya tersembunyi."}
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => {
            const IconComponent = iconMap[plan.name] || Zap;
            const tagline = taglineMap[plan.name] || "Solusi digital profesional";
            const badge = badgeMap[plan.name];
            
            return (
              <div
                key={plan.name}
                className={`relative rounded-minimal p-8 border transition-all duration-300 ${
                  plan.highlight
                    ? "bg-primary text-white border-primary shadow-lg scale-105"
                    : "bg-white text-[#131b2e] border-slate-100 shadow-sm hover:shadow-md"
                }`}
              >
                {badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white text-[#1A5CFF] rounded-full text-xs font-bold shadow-lg border border-blue-100">
                    {badge}
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      plan.highlight ? "bg-white/20" : "bg-[#1A5CFF]/10"
                    }`}
                  >
                    <IconComponent
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
                      {tagline}
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
                  <span
                    className={`text-sm ${plan.highlight ? "text-white/60" : "text-[#434656]"}`}
                  >
                    /projek
                  </span>
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
                  href={`/kontak?paket=${plan.name.toLowerCase()}`}
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? "bg-white text-[#1A5CFF] hover:bg-blue-50"
                      : "border-2 border-[#1A5CFF] text-[#1A5CFF] hover:bg-[#1A5CFF] hover:text-white"
                  }`}
                >
                  Pilih {plan.name}
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center text-sm text-[#434656]">
          Tidak yakin pilih paket mana?{" "}
          <a
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo, saya ingin konsultasi paket website yang cocok untuk bisnis saya.")}`}
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
