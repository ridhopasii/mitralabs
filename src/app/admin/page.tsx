"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  ArrowRight, 
  ArrowUpRight, 
  Package, 
  Calendar, 
  Loader2, 
  History,
  TrendingUp,
  Target,
  FileText,
  Activity,
  Zap,
  Globe,
  Plus,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  MousePointer2,
  Clock
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const { data } = useData();
  const [counts, setCounts] = useState({ messages: 0, projects: 0, invoices: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { count: msgCount } = await supabase
          .from("SiteMessage")
          .select("*", { count: "exact", head: true });

        const { count: invCount } = await supabase
          .from("Invoice")
          .select("*", { count: "exact", head: true });

        const { data: leads } = await supabase
          .from("SiteMessage")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setCounts({ 
          messages: msgCount || 0, 
          projects: data.portfolio.projects.length,
          invoices: invCount || 0
        });
        setRecentLeads(leads || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [data.portfolio.projects.length]);

  const stats = [
    { label: "Total Leads", value: counts.messages, icon: MessageSquare, trend: "+12%", color: "bg-indigo-500" },
    { label: "Proyek Aktif", value: counts.projects, icon: Package, trend: "Growth", color: "bg-emerald-500" },
    { label: "Total Invoices", value: counts.invoices, icon: FileText, trend: "New", color: "bg-amber-500" },
    { label: "Success Rate", value: "98%", icon: Target, trend: "+2%", color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3.5rem] p-12 lg:p-16 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/10">
              <Sparkles className="text-amber-400" size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Welcome back, Administrator</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9]">
              Command <br className="hidden lg:block" /> <span className="text-primary">Center.</span>
            </h1>
            <p className="text-lg text-white/50 font-medium max-w-md">Monitor aktivitas website Mitralabs dan kelola pertumbuhan bisnis Anda dari satu tempat.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Server Status</p>
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  <span className="font-bold text-sm uppercase">Healthy</span>
                </div>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Sync Time</p>
                <div className="flex items-center gap-2 text-primary">
                  <Clock size={16} />
                  <span className="font-bold text-sm uppercase">Realtime</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-current/20 group-hover:rotate-12 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                  {stat.trend}
                </span>
                <Activity size={14} className="text-slate-100 mt-2" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <h3 className="text-4xl font-black tracking-tighter text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Activity / Leads */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden h-full">
            <div className="p-10 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Aktivitas Leads</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Interaksi terbaru dari calon klien</p>
              </div>
              <Link href="/admin/pesan" className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="p-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-20">
                   <Loader2 className="animate-spin text-primary mb-4" size={48} />
                   <p className="font-black text-[10px] uppercase tracking-widest">Synchronizing...</p>
                </div>
              ) : recentLeads.length > 0 ? (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="group flex items-center justify-between p-6 rounded-3xl border border-slate-50 hover:bg-slate-50 transition-all hover:shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-lg text-slate-900 line-clamp-1">{lead.name}</h4>
                          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Globe size={12} /> {lead.email}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                      <Link href="/admin/pesan" className="w-12 h-12 bg-white border border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                        <ArrowUpRight size={20} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center space-y-4">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                    <MessageSquare size={40} />
                   </div>
                   <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Belum ada pesan masuk hari ini</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-10 rounded-[3.5rem] shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/10">
                    <ShieldCheck size={32} className="text-indigo-200" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tighter mb-4 leading-none">Security <br /> & Logs</h2>
                 <p className="text-indigo-100/60 font-medium text-sm mb-8">Tinjau aktivitas sistem dan pastikan semua data tersinkronisasi sempurna.</p>
                 <Link href="/admin/logs" className="flex items-center justify-between p-5 bg-white rounded-2xl text-indigo-900 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                    Check Logs <ChevronRight size={18} />
                 </Link>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                    <Zap size={20} />
                 </div>
                 <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                 <Link href="/admin/portfolio" className="flex items-center justify-between p-5 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all group">
                    <div className="flex items-center gap-4">
                      <Plus size={18} /> New Project
                    </div>
                    <MousePointer2 size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                 </Link>
                 <Link href="/admin/blog" className="flex items-center justify-between p-5 bg-slate-50 hover:bg-primary hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all group">
                    <div className="flex items-center gap-4">
                      <FileText size={18} /> New Article
                    </div>
                    <MousePointer2 size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                 </Link>
                 <Link href="/" target="_blank" className="flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all group">
                    <div className="flex items-center gap-4">
                      <Globe size={18} /> Live Website
                    </div>
                    <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-all" />
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
