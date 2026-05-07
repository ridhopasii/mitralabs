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
  ChevronRight,
  Filter,
  MoreVertical,
  Type,
  Layout,
  BookOpen,
  Tag,
  Upload
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
  content: z.string().min(50, "Konten minimal 50 karakter"),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter")
});

type BlogPost = z.infer<typeof blogPostSchema> & { id: number };

export default function BlogManagement() {
  const { data, updateData } = useData();
  const [posts, setPosts] = useState<BlogPost[]>(data.blog.posts);
  const [search, setSearch] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
    const isNew = !posts.some(p => p.id === editingPost.id);
    const newPosts = isNew 
      ? [{ ...editingPost, id: Date.now() }, ...posts]
      : posts.map(p => p.id === editingPost.id ? editingPost : p);
    
    const newData = { ...data };
    newData.blog.posts = newPosts;
    
    setTimeout(() => {
      updateData(newData);
      setPosts(newPosts);
      logActivity(isNew ? "Create Blog" : "Update Blog", `Artikel: ${editingPost.title}`);
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
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 font-bold">
          <CheckCircle2 size={24} />
          Blog Berhasil Diperbarui!
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900">Blog Library</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Bagikan wawasan dan berita terbaru kepada audiens Anda.</p>
        </div>
        <button 
          onClick={() => setEditingPost({
            id: 0,
            title: "",
            slug: "",
            category: "Edukasi",
            author: "Admin",
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            image: "",
            content: "",
            excerpt: ""
          })}
          className="px-10 py-5 bg-primary text-on-primary rounded-[2rem] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
        >
          <Plus size={24} /> Tambah Artikel
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Artikel</p>
            <h4 className="text-3xl font-black text-slate-900">{posts.length}</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Tag size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kategori</p>
            <h4 className="text-3xl font-black text-slate-900">{Array.from(new Set(posts.map(p => p.category))).length}</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <UserIcon size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Penulis</p>
            <h4 className="text-3xl font-black text-slate-900">{Array.from(new Set(posts.map(p => p.author))).length}</h4>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari judul, kategori, atau penulis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-primary font-bold transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-primary hover:text-primary transition-all">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-10 py-6">Artikel Info</th>
                <th className="px-6 py-6">Category</th>
                <th className="px-6 py-6">Author</th>
                <th className="px-6 py-6">Date</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-100 relative shadow-sm">
                        {post.image ? (
                          <Image src={post.image} alt={post.title} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="max-w-md">
                        <h5 className="font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{post.title}</h5>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {post.category}
                     </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px]">
                        {post.author.charAt(0)}
                      </div>
                      {post.author}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-slate-400 font-medium text-sm">
                    {post.date}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingPost(post)}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-primary hover:text-primary shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deletePost(post.id)}
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPosts.length === 0 && (
            <div className="p-20 text-center space-y-4 text-slate-400">
              <Search size={48} className="mx-auto opacity-20" />
              <p className="font-bold">Tidak ada artikel yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      {editingPost.id === 0 ? "Tulis Artikel Baru" : "Edit Artikel"}
                    </h3>
                    <p className="text-xs text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Publikasikan ide dan edukasi digital</p>
                  </div>
               </div>
               <button onClick={() => setEditingPost(null)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               {errors.length > 0 && (
                 <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] mb-10 flex gap-6 items-start animate-in slide-in-from-top-4">
                    <AlertCircle className="text-rose-500 shrink-0" size={24} />
                    <ul className="space-y-1">
                      {errors.map((e, i) => <li key={i} className="text-rose-600 font-bold text-sm"># {e}</li>)}
                    </ul>
                 </div>
               )}

               <div className="grid lg:grid-cols-12 gap-12">
                  {/* Sidebar Info */}
                  <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Featured Image</label>
                      <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                        {editingPost.image && <Image src={editingPost.image} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                        <div className="relative z-10 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                          {isUploading ? <Loader2 size={32} className="animate-spin text-primary" /> : <Upload size={32} className="text-primary" />}
                          <p className="font-black text-[10px] uppercase tracking-widest text-slate-900">Upload Image</p>
                        </div>
                        {!editingPost.image && (
                          <div className="flex flex-col items-center gap-3 text-slate-200">
                             <ImageIcon size={64} strokeWidth={1} />
                             <p className="font-black text-[10px] uppercase tracking-widest">Featured Art</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Detail Publikasi</label>
                          <div className="space-y-4">
                             <div className="relative">
                               <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                               <input 
                                 type="text" 
                                 value={editingPost.author}
                                 placeholder="Nama Penulis"
                                 onChange={(e) => setEditingPost({...editingPost, author: e.target.value})}
                                 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm"
                               />
                             </div>
                             <div className="relative">
                               <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                               <input 
                                 type="text" 
                                 value={editingPost.date}
                                 placeholder="Tanggal Terbit"
                                 onChange={(e) => setEditingPost({...editingPost, date: e.target.value})}
                                 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm"
                               />
                             </div>
                             <div className="relative">
                               <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                               <input 
                                 type="text" 
                                 value={editingPost.category}
                                 placeholder="Kategori"
                                 onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                 className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all shadow-sm"
                               />
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-8 space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Judul & Identitas</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input 
                              type="text" 
                              value={editingPost.title}
                              placeholder="Judul Artikel Menarik..."
                              onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-xl focus:border-primary transition-all shadow-sm md:col-span-1"
                           />
                           <input 
                              type="text" 
                              value={editingPost.slug}
                              placeholder="url-slug-artikel"
                              onChange={(e) => setEditingPost({...editingPost, slug: e.target.value})}
                              className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-lg focus:border-primary transition-all shadow-sm md:col-span-1"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Ringkasan Singkat (Excerpt)</label>
                        <textarea 
                           value={editingPost.excerpt}
                           placeholder="Jelaskan secara singkat isi artikel ini untuk ditampilkan di halaman depan..."
                           onChange={(e) => setEditingPost({...editingPost, excerpt: e.target.value})}
                           className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] outline-none font-medium text-lg focus:border-primary h-32 transition-all shadow-sm resize-none"
                        />
                     </div>

                     <div className="space-y-4 flex flex-col h-full">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Konten Lengkap</label>
                        <textarea 
                           value={editingPost.content}
                           placeholder="Tuliskan isi artikel Anda secara mendalam di sini..."
                           onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                           className="flex-1 w-full px-8 py-8 bg-white border border-slate-200 rounded-[2.5rem] outline-none font-medium text-lg focus:border-primary transition-all min-h-[400px] shadow-sm custom-scrollbar"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
               <button 
                 onClick={() => setEditingPost(null)}
                 className="px-12 py-5 bg-white border border-slate-200 text-slate-600 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-sm"
               >
                 Batal
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="px-16 py-5 bg-primary text-on-primary rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50"
               >
                 {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                 {isSaving ? "Menyimpan..." : "Simpan & Publish"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
