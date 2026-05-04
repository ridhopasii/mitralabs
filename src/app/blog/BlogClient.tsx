"use client";

import { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Search, LayoutGrid, List } from "lucide-react";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import Image from "next/image";

export default function BlogClient() {
  const { data } = useData();
  const { blog } = data;
  
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleCount, setVisibleCount] = useState(6);

  const categories = useMemo(() => {
    const cats = new Set(blog.posts.map(p => p.category));
    return ["Semua", ...Array.from(cats)];
  }, [blog.posts]);

  const filteredPosts = useMemo(() => {
    return blog.posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "Semua" || post.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [blog.posts, search, activeCategory]);

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  return (
    <>
      <div className="pt-40 pb-24 bg-gradient-to-b from-surface-container-low to-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-6 block animate-in fade-in slide-in-from-bottom-4 duration-700">
             Technical Insights & News
          </span>
          <h1 className="font-display text-5xl md:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {blog.title.split(" & ")[0]} & <span className="text-primary">{blog.title.split(" & ")[1]}</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {blog.subtitle}
          </p>
        </div>
      </div>

      <section className="pb-40 bg-background relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-6">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between mb-20 bg-surface-container-lowest p-6 rounded-[3rem] shadow-premium border border-surface-container-highest animate-in zoom-in-95 duration-700">
            {/* Search */}
            <div className="relative w-full lg:w-96">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-8 py-5 bg-surface-container-low border border-transparent rounded-[2rem] outline-none focus:border-primary focus:bg-white transition-all font-bold text-sm"
                />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(6); }}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                    ? "bg-primary text-on-primary shadow-xl shadow-primary/20 scale-105" 
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayedPosts.map((post, idx) => (
              <article 
                key={post.id} 
                className="group bg-surface-container-lowest rounded-[3rem] overflow-hidden border border-surface-container-highest shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col animate-in fade-in slide-in-from-bottom-10"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <Image
                    src={post.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-on-surface rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-40 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-primary" />
                      {post.author}
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-black text-on-surface mb-6 leading-tight group-hover:text-primary transition-colors tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-on-surface-variant font-medium leading-relaxed mb-10 line-clamp-3 opacity-80">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-8 border-t border-surface-container-highest">
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-widest hover:gap-6 transition-all">
                      Read Article <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-40 bg-surface-container-low rounded-[4rem] border-4 border-dashed border-surface-container-highest animate-in fade-in duration-700">
               <div className="w-24 h-24 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                  <Search size={48} />
               </div>
               <h3 className="text-3xl font-black text-on-surface mb-4 opacity-40 uppercase tracking-tighter">Tidak ada artikel</h3>
               <p className="text-on-surface-variant font-bold max-w-sm mx-auto opacity-60">
                 Coba cari dengan kata kunci lain atau pilih kategori yang berbeda.
               </p>
               <button 
                 onClick={() => { setSearch(""); setActiveCategory("Semua"); }}
                 className="mt-10 px-10 py-5 bg-on-surface text-surface rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
               >
                  Reset Pencarian
               </button>
            </div>
          )}

          {/* Load More */}
          {visibleCount < filteredPosts.length && (
            <div className="mt-24 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 6)}
                className="px-16 py-6 bg-on-surface text-surface rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
