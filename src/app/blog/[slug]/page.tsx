import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase.from("BlogPost").select("*").eq("slug", slug).maybeSingle();

  if (!post) return { title: "Article Not Found | Mitralabs" };

  return {
    title: `${post.title} | Blog Mitralabs`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
      type: "article",
    },
  };
}

export default async function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: post } = await supabase.from("BlogPost").select("*").eq("slug", slug).maybeSingle();

  if (!post) notFound();

  // Related Posts Logic (Direct DB fetch)
  const { data: relatedPosts } = await supabase
    .from("BlogPost")
    .select("*")
    .eq("category", post.category)
    .neq("slug", slug)
    .limit(3);

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

          <div className="space-y-8 mb-16">
            <span className="px-4 py-1.5 bg-primary/5 text-primary rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/10">
               {post.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-sm text-slate-500 font-bold border-y border-slate-50 py-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <User size={18} />
                 </div>
                 <span className="text-slate-900">{post.author}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Calendar size={18} className="text-primary" />
                 <span>{new Date(post.published_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3">
                 <Clock size={18} className="text-primary" />
                 <span>5 min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-20 shadow-2xl relative border border-slate-50">
            <Image 
              src={post.image_url} 
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-xl prose-slate max-w-none mb-24">
             <div 
               className="font-medium text-slate-600 leading-relaxed text-xl md:text-2xl space-y-8 blog-content"
               dangerouslySetInnerHTML={{ __html: post.content }}
             />
          </div>

          {/* Share & Footer */}
          <div className="pt-12 border-t border-slate-100 flex flex-wrap items-center justify-between gap-8 mb-20">
             <div className="flex items-center gap-6">
                <p className="font-bold uppercase tracking-widest text-[10px] text-slate-400">Bagikan Artikel</p>
                <div className="flex gap-3">
                   <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all cursor-pointer">
                      <Share2 size={18} />
                   </div>
                </div>
             </div>
             <Link 
               href="/kontak"
               className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
             >
                Diskusi Project
             </Link>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="bg-slate-50 py-32 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Keep Learning</span>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Artikel Terkait</h3>
                </div>
                <Link href="/blog" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                  Lihat Semua <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {relatedPosts.map((rp: any) => (
                  <Link 
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                      <Image src={rp.image_url} alt={rp.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-3">{rp.category}</span>
                    <h4 className="text-xl font-bold line-clamp-2 mb-4 group-hover:text-primary transition-colors">{rp.title}</h4>
                    <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
