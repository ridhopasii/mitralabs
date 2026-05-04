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
  AlertCircle
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
    if (!error) setLogs([]);
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.detail.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" size={20} />
          <input
            type="text"
            placeholder="Cari aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-surface-container-highest rounded-3xl outline-none focus:border-primary shadow-sm font-bold transition-all"
          />
        </div>
        <div className="flex gap-4">
           <button 
             onClick={fetchLogs}
             className="p-5 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-on-surface hover:text-surface transition-all"
           >
              <Clock size={20} />
           </button>
           <button 
             onClick={clearLogs}
             className="px-8 py-5 bg-error/10 text-error rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-error hover:text-white transition-all"
           >
              <Trash2 size={18} /> Clear All Logs
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-surface-container-highest shadow-premium overflow-hidden">
        <div className="p-10 border-b border-surface-container-highest bg-surface-container-low flex items-center gap-4">
           <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">Audit Logs</h2>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Rekam jejak aktivitas administrasi</p>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 border-b border-surface-container-highest">Waktu</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 border-b border-surface-container-highest">Aksi</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest opacity-40 border-b border-surface-container-highest">Detail Perubahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest">
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                     <Loader2 className="animate-spin mx-auto mb-4 text-primary" size={40} />
                     <p className="font-black uppercase tracking-widest text-xs opacity-20">Memuat riwayat...</p>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center opacity-20">
                     <Activity size={48} className="mx-auto mb-4" />
                     <p className="font-bold">Belum ada aktivitas tercatat.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-8">
                       <div className="flex flex-col">
                          <span className="font-black text-sm">{new Date(log.created_at).toLocaleTimeString()}</span>
                          <span className="text-[10px] font-bold opacity-40">{new Date(log.created_at).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="p-8">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         log.action.includes('Update') ? 'bg-blue-50 text-blue-600' :
                         log.action.includes('Delete') ? 'bg-red-50 text-red-600' :
                         'bg-green-50 text-green-600'
                       }`}>
                          {log.action}
                       </span>
                    </td>
                    <td className="p-8">
                       <p className="text-sm font-medium text-on-surface-variant max-w-xl line-clamp-2">{log.detail}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-8 border-t border-surface-container-highest bg-surface-container-low/20 flex items-center justify-between">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                Menampilkan {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, totalCount)} dari {totalCount} log
             </p>
             <div className="flex gap-3">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-6 py-3 bg-surface-container-low rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:bg-primary hover:text-white transition-all"
                >
                   Previous
                </button>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-6 py-3 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:scale-105 transition-all"
                >
                   Next
                </button>
             </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6 p-10 bg-inverse-surface text-inverse-on-surface rounded-[3rem] shadow-xl">
         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle size={32} />
         </div>
         <div>
            <h4 className="text-xl font-black mb-1">Penting</h4>
            <p className="opacity-60 text-sm leading-relaxed font-medium">
               Halaman ini hanya mencatat perubahan yang dilakukan melalui CMS. Akses langsung ke database melalui Supabase Dashboard tidak akan tercatat di sini secara otomatis.
            </p>
         </div>
      </div>
    </div>
  );
}
