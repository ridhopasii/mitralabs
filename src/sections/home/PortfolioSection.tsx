"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Package } from "lucide-react";
import { useData } from "@/context/DataContext";
import Link from "next/link";

export default function PortfolioSection() {
  const { data } = useData();
  const projects = data.portfolio.projects.slice(0, 3); // Ambil 3 teratas

  if (projects.length === 0) return null;

  return (
    <section className="py-32 px-6 bg-white overflow-hidden" id="portfolio">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-xs mb-6 block">Karya Terpilih</span>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Bukti Nyata Solusi Digital yang <span className="text-blue-600">Bekerja.</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/portfolio" 
              className="group flex items-center gap-3 text-slate-900 font-bold text-sm uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Lihat Semua Project 
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                <ArrowRight size={18} />
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/portfolio/${project.slug}`} className="block space-y-6">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 border border-slate-100">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                    <div className="text-white">
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-80">{project.category}</p>
                       <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <ExternalLink size={20} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
