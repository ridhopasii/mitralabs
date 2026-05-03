import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { Calendar, User, ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Tips — Edukasi Digital Mitralabs.id",
  description: "Dapatkan tips, trik, dan artikel seputar pengembangan website, SEO, dan digital marketing untuk membantu bisnis Anda berkembang.",
};

const posts = [
  {
    title: "Kenapa UMKM Butuh Website di Tahun 2024?",
    excerpt: "Media sosial saja tidak cukup. Pelajari kenapa website adalah aset terpenting bagi UMKM untuk naik kelas.",
    category: "Edukasi",
    author: "Ridho",
    date: "12 Mar 2024",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "5 Ciri Website yang Bagus untuk Konversi Penjualan",
    excerpt: "Bukan hanya sekadar cantik, website yang bagus harus bisa merubah pengunjung menjadi pembeli.",
    category: "Tips",
    author: "Ghazy",
    date: "10 Mar 2024",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mengenal Next.js: Kenapa Kami Menggunakannya?",
    excerpt: "Teknologi di balik website cepat dan SEO-friendly. Kenapa kami memilih Next.js untuk semua project kami.",
    category: "Teknologi",
    author: "Ghazy",
    date: "05 Mar 2024",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogPage() {
  return (
    <>
      <div className="pt-32 pb-20 bg-gradient-to-b from-[#faf8ff] to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
             📰 Blog
          </div>
          <h1 className="font-manrope text-5xl md:text-6xl font-extrabold text-[#131b2e] leading-tight mb-6">
            Edukasi & <span className="text-gradient">Wawasan</span>
          </h1>
          <p className="text-lg text-[#434656] max-w-2xl mx-auto leading-relaxed">
            Tips, trik, dan artikel terbaru seputar dunia teknologi dan bisnis untuk membantu Anda tetap relevan di era digital.
          </p>
        </div>
      </div>

      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search/Filter Bar */}
          <div className="max-w-xl mx-auto mb-16">
             <div className="relative">
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-[#faf8ff] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.title} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#131b2e] rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-[#434656] mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-500" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" />
                      {post.author}
                    </div>
                  </div>
                  <h3 className="font-manrope text-xl font-bold text-[#131b2e] mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#434656] leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-gray-50">
                    <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
                      Baca Selengkapnya <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination (Visual) */}
          <div className="mt-16 flex justify-center gap-2">
             <button className="w-10 h-10 rounded-lg gradient-primary text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-blue-500/20">1</button>
             <button className="w-10 h-10 rounded-lg bg-[#faf8ff] text-[#434656] font-bold text-sm flex items-center justify-center hover:bg-gray-100 transition-colors">2</button>
             <button className="w-10 h-10 rounded-lg bg-[#faf8ff] text-[#434656] font-bold text-sm flex items-center justify-center hover:bg-gray-100 transition-colors">3</button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
