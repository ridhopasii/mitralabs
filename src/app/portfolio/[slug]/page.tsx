import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle2, Target, Zap, Layout, Globe, User, Calendar, Cpu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: project } = await supabase.from("Project").select("*").eq("slug", slug).maybeSingle();

  if (!project) return { title: "Project Not Found | Mitralabs" };

  return {
    title: `${project.title} | Portfolio Mitralabs`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image_url],
      type: "article",
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch direct from relational DB for SEO/Server Side performance
  const { data: project } = await supabase.from("Project").select("*").eq("slug", slug).maybeSingle();

  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-surface">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <Breadcrumbs 
            items={[
              { label: "Portfolio", href: "/portfolio" },
              { label: project.category, href: `/portfolio?filter=${project.category}` },
              { label: project.title }
            ]} 
          />
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
               <div className="inline-flex px-4 py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                  {project.category}
               </div>
               <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tight leading-tight text-slate-900">
                  {project.title}
               </h1>
               <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                  {project.description}
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 text-slate-400 mb-3">
                    <User size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Client</span>
                 </div>
                 <p className="font-bold text-slate-900">{project.client_name || "Confidential"}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 text-slate-400 mb-3">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Year</span>
                 </div>
                 <p className="font-bold text-slate-900">{project.project_date || "2026"}</p>
              </div>
              {project.live_link && (
                <a href={project.live_link} target="_blank" className="bg-primary/5 p-8 rounded-3xl border border-primary/10 shadow-sm group hover:bg-primary transition-all col-span-2 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-primary group-hover:text-white">
                      <Globe size={20} />
                      <span className="font-bold uppercase tracking-widest text-xs">Live Preview</span>
                   </div>
                   <ArrowLeft size={20} className="rotate-180 text-primary group-hover:text-white" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 relative">
            <Image 
              src={project.image_url} 
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </div>
        </section>

        {/* Case Study Content */}
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-24">
             {/* Challenge */}
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                   <Target size={28} />
                   <h3 className="text-2xl font-bold uppercase tracking-tight">The Challenge</h3>
                </div>
                <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <p className="text-xl text-slate-600 leading-relaxed font-medium">
                      {project.challenge}
                   </p>
                </div>
             </div>

             {/* Solution */}
             <div className="space-y-6">
                <div className="flex items-center gap-4 text-primary">
                   <Zap size={28} />
                   <h3 className="text-2xl font-bold uppercase tracking-tight">Our Solution</h3>
                </div>
                <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                   <p className="text-xl text-slate-600 leading-relaxed font-medium">
                      {project.solution}
                   </p>
                </div>
             </div>

             {/* Tech Stack */}
             {project.tech_stack && project.tech_stack.length > 0 && (
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-slate-400">
                     <Cpu size={28} />
                     <h3 className="text-2xl font-bold uppercase tracking-tight">Tech Stack</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     {project.tech_stack.map((tech: string, i: number) => (
                        <span key={i} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm uppercase tracking-widest">
                           {tech}
                        </span>
                     ))}
                  </div>
               </div>
             )}
          </div>

          <aside className="lg:col-span-4 space-y-12">
             <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex items-center gap-4 mb-8 relative z-10">
                   <Layout size={24} className="text-primary" />
                   <h4 className="text-lg font-bold uppercase tracking-widest">Key Results</h4>
                </div>
                <ul className="space-y-6 relative z-10">
                   {project.results?.map((res: string, i: number) => (
                      <li key={i} className="flex gap-4 items-start">
                         <CheckCircle2 className="text-primary shrink-0" size={18} />
                         <span className="font-bold text-slate-300">{res}</span>
                      </li>
                   ))}
                </ul>
             </div>

             <div className="bg-primary p-10 rounded-[2.5rem] shadow-xl text-white">
                <h4 className="text-2xl font-bold mb-4">Ingin Hasil yang Sama?</h4>
                <p className="opacity-80 font-medium mb-8">Konsultasikan visi bisnis Anda dan mari bangun solusi digital yang berdampak.</p>
                <Link 
                  href="/kontak"
                  className="block text-center bg-white text-primary py-5 rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all"
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
