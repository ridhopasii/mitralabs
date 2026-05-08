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
  ChevronRight
} from "lucide-react";

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
    <div className="max-w-[1200px] mx-auto space-y-12 pb-24">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10 px-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-md">
            Pantau setiap perubahan dan aktivitas sistem secara real-time.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-grow md:flex-grow-0">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
             <input 
               type="text" 
               placeholder="Cari aktivitas..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-12 pr-6 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 font-medium text-[13px] w-full md:w-72 transition-all shadow-sm"
             />
          </div>
          <button 
            onClick={clearLogs}
            className="h-[52px] px-8 bg-white border border-slate-200 text-rose-500 rounded-2xl font-semibold text-[13px] flex items-center gap-2 hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-[0.98]"
          >
            <Trash2 size={16} /> Hapus Semua
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden mx-4">
        <div className="p-8 border-b border-slate-50 flex items-center gap-4 bg-slate-50/30">
           <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <ShieldCheck size={18} />
           </div>
           <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest leading-none">Security Registry</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Sistem Pencatatan Aktivitas Terpusat</p>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Timeline</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Aksi</th>
                <th className="px-10 py-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-32 text-center">
                     <Loader2 className="animate-spin mx-auto mb-4 text-slate-300" size={40} strokeWidth={1.5} />
                     <p className="font-bold uppercase tracking-widest text-[10px] text-slate-300">Menarik data...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-32 text-center opacity-10">
                     <Activity size={64} className="mx-auto mb-4" strokeWidth={1} />
                     <p className="font-bold uppercase tracking-widest text-[10px]">Belum ada aktivitas</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <span className="font-bold text-[13px] text-slate-900 tracking-tight">{new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="text-[11px] font-medium text-slate-400">{new Date(log.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                         log.action.includes('Update') ? 'bg-blue-50 text-blue-600 border-blue-100' :
                         log.action.includes('Delete') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                         'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                          {log.action}
                       </span>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-[13px] font-medium text-slate-600 max-w-2xl leading-relaxed">{log.detail}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
             <p className="text-[11px] font-bold text-slate-400">
                Menampilkan {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, totalCount)} dari {totalCount} log
             </p>
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
                  className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl disabled:opacity-20 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="mx-4 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-8 group">
         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <AlertCircle size={24} className="text-slate-400" />
         </div>
         <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5 uppercase tracking-widest">Informasi Sistem</h4>
            <p className="text-slate-400 text-[13px] leading-relaxed font-medium">
               Halaman ini merekam seluruh jejak perubahan yang dilakukan melalui panel kontrol. Gunakan data ini untuk audit operasional dan keamanan data.
            </p>
         </div>
      </div>
    </div>
  );
}
