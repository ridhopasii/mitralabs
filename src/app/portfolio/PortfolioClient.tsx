"use client";

import { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import { ArrowRight, ExternalLink, Search, LayoutGrid, List } from "lucide-react";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import Image from "next/image";

export default function PortfolioClient() {
  const { data } = useData();
  const { portfolio, settings } = data;
  const { projects, categories, cta } = portfolio;
  
  const [filter, setFilter] = useState("All Works");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesFilter = filter === "All Works" || p.category === filter;
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                           p.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, search]);

  const displayedProjects = filteredProjects.slice(0, visibleCount);

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya tertarik untuk memulai project baru.")}`;

  return (
    <>
      <main className="pt-40 bg-background overflow-hidden">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative">
          <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-700">
               Showcasing Excellence
            </span>
            <h1 className="font-display text-5xl md:text-9xl font-black mb-8 text-on-surface leading-[0.85] tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {portfolio.title.split('.')[0]}<span className="text-primary">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl font-medium leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {portfolio.subtitle}
            </p>
          </div>
        </section>

        {/* Controls Bar */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between bg-surface-container-lowest p-6 rounded-[3rem] shadow-premium border border-surface-container-highest animate-in zoom-in-95 duration-700">
            {/* Search */}
            <div className="relative w-full lg:w-96">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                <input
                  type="text"
                  placeholder="Cari project..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-surface-container-low border border-transparent rounded-[2rem] outline-none focus:border-primary focus:bg-white transition-all font-bold text-sm"
                />
            </div>

            {/* Filter Section */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setVisibleCount(6); }}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === cat 
                      ? "bg-primary text-on-primary shadow-xl shadow-primary/20 scale-105" 
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-24">
          {displayedProjects.map((p, idx) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-[3rem] shadow-premium bg-surface-container-low border border-surface-container-highest aspect-[4/5] animate-in fade-in slide-in-from-bottom-10"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                <span className="text-primary-fixed-dim text-[10px] font-black uppercase tracking-[0.2em] mb-3">{p.category}</span>
                <h3 className="text-white text-3xl font-black mb-6 tracking-tight">{p.title}</h3>
                <div className="flex gap-4">
                  <Link 
                    href={`/portfolio/${p.slug}`}
                    className="flex-1 flex items-center justify-center gap-3 bg-white text-on-surface px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all shadow-xl"
                  >
                    Details <ArrowRight size={18} />
                  </Link>
                  <button className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-on-surface transition-all">
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="max-w-7xl mx-auto px-6 mb-24">
            <div className="text-center py-40 bg-surface-container-low rounded-[4rem] border-4 border-dashed border-surface-container-highest animate-in fade-in duration-700">
               <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                  <Search size={48} />
               </div>
               <h3 className="text-3xl font-black text-on-surface mb-4 opacity-40 uppercase tracking-tighter">Project tidak ditemukan</h3>
               <p className="text-on-surface-variant font-bold max-w-sm mx-auto opacity-60">
                 Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.
               </p>
            </div>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredProjects.length && (
          <div className="mb-24 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-16 py-6 bg-on-surface text-surface rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
            >
              Load More Projects
            </button>
          </div>
        )}

        {/* Bottom CTA Section */}
        <section className="max-w-7xl mx-auto px-6 mb-40">
          <div className="bg-primary p-12 md:p-32 rounded-[4rem] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1A5CFF_0%,_transparent_70%)] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 text-on-primary tracking-tighter leading-none">
                {cta.title}
              </h2>
              <p className="text-xl text-on-primary/70 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                {cta.subtitle}
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-6 bg-white text-primary px-16 py-7 rounded-[2rem] font-black text-xl hover:scale-110 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
              >
                {cta.buttonText}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
