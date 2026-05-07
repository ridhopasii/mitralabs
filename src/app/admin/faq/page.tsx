"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  CheckCircle2,
  Filter,
  Loader2,
  MessageCircle,
  HelpCircle as HelpIcon,
  Tag
} from "lucide-react";
import { logActivity } from "@/lib/supabase";

export default function FAQAdmin() {
  const { data, updateData } = useData();
  const [faqs, setFaqs] = useState(data.faqs || []);
  const [search, setSearch] = useState("");
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setFaqs(data.faqs || []);
  }, [data.faqs]);

  const handleSave = async () => {
    if (!editingFaq) return;
    setIsSaving(true);

    let newFaqs;
    if (editingFaq.id === 0) {
      const newId = Math.max(0, ...faqs.map((f: any) => f.id)) + 1;
      newFaqs = [...faqs, { ...editingFaq, id: newId }];
      await logActivity("Add FAQ", `Menambahkan FAQ: ${editingFaq.question}`);
    } else {
      newFaqs = faqs.map((f: any) => f.id === editingFaq.id ? editingFaq : f);
      await logActivity("Update FAQ", `Memperbarui FAQ: ${editingFaq.question}`);
    }
    
    setTimeout(() => {
      setFaqs(newFaqs);
      updateData({ ...data, faqs: newFaqs });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditingFaq(null);
    }, 800);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus FAQ ini?")) return;
    const f = faqs.find((item: any) => item.id === id);
    const newFaqs = faqs.filter((item: any) => item.id !== id);
    setFaqs(newFaqs);
    updateData({ ...data, faqs: newFaqs });
    await logActivity("Delete FAQ", `Menghapus FAQ: ${f?.question}`);
  };

  const filteredFaqs = faqs.filter((f: any) => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {showSuccess && (
        <div className="fixed top-10 right-10 z-[200] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 font-bold">
          <CheckCircle2 size={24} />
          FAQ Berhasil Diperbarui!
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-900">Support Center</h2>
          <p className="text-slate-500 font-medium mt-2 text-lg">Kelola bantuan dan informasi layanan untuk kemudahan klien Anda.</p>
        </div>
        <button 
          onClick={() => setEditingFaq({ id: 0, question: "", answer: "", category: "Umum" })}
          className="px-10 py-5 bg-primary text-on-primary rounded-[2rem] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
        >
          <Plus size={24} /> Add FAQ
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
            <HelpIcon size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total FAQ</p>
            <h4 className="text-3xl font-black text-slate-900">{faqs.length}</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Tag size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</p>
            <h4 className="text-3xl font-black text-slate-900">{Array.from(new Set(faqs.map((f: any) => f.category))).length}</h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
            <MessageCircle size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Questions</p>
            <h4 className="text-3xl font-black text-slate-900">{faqs.length}</h4>
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
              placeholder="Cari pertanyaan atau jawaban..."
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
                <th className="px-10 py-6">FAQ Details</th>
                <th className="px-6 py-6">Category</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFaqs.map((f: any) => (
                <tr key={f.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1 max-w-2xl">
                      <h5 className="font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{f.question}</h5>
                      <p className="text-sm font-medium text-slate-400 line-clamp-1">{f.answer}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                       {f.category}
                     </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingFaq(f)}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-primary hover:text-primary shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(f.id)}
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
          {filteredFaqs.length === 0 && (
            <div className="p-20 text-center space-y-4 text-slate-400">
              <Search size={48} className="mx-auto opacity-20" />
              <p className="font-bold">Tidak ada FAQ yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingFaq && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                    <HelpIcon size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                      {editingFaq.id === 0 ? "New FAQ" : "Edit FAQ"}
                    </h3>
                    <p className="text-xs text-slate-400 font-black tracking-[0.2em] uppercase mt-1">Kelola bantuan dan solusi bantuan</p>
                  </div>
               </div>
               <button onClick={() => setEditingFaq(null)} className="p-5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <X size={24} />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Category</label>
                  <input 
                     type="text" 
                     value={editingFaq.category}
                     placeholder="e.g. Umum, Teknis, Harga"
                     onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})}
                     className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-lg focus:border-primary transition-all shadow-sm"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Question</label>
                  <input 
                     type="text" 
                     value={editingFaq.question}
                     placeholder="Pertanyaan yang sering diajukan..."
                     onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                     className="w-full px-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none font-black text-xl focus:border-primary transition-all shadow-sm"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Answer</label>
                  <textarea 
                     value={editingFaq.answer}
                     placeholder="Tuliskan jawaban yang lengkap dan jelas di sini..."
                     onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                     className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] outline-none font-medium text-lg focus:border-primary h-48 transition-all shadow-sm resize-none"
                  />
               </div>
            </div>

            {/* Modal Footer */}
            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-6">
               <button 
                 onClick={() => setEditingFaq(null)}
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
                 {isSaving ? "Menyimpan..." : "Simpan FAQ"}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
