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
    const headers = ["ID", "Nama", "Email", "Pesan", "Tanggal"];
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
    if (!confirm("Hapus pesan ini secara permanen?")) return;
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
    <div className="max-w-[1400px] mx-auto space-y-10 pb-24">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Inbox</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">
            Pantau dan kelola komunikasi masuk dari klien potensial Anda.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5">
              <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center">
                 <Inbox size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Pesan</p>
                 <h4 className="text-xl font-bold text-slate-900 leading-none">{totalCount}</h4>
              </div>
           </div>
           <button 
             onClick={downloadCSV}
             className="h-[60px] px-8 bg-slate-900 text-white rounded-2xl font-semibold text-[13px] flex items-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
           >
              <Download size={18} /> Export CSV
           </button>
        </div>
      </div>

      {/* Main Inbox Interface */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col lg:flex-row min-h-[700px] mx-4">
        
        {/* Messages List Panel */}
        <div className="w-full lg:w-[420px] border-r border-slate-50 flex flex-col bg-slate-50/30">
          <div className="p-8 border-b border-slate-50">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Cari pesan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-1 focus:ring-slate-200 font-medium text-[13px] transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-20">
                <Loader2 className="animate-spin mb-4" size={48} strokeWidth={1.5} />
                <p className="font-bold uppercase tracking-widest text-[10px]">Menyinkronkan...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-32 opacity-10 space-y-4">
                 <Mail className="mx-auto" size={64} strokeWidth={1} />
                 <p className="font-bold uppercase tracking-widest text-[10px]">Kotak Masuk Kosong</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMsg(msg)}
                  className={`w-full text-left p-6 rounded-2xl transition-all flex gap-5 group relative ${
                    selectedMsg?.id === msg.id 
                      ? "bg-white border border-slate-100 shadow-lg shadow-slate-900/5 ring-1 ring-slate-100" 
                      : "hover:bg-white/50 border border-transparent"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                    selectedMsg?.id === msg.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-white transition-colors"
                  }`}>
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-bold truncate pr-4 text-[13px] text-slate-900">{msg.name}</h4>
                      <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap">
                         {new Date(msg.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-[12px] font-medium truncate ${selectedMsg?.id === msg.id ? "text-slate-600" : "text-slate-400"}`}>
                      {msg.message}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-slate-50 bg-white/50 flex items-center justify-between">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Halaman {page} dari {totalPages}</span>
               <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-xl disabled:opacity-20 hover:text-slate-900 transition-all"
                  >
                     <ChevronRight size={16} className="rotate-180" />
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-xl disabled:opacity-20 hover:text-slate-900 transition-all"
                  >
                     <ChevronRight size={16} />
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Message Content Panel */}
        <div className="flex-1 bg-white relative">
          {selectedMsg ? (
            <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
               {/* Detail Header */}
               <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center font-bold text-xl">
                        {selectedMsg.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{selectedMsg.name}</h2>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-400 mt-1.5">
                          <span className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Mail size={13} /> {selectedMsg.email}</span>
                          <span className="flex items-center gap-2"><Clock size={13} /> {new Date(selectedMsg.created_at).toLocaleString('id-ID')}</span>
                        </div>
                     </div>
                  </div>
                  <button 
                    onClick={() => deleteMessage(selectedMsg.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={18} />
                  </button>
               </div>

               {/* Detail Body */}
               <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
                  <div className="max-w-3xl mx-auto space-y-10">
                    <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 relative group">
                       <div className="flex items-center gap-3 mb-8 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                          <MessageCircle size={14} /> Pesan Masuk
                       </div>
                       <p className="text-[15px] font-medium leading-relaxed text-slate-700 whitespace-pre-line tracking-tight">
                          {selectedMsg.message}
                       </p>
                    </div>
                  </div>
               </div>

               {/* Detail Actions */}
               <div className="p-10 border-t border-slate-50 bg-white flex gap-4">
                  <a 
                    href={`mailto:${selectedMsg.email}`}
                    className="flex-1 h-[56px] bg-slate-900 text-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/5"
                  >
                     <Send size={18} /> Balas via Email
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Halo ${selectedMsg.name}, kami dari Mitralabs ingin merespon pesan Anda: "${selectedMsg.message.substring(0, 50)}..."`)}`}
                    target="_blank"
                    className="flex-1 h-[56px] bg-emerald-500 text-white rounded-xl font-semibold text-[13px] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/5"
                  >
                     <MessageCircle size={18} /> Hubungi via WhatsApp
                  </a>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-10 space-y-6">
               <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
                  <Inbox size={48} strokeWidth={1} />
               </div>
               <div className="max-w-xs">
                 <h3 className="text-xl font-bold uppercase tracking-widest">Pilih Pesan</h3>
                 <p className="font-medium text-sm mt-2 leading-relaxed">Klik salah satu pesan di samping untuk meninjau detail komunikasi.</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
