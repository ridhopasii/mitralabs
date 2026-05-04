"use client";

import { useParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle2, Target, Zap, Layout } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data } = useData();
  const project = data.portfolio.projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Project Not Found</h1>
          <Link href="/portfolio" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <Breadcrumbs 
            items={[
              { label: "Portfolio", href: "/portfolio" },
              { label: project.category, href: `/portfolio?filter=${project.category}` },
              { label: project.title }
            ]} 
          />
          <div className="grid lg:grid-cols-2 gap-16 items-end">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h1 className="font-display text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-on-surface">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-xl">
                {project.description}
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4"
            >
              <div className="bg-surface-container-low px-8 py-4 rounded-2xl border border-surface-container-highest">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Category</p>
                 <p className="font-bold">{project.category}</p>
              </div>
              <div className="bg-surface-container-low px-8 py-4 rounded-2xl border border-surface-container-highest">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Status</p>
                 <p className="font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    {project.status}
                 </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[21/9] rounded-[4rem] overflow-hidden shadow-premium border border-surface-container-highest relative"
          >
            <Image 
              src={project.image} 
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </motion.div>
        </section>

        {/* Case Study Content */}
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-24">
             {/* Challenge */}
             <div className="space-y-8">
                <div className="flex items-center gap-4 text-primary">
                   <Target size={32} />
                   <h3 className="text-3xl font-black uppercase tracking-tight">The Challenge</h3>
                </div>
                <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed">
                   {project.challenge}
                </p>
             </div>

             {/* Solution */}
             <div className="space-y-8">
                <div className="flex items-center gap-4 text-primary">
                   <Zap size={32} />
                   <h3 className="text-3xl font-black uppercase tracking-tight">Our Solution</h3>
                </div>
                <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed">
                   {project.solution}
                </p>
             </div>
          </div>

          <aside className="lg:col-span-4 space-y-12">
             <div className="bg-on-surface text-surface p-10 rounded-[3rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                   <Layout size={24} />
                   <h4 className="text-xl font-black uppercase tracking-widest">Results</h4>
                </div>
                <ul className="space-y-6">
                   {project.results?.map((res, i) => (
                      <li key={i} className="flex gap-4 items-start">
                         <CheckCircle2 className="text-primary shrink-0" size={20} />
                         <span className="font-bold text-lg opacity-90">{res}</span>
                      </li>
                   ))}
                </ul>
             </div>

             <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10">
                <h4 className="text-xl font-black mb-4">Ingin Hasil yang Sama?</h4>
                <p className="text-on-surface-variant font-medium mb-8">Konsultasikan visi bisnis Anda dan mari bangun solusi digital yang berdampak.</p>
                <Link 
                  href="/kontak"
                  className="block text-center bg-primary text-on-primary py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  Mulai Diskusi
                </Link>
             </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
