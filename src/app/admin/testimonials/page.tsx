"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Star, Plus, Trash2, Edit, Save, X, Image as ImageIcon, Quote } from "lucide-react";
import { logActivity } from "@/lib/supabase";

export default function TestimonialsAdmin() {
  const { data, updateData } = useData();
  const [testimonials, setTestimonials] = useState(data.testimonials || []);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    setTestimonials(data.testimonials || []);
  }, [data.testimonials]);

  const handleSave = async () => {
    let newTestimonials;
    if (isEditing === 0) {
      const newId = Math.max(0, ...testimonials.map(t => t.id)) + 1;
      newTestimonials = [...testimonials, { ...editForm, id: newId }];
      await logActivity("Add Testimonial", `Menambahkan testimonial dari ${editForm.name}`);
    } else {
      newTestimonials = testimonials.map(t => t.id === isEditing ? editForm : t);
      await logActivity("Update Testimonial", `Memperbarui testimonial ${editForm.name}`);
    }
    
    setTestimonials(newTestimonials);
    updateData({ ...data, testimonials: newTestimonials });
    setIsEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus testimonial ini?")) return;
    const t = testimonials.find(item => item.id === id);
    const newTestimonials = testimonials.filter(item => item.id !== id);
    setTestimonials(newTestimonials);
    updateData({ ...data, testimonials: newTestimonials });
    await logActivity("Delete Testimonial", `Menghapus testimonial dari ${t?.name}`);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-on-surface uppercase">Testimonials</h1>
           <p className="text-on-surface-variant font-bold opacity-40 uppercase tracking-widest text-[10px] mt-1">Kelola feedback dari klien</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(0);
            setEditForm({ name: "", role: "", content: "", rating: 5, image: "" });
          }}
          className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white p-10 rounded-[3rem] border border-surface-container-highest shadow-premium relative group">
            <div className="flex justify-between items-start mb-8">
               <div className="w-16 h-16 rounded-2xl overflow-hidden border border-surface-container-highest">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setIsEditing(t.id); setEditForm(t); }}
                    className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-on-surface hover:text-surface transition-all"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="p-3 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
            </div>
            
            <div className="flex gap-1 mb-4 text-yellow-500">
               {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            
            <p className="text-sm font-medium text-on-surface-variant italic mb-8 leading-relaxed">
               "{t.content}"
            </p>
            
            <div className="pt-6 border-t border-surface-container-highest">
               <h4 className="font-black text-on-surface">{t.name}</h4>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing !== null && (
        <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black uppercase tracking-tight">
                  {isEditing === 0 ? "New Testimonial" : "Edit Testimonial"}
               </h2>
               <button onClick={() => setIsEditing(null)} className="p-4 bg-surface-container-low rounded-2xl text-on-surface-variant">
                  <X size={24} />
               </button>
            </div>
            
            <div className="space-y-8">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Client Name</label>
                     <input 
                       value={editForm.name}
                       onChange={e => setEditForm({...editForm, name: e.target.value})}
                       className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Role / Company</label>
                     <input 
                       value={editForm.role}
                       onChange={e => setEditForm({...editForm, role: e.target.value})}
                       className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Content</label>
                  <textarea 
                    value={editForm.content}
                    onChange={e => setEditForm({...editForm, content: e.target.value})}
                    className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-medium h-32 resize-none"
                  />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Image URL</label>
                     <input 
                       value={editForm.image}
                       onChange={e => setEditForm({...editForm, image: e.target.value})}
                       className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Rating (1-5)</label>
                     <input 
                       type="number" min="1" max="5"
                       value={editForm.rating}
                       onChange={e => setEditForm({...editForm, rating: parseInt(e.target.value)})}
                       className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                     />
                  </div>
               </div>

               <button 
                 onClick={handleSave}
                 className="w-full py-6 bg-primary text-on-primary rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                  <Save size={20} /> Save Testimonial
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
