"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Plus, Trash2, Edit, Save, X, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { logActivity } from "@/lib/supabase";

export default function FAQAdmin() {
  const { data, updateData } = useData();
  const [faqs, setFaqs] = useState(data.faqs || []);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSave = async () => {
    let newFaqs;
    if (isEditing === 0) {
      const newId = Math.max(0, ...faqs.map(f => f.id)) + 1;
      newFaqs = [...faqs, { ...editForm, id: newId }];
      await logActivity("Add FAQ", `Menambahkan FAQ: ${editForm.question}`);
    } else {
      newFaqs = faqs.map(f => f.id === isEditing ? editForm : f);
      await logActivity("Update FAQ", `Memperbarui FAQ: ${editForm.question}`);
    }
    
    setFaqs(newFaqs);
    updateData({ ...data, faqs: newFaqs });
    setIsEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus FAQ ini?")) return;
    const f = faqs.find(item => item.id === id);
    const newFaqs = faqs.filter(item => item.id !== id);
    setFaqs(newFaqs);
    updateData({ ...data, faqs: newFaqs });
    await logActivity("Delete FAQ", `Menghapus FAQ: ${f?.question}`);
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-on-surface uppercase">Frequently Asked Questions</h1>
           <p className="text-on-surface-variant font-bold opacity-40 uppercase tracking-widest text-[10px] mt-1">Kelola bantuan dan informasi layanan</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(0);
            setEditForm({ question: "", answer: "", category: "Umum" });
          }}
          className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
        >
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      <div className="space-y-4 max-w-4xl">
        {faqs.map((f) => (
          <div key={f.id} className="bg-white rounded-[2rem] border border-surface-container-highest shadow-sm overflow-hidden group">
            <div 
              className="p-8 flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors"
              onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}
            >
               <div className="flex items-center gap-6">
                  <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shrink-0">
                     <HelpCircle size={20} />
                  </div>
                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">{f.category}</span>
                     <h3 className="font-bold text-lg text-on-surface">{f.question}</h3>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                       onClick={(e) => { e.stopPropagation(); setIsEditing(f.id); setEditForm(f); }}
                       className="p-3 bg-surface-container-low text-on-surface-variant rounded-xl hover:bg-on-surface hover:text-surface transition-all"
                     >
                       <Edit size={16} />
                     </button>
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleDelete(f.id); }}
                       className="p-3 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
                  {expandedId === f.id ? <ChevronUp size={20} className="opacity-20" /> : <ChevronDown size={20} className="opacity-20" />}
               </div>
            </div>
            
            {expandedId === f.id && (
              <div className="p-8 pt-0 border-t border-surface-container-highest animate-in slide-in-from-top-2 duration-300">
                 <p className="text-on-surface-variant leading-relaxed font-medium">
                    {f.answer}
                 </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing !== null && (
        <div className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-3xl font-black uppercase tracking-tight">
                  {isEditing === 0 ? "New FAQ" : "Edit FAQ"}
               </h2>
               <button onClick={() => setIsEditing(null)} className="p-4 bg-surface-container-low rounded-2xl text-on-surface-variant">
                  <X size={24} />
               </button>
            </div>
            
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Category</label>
                  <input 
                    value={editForm.category}
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold"
                    placeholder="e.g. Umum, Teknis, Harga"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Question</label>
                  <input 
                    value={editForm.question}
                    onChange={e => setEditForm({...editForm, question: e.target.value})}
                    className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-bold text-lg"
                  />
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Answer</label>
                  <textarea 
                    value={editForm.answer}
                    onChange={e => setEditForm({...editForm, answer: e.target.value})}
                    className="w-full px-6 py-4 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary outline-none font-medium h-40 resize-none leading-relaxed"
                  />
               </div>

               <button 
                 onClick={handleSave}
                 className="w-full py-6 bg-primary text-on-primary rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all"
               >
                  <Save size={20} /> Save FAQ
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
