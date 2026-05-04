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
  ArrowRightCircle
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { supabase } from "@/lib/supabase";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

export default function AdminPage() {
  const { data } = useData();
  const [counts, setCounts] = useState({ messages: 0, projects: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { count: msgCount } = await supabase
          .from("site_messages")
          .select("*", { count: "exact", head: true });

        const { data: leads } = await supabase
          .from("site_messages")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: logs } = await supabase
          .from("admin_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setCounts({ 
          messages: msgCount || 0, 
          projects: data.portfolio.projects.length 
        });
        setRecentLeads(leads || []);
        setRecentLogs(logs || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [data.portfolio.projects.length]);

  const stats = [
    { label: "Total Leads", value: counts.messages, icon: MessageSquare, trend: "+12%" },
    { label: "Live Projects", value: counts.projects, icon: Package, trend: "Stable" },
    { label: "Avg. Response", value: "15m", icon: History, trend: "-5m" },
    { label: "Goal Success", value: "84%", icon: Target, trend: "+2%" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black tracking-tight text-on-surface uppercase">Dashboard Overview</h1>
           <p className="text-on-surface-variant font-bold opacity-40 uppercase tracking-widest text-[10px] mt-1">Sistem Kontrol Mitralabs v2.1</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-surface-container-highest shadow-sm">
           <Calendar className="text-primary ml-4" size={20} />
           <span className="font-black text-xs uppercase tracking-widest px-4 py-3 bg-surface-container-low rounded-xl">
              {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-surface-container-highest shadow-premium hover:border-primary/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Leads & Activity */}
        <div className="lg:col-span-2 space-y-10">
          {/* Leads */}
          <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-surface-container-highest">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Leads Terbaru</h2>
                <p className="text-[10px] text-on-surface-variant font-black opacity-40 uppercase tracking-widest mt-1">Data real-time dari website</p>
              </div>
              <Link href="/admin/pesan" className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                <ArrowRight size={20} />
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-20">
                 <Loader2 className="animate-spin text-primary opacity-20" size={40} />
              </div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-6 rounded-2xl bg-surface-container-low/30 border border-transparent hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-on-surface text-surface rounded-xl flex items-center justify-center font-black">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{lead.name}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                          {lead.email}
                        </p>
                      </div>
                    </div>
                    <Link href="/admin/pesan" className="p-3 bg-white rounded-xl shadow-sm hover:scale-110 transition-transform">
                       <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-surface-container-highest">
             <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Aktivitas Sistem</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Audit log administrasi</p>
                </div>
                <Link href="/admin/logs" className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center hover:bg-on-surface hover:text-surface transition-all">
                  <History size={20} />
                </Link>
             </div>
             <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-6 p-4 rounded-2xl border border-transparent hover:bg-surface-container-low/50 transition-all">
                     <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center text-primary opacity-40">
                        <TrendingUp size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{log.detail}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1">
                           {log.action} • {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Chart & Settings */}
        <div className="space-y-10">
           {/* Analytics Chart */}
           <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-surface-container-highest">
              <div className="mb-10">
                 <h2 className="text-2xl font-black tracking-tight uppercase">Lead Growth</h2>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Lead masuk 7 hari terakhir</p>
              </div>
              <AnalyticsChart />
           </div>

           {/* Business Mode */}
           <div className="bg-inverse-surface text-inverse-on-surface rounded-[3rem] p-10 shadow-2xl flex flex-col justify-between min-h-[300px] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Target size={120} />
              </div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">Business Mode</h2>
                 <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 mb-8">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Status Saat Ini</p>
                    <div className="flex items-center gap-4">
                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_15px_#22c55e]"></div>
                       <span className="text-xl font-black tracking-tight">MODE AGRESIF</span>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    Update Mode <ArrowRightCircle size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
