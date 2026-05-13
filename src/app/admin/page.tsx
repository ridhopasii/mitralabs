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
  CreditCard,
  DollarSign,
  PieChart as PieChartIcon,
  Clock,
  AlertCircle,
  TrendingDown,
  Layers,
  Search,
  LayoutDashboard,
  Users,
  Send,
  X,
  Type,
  Settings,
  ArrowDownRight,
  Briefcase,
  History,
  Terminal
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from "recharts";

const COLORS = ['#0F172A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminPage() {
  const { data: globalData } = useData();
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [projectChats, setProjectChats] = useState<any[]>([]);
  const [activeSupportChat, setActiveSupportChat] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, leadsRes, chatsRes] = await Promise.all([
        fetch('/api/admin/stats').then(res => res.json()),
        supabase.from("SiteMessage").select("*").order("created_at", { ascending: false }).limit(5),
        fetch('/api/admin/chats').then(res => res.json())
      ]);

      setStats(statsRes);
      setRecentLeads(leadsRes.data || []);
      setProjectChats(chatsRes || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
  }, []);

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeSupportChat) return;

    setIsReplying(true);
    try {
      const res = await fetch('/api/admin/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeSupportChat.project_id,
          message: replyMessage.trim()
        })
      });

      if (!res.ok) throw new Error("Gagal mengirim balasan");

      setReplyMessage("");
      fetchDashboardData(); // Refresh to see new message
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsReplying(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Command Header - Premium Apple Style */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden bg-slate-900 rounded-[4rem] p-16 lg:p-20 shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -mr-64 -mt-64 animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
          <div className="space-y-10">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Mitra Intelligence Engine v2.0</span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-white leading-[0.9]">
                Control <br /> <span className="text-primary italic">Everything.</span>
              </h1>
              <p className="text-xl text-white/50 font-medium max-w-xl leading-relaxed">
                Platform operasional Mitralabs berjalan optimal. Semua sistem sinkron dan siap untuk ekspansi pasar.
              </p>
            </div>

            <div className="flex gap-6">
               <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-all cursor-default">
                  <div className="text-emerald-400"><ShieldCheck size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Security</p>
                    <p className="text-sm font-bold text-white">Active</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-white/10 transition-all cursor-default">
                  <div className="text-blue-400"><Zap size={24} /></div>
                  <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Latency</p>
                    <p className="text-sm font-bold text-white">24ms</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
             {[
               { label: "Market Status", value: "Aggressive", color: "text-emerald-400", bg: "bg-emerald-400/10" },
               { label: "Data Stream", value: "Real-time", color: "text-primary", bg: "bg-primary/10" },
               { label: "Uptime", value: "99.9%", color: "text-blue-400", bg: "bg-blue-400/10" },
               { label: "Load", value: "Normal", color: "text-amber-400", bg: "bg-amber-400/10" },
             ].map((m, i) => (
               <div key={i} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[160px] hover:bg-white/10 transition-all">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">{m.label}</p>
                  <span className={`font-black text-sm uppercase tracking-[0.15em] ${m.color}`}>{m.value}</span>
               </div>
             ))}
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {loading || !stats?.summary ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 relative overflow-hidden">
               <div className="h-40 animate-pulse bg-slate-50 rounded-2xl"></div>
            </div>
          )) : [
            { label: "Total Revenue", value: formatCurrency(stats.summary.totalRevenue || 0), trend: "+12.5%", icon: DollarSign, color: "bg-emerald-500/10", iconColor: "text-emerald-500", trendUp: true },
            { label: "Pending Collection", value: formatCurrency(stats.summary.pendingRevenue || 0), trend: "+8.2%", icon: CreditCard, color: "bg-blue-500/10", iconColor: "text-blue-500", trendUp: true },
            { label: "Active Pipelines", value: stats.summary.totalBookings || 0, trend: "-2.1%", icon: Package, color: "bg-purple-500/10", iconColor: "text-purple-500", trendUp: false },
            { label: "Conversion Rate", value: `${stats.summary.conversionRate || 0}%`, trend: "+5.1%", icon: Target, color: "bg-amber-500/10", iconColor: "text-amber-500", trendUp: true },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-200/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700`}>
                  <stat.icon className={stat.iconColor} size={32} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {stat.trend}
                  {stat.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                <h3 className="text-3xl font-black tracking-tight text-slate-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modern Tool Grid - Modern & Minimalist Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
         {[
           { name: "New Invoice", icon: CreditCard, href: "/admin/booking", color: "bg-slate-900 text-white" },
           { name: "Site Engine", icon: Type, href: "/admin/konten", color: "bg-white text-slate-900" },
           { name: "Project CRM", icon: Layers, href: "/admin/crm", color: "bg-white text-slate-900" },
           { name: "Portfolio", icon: Briefcase, href: "/admin/portfolio", color: "bg-white text-slate-900" },
           { name: "Leads", icon: MessageSquare, href: "/admin/pesan", color: "bg-white text-slate-900" },
           { name: "Settings", icon: Settings, href: "/admin/settings", color: "bg-white text-slate-900" },
         ].map((action, i) => (
           <Link key={i} href={action.href}>
             <motion.div 
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.95 }}
               className={`${action.color} p-8 rounded-[2.5rem] border border-slate-200/50 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-2xl transition-all cursor-pointer group`}
             >
               <div className="group-hover:scale-110 transition-transform">
                 <action.icon size={24} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">{action.name}</span>
             </motion.div>
           </Link>
         ))}
      </div>

      {/* Intelligence & Data Row */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Analytics Hub */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-200/50 shadow-sm p-12 lg:p-16 space-y-12"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">Revenue Stream</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Growth Index • Dynamic View</p>
            </div>
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button className="px-6 py-2.5 bg-white shadow-sm text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">6 Months</button>
               <button className="px-6 py-2.5 text-slate-400 hover:text-slate-900 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest">1 Year</button>
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            {isClient && stats?.charts?.revenue ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.charts.revenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} dy={25} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94A3B8'}} tickFormatter={(v) => `Rp${v/1000000}M`} dx={-10} />
                  <Tooltip 
                    contentStyle={{borderRadius: '30px', border: 'none', boxShadow: '0 40px 80px -12px rgb(0 0 0 / 0.1)', padding: '24px'}}
                    itemStyle={{fontSize: '16px', fontWeight: 900, color: '#3B82F6'}}
                    labelStyle={{fontSize: '10px', color: '#94A3B8', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" animationDuration={2500} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 rounded-[3rem] animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Support Hub - Interaction Focus */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-[4rem] overflow-hidden flex flex-col shadow-2xl h-full min-h-[600px]">
          <div className="p-12 border-b border-white/5 flex justify-between items-center">
            <div className="space-y-1">
               <h3 className="text-2xl font-black tracking-tight">Active Support</h3>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Client Communications</p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
               <MessageSquare size={20} />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-12 space-y-8 custom-scrollbar">
            {projectChats.length > 0 ? projectChats.slice(0, 10).map((chat: any) => (
              <div key={chat.id} className={`flex flex-col ${chat.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                 <div className={`p-6 rounded-[2rem] max-w-[90%] text-sm font-medium leading-relaxed shadow-xl ${
                   chat.sender_type === 'admin' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                 }`}>
                   {chat.message}
                 </div>
                 <div className="flex items-center gap-3 mt-3 px-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{chat.sender_type === 'admin' ? 'Master Admin' : chat.project?.client?.full_name || 'Client'}</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Now</span>
                 </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-6">
                 <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <MessageSquare size={40} />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Incoming Transmissions</p>
              </div>
            )}
          </div>
          
          <div className="p-10 bg-white/5 border-t border-white/5">
             <Link href="/admin/pesan" className="w-full flex items-center justify-center gap-4 py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                Access Message Center <ArrowRight size={18} />
             </Link>
          </div>
        </div>
      </div>

      {/* Critical Insights & Leads Row */}
      <div className="grid lg:grid-cols-12 gap-10">
         {/* Milestone Tracker */}
         <div className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-200/50 shadow-sm overflow-hidden">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Milestone Hub</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Upcoming Deliverables</p>
               </div>
               <div className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center shadow-sm">
                  <Clock size={20} />
               </div>
            </div>
            <div className="p-12 space-y-6">
               {stats?.insights?.upcomingBookings?.slice(0, 3).map((b: any) => (
                 <div key={b.id} className="group flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-700">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          <span className="text-2xl font-black text-slate-900 leading-none">{new Date(b.scheduled_date).getDate()}</span>
                          <span className="text-[9px] font-black uppercase text-primary mt-1">{new Date(b.scheduled_date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-xl text-slate-900 mb-2">{b.customer_name}</h4>
                          <div className="flex items-center gap-4">
                             <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">{b.plan_name}</span>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Phase: {b.status}</span>
                          </div>
                       </div>
                    </div>
                    <ChevronRight size={24} className="text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-2" />
                 </div>
               ))}
            </div>
         </div>

         {/* Leads Intelligence Intelligence - REINSTATED */}
         <div className="lg:col-span-4 bg-white rounded-[4rem] border border-slate-200/50 shadow-sm overflow-hidden flex flex-col">
            <div className="p-12 border-b border-slate-50 flex justify-between items-center">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Recent Leads</h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">New Inquiries</p>
               </div>
               <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                  <Users size={20} />
               </div>
            </div>
            <div className="p-8 flex-grow space-y-4 overflow-y-auto">
               {recentLeads.length > 0 ? recentLeads.slice(0, 4).map((lead) => (
                 <div key={lead.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-lg transition-all group cursor-default">
                    <div className="flex items-center justify-between">
                       <h4 className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{lead.name}</h4>
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all">New</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 truncate">{lead.email}</p>
                 </div>
               )) : (
                 <div className="h-full flex items-center justify-center opacity-20 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Leads Yet</p>
                 </div>
               )}
            </div>
            <div className="p-8 bg-slate-50/50 border-t border-slate-100">
               <Link href="/admin/pesan" className="block text-center p-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  View All Leads
               </Link>
            </div>
         </div>
      </div>

      {/* Operations & Finance Row */}
      <div className="grid lg:grid-cols-12 gap-10">
         {/* Finance Protocol */}
         <div className="lg:col-span-8 bg-white rounded-[4rem] border border-slate-200/50 shadow-sm overflow-hidden">
            <div className="p-12 border-b border-rose-50 bg-rose-50/10 flex justify-between items-center">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Financial Protocol</h3>
                  <p className="text-[11px] font-black text-rose-400 uppercase tracking-[0.3em]">Payment Collection Required</p>
               </div>
               <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
                  <AlertCircle size={20} />
               </div>
            </div>
            <div className="p-12 grid sm:grid-cols-2 gap-6">
               {stats?.insights?.overdueInvoices?.slice(0, 2).map((inv: any) => (
                 <div key={inv.id} className="group flex flex-col p-8 bg-rose-50/30 rounded-[2.5rem] border border-transparent hover:border-rose-200 hover:bg-white hover:shadow-xl transition-all duration-700">
                    <div className="flex items-center gap-6 mb-6">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-rose-500 group-hover:rotate-12 transition-transform">
                          <CreditCard size={28} />
                       </div>
                       <div>
                          <h4 className="font-bold text-lg text-slate-900 truncate max-w-[120px]">{inv.client_name}</h4>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{inv.invoice_number}</p>
                       </div>
                    </div>
                    <div className="mt-auto">
                       <p className="text-[9px] font-black uppercase tracking-widest text-rose-400 mb-1">Outstanding Balance</p>
                       <p className="text-3xl font-black text-rose-600 tracking-tighter">{formatCurrency(inv.amount)}</p>
                    </div>
                 </div>
               ))}
               <div className="sm:col-span-2">
                 <Link href="/admin/invoice" className="block w-full text-center py-6 bg-rose-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4">
                    Initiate Global Collection Sequence
                 </Link>
               </div>
            </div>
         </div>

         {/* System Operational Control - REINSTATED */}
         <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group flex-grow">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10">
                        <Terminal size={24} />
                     </div>
                     <h2 className="text-2xl font-black tracking-tight">Core System</h2>
                  </div>
                  <div className="space-y-6 flex-grow">
                     <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Database Sync</span>
                        </div>
                        <p className="text-xs font-bold text-white/80">Active & Encrypted</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Operational Mode</span>
                        </div>
                        <p className="text-xs font-bold text-white/80">Aggressive Expansion</p>
                     </div>
                  </div>
                  <Link href="/admin/logs" className="block text-center mt-10 p-5 bg-white text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-[1.05] transition-all">
                     View Security Logs <History size={14} className="inline ml-2" />
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
