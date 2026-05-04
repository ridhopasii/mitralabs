"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Mail, 
  User, 
  Calendar, 
  Trash2, 
  MessageCircle, 
  ExternalLink, 
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Loader2,
  Download
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const ITEMS_PER_PAGE = 10;

  const fetchMessages = async () => {
    setLoading(true);
    const { data, count, error } = await supabase
      .from("SiteMessage")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    if (data) setMessages(data);
    if (count !== null) setTotalCount(count);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [page]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const downloadCSV = () => {
    const headers = ["ID", "Name", "Email", "Message", "Date"];
    const rows = messages.map(m => [m.id, m.name, m.email, `"${m.message.replace(/"/g, '""')}"`, m.created_at]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `mitralabs_messages_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Hapus pesan ini permanen?")) return;
    const { error } = await supabase.from("SiteMessage").delete().eq("id", id);
    if (!error) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMsg?.id === id) setSelectedMsg(null);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={20} />
          <input
            type="text"
            placeholder="Cari pesan atau nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-surface-container-highest rounded-3xl outline-none focus:border-primary shadow-sm font-bold transition-all"
          />
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={downloadCSV}
             className="px-8 py-4 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-sm"
           >
              <Download size={16} /> Export CSV
           </button>
           <div className="bg-white px-6 py-4 rounded-2xl border border-surface-container-highest">
              <span className="font-black text-[10px] uppercase tracking-widest opacity-40">Total: {totalCount}</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-black uppercase tracking-widest text-xs">Syncing Messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-surface-container-highest">
               <Mail className="mx-auto mb-4 opacity-20" size={48} />
               <p className="font-bold text-on-surface-variant">Tidak ada pesan ditemukan.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                className={`w-full text-left p-8 rounded-[2.5rem] border transition-all flex gap-6 group relative overflow-hidden ${
                  selectedMsg?.id === msg.id 
                    ? "bg-on-surface text-surface border-on-surface shadow-2xl" 
                    : "bg-white border-surface-container-highest hover:border-primary"
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                  selectedMsg?.id === msg.id ? "bg-white/10" : "bg-primary/5 text-primary"
                }`}>
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black truncate pr-4">{msg.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 whitespace-nowrap">
                       {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm font-medium truncate opacity-60`}>
                    {msg.message}
                  </p>
                </div>
              </button>
            ))
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-surface-container-highest">
               <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Halaman {page} / {totalPages}</span>
               <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 bg-surface-container-low rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-on-surface hover:text-surface transition-all"
                  >
                     Prev
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:scale-105 transition-all shadow-sm"
                  >
                     Next
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-7">
          {selectedMsg ? (
            <div className="bg-white rounded-[3.5rem] p-12 border border-surface-container-highest shadow-premium sticky top-0 animate-in fade-in slide-in-from-right-10 duration-500">
               <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-on-primary font-black text-2xl">
                        {selectedMsg.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-3xl font-black tracking-tight">{selectedMsg.name}</h2>
                        <p className="text-on-surface-variant font-bold">{selectedMsg.email}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={() => deleteMessage(selectedMsg.id)}
                       className="p-4 bg-error/10 text-error rounded-2xl hover:bg-error hover:text-white transition-all"
                     >
                        <Trash2 size={24} />
                     </button>
                  </div>
               </div>

               <div className="bg-surface-container-low p-10 rounded-[2.5rem] mb-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                     <MessageCircle size={150} />
                  </div>
                  <p className="text-xl font-medium leading-relaxed text-on-surface relative z-10 whitespace-pre-line">
                     {selectedMsg.message}
                  </p>
               </div>

               <div className="flex flex-wrap gap-4 pt-8 border-t border-surface-container-highest">
                  <a 
                    href={`mailto:${selectedMsg.email}`}
                    className="flex-1 px-10 py-5 bg-on-surface text-surface rounded-2xl font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                  >
                     <Mail size={20} /> Reply via Email
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Halo ${selectedMsg.name}, kami dari Mitralabs ingin merespon pesan Anda: "${selectedMsg.message.substring(0, 50)}..."`)}`}
                    target="_blank"
                    className="flex-1 px-10 py-5 bg-[#25D366] text-white rounded-2xl font-black flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20"
                  >
                     <MessageCircle size={20} /> Reply via WhatsApp
                  </a>
               </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white/40 backdrop-blur-md rounded-[3.5rem] border-4 border-dashed border-surface-container-highest flex flex-col items-center justify-center text-center p-12">
               <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 opacity-20">
                  <Mail size={40} />
               </div>
               <h3 className="text-2xl font-black opacity-20 uppercase tracking-widest">Select a message to read</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
