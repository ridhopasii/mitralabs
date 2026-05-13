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
  X
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

  const dashboardStats = stats ? [
    { label: "Gross Revenue", value: formatCurrency(stats.summary.totalRevenue), icon: DollarSign, trend: "+12.5%", color: "bg-slate-900", iconColor: "text-emerald-400" },
    { label: "Accounts Receivable", value: formatCurrency(stats.summary.pendingRevenue), icon: CreditCard, trend: "Pending", color: "bg-slate-900", iconColor: "text-amber-400" },
    { label: "Active Pipelines", value: stats.summary.totalBookings, icon: Layers, trend: "Growth", color: "bg-slate-900", iconColor: "text-blue-400" },
    { label: "Conversion Rate", value: `${stats.summary.conversionRate}%`, icon: Target, trend: "+2.1%", color: "bg-slate-900", iconColor: "text-rose-400" },
  ] : [];

  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Command Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 lg:p-16 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -ml-40 -mb-40"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-xl">
              <Sparkles className="text-primary animate-spin-slow" size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Intelligence Command Active</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight">
                Operational <span className="text-primary">Insight.</span>
              </h1>
              <p className="text-lg text-white/40 font-medium max-w-xl leading-relaxed">
                Welcome back, Ridho. The Mitralabs ecosystem is operating at peak efficiency with a <span className="text-emerald-400 font-bold">98% uptime</span> and rising profitability.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
             <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center flex-1 lg:min-w-[180px] shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Market Position</p>
                <div className="flex items-center gap-3 px-5 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                  <span className="font-black text-[11px] uppercase tracking-widest">Growth</span>
                </div>
             </div>
             <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center flex-1 lg:min-w-[180px] shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Data Stream</p>
                <div className="flex items-center gap-3 px-5 py-2 bg-primary/10 text-primary rounded-full border border-primary/20">
                  <Activity size={14} className="animate-pulse" />
                  <span className="font-black text-[11px] uppercase tracking-widest">Real-time</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {loading ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
               <div className="flex justify-between items-start mb-10">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl animate-pulse" />
                  <div className="w-16 h-6 bg-slate-50 rounded-full animate-pulse" />
               </div>
               <div className="space-y-3">
                  <div className="w-24 h-3 bg-slate-50 rounded-full animate-pulse" />
                  <div className="w-32 h-8 bg-slate-50 rounded-full animate-pulse" />
               </div>
               {/* Shimmer effect */}
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
               />
            </div>
          )) : dashboardStats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-200/50 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className={stat.iconColor} size={28} strokeWidth={2} />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{stat.trend}</span>
                  <TrendingUp size={12} className="text-emerald-500" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                <h3 className="text-3xl font-black tracking-tight text-slate-900">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick Action Navigation - Workflow Optimization */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
         {[
           { name: "New Invoice", icon: CreditCard, href: "/admin/booking", color: "bg-emerald-50 text-emerald-600" },
           { name: "Add Project", icon: Package, href: "/admin/portfolio", color: "bg-blue-50 text-blue-600" },
           { name: "Update Site", icon: Type, href: "/admin/konten", color: "bg-purple-50 text-purple-600" },
           { name: "Pricing Edit", icon: DollarSign, href: "/admin/layanan", color: "bg-amber-50 text-amber-600" },
           { name: "Check Leads", icon: MessageSquare, href: "/admin/pesan", color: "bg-rose-50 text-rose-600" },
           { name: "System Config", icon: Settings, href: "/admin/settings", color: "bg-slate-50 text-slate-600" },
         ].map((action, i) => (
           <Link key={i} href={action.href}>
             <motion.div 
               whileHover={{ scale: 1.05, y: -5 }}
               whileTap={{ scale: 0.95 }}
               className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center gap-4 hover:shadow-xl transition-all cursor-pointer group"
             >
               <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                 <action.icon size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{action.name}</span>
             </motion.div>
           </Link>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200/50 shadow-premium p-10 lg:p-14 space-y-12"
        >
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Revenue Dynamics</h3>
              </div>
              <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Financial Performance Index • Last 6 Months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Monthly</button>
              <button className="px-5 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Quarterly</button>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            {isClient && stats?.charts?.revenue ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.charts.revenue}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                    dy={20} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fontWeight: 700, fill: '#94A3B8'}} 
                    tickFormatter={(v) => `Rp${v/1000000}M`} 
                  />
                  <Tooltip 
                    cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '5 5' }}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px'}}
                    itemStyle={{fontSize: '14px', fontWeight: 900}}
                    labelStyle={{fontSize: '12px', color: '#94A3B8', marginBottom: '8px', fontWeight: 700}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-50 rounded-[2.5rem] animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Plan Share - Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-slate-900 text-white rounded-[3rem] p-10 lg:p-14 flex flex-col justify-between shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-2xl font-black tracking-tight">Market Share</h3>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Service Tier Utilization</p>
          </div>
          
          <div className="flex-grow flex items-center justify-center relative my-12">
            {isClient && stats?.charts?.plans ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.charts.plans}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {stats.charts.plans.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', color: 'white'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-56 h-56 rounded-full border-4 border-white/5 border-t-primary animate-spin" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <PieChartIcon className="text-primary mb-2 opacity-50" size={32} />
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Share Index</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10 pt-8 border-t border-white/5">
             {stats?.charts?.plans?.map((plan: any, i: number) => (
               <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{plan.name}</span>
                  </div>
                  <p className="text-lg font-bold ml-4">{plan.value}</p>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Insights - Critical Actions */}
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Milestone Monitor */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-[3rem] border border-slate-200/50 shadow-premium overflow-hidden"
        >
          <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">Milestone Monitor</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Upcoming Project Deliveries</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all">
              <Plus size={18} />
            </button>
          </div>
          <div className="p-10 space-y-6">
            {stats?.insights?.upcomingBookings?.length > 0 ? stats.insights.upcomingBookings.map((b: any) => (
              <div key={b.id} className="group flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="text-lg font-black text-slate-900 leading-none">{new Date(b.scheduled_date).getDate()}</span>
                    <span className="text-[8px] font-black uppercase text-slate-400">{new Date(b.scheduled_date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{b.customer_name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">{b.plan_name}</span>
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400"><Activity size={10} /> {b.status}</span>
                    </div>
                  </div>
                </div>
                <button className="p-3 bg-white border border-slate-200 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-primary hover:bg-primary hover:text-white">
                  <ArrowRight size={16} />
                </button>
              </div>
            )) : (
              <div className="text-center py-12 space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                   <Clock size={32} />
                 </div>
                 <p className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-300">All Project On Schedule</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Financial Guard */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-[3rem] border border-slate-200/50 shadow-premium overflow-hidden"
        >
          <div className="p-10 border-b border-slate-50 bg-rose-50/20 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">Financial Guard</h3>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-1">Overdue & Critical Invoices</p>
              </div>
            </div>
            <Link href="/admin/invoice" className="px-5 py-2.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 transition-all">Collect Now</Link>
          </div>
          <div className="p-10 space-y-6">
            {stats?.insights?.overdueInvoices?.length > 0 ? stats.insights.overdueInvoices.map((inv: any) => (
              <div key={inv.id} className="group flex items-center justify-between p-6 bg-rose-50/30 rounded-3xl border border-rose-100/50 hover:bg-rose-50 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-rose-500 group-hover:rotate-12 transition-transform">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{inv.client_name}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{inv.invoice_number}</span>
                      <span className="w-1 h-1 bg-rose-200 rounded-full"></span>
                      <span className="text-[10px] font-bold text-slate-400 italic">Due {new Date(inv.due_date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-rose-600 tracking-tight">
                    {formatCurrency(inv.amount)}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 space-y-4">
                 <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-200">
                   <ShieldCheck size={32} />
                 </div>
                 <p className="font-black text-[10px] uppercase tracking-[0.3em] text-emerald-300">Financial Integrity Optimal</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Activity & Operational Control Row */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Leads Intelligence */}
        <div className="lg:col-span-4 bg-white rounded-[3rem] border border-slate-200/50 shadow-premium overflow-hidden flex flex-col">
          <div className="p-10 flex justify-between items-center bg-slate-50/30 border-b border-slate-100">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center">
                  <Users size={18} />
               </div>
               <h2 className="text-lg font-black text-slate-900">Leads</h2>
            </div>
            <Link href="/admin/pesan" className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-primary transition-all">
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="p-8 flex-grow space-y-4">
            {recentLeads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-[11px] mb-1">{lead.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{lead.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Center */}
        <div className="lg:col-span-4 bg-white rounded-[3rem] border border-slate-200/50 shadow-premium overflow-hidden flex flex-col h-[500px]">
          <div className="p-10 flex justify-between items-center bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <MessageSquare size={18} />
               </div>
               <h2 className="text-lg font-black text-slate-900">Support</h2>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="p-8 flex-grow overflow-y-auto space-y-4">
            {projectChats.slice(0, 8).map((chat: any) => (
              <div key={chat.id} className={`flex flex-col ${chat.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[90%] text-[11px] font-medium shadow-sm ${
                  chat.sender_type === 'admin' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  <p>{chat.message}</p>
                </div>
                {chat.sender_type === 'client' && (
                  <button onClick={() => { setActiveSupportChat(chat); setReplyMessage(`Halo ${chat.project?.client?.full_name?.split(' ')[0] || 'Klien'}, `); }} className="text-[8px] font-black uppercase text-primary mt-1">Reply</button>
                )}
              </div>
            ))}
          </div>
          {activeSupportChat && (
            <form onSubmit={handleAdminReply} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <input type="text" value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} placeholder="Reply..." className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none" />
              <button type="submit" disabled={isReplying} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg"><Send size={14} /></button>
            </form>
          )}
        </div>

        {/* Operational Control */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10 space-y-6">
                 <ShieldCheck size={24} className="text-primary" />
                 <div>
                    <h2 className="text-xl font-black tracking-tight">System Core</h2>
                    <p className="text-white/40 font-medium text-[11px] mt-1 leading-relaxed">Encrypted data sync active.</p>
                 </div>
                 <Link href="/admin/logs" className="block text-center p-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">View Audit Logs</Link>
              </div>
           </div>

           <div className="bg-white p-10 rounded-[3rem] border border-slate-200/50 shadow-premium space-y-6">
              <div className="flex items-center gap-3">
                 <Zap size={18} className="text-primary" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Commands</h3>
              </div>
              <div className="grid gap-2">
                 {[
                   { label: "New Project", href: "/admin/portfolio", color: "hover:bg-blue-50" },
                   { label: "Dispatch Invoice", href: "/admin/invoice", color: "hover:bg-emerald-50" },
                 ].map((action, idx) => (
                   <Link key={idx} href={action.href} className={`block p-4 bg-slate-50 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all ${action.color}`}>{action.label}</Link>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
