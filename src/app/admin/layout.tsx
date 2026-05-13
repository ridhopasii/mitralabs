"use client";

import {
  LayoutDashboard,
  Briefcase,
  Settings,
  Package,
  LogOut,
  Type,
  FileText,
  MessageSquare,
  History,
  Star,
  HelpCircle,
  ExternalLink,
  Image,
  Users,
  Layers,
  Search,
  Bell,
  Clock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlobalSearch from "@/components/admin/GlobalSearch";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      if (!data.user) { router.replace("/login"); return; }
      // Get name from User table
      const { data: userData } = await supabase.from("User").select("full_name").eq("id", data.user.id).single();
      setAdminName(userData?.full_name || data.user.email?.split('@')[0] || "Admin");
      setIsAuthorized(true);
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => { active = false; clearInterval(timer); };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const menuItems = [
    // --- Utama / Operations ---
    { name: "Command Center", icon: LayoutDashboard, href: "/admin", category: "Operations" },
    { name: "Project Pipeline", icon: Layers, href: "/admin/crm", category: "Operations" },
    { name: "Bookings & Invoices", icon: Package, href: "/admin/booking", category: "Operations" },
    { name: "Client Registry", icon: Users, href: "/admin/clients", category: "Operations" },

    // --- Communications ---
    { name: "Pesan Masuk", icon: MessageSquare, href: "/admin/pesan", category: "Communications" },
    { name: "Blog / Artikel", icon: FileText, href: "/admin/blog", category: "Communications" },

    // --- CMS / Site Engine ---
    { name: "Site Builder", icon: Type, href: "/admin/konten", category: "Site Engine" },
    { name: "Service Plans", icon: Briefcase, href: "/admin/layanan", category: "Site Engine" },
    { name: "Portfolio", icon: Package, href: "/admin/portfolio", category: "Site Engine" },
    { name: "Testimoni", icon: Star, href: "/admin/testimonials", category: "Site Engine" },
    { name: "FAQ Library", icon: HelpCircle, href: "/admin/faq", category: "Site Engine" },

    // --- Infrastructure ---
    { name: "System & Finance", icon: Settings, href: "/admin/settings", category: "Infrastructure" },
    { name: "Media Assets", icon: Image, href: "/admin/media", category: "Infrastructure" },
    { name: "Generated Docs", icon: FileText, href: "/admin/dokumen", category: "Infrastructure" },
    { name: "Users & Staff", icon: Users, href: "/admin/users", category: "Infrastructure" },
    { name: "Audit Logs", icon: History, href: "/admin/logs", category: "Infrastructure" },
  ];

  const categories = ["Operations", "Communications", "Site Engine", "Infrastructure"];

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-primary/10">
      {/* Refined Minimalist Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200/60 flex flex-col z-50 overflow-hidden shadow-sm sticky top-0 h-screen">
        <div className="p-10 pb-12">
          <Link href="/admin" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-2xl shadow-slate-900/20 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
               <span className="relative z-10">M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight leading-none mb-1">Mitralabs</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">HQ Console</span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-grow overflow-y-auto px-8 space-y-12 custom-scrollbar pb-10">
          {categories.map((cat) => (
            <div key={cat} className="space-y-5">
              <h3 className="px-5 text-[10px] font-black uppercase tracking-[0.35em] text-slate-300 flex items-center justify-between">
                {cat}
                <ChevronRight size={10} className="opacity-0 group-hover:opacity-100" />
              </h3>
              <div className="space-y-1.5">
                {menuItems.filter(i => i.category === cat).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group relative flex items-center gap-4 px-6 py-4 rounded-[1.25rem] transition-all font-bold text-[13px] overflow-hidden ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="active-pill"
                          className="absolute inset-0 bg-slate-50 border border-slate-100 shadow-sm rounded-[1.25rem] -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900"
                      }`}>
                        <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className="flex-grow">{item.name}</span>
                      
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-8 border-t border-slate-100">
             <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                      <Clock size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Server Time</p>
                      <p className="text-xs font-black text-slate-900 tabular-nums">
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </p>
                   </div>
                </div>
                <Link href="/" target="_blank" className="flex items-center justify-between w-full px-5 py-3 bg-white rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                   Preview Site <ExternalLink size={12} />
                </Link>
             </div>
          </div>
        </nav>

        <div className="p-8 mt-auto border-t border-slate-100">
          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 font-bold text-[13px] hover:bg-rose-50 transition-all group">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
               <LogOut size={18} />
            </div>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Clean Main Content Area */}
      <main className="flex-grow overflow-y-auto h-screen">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-10 lg:px-16 py-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-10">
               <div className="space-y-1">
                 <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">
                    <LayoutDashboard size={12} />
                    <span>System Control</span>
                    <ChevronRight size={10} />
                    <span className="text-primary">{menuItems.find(i => i.href === pathname)?.name || "Overview"}</span>
                 </div>
                 <h1 className="text-2xl font-black tracking-tight text-slate-900">
                   {menuItems.find(i => i.href === pathname)?.name || "Operational Overview"}
                 </h1>
               </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="hidden xl:block">
                 <GlobalSearch />
              </div>
              
              <div className="flex items-center gap-6">
                <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-all relative">
                   <Bell size={20} />
                   <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></div>
                </button>
                
                <div className="flex items-center gap-5 p-2 pr-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="relative">
                    <div className="w-11 h-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg">
                      {adminName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-50 rounded-full"></div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-black text-slate-900 leading-tight">{adminName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Master Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 lg:p-16 max-w-7xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
