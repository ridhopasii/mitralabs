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
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 font-bold">
          <CheckCircle2 size={24} />
          Testimonial Berhasil Diperbarui!
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900">Social Proof</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Kelola apresiasi dan feedback dari klien-klien terbaik Anda.</p>
        </div>
        <button 
          onClick={() => setEditingTestimonial({ id: 0, name: "", role: "", content: "", rating: 5, image: "" })}
          className="px-10 py-5 bg-primary text-on-primary rounded-[2rem] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
        >
          <Plus size={24} /> Add Testimonial
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <Star size={28} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Average Rating</p>
            <h4 className="text-3xl font-black text-slate-900">
              {(testimonials.reduce((acc: number, t: any) => acc + t.rating, 0) / (testimonials.length || 1)).toFixed(1)} / 5.0
            </h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <ThumbsUp size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Review</p>
            <h4 className="text-3xl font-black text-slate-900">{testimonials.length}</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Quote size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured</p>
            <h4 className="text-3xl font-black text-slate-900">{testimonials.filter((t: any) => t.rating === 5).length}</h4>
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
              placeholder="Cari nama, role, atau testimoni..."
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
                <th className="px-10 py-6">Client Info</th>
                <th className="px-6 py-6">Content</th>
                <th className="px-6 py-6 text-center">Rating</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTestimonials.map((t: any) => (
                <tr key={t.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm border border-slate-200">
                        {t.image ? (
                          <Image src={t.image} alt={t.name} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-300">
                            <UserIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-900 group-hover:text-primary transition-colors">{t.name}</h5>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{t.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <p className="text-sm font-medium text-slate-600 line-clamp-2 italic max-w-xl">
                       "{t.content}"
                     </p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex justify-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth={3} />
                      ))}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingTestimonial(t)}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-primary hover:text-primary shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
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
          {filteredTestimonials.length === 0 && (
            <div className="p-20 text-center space-y-4 text-slate-400">
              <Search size={48} className="mx-auto opacity-20" />
              <p className="font-bold">Tidak ada testimonial yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                    <Quote size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      {editingTestimonial.id === 0 ? "Add Social Proof" : "Edit Social Proof"}
                    </h3>
                    <p className="text-xs text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Abadikan kepuasan klien Anda</p>
                  </div>
               </div>
               <button onClick={() => setEditingTestimonial(null)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
               <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Avatar</label>
                        <div className="relative group w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all mx-auto">
                          {editingTestimonial.image && <Image src={editingTestimonial.image} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                          <div className="relative z-10 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                            {isUploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <ImageIcon size={24} className="text-primary" />}
                          </div>
                          {!editingTestimonial.image && (
                            <div className="flex flex-col items-center gap-2 text-slate-200">
                               <UserIcon size={48} strokeWidth={1} />
                               <p className="font-black text-[8px] uppercase tracking-widest text-center px-4">Upload Photo</p>
                            </div>
                          )}
                          <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                     </div>

                     <div className="space-y-2 text-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Star Rating</label>
                        <div className="flex justify-center gap-3">
                           {[1, 2, 3, 4, 5].map(star => (
                             <button 
                               key={star} 
                               onClick={() => setEditingTestimonial({...editingTestimonial, rating: star})}
                               className={`transition-all ${editingTestimonial.rating >= star ? "text-amber-400 scale-125" : "text-slate-200"}`}
                             >
                               <Star size={32} fill={editingTestimonial.rating >= star ? "currentColor" : "none"} strokeWidth={3} />
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Name</label>
                        <input 
                           type="text" 
                           value={editingTestimonial.name}
                           placeholder="Nama Lengkap Klien"
                           onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                           className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-lg focus:border-primary transition-all shadow-sm"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Role / Company</label>
                        <input 
                           type="text" 
                           value={editingTestimonial.role}
                           placeholder="e.g. CEO of Mitralabs"
                           onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                           className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-lg focus:border-primary transition-all shadow-sm"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Client Experience</label>
                        <textarea 
                           value={editingTestimonial.content}
                           placeholder="Tuliskan pengalaman positif klien Anda di sini..."
                           onChange={(e) => setEditingTestimonial({...editingTestimonial, content: e.target.value})}
                           className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] outline-none font-medium text-lg focus:border-primary h-48 transition-all shadow-sm resize-none"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
               <button 
                 onClick={() => setEditingTestimonial(null)}
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
                 {isSaving ? "Menyimpan..." : "Simpan Testimonial"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
