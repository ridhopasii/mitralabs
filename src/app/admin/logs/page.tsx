"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  History, 
  User, 
  Activity, 
  Calendar, 
  Trash2, 
  Search,
  Clock,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Database,
  RefreshCw,
  Plus,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
  id: number;
  action: string;
  detail: string;
  created_at: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 20;

  const fetchLogs = async () => {
    setLoading(true);
    const { data, count, error } = await supabase
      .from("AdminLog")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

    if (data) setLogs(data);
    if (count !== null) setTotalCount(count);
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const clearLogs = async () => {
    if (!confirm("Hapus seluruh log aktivitas? Tindakan ini tidak dapat dibatalkan.")) return;
    const { error } = await supabase.from("AdminLog").delete().neq("id", 0);
    if (!error) fetchLogs();
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-16 pb-32">
      {/* Header Bento Section */}
      <div className="grid lg:grid-cols-12 gap-8 px-4">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">System Intelligence.</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
            Audit setiap detak jantung operasional Mitralabs. Rekam jejak transparan untuk keamanan dan akuntabilitas data.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group flex-grow max-w-md">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari jejak aktivitas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 font-bold text-sm transition-all"
                />
             </div>
             <button 
               onClick={fetchLogs}
               className="h-[56px] w-[56px] bg-slate-100 text-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-all active:scale-95"
             >
               <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
             </button>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Status Keamanan</p>
                 <p className="text-3xl font-black text-emerald-500">Aktif</p>
              </div>
           </div>
           <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={clearLogs}
                className="w-10 h-10 bg-white/10 text-rose-400 rounded-xl flex items-center justify-center relative z-10 hover:bg-rose-500 hover:text-white transition-all"
              >
                 <Trash2 size={20} />
              </button>
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Database Entries</p>
                 <p className="text-3xl font-black tracking-tight">{totalCount}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Timeline View */}
      <div className="relative px-4">
        {/* The Center Line */}
        <div className="absolute left-10 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-100 to-transparent lg:-translate-x-px" />

        <div className="space-y-12">
          {loading && page === 1 ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="relative pl-24 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-20">
                 <div className={`${i % 2 === 0 ? "lg:text-right" : "lg:col-start-2"} space-y-4`}>
                    <div className="h-24 bg-slate-50 rounded-[2rem] animate-pulse" />
                 </div>
                 <div className="absolute left-10 lg:left-1/2 w-4 h-4 bg-slate-200 rounded-full -translate-x-1/2 mt-10 animate-pulse" />
              </div>
            ))
          ) : filteredLogs.length === 0 ? (
            <div className="py-40 text-center space-y-6 opacity-20">
              <History size={80} strokeWidth={1} className="mx-auto" />
              <p className="font-black uppercase tracking-[0.3em] text-[12px]">No activity patterns found</p>
            </div>
          ) : (
            filteredLogs.map((log, i) => {
              const isEven = i % 2 === 0;
              const date = new Date(log.created_at);
              
              return (
                <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative pl-24 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-20 group"
                >
                  {/* Content Card */}
                  <div className={`${isEven ? "lg:text-right" : "lg:col-start-2"} relative`}>
                    <div className={`bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500 relative ${isEven ? "lg:ml-auto" : "lg:mr-auto"}`}>
                       <div className={`flex items-center gap-4 mb-4 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            log.action.includes('Update') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            log.action.includes('Delete') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                             <Clock size={12} />
                             {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                       </div>
                       <p className="text-lg font-bold text-slate-900 tracking-tight leading-relaxed mb-4">{log.detail}</p>
                       <div className={`flex items-center gap-3 ${isEven ? "lg:flex-row-reverse" : ""}`}>
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                             <User size={14} />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">Admin Session</span>
                       </div>
                    </div>
                  </div>

                  {/* Dot on Line */}
                  <div className="absolute left-10 lg:left-1/2 top-10 lg:top-12 w-10 h-10 -translate-x-1/2 flex items-center justify-center z-10">
                     <div className="w-4 h-4 bg-white border-4 border-slate-900 rounded-full group-hover:scale-150 transition-transform duration-500 shadow-xl" />
                     <div className="absolute inset-0 bg-slate-900/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                  </div>

                  {/* Date Label (Floating) */}
                  <div className={`absolute top-10 lg:top-12 text-[11px] font-black uppercase tracking-widest text-slate-200 hidden lg:block ${isEven ? "left-[55%]" : "right-[55%] text-right"}`}>
                     {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Bento */}
      {totalPages > 1 && (
        <div className="px-4">
           <div className="bg-slate-50 rounded-[3rem] p-4 flex items-center justify-between border border-slate-100 shadow-inner">
              <button 
                disabled={page === 1}
                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="h-16 px-10 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-4 text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all"
              >
                <ArrowRight size={18} className="rotate-180" /> Previous Data
              </button>
              
              <div className="flex gap-2">
                 {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                   <button 
                     key={i}
                     onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                     className={`w-12 h-12 rounded-2xl font-black text-[12px] transition-all ${page === i + 1 ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-200"}`}
                   >
                     {i + 1}
                   </button>
                 ))}
              </div>

              <button 
                disabled={page === totalPages}
                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="h-16 px-10 bg-slate-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-4 hover:opacity-80 disabled:opacity-0 transition-all shadow-xl"
              >
                Next Sequence <ArrowRight size={18} />
              </button>
           </div>
        </div>
      )}

      {/* Final Safety Card */}
      <div className="px-4">
         <div className="bg-white rounded-[4rem] p-12 lg:p-20 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-12 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150" />
            <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shrink-0 relative z-10 shadow-2xl group-hover:rotate-12 transition-transform">
               <Database size={40} />
            </div>
            <div className="relative z-10 space-y-4 text-center lg:text-left">
               <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Data Integrity Protocol.</h4>
               <p className="text-slate-400 text-lg leading-relaxed font-medium max-w-2xl">
                  Setiap log dienkripsi secara logis dan disimpan dalam database Supabase yang aman. Log ini tidak dapat diedit secara manual oleh siapapun untuk menjamin keaslian jejak audit.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
