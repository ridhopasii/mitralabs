"use client";

import { useParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const { data } = useData();
  const post = data.blog.posts.find((p) => p.slug === slug);

  // Related Posts Logic
  const relatedPosts = data.blog.posts
    .filter((p) => p.category === post?.category && p.slug !== slug)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Article Not Found</h1>
          <Link href="/blog" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-24 bg-white">
        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-6">
          <Breadcrumbs 
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.category, href: `/blog?category=${post.category}` },
              { label: post.title }
            ]} 
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mb-16"
          >
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
               {post.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[1.1] text-[#131b2e]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-sm text-on-surface-variant font-bold border-y border-gray-100 py-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <User size={18} />
                 </div>
                 <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Calendar size={18} className="text-blue-500" />
                 <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Clock size={18} className="text-blue-500" />
                 <span>5 min read</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video rounded-[3rem] overflow-hidden mb-20 shadow-2xl relative"
          >
            <Image 
              src={post.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"} 
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </motion.div>

          {/* Article Content */}
          <div className="prose prose-xl prose-slate max-w-none mb-24">
             <div 
               className="font-medium text-[#434656] leading-relaxed text-xl md:text-2xl space-y-8 blog-content"
               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
             />
          </div>

          {/* Share & Footer */}
          <div className="pt-12 border-t border-surface-container-highest flex flex-wrap items-center justify-between gap-8 mb-20">
             <div className="flex items-center gap-6">
                <p className="font-black uppercase tracking-widest text-xs opacity-40">Bagikan Artikel</p>
                <div className="flex gap-3">
                   <a 
                     href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`}
                     target="_blank"
                     className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all"
                   >
                      <Share2 size={18} />
                   </a>
                   <a 
                     href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                     target="_blank"
                     className="w-12 h-12 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all"
                   >
                      <Share2 size={18} />
                   </a>
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(window.location.href);
                       alert("Link berhasil disalin!");
                     }}
                     className="w-12 h-12 rounded-xl bg-on-surface/5 flex items-center justify-center hover:bg-on-surface hover:text-surface transition-all"
                   >
                      <ArrowRight size={18} />
                   </button>
                </div>
             </div>
             <Link 
               href="/kontak"
               className="px-10 py-5 bg-on-surface text-surface rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
             >
                Diskusi Project
             </Link>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-surface-container-low py-32 border-t border-surface-container-highest">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Keep Learning</span>
                  <h3 className="text-4xl md:text-5xl font-black tracking-tighter">Artikel Terkait</h3>
                </div>
                <Link href="/blog" className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                  Lihat Semua <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {relatedPosts.map((rp) => (
                  <Link 
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="group bg-background rounded-[2.5rem] p-8 border border-surface-container-highest shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                      <Image src={rp.image} alt={rp.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">{rp.category}</span>
                    <h4 className="text-xl font-black line-clamp-2 mb-4 group-hover:text-primary transition-colors">{rp.title}</h4>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                      Baca Sekarang <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
