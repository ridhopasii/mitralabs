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
            <span className="font-semibold text-slate-900 text-sm tracking-tight">FAQ Disimpan.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Support Center</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">
            Kelola pusat bantuan dan informasi layanan untuk kemudahan klien Anda.
          </p>
        </div>
        
        <button 
          onClick={() => setEditingFaq({ id: 0, question: "", answer: "", category: "Umum" })}
          className="h-[60px] px-8 bg-slate-900 text-white rounded-2xl font-semibold text-[13px] flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
        >
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {[
          { label: "Total FAQ", value: faqs.length, icon: HelpIcon },
          { label: "Kategori", value: Array.from(new Set(faqs.map((f: any) => f.category))).length, icon: Tag },
          { label: "Query Aktif", value: faqs.length, icon: MessageCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
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

      {/* Main Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden mx-4">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900" size={16} />
            <input 
              type="text" 
              placeholder="Cari pertanyaan..."
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
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Pertanyaan & Jawaban</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Kategori</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFaqs.map((f: any) => (
                <tr key={f.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-2 max-w-2xl">
                      <h5 className="font-bold text-slate-900 tracking-tight leading-tight group-hover:text-slate-600 transition-colors">{f.question}</h5>
                      <p className="text-[13px] font-medium text-slate-400 line-clamp-1">{f.answer}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200/50">
                       {f.category}
                     </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setEditingFaq(f)}
                        className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(f.id)}
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
          {filteredFaqs.length === 0 && (
            <div className="py-40 text-center space-y-4 opacity-10">
              <Search size={64} className="mx-auto" strokeWidth={1} />
              <p className="font-bold uppercase tracking-widest text-[10px]">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Apple-style Modal */}
      <AnimatePresence>
        {editingFaq && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingFaq(null)}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden relative z-10 border border-slate-100"
            >
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-xl sticky top-0 z-20">
                 <div className="flex items-center gap-5">
                    <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                       <HelpIcon size={20} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                         {editingFaq.id === 0 ? "New FAQ" : "Edit FAQ"}
                       </h3>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry Bantuan</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingFaq(null)} className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-10">
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category Registry</label>
                    <input 
                       type="text" 
                       value={editingFaq.category}
                       placeholder="e.g. Umum, Teknis, Harga"
                       onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-base focus:bg-white focus:border-slate-200 transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Question String</label>
                    <input 
                       type="text" 
                       value={editingFaq.question}
                       placeholder="Pertanyaan yang sering diajukan..."
                       onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                       className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-xl outline-none font-bold text-lg tracking-tight focus:bg-white focus:border-slate-200 transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Answer Narrative</label>
                    <textarea 
                       value={editingFaq.answer}
                       placeholder="Tuliskan jawaban yang lengkap..."
                       onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                       className="w-full px-8 py-8 bg-slate-50 border border-transparent rounded-[2rem] outline-none font-medium text-lg leading-relaxed focus:bg-white focus:border-slate-200 h-64 transition-all resize-none"
                    />
                 </div>
              </div>

              <div className="px-10 py-8 border-t border-slate-50 bg-slate-50/20 flex justify-end gap-4">
                 <button 
                   onClick={() => setEditingFaq(null)}
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
