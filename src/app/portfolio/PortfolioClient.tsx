"use client";

import { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import { ArrowRight, Search, LayoutGrid } from "lucide-react";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
      <main className="bg-background min-h-screen">
        {/* Hero Section */}
        <header className="pt-40 pb-24 md:pt-60 md:pb-40 px-6">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-primary font-semibold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-6 block">Karya Terpilih</span>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-semibold text-on-surface mb-10 leading-[1.05] tracking-tight md:tracking-[-0.03em] reveal-text">
                {portfolio.title.split('.')[0]}
              </h1>
              <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto font-medium leading-relaxed">
                {portfolio.subtitle}
              </p>
            </motion.div>
          </div>
        </header>

        {/* Controls Bar */}
        <section className="sticky top-20 z-30 pb-10 px-6">
          <div className="section-container">
            <div className="glass-apple p-4 md:p-6 rounded-[2.5rem] md:rounded-full border border-outline/10 shadow-apple flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Filter Section */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setFilter(cat); setVisibleCount(6); }}
                    className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest shrink-0 transition-all duration-300 ${
                      filter === cat 
                        ? "bg-on-background text-background shadow-lg scale-105" 
                        : "text-secondary hover:text-on-background hover:bg-surface-container"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72 group">
                  <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary transition-colors group-focus-within:text-on-background" />
                  <input
                    type="text"
                    placeholder="Cari project..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-3 bg-surface-container/50 border border-transparent rounded-full outline-none focus:border-outline/20 focus:bg-background transition-all font-medium text-sm"
                  />
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="section-container py-20">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {displayedProjects.map((p) => (
                <motion.div
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative h-[550px] md:h-[650px] rounded-[3.5rem] overflow-hidden bg-surface-container shadow-apple hover:shadow-apple-hover transition-all duration-700"
                >
                   <Link href={`/portfolio/${p.slug}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {p.title}</span>
                  </Link>
                  
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-2000 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/80 transition-opacity duration-700"></div>
                  
                  <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between text-white z-20 pointer-events-none">
                    <div className="flex justify-between items-start">
                       <span className="bg-white/10 backdrop-blur-2xl px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20">
                         {p.category}
                       </span>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight leading-tight transition-transform duration-700 group-hover:-translate-y-2">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        Detail Project <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="section-container py-32">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-40 bg-surface-container/50 rounded-[4rem] border border-outline/5"
            >
               <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-8 text-secondary/30">
                  <LayoutGrid size={32} />
               </div>
               <h3 className="text-3xl font-semibold text-on-background mb-4">Project tidak ditemukan</h3>
               <p className="text-secondary font-medium max-w-sm mx-auto">
                 Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.
               </p>
            </motion.div>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredProjects.length && (
          <div className="py-20 text-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="btn-apple-secondary border border-outline/10 text-sm px-12"
            >
              Lihat Lebih Banyak
            </button>
          </div>
        )}

        {/* Bottom CTA Section */}
        <section className="section-container py-24 md:py-48 mb-20">
           <div className="bg-surface-container p-16 md:p-32 rounded-[4rem] text-center relative overflow-hidden border border-outline/5 shadow-apple">
              <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-semibold mb-10 text-on-background tracking-tight reveal-text">
                  {cta.title}
                </h2>
                <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
                  {cta.subtitle}
                </p>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apple text-lg px-12 py-5 flex items-center justify-center gap-3"
                >
                  {cta.buttonText} <ArrowRight size={20} />
                </a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
