"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Image as ImageIcon, 
  Quote,
  Search,
  CheckCircle2,
  Filter,
  User as UserIcon,
  Loader2,
  ThumbsUp,
  Upload
} from "lucide-react";
import { logActivity, uploadImage } from "@/lib/supabase";
import Image from "next/image";

export default function TestimonialsAdmin() {
  const { data, updateData } = useData();
  const [testimonials, setTestimonials] = useState(data.testimonials || []);
  const [search, setSearch] = useState("");
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setTestimonials(data.testimonials || []);
  }, [data.testimonials]);

  const handleSave = async () => {
    if (!editingTestimonial) return;
    setIsSaving(true);
    
    let newTestimonials;
    if (editingTestimonial.id === 0) {
      const newId = Math.max(0, ...testimonials.map((t: any) => t.id)) + 1;
      newTestimonials = [...testimonials, { ...editingTestimonial, id: newId }];
      await logActivity("Add Testimonial", `Menambahkan testimonial dari ${editingTestimonial.name}`);
    } else {
      newTestimonials = testimonials.map((t: any) => t.id === editingTestimonial.id ? editingTestimonial : t);
      await logActivity("Update Testimonial", `Memperbarui testimonial ${editingTestimonial.name}`);
    }
    
    setTimeout(() => {
      setTestimonials(newTestimonials);
      updateData({ ...data, testimonials: newTestimonials });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditingTestimonial(null);
    }, 800);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus testimonial ini?")) return;
    const t = testimonials.find((item: any) => item.id === id);
    const newTestimonials = testimonials.filter((item: any) => item.id !== id);
    setTestimonials(newTestimonials);
    updateData({ ...data, testimonials: newTestimonials });
    await logActivity("Delete Testimonial", `Menghapus testimonial dari ${t?.name}`);
  };

  const handleImageUpload = async (file: File) => {
    if (!editingTestimonial) return;
    setIsUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setEditingTestimonial({ ...editingTestimonial, image: url });
    }
    setIsUploading(false);
  };

  const filteredTestimonials = testimonials.filter((t: any) => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.role.toLowerCase().includes(search.toLowerCase()) ||
    t.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-24">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-[500] bg-white border border-slate-200/60 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <CheckCircle2 size={16} />
            </div>
            <span className="font-semibold text-slate-900 text-sm tracking-tight">Data Tersimpan.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Social Proof</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">
            Kelola apresiasi dan feedback dari klien-klien terbaik Anda.
          </p>
        </div>
        
        <button 
          onClick={() => setEditingTestimonial({ id: 0, name: "", role: "", content: "", rating: 5, image: "" })}
          className="h-[60px] px-8 bg-slate-900 text-white rounded-2xl font-semibold text-[13px] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {[
          { label: "Rata-rata Rating", value: `${(testimonials.reduce((acc: number, t: any) => acc + t.rating, 0) / (testimonials.length || 1)).toFixed(1)} / 5.0`, icon: Star },
          { label: "Total Ulasan", value: testimonials.length, icon: ThumbsUp },
          { label: "Ulasan Bintang 5", value: testimonials.filter((t: any) => t.rating === 5).length, icon: Quote },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center">
                   <stat.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden mx-4">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900" size={16} />
            <input 
              type="text" 
              placeholder="Cari testimoni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-1 focus:ring-slate-200 font-medium text-[13px] transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-semibold text-slate-400 text-[12px] hover:text-slate-900 transition-all">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Client Info</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Content</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center">Rating</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTestimonials.map((t: any) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                        {t.image ? (
                          <Image src={t.image} alt={t.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 tracking-tight leading-none mb-1.5">{t.name}</h5>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <p className="text-[13px] font-medium text-slate-500 line-clamp-2 italic max-w-xl leading-relaxed">
                       "{t.content}"
                     </p>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < t.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} />
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingTestimonial(t)}
                        className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-3 text-slate-300 hover:text-rose-500 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTestimonials.length === 0 && (
            <div className="py-40 text-center space-y-4 opacity-10">
              <Search size={64} className="mx-auto" strokeWidth={1} />
              <p className="font-bold uppercase tracking-widest text-[10px]">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Apple-style Modal */}
      <AnimatePresence>
        {editingTestimonial && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingTestimonial(null)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative z-10 border border-slate-100"
            >
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-20">
                 <div className="flex items-center gap-5">
                    <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                       <Quote size={20} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                         {editingTestimonial.id === 0 ? "Add Social Proof" : "Edit Social Proof"}
                       </h3>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Feedback</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingTestimonial(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                 <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-12 text-center">
                       <div className="space-y-4">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Client Visual</label>
                          <div className="relative group w-48 h-48 rounded-[3rem] overflow-hidden border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300 transition-all mx-auto">
                            {editingTestimonial.image && <Image src={editingTestimonial.image} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                            <div className="relative z-10 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                              {isUploading ? <Loader2 size={24} className="animate-spin text-slate-900" /> : <Upload size={24} className="text-slate-900" />}
                            </div>
                            {!editingTestimonial.image && (
                              <div className="flex flex-col items-center gap-3 text-slate-200">
                                 <UserIcon size={48} strokeWidth={1} />
                                 <p className="font-bold text-[9px] uppercase tracking-widest">Upload Photo</p>
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Metric Rating</label>
                          <div className="flex justify-center gap-3">
                             {[1, 2, 3, 4, 5].map(star => (
                               <button 
                                 key={star} 
                                 onClick={() => setEditingTestimonial({...editingTestimonial, rating: star})}
                                 className={`transition-all ${editingTestimonial.rating >= star ? "text-amber-400 scale-110" : "text-slate-100"}`}
                               >
                                 <Star size={32} fill={editingTestimonial.rating >= star ? "currentColor" : "none"} strokeWidth={2.5} />
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Client Legal Name</label>
                          <input 
                             type="text" 
                             value={editingTestimonial.name}
                             placeholder="Nama Lengkap Klien"
                             onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                             className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-base focus:bg-white focus:border-slate-200 transition-all"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Operational Role</label>
                          <input 
                             type="text" 
                             value={editingTestimonial.role}
                             placeholder="e.g. CEO of Company"
                             onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                             className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-semibold text-base focus:bg-white focus:border-slate-200 transition-all"
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Experience Narrative</label>
                          <textarea 
                             value={editingTestimonial.content}
                             placeholder="Tuliskan pengalaman klien..."
                             onChange={(e) => setEditingTestimonial({...editingTestimonial, content: e.target.value})}
                             className="w-full px-8 py-8 bg-slate-50 border border-transparent rounded-[2rem] outline-none font-medium text-lg leading-relaxed focus:bg-white focus:border-slate-200 h-64 transition-all resize-none"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/20 flex justify-end gap-4">
                 <button 
                   onClick={() => setEditingTestimonial(null)}
                   className="px-8 py-3 text-slate-500 font-bold text-[12px] hover:text-slate-900 transition-all"
                 >
                   Discard
                 </button>
                 <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="px-12 py-3 bg-slate-900 text-white rounded-xl font-bold text-[12px] flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50"
                 >
                   {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                   {isSaving ? "Synchronizing..." : "Commit Registry"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
