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
  Download,
  Inbox,
  AlertCircle,
  ChevronRight,
  Send,
  MessageSquare
} from "lucide-react";

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

    const channel = supabase
      .channel('realtime_messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'SiteMessage' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
    link.setAttribute("download", `mitralabs_inbox_${new Date().toISOString().split('T')[0]}.csv`);
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
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
           <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">Inquiries.</h2>
           <p className="text-slate-500 font-medium mt-3 text-lg">Pantau dan kelola semua pesan masuk dari calon klien Anda.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-white px-8 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-black">
                 <Inbox size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Inbox</p>
                 <h4 className="text-xl font-black text-slate-900 leading-none">{totalCount}</h4>
              </div>
           </div>
           <button 
             onClick={downloadCSV}
             className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20"
           >
              <Download size={18} /> Export Data
           </button>
        </div>
      </div>

      {/* Main Inbox Interface */}
      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden min-h-[700px] flex flex-col lg:flex-row">
        
        {/* Messages List Panel */}
        <div className="w-full lg:w-[450px] border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="p-8 border-b border-slate-100 bg-white">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Cari pesan atau nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:border-primary font-bold text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 opacity-20">
                <Loader2 className="animate-spin mb-4" size={48} />
                <p className="font-black uppercase tracking-widest text-xs text-center">Syncing Inbox...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-24 opacity-30 space-y-4">
                 <Mail className="mx-auto" size={64} />
                 <p className="font-black uppercase tracking-widest text-xs">Inbox Kosong</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`w-full text-left p-8 rounded-[2.5rem] transition-all flex gap-6 group relative overflow-hidden ${
                    selectedMsg?.id === msg.id 
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30 scale-[1.02] z-10" 
                      : "bg-white border border-slate-100 hover:border-primary hover:shadow-lg"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-black text-xl ${
                    selectedMsg?.id === msg.id ? "bg-white/10" : "bg-primary/5 text-primary"
                  }`}>
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black truncate pr-4 text-sm uppercase tracking-tight">{msg.name}</h4>
                      <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${
                        selectedMsg?.id === msg.id ? "text-white/40" : "text-slate-300"
                      }`}>
                         {new Date(msg.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <p className={`text-xs font-medium truncate ${
                      selectedMsg?.id === msg.id ? "text-white/60" : "text-slate-400"
                    }`}>
                      {msg.message}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Page {page} of {totalPages}</span>
               <div className="flex gap-3">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl disabled:opacity-30 hover:bg-slate-900 hover:text-white transition-all"
                  >
                     <ChevronRight size={18} className="rotate-180" />
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl disabled:opacity-30 hover:bg-slate-900 hover:text-white transition-all"
                  >
                     <ChevronRight size={18} />
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Message Content Panel */}
        <div className="flex-1 bg-white relative">
          {selectedMsg ? (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-10 duration-500">
               {/* Detail Header */}
               <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-primary text-on-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 font-black text-2xl">
                        {selectedMsg.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">{selectedMsg.name}</h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mt-2">
                          <span className="flex items-center gap-1"><Mail size={12} /> {selectedMsg.email}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {new Date(selectedMsg.created_at).toLocaleString('id-ID')}</span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => deleteMessage(selectedMsg.id)}
                    className="p-5 bg-white border border-slate-200 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                  >
                    <Trash2 size={24} />
                  </button>
               </div>

               {/* Detail Body */}
               <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                  <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-125 transition-transform duration-1000">
                        <MessageSquare size={180} />
                     </div>
                     <div className="flex items-center gap-3 mb-8 text-primary opacity-50 font-black text-[10px] uppercase tracking-[0.2em]">
                        <MessageCircle size={14} /> User Inquiry Content
                     </div>
                     <p className="text-2xl font-medium leading-relaxed text-slate-800 relative z-10 whitespace-pre-line">
                        {selectedMsg.message}
                     </p>
                  </div>
               </div>

               {/* Detail Actions */}
               <div className="p-12 border-t border-slate-100 bg-slate-50/50 flex gap-6">
                  <a 
                    href={`mailto:${selectedMsg.email}`}
                    className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20"
                  >
                     <Send size={20} /> Respond via Email
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Halo ${selectedMsg.name}, kami dari Mitralabs ingin merespon pesan Anda: "${selectedMsg.message.substring(0, 50)}..."`)}`}
                    target="_blank"
                    className="flex-1 py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20"
                  >
                     <MessageCircle size={20} /> Chat via WhatsApp
                  </a>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-20 space-y-6">
               <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
                  <Inbox size={64} />
               </div>
               <div>
                 <h3 className="text-3xl font-black uppercase tracking-widest">Select Inquiry</h3>
                 <p className="font-bold text-sm">Pilih pesan di sebelah kiri untuk membaca detail</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
