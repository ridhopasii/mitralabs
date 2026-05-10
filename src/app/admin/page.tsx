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
  Clock,
  Mail
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

        const { count: bookingCount } = await supabase
          .from("Booking")
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
          messages: (msgCount || 0) + (bookingCount || 0),
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

  const calculateSuccessRate = () => {
    const projects = data.portfolio.projects;
    if (projects.length === 0) return "100%";
    const completed = projects.filter(p => p.status === "Completed" || p.status === "completed").length;
    return `${Math.round((completed / projects.length) * 100)}%`;
  };

  const stats = [
    { label: "Total Leads", value: counts.messages, icon: MessageSquare, trend: "+12%", color: "bg-indigo-500" },
    { label: "Proyek Aktif", value: counts.projects, icon: Package, trend: "Growth", color: "bg-emerald-500" },
    { label: "Total Invoices", value: counts.invoices, icon: FileText, trend: "New", color: "bg-amber-500" },
    { label: "Success Rate", value: calculateSuccessRate(), icon: Target, trend: "+2%", color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Modern Dashboard Header & Welcome */}
      <div className="relative group overflow-hidden bg-white border border-slate-200/60 rounded-[2.5rem] p-10 lg:p-12 shadow-sm">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-primary/10 duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
              <Sparkles className="text-primary" size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Analytics Intelligence Active</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Command <span className="text-primary/40">Center.</span>
              </h1>
              <p className="text-base text-slate-500 font-medium max-w-lg leading-relaxed">
                Welcome back, Ridho. Your business ecosystem is performing within optimal parameters. Here's your morning overview.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col items-center justify-center text-center flex-1 lg:min-w-[160px]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">System Health</p>
                <div className="flex items-center gap-2.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="font-bold text-[10px] uppercase tracking-widest">Optimal</span>
                </div>
             </div>
             <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100/50 flex flex-col items-center justify-center text-center flex-1 lg:min-w-[160px]">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3">Network Sync</p>
                <div className="flex items-center gap-2.5 px-4 py-1.5 bg-primary/5 text-primary rounded-full border border-primary/10">
                  <Activity size={12} className="animate-pulse" />
                  <span className="font-bold text-[10px] uppercase tracking-widest">Live</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Refined Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-0 group-hover:opacity-[0.05] rounded-full blur-2xl -mr-8 -mt-8 transition-all duration-700`}></div>

            <div className="flex justify-between items-center mb-8">
              <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  {stat.trend}
                </span>
                <TrendingUp size={10} className="text-emerald-500" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
              <h3 className="text-4xl font-bold tracking-tight text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Activity & Leads Management */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 lg:p-10 flex justify-between items-center bg-slate-50/30 border-b border-slate-100">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">Conversion Intelligence</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Latest interactions and potential growth channels</p>
              </div>
              <Link href="/admin/pesan" className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary hover:border-primary transition-all shadow-sm">
                <ChevronRight size={20} />
              </Link>
            </div>

            <div className="p-8 lg:p-10 flex-grow">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                   <Loader2 className="animate-spin text-primary mb-4" size={32} />
                   <p className="font-bold text-[10px] uppercase tracking-[0.2em]">Authenticating Stream...</p>
                </div>
              ) : recentLeads.length > 0 ? (
                <div className="space-y-3">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:bg-slate-50/50 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-base shadow-lg shadow-slate-900/5 group-hover:scale-105 transition-transform">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 leading-none mb-1.5">{lead.name}</h4>
                          <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5"><Mail size={10} className="text-slate-300" /> {lead.email}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={10} className="text-slate-300" /> {new Date(lead.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white border border-slate-100 text-slate-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-5">
                   <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                    <MessageSquare size={32} strokeWidth={1.5} />
                   </div>
                   <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">No incoming leads reported today</p>
                </div>
              )}
            </div>
            <div className="p-8 lg:p-10 border-t border-slate-50 pt-0">
               <Link href="/admin/pesan" className="w-full flex justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition-all">
                  Access Communication Hub
               </Link>
            </div>
          </div>
        </div>

        {/* Global Control Center */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-125 transition-transform duration-1000"></div>
              <div className="relative z-10">
                 <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/10">
                    <ShieldCheck size={28} className="text-primary" strokeWidth={1.5} />
                 </div>
                 <h2 className="text-2xl font-bold tracking-tight mb-3">System Integrity</h2>
                 <p className="text-white/40 font-medium text-sm mb-10 leading-relaxed">Continuous monitoring and automated synchronization across global endpoints.</p>
                 <Link href="/admin/logs" className="flex items-center justify-between p-5 bg-white text-slate-900 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all">
                    Review Logs <ChevronRight size={18} />
                 </Link>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center">
                    <Zap size={20} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Direct Command</h3>
              </div>
              <div className="space-y-2">
                 {[
                   { label: "Initialize Project", href: "/admin/portfolio", icon: Plus },
                   { label: "Publish Insight", href: "/admin/blog", icon: FileText },
                   { label: "Deployment View", href: "/", icon: Globe, external: true },
                 ].map((action, idx) => (
                   <Link
                    key={idx}
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    className="flex items-center justify-between p-5 bg-slate-50 hover:bg-primary/5 hover:text-primary rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all group border border-transparent hover:border-primary/10"
                   >
                      <div className="flex items-center gap-4">
                        <action.icon size={16} strokeWidth={2} />
                        {action.label}
                      </div>
                      <MousePointer2 size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
