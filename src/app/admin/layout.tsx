"use client";

import { 
  LayoutDashboard, 
  Package, 
  Briefcase, 
  Settings, 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  LogOut,
  Type,
  FileText,
  History,
  Star,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-on-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin", category: "Utama" },
    { name: "Services", icon: Briefcase, href: "/admin/layanan", category: "CMS" },
    { name: "Portfolio", icon: Package, href: "/admin/portfolio", category: "CMS" },
    { name: "Kelola Blog", icon: FileText, href: "/admin/blog", category: "CMS" },
    { name: "Editor Konten", icon: Type, href: "/admin/konten", category: "CMS" },
    { name: "Pesan Masuk", icon: MessageSquare, href: "/admin/pesan", category: "Utama" },
    { name: "Riwayat Aktivitas", icon: History, href: "/admin/logs", category: "Utama" },
    { name: "Testimonial", icon: Star, href: "/admin/testimonials", category: "Utama" },
    { name: "Kelola FAQ", icon: HelpCircle, href: "/admin/faq", category: "Utama" },
    { name: "Pengaturan", icon: Settings, href: "/admin/settings", category: "Sistem" },
  ];

  const categories = ["Utama", "CMS", "Sistem"];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col shadow-2xl z-50 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="p-8 border-b border-white/5 relative z-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center font-black text-2xl text-on-primary shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
              M
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tighter block leading-tight">Mitralabs</span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase opacity-70">Admin Core v3</span>
            </div>
          </Link>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <h3 className="px-5 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">{cat}</h3>
              <div className="space-y-1">
                {menuItems.filter(i => i.category === cat).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 font-bold relative overflow-hidden ${
                        isActive 
                          ? "bg-primary text-on-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className={`transition-transform duration-500 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                        <item.icon size={20} strokeWidth={2.5} />
                      </div>
                      <span className="relative z-10">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-error font-bold hover:bg-error/10 transition-all"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto h-screen p-10 bg-surface-container-low">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {menuItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
            <p className="text-on-surface-variant font-medium mt-1">Selamat datang kembali, Ridho.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-bold">Ridho Robbi Pasi</p>
              <p className="text-xs text-on-surface-variant font-medium">Administrator</p>
            </div>
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-bold text-on-primary shadow-lg">
              RP
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
