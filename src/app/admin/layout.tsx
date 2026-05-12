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
  Layers
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import GlobalSearch from "@/components/admin/GlobalSearch";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

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

    return () => { active = false; };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin", category: "Utama" },
    { name: "CRM Pipeline", icon: Layers, href: "/admin/crm", category: "Utama" },
    { name: "Users & Staff", icon: Users, href: "/admin/users", category: "Utama" },
    { name: "Clients", icon: Users, href: "/admin/clients", category: "Utama" },
    { name: "Order & Invoice", icon: Package, href: "/admin/booking", category: "Utama" },
    { name: "Pesan Masuk", icon: MessageSquare, href: "/admin/pesan", category: "Utama" },
    { name: "Riwayat", icon: History, href: "/admin/logs", category: "Utama" },
    { name: "Settings", icon: Settings, href: "/admin/settings", category: "Utama" },
    { name: "Site Settings", icon: Type, href: "/admin/konten", category: "CMS" },
    { name: "Layanan", icon: Briefcase, href: "/admin/layanan", category: "CMS" },
    { name: "Portfolio", icon: Package, href: "/admin/portfolio", category: "CMS" },
    { name: "Blog", icon: FileText, href: "/admin/blog", category: "CMS" },
    { name: "Dokumen", icon: FileText, href: "/admin/dokumen", category: "CMS" },
    { name: "Media", icon: Image, href: "/admin/media", category: "CMS" },
    { name: "Testimoni", icon: Star, href: "/admin/testimonials", category: "CMS" },
    { name: "FAQ", icon: HelpCircle, href: "/admin/faq", category: "CMS" },
  ];

  const categories = ["Utama", "CMS"];

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#FBFBFD] font-sans text-slate-900 selection:bg-primary/10">
      {/* Refined Minimalist Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200/60 flex flex-col z-50 overflow-hidden shadow-sm">
        <div className="p-10 pb-12">
          <Link href="/admin" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-900/10">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none mb-1">Mitralabs</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admin Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow overflow-y-auto px-6 space-y-10 custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat} className="space-y-4">
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">{cat}</h3>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === cat).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-all font-bold text-[13px] ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10 translate-x-2"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-6">
             <Link href="/" target="_blank" className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl text-slate-600 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                View Site <ExternalLink size={14} />
             </Link>
          </div>
        </nav>

        <div className="p-8 mt-auto border-t border-slate-100">
          <button onClick={handleSignOut} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 font-bold text-[13px] hover:bg-rose-50 transition-all">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Clean Main Content Area */}
      <main className="flex-grow overflow-y-auto h-screen p-10 lg:p-16">
        <header className="flex flex-col gap-6 mb-16">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {menuItems.find(i => i.href === pathname)?.name || "Overview"}
              </h1>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <p className="font-bold text-[11px] uppercase tracking-widest">System Control Interface</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{adminName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Admin</p>
              </div>
              <div className="relative group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-slate-900 shadow-sm border border-slate-200 group-hover:border-primary transition-all">
                  RP
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Global Search */}
          <GlobalSearch />
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
           {children}
        </div>
      </main>
    </div>
  );
}
