"use client";

import { useData } from "@/context/DataContext";
import { Instagram, ArrowRight, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const FALLBACK_POSTS = [
  {
    url: "/mitralabs_umkm_service.png",
    title: "Website UMKM & Toko Online",
    caption: "Mulai dari Rp 1.5jt, kami bantu tokomu go-digital dengan website responsif dan tombol pesan langsung WA!",
    likes: 142,
    comments: 18,
    link: "https://instagram.com/mitralabs.id"
  },
  {
    url: "/mitralabs_travel_service.png",
    title: "Portal Travel Danau Toba",
    caption: "Sistem booking otomatis & interaktif untuk paket wisata Danau Toba. Wisatawan bisa booking kapan saja.",
    likes: 198,
    comments: 24,
    link: "https://instagram.com/mitralabs.id"
  },
  {
    url: "/mitralabs_school_service.png",
    title: "Web Profil Sekolah Penerbangan",
    caption: "Informasi PPDB online terintegrasi, galeri kegiatan, dan profil berita sekolah dalam wadah profesional.",
    likes: 176,
    comments: 15,
    link: "https://instagram.com/mitralabs.id"
  },
  {
    url: "/mitralabs_ig_tips.png",
    title: "5 Tips Naikkan Omset Bisnis",
    caption: "Kenapa website bisa melipatgandakan kepercayaan pembeli dan menghemat waktu operasional sales kamu?",
    likes: 245,
    comments: 32,
    link: "https://instagram.com/mitralabs.id"
  }
];

export default function InstagramSection() {
  const { data } = useData();
  const { brand } = data;
  const [posts, setPosts] = useState<any[]>(FALLBACK_POSTS);

  useEffect(() => {
    fetch("/api/instagram")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data && resData.data.length > 0) {
          const igData = resData.data.slice(0, 4).map((p: any, idx: number) => ({
            ...FALLBACK_POSTS[idx],
            url: p.media_type === "VIDEO" ? p.thumbnail_url || p.media_url : p.media_url,
            link: p.permalink,
          }));
          setPosts(igData);
        }
      })
      .catch((err) => {
        console.log("Using static premium fallbacks for Instagram feed:", err.message);
      });
  }, []);

  if (!brand.instagram) return null;

  const igHandle = brand.instagram.replace("@", "");
  const igUrl = `https://instagram.com/${igHandle}`;

  return (
    <section className="py-32 bg-surface-container-low overflow-hidden border-t border-outline/5">
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Instagram size={20} />
              </div>
              <span className="font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">@{igHandle}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-6">
              Ikuti Perjalanan Kami
            </h2>
            <p className="text-on-surface-variant font-medium text-lg leading-relaxed max-w-lg">
              Dapatkan tips digital marketing, inspirasi desain website, dan *behind the scene* project terbaru kami setiap hari.
            </p>
          </motion.div>

          <motion.a
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4.5 bg-white text-on-surface border border-surface-container-highest rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
          >
            Follow Instagram <ArrowRight size={16} />
          </motion.a>
        </div>

        {/* Mockup Instagram Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[2.5rem] border border-surface-container-highest shadow-sm overflow-hidden flex flex-col hover:shadow-apple-hover hover:scale-[1.01] transition-all duration-500"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-container-highest bg-surface-container-low/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-container-highest bg-primary/5 flex items-center justify-center shrink-0 text-[10px] font-black text-primary">
                    ML
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-on-surface">mitralabs.id</span>
                      {/* Verified Badge */}
                      <svg className="w-3.5 h-3.5 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <span className="text-[8px] font-black text-on-surface-variant opacity-60 uppercase tracking-widest block">Medan, Sumut</span>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Image with Interactive Glass Stats Overlay */}
              <a
                href={post.link || igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square block overflow-hidden bg-surface-container-low"
              >
                <img
                  src={post.url}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-400 flex flex-col items-center justify-center gap-3">
                  <div className="flex items-center gap-6 text-white text-sm font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="flex items-center gap-1.5">❤️ {post.likes}</span>
                    <span className="flex items-center gap-1.5">💬 {post.comments}</span>
                  </div>
                  <span className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-widest uppercase text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                    Buka Postingan ↗
                  </span>
                </div>
              </a>

              {/* Instagram Details & Actions */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 text-on-surface">
                    <div className="flex items-center gap-4">
                      <Heart size={18} className="hover:text-primary hover:fill-primary transition-all cursor-pointer" />
                      <MessageCircle size={18} className="hover:text-primary transition-colors cursor-pointer" />
                      <Send size={18} className="hover:text-primary transition-colors cursor-pointer" />
                    </div>
                    <Bookmark size={18} className="hover:text-primary transition-colors cursor-pointer" />
                  </div>
                  <div className="text-xs">
                    <span className="font-black text-on-surface block mb-1.5">mitralabs.id</span>
                    <span className="font-black text-primary text-[11px] block mb-2">{post.title}</span>
                    <p className="text-on-surface-variant font-medium leading-relaxed line-clamp-3">
                      {post.caption}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-surface-container-highest flex items-center justify-between">
                  <span className="text-[9px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">Baru Saja</span>
                  <span className="text-[10px] font-black text-primary hover:underline cursor-pointer">Lihat Ulasan</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
