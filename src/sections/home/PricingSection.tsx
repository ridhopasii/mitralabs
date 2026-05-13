"use client";

import Link from "next/link";
import { CheckCircle2, Star, Zap, Diamond, ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

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
    "Basic": "Cocok untuk perkenalan awal bisnis kamu.",
    "Standard": "Pilihan paling lengkap & hemat buat UMKM.",
    "Premium": "Sistem custom buat bisnis yang sudah jalan."
  };

  return (
    <section id="harga" className="py-24 md:py-40 bg-background">
      <div className="section-container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-7xl font-semibold mb-6 md:mb-8 tracking-tight reveal-text">
            {data.home.pricing?.title || "Harga Jujur & Transparan"}
          </h2>
          <p className="text-lg md:text-2xl text-secondary max-w-2xl mx-auto font-medium">
            {data.home.pricing?.subtitle || "Pilih paket yang sesuai dengan kebutuhan bisnis kamu. Tidak ada biaya tersembunyi."}
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const IconComponent = iconMap[plan.name] || Zap;
            const tagline = taglineMap[plan.name] || "Solusi digital profesional";
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                className={`relative rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 flex flex-col ${
                  plan.highlight
                    ? "bg-on-background text-background border-on-background shadow-apple-hover scale-100 md:scale-105 z-10"
                    : "bg-surface-container text-on-background border-outline/10 shadow-apple hover:shadow-apple-hover"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    Paling Populer
                  </div>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      plan.highlight ? "bg-background/10" : "bg-primary/10"
                    }`}
                  >
                    <IconComponent
                      size={24}
                      className={plan.highlight ? "text-background" : "text-primary"}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {plan.name}
                    </h3>
                    <p className={`text-xs font-medium uppercase tracking-wider ${plan.highlight ? "text-background/60" : "text-secondary"}`}>
                      {tagline}
                    </p>
                  </div>
                </div>

                <div className="mb-10">
                  <span className="text-4xl md:text-5xl font-bold tracking-tight">
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-2 font-medium ${plan.highlight ? "text-background/50" : "text-secondary"}`}>
                    /projek
                  </span>
                </div>

                <ul className="space-y-4 mb-12 flex-grow">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className={`mt-0.5 flex-shrink-0 ${
                          plan.highlight ? "text-success" : "text-success"
                        }`}
                      />
                      <span className={`text-sm md:text-base font-medium ${plan.highlight ? "text-background/90" : "text-on-background/80"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/kontak?paket=${plan.name.toLowerCase()}`}
                  className={`flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-base transition-all duration-300 ${
                    plan.highlight
                      ? "bg-background text-on-background hover:bg-background/90"
                      : "bg-on-background text-background hover:opacity-90"
                  }`}
                >
                  Pilih {plan.name}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center text-lg font-medium text-secondary">
          Tidak yakin pilih paket mana?{" "}
          <a
            href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo, saya ingin konsultasi paket website yang cocok untuk bisnis saya.")}`}
            className="text-primary font-bold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Konsultasi gratis &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
