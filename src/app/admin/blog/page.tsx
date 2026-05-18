"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import {
  Plus,
  Trash2,
  Edit3,
  Eye,
  Save,
  X,
  Image as ImageIcon,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  User as UserIcon,
  ChevronRight,
  Filter,
  MoreVertical,
  Type,
  Layout,
  BookOpen,
  Tag,
  Upload,
  Zap
} from "lucide-react";
import { z } from "zod";
import { uploadImage, logActivity } from "@/lib/supabase";
import Image from "next/image";
import ImageUploader from "@/components/admin/ImageUploader";

// Validation Schema
const blogPostSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  category: z.string().min(2, "Kategori wajib diisi"),
  author: z.string().min(2, "Nama penulis wajib diisi"),
  date: z.string().min(5, "Format tanggal tidak valid"),
  image: z.string().url("URL Gambar tidak valid").or(z.string().length(0)),
  content: z.string().min(50, "Konten minimal 50 karakter"),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter")
});

type BlogPost = z.infer<typeof blogPostSchema> & { id: number };

export default function BlogManagement() {
  const { data, updateData, syncBlogPost } = useData();
  const [posts, setPosts] = useState<BlogPost[]>(data.blog.posts);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  useEffect(() => {
    setPosts(data.blog.posts);
  }, [data.blog.posts]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  const handleSave = () => {
    setErrors([]);
    if (!editingPost) return;

    const postWithSlug = {
      ...editingPost,
      slug: editingPost.slug || generateSlug(editingPost.title)
    };

    const result = blogPostSchema.safeParse(postWithSlug);
    if (!result.success) {
      setErrors(result.error.issues.map((e: any) => e.message));
      return;
    }

    setIsSaving(true);
    const isNew = !posts.some(p => p.id === postWithSlug.id);
    const newPosts = isNew
      ? [{ ...postWithSlug, id: Date.now() }, ...posts]
      : posts.map(p => p.id === postWithSlug.id ? postWithSlug : p);

    const newData = { ...data };
    newData.blog.posts = newPosts;

    setTimeout(async () => {
      updateData(newData);
      setPosts(newPosts);
      
      try {
        await syncBlogPost(postWithSlug as any);
      } catch (err) {
        console.error(err);
      }
      
      logActivity(isNew ? "Create Blog" : "Update Blog", `Artikel: ${postWithSlug.title}`);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditingPost(null);
    }, 800);
  };

  const deletePost = (id: number) => {
    if (!confirm("Hapus artikel ini secara permanen?")) return;
    const newPosts = posts.filter(p => p.id !== id);
    const newData = { ...data };
    newData.blog.posts = newPosts;
    updateData(newData);
    setPosts(newPosts);
  };

  const handleImageUpload = async (file: File) => {
    if (!editingPost) return;
    setIsUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setEditingPost({ ...editingPost, image: url });
    }
    setIsUploading(false);
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-10 right-10 z-[300] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 font-bold border border-white/10"
          >
            <CheckCircle2 size={24} className="text-primary" />
            Editorial Content Synchronized!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 leading-none">Editorial Hub.</h2>
          <p className="text-slate-400 font-medium mt-3 text-lg">Bagikan wawasan dan berita terbaru kepada audiens Anda.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
           <div className="relative group flex-grow md:flex-grow-0">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary/30 font-bold text-sm w-full md:w-80 transition-all shadow-sm"
              />
           </div>
           <button
            onClick={() => { setEditingPost({
              id: 0,
              title: "",
              slug: "",
              category: "Edukasi",
              author: "Admin",
              date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              image: "",
              content: "",
              excerpt: ""
            }); setActiveTab("identity"); }}
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-4 hover:opacity-90 active:scale-95 transition-all shadow-xl"
          >
            <Plus size={20} /> Create Article
          </button>
        </div>
      </div>

      {/* Grid View for Blog Posts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div key={post.id} className="group bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-slate-50">
              {post.image ? (
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-200">
                  <ImageIcon size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-6 left-6">
                 <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-slate-900 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm">
                    {post.category}
                 </span>
              </div>
            </div>
            <div className="p-10 flex-grow flex flex-col">
               <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className="text-primary" />
                    {post.author}
                  </div>
               </div>
               <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
               <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-8">/{post.slug}</p>

               <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={() => { setEditingPost(post); setActiveTab("identity"); }}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-900 hover:text-primary transition-colors"
                  >
                    Edit Details <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
          </div>
        ))}
        {filteredPosts.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 py-32 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
             <div className="flex flex-col items-center gap-6 opacity-20">
                <Search size={64} strokeWidth={1} />
                <p className="font-bold uppercase tracking-[0.3em] text-[10px]">No publications found in the library</p>
             </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal Console */}
      <AnimatePresence>
        {editingPost && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPost(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 20 }}
              className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative z-10 border border-slate-200"
            >
              {/* Modal Header */}
              <div className="p-8 lg:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <FileText size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                        {editingPost.id === 0 ? "Narrative Blueprint" : "Editorial Console"}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-primary" /> Content Engine v3.0
                      </p>
                    </div>
                 </div>
                 <button onClick={() => setEditingPost(null)} className="p-3 text-slate-400 hover:text-slate-900 transition-all bg-white border border-slate-200 rounded-xl">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                  {/* Modal Sidebar */}
                  <div className="lg:w-64 border-r border-slate-100 p-8 bg-slate-50/30 space-y-2 shrink-0 overflow-y-auto">
                     <p className="px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">Article Modules</p>
                     {[
                       { id: "identity", label: "Metadata", icon: UserIcon },
                       { id: "narrative", label: "Narrative", icon: Type },
                       { id: "media", label: "Visual Hub", icon: ImageIcon }
                     ].map((tab) => (
                       <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-4 ${activeTab === tab.id ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "text-slate-500 hover:bg-white hover:text-slate-900"}`}
                       >
                         <tab.icon size={16} /> {tab.label}
                       </button>
                     ))}
                  </div>

                  {/* Form Content Area */}
                  <div className="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar bg-white">
                     {activeTab === "identity" && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                           <div className="grid md:grid-cols-2 gap-10">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Article Headline</label>
                                 <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-lg focus:border-primary/50 focus:bg-white transition-all"
                                    placeholder="Enter publication title..."
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Logic Path (Slug)</label>
                                 <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-sm">/</span>
                                    <input
                                      type="text"
                                      value={editingPost.slug}
                                      onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                                      className="w-full pl-10 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-primary/50 focus:bg-white transition-all text-primary"
                                      placeholder="article-unique-slug"
                                    />
                                    <button
                                      onClick={() => setEditingPost({...editingPost, slug: generateSlug(editingPost.title)})}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-primary transition-all"
                                      title="Auto-generate from title"
                                    >
                                      <Zap size={14} />
                                    </button>
                                 </div>
                              </div>
                           </div>

                           <div className="grid md:grid-cols-3 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Classification</label>
                                 <input
                                    type="text"
                                    value={editingPost.category}
                                    onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest focus:border-primary/50"
                                    placeholder="e.g. Technology"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Intellectual Author</label>
                                 <input
                                    type="text"
                                    value={editingPost.author}
                                    onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest focus:border-primary/50"
                                    placeholder="Author name"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Release Date</label>
                                 <input
                                    type="text"
                                    value={editingPost.date}
                                    onChange={(e) => setEditingPost({...editingPost, date: e.target.value})}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-[11px] uppercase tracking-widest focus:border-primary/50"
                                 />
                              </div>
                           </div>

                           {errors.length > 0 && (
                              <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl space-y-2">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                    <AlertCircle size={14} /> Validation Errors
                                 </p>
                                 <ul className="space-y-1">
                                    {errors.map((err, i) => <li key={i} className="text-xs text-rose-600 font-medium">• {err}</li>)}
                                 </ul>
                              </div>
                           )}
                        </div>
                     )}

                     {activeTab === "narrative" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Executive Summary (Excerpt)</label>
                              <textarea
                                 value={editingPost.excerpt}
                                 onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                                 className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-sm leading-relaxed focus:border-primary/50 h-32 transition-all resize-none"
                                 placeholder="Short summary for the index page..."
                              />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Narrative Body</label>
                              <textarea
                                 value={editingPost.content}
                                 onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                 className="w-full px-8 py-8 bg-slate-50 border border-slate-200 rounded-[2.5rem] outline-none font-medium text-lg leading-relaxed focus:border-primary/50 h-[500px] transition-all resize-none custom-scrollbar"
                                 placeholder="Write your article depth here..."
                              />
                           </div>
                        </div>
                     )}

                     {activeTab === "media" && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                           <div className="space-y-4">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Hero Asset (Cover)</label>
                              <ImageUploader
                                currentImage={editingPost.image}
                                onUploadSuccess={(url, filename) => {
                                  setEditingPost({ ...editingPost, image: url });
                                  logActivity("Upload Image", `Blog cover: ${filename}`);
                                }}
                                folder="blog"
                              />
                           </div>
                        </div>
                     )}
                  </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 lg:p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
                 <button
                   onClick={() => setEditingPost(null)}
                   className="px-10 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all"
                 >
                   Discard
                 </button>
                 <button
                   onClick={handleSave}
                   disabled={isSaving}
                   className="px-16 py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 hover:opacity-90 active:scale-95 transition-all shadow-xl disabled:opacity-50"
                 >
                   {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                   {isSaving ? "Syncing..." : "Finalize Publication"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
