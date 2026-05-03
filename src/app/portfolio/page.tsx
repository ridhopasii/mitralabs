"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function PortfolioPage() {
  const { data } = useData();
  const { portfolio, settings } = data;
  const { projects, categories, cta } = portfolio;
  const [filter, setFilter] = useState("All Works");

  const filteredProjects = filter === "All Works" 
    ? projects 
    : projects.filter(p => p.category === filter);

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya tertarik untuk memulai project baru.")}`;

  return (
    <>
      <main className="max-w-7xl mx-auto px-6 pt-24">
        {/* Hero Section */}
        <section className="mb-24 text-center md:text-left">
          <h1 className="font-display text-5xl md:text-8xl font-extrabold mb-6 text-on-background">
            {portfolio.title}
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed">
            {portfolio.subtitle}
          </p>
        </section>

        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-3xl shadow-premium bg-surface-container-low border border-surface-container-highest aspect-[4/5]"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-primary-fixed-dim text-xs font-bold uppercase tracking-widest mb-2">{p.category}</span>
                <h3 className="text-white text-3xl font-extrabold mb-4">{p.title}</h3>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all">
                    View Case Study <ArrowRight size={14} />
                  </button>
                  <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom CTA Section */}
        <section className="mb-24 bg-surface-container-low rounded-[3rem] p-12 md:p-24 text-center border border-surface-container-highest">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-on-background tracking-tight">
            {cta.title}
          </h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            {cta.subtitle}
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-primary text-on-primary px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
          >
            {cta.buttonText}
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}
