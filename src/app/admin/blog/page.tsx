"use client";

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
  ChevronRight
} from "lucide-react";
import { z } from "zod";
import { uploadImage, logActivity } from "@/lib/supabase";
import Image from "next/image";

// Validation Schema
const blogPostSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  category: z.string().min(2, "Kategori wajib diisi"),
  author: z.string().min(2, "Nama penulis wajib diisi"),
  date: z.string().min(5, "Format tanggal tidak valid"),
  image: z.string().url("URL Gambar tidak valid").or(z.string().length(0)),
  content: z.string().min(50, "Konten minimal 50 karakter")
});

type BlogPost = z.infer<typeof blogPostSchema> & { id: number; excerpt: string };

export default function BlogManagement() {
  const { data, updateData } = useData();
  const [posts, setPosts] = useState<BlogPost[]>(data.blog.posts);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Sync with global data (for realtime updates)
  useEffect(() => {
    setPosts(data.blog.posts);
  }, [data.blog.posts]);

  const handleSave = () => {
    setErrors([]);
    if (!editingPost) return;

    const result = blogPostSchema.safeParse(editingPost);
    if (!result.success) {
      setErrors(result.error.issues.map((e: any) => e.message));
      return;
    }

    setIsSaving(true);
    const newPosts = posts.map(p => p.id === editingPost.id ? editingPost : p);
    
    // Update Global Context
    const newData = { ...data };
    newData.blog.posts = newPosts;
    
    setTimeout(() => {
      updateData(newData);
      setPosts(newPosts);
      logActivity("Update Blog", `Menyimpan artikel: ${editingPost.title}`);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditingPost(null);
    }, 800);
  };

  const deletePost = (id: number) => {
    if (!confirm("Hapus artikel ini?")) return;
    const newPosts = posts.filter(p => p.id !== id);
    const newData = { ...data };
    newData.blog.posts = newPosts;
    updateData(newData);
    setPosts(newPosts);
  };

  const addNewPost = () => {
    const newPost: BlogPost = {
      id: Date.now(),
      title: "Judul Artikel Baru",
      slug: "artikel-baru-" + Math.floor(Math.random() * 1000),
      category: "Edukasi",
      author: "Admin",
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      image: "",
      content: "Tulis konten artikel Anda di sini...",
      excerpt: "Ringkasan artikel..."
    };
    setEditingPost(newPost);
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
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
          <CheckCircle2 size={24} />
          <p className="font-black">Blog Berhasil Diperbarui!</p>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={20} />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-surface-container-highest rounded-3xl outline-none focus:border-primary shadow-sm font-bold transition-all"
          />
        </div>
        <button 
          onClick={addNewPost}
          className="px-10 py-5 bg-primary text-on-primary rounded-2xl font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={20} /> Tambah Artikel
        </button>
      </div>

      {/* Blog List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-[3rem] overflow-hidden border border-surface-container-highest shadow-premium group flex flex-col">
            <div className="aspect-video relative overflow-hidden bg-surface-container-low">
              {post.image ? (
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {post.category}
                </span>
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
              <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest opacity-40 mb-8">
                 <div className="flex items-center gap-2"><UserIcon size={14} /> {post.author}</div>
                 <div className="flex items-center gap-2"><Calendar size={14} /> {post.date}</div>
              </div>
              <div className="mt-auto flex gap-4">
                <button 
                  onClick={() => setEditingPost(post)}
                  className="flex-1 py-4 bg-surface-container-low text-on-surface-variant rounded-xl font-black text-xs uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-all flex items-center justify-center gap-3"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="p-4 bg-error/5 text-error rounded-xl hover:bg-error hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[150] bg-on-surface/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
            {/* Modal Header */}
            <div className="p-10 border-b border-surface-container-highest flex justify-between items-center bg-surface-container-lowest">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Edit Artikel</h2>
                    <p className="text-xs text-on-surface-variant font-bold opacity-40 uppercase tracking-widest">Sempurnakan konten edukasi Anda</p>
                  </div>
               </div>
               <button onClick={() => setEditingPost(null)} className="p-4 bg-surface-container-low rounded-2xl hover:bg-error/10 hover:text-error transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               {errors.length > 0 && (
                 <div className="bg-error/5 border border-error/20 p-8 rounded-3xl mb-10 flex gap-6 items-start animate-in slide-in-from-top-4">
                    <AlertCircle className="text-error shrink-0" size={24} />
                    <ul className="space-y-1">
                      {errors.map((e, i) => <li key={i} className="text-error font-bold text-sm">{e}</li>)}
                    </ul>
                 </div>
               )}

               <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Judul Artikel</label>
                        <input 
                          type="text" 
                          value={editingPost.title}
                          onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                          className="w-full px-8 py-5 bg-surface-container-low border border-surface-container-highest rounded-2xl outline-none font-black text-lg focus:border-primary transition-all"
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Slug (URL)</label>
                            <input 
                              type="text" 
                              value={editingPost.slug}
                              onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                              className="w-full px-6 py-4 bg-surface-container-low border border-surface-container-highest rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Kategori</label>
                            <input 
                              type="text" 
                              value={editingPost.category}
                              onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                              className="w-full px-6 py-4 bg-surface-container-low border border-surface-container-highest rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all"
                            />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Featured Image</label>
                        <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden border-4 border-dashed border-surface-container-highest bg-surface-container-low flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                          {editingPost.image && <Image src={editingPost.image} alt="Preview" fill className="object-cover" />}
                          <div className="relative z-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                            {isUploading ? <Loader2 size={32} className="animate-spin text-primary" /> : <ImageIcon size={32} className="text-primary" />}
                            <p className="font-black text-xs uppercase tracking-widest">{isUploading ? "Uploading..." : "Ganti Gambar"}</p>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 flex flex-col h-full">
                     <div className="space-y-2 flex-1 flex flex-col">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-2">Konten (Support HTML)</label>
                        <textarea 
                          value={editingPost.content}
                          onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                          className="flex-1 w-full px-8 py-8 bg-surface-container-low border border-surface-container-highest rounded-[2.5rem] outline-none font-medium text-lg focus:border-primary transition-all min-h-[400px] custom-scrollbar"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-surface-container-highest bg-surface-container-low flex justify-end gap-6">
               <button 
                 onClick={() => setEditingPost(null)}
                 className="px-10 py-5 bg-white border border-surface-container-highest text-on-surface-variant rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-surface-container transition-all"
               >
                 Batal
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="px-12 py-5 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
               >
                 {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                 {isSaving ? "Menyimpan..." : "Simpan Artikel"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
