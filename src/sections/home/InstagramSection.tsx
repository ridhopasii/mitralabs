"use client";

import { useData } from "@/context/DataContext";
import { Instagram, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const IG_POSTS = [
  "/mitralabs_ig_tips.png",
  "/mitralabs_travel_service_1778227548373.png",
  "/mitralabs_school_service_1778227565941.png",
  "/mitralabs_business_service.png",
];

interface InstagramPost {
  url: string;
  link: string;
}

export default function InstagramSection() {
  const { data } = useData();
  const { brand } = data;
  const [posts, setPosts] = useState<InstagramPost[]>(
    IG_POSTS.map((url) => ({ url, link: "" }))
  );

  useEffect(() => {
    fetch("/api/instagram")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data && resData.data.length > 0) {
          const igData = resData.data.slice(0, 4).map((p: any) => ({
            url: p.media_type === "VIDEO" ? p.thumbnail_url || p.media_url : p.media_url,
            link: p.permalink,
          }));
          setPosts(igData);
        }
      })
      .catch((err) => {
        console.log("Using static fallback for Instagram feed:", err.message);
      });
  }, []);

  if (!brand.instagram) return null;

  const igHandle = brand.instagram.replace("@", "");
  const igUrl = `https://instagram.com/${igHandle}`;

  return (
    <section className="py-24 md:py-32 bg-background overflow-hidden border-t border-outline/5">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 text-primary mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Instagram size={20} />
              </div>
              <span className="font-bold uppercase tracking-[0.2em] text-[10px]">@{igHandle}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-on-surface mb-4">
              Ikuti Perjalanan Kami
            </h2>
            <p className="text-secondary font-medium text-lg leading-relaxed">
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
            className="btn-apple-secondary border border-outline/10 px-8 flex items-center gap-3 shrink-0"
          >
            Follow Instagram <ArrowRight size={16} />
          </motion.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href={post.link || igUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-square rounded-[2rem] overflow-hidden bg-surface-container shadow-apple"
            >
              {/* Using standard img tag to prevent issues with variable Instagram CDN domains in Next.js Remote Patterns */}
              <img
                src={post.url}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram
                  size={32}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-50 group-hover:scale-100"
                />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
