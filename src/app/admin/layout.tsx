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
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    setIsAuthorized(true);
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin", category: "Utama" },
    { name: "Site Settings", icon: Settings, href: "/admin/konten", category: "CMS" },
    { name: "Pesan Masuk", icon: MessageSquare, href: "/admin/pesan", category: "Utama" },
    { name: "Riwayat", icon: History, href: "/admin/logs", category: "Utama" },
    { name: "Layanan", icon: Briefcase, href: "/admin/layanan", category: "CMS" },
    { name: "Portfolio", icon: Package, href: "/admin/portfolio", category: "CMS" },
    { name: "Blog", icon: FileText, href: "/admin/blog", category: "CMS" },
    { name: "Testimoni", icon: Star, href: "/admin/testimonials", category: "CMS" },
    { name: "FAQ", icon: HelpCircle, href: "/admin/faq", category: "CMS" },
  ];

  const categories = ["Utama", "CMS"];

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-surface-container font-sans text-on-surface selection:bg-primary/10">
      {/* Apple-style Sidebar */}
      <aside className="w-72 bg-surface-container-low border-r border-outline/5 flex flex-col z-50 overflow-hidden">
        <div className="p-8 pb-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-on-background text-background rounded-lg flex items-center justify-center font-bold text-sm">
              M
            </div>
            <span className="font-semibold text-sm tracking-tight">Mitralabs Admin</span>
          </Link>
        </div>

        <nav className="flex-grow overflow-y-auto px-4 space-y-8 custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat} className="space-y-1">
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary mb-3">{cat}</h3>
              <div className="space-y-0.5">
                {menuItems.filter(i => i.category === cat).map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm ${
                        isActive 
                          ? "bg-white shadow-apple text-on-background" 
                          : "text-secondary hover:bg-white/50 hover:text-on-background"
                      }`}
                    >
                      <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="pt-8">
             <Link href="/" target="_blank" className="flex items-center justify-between px-4 py-3 bg-primary/5 rounded-2xl text-primary text-xs font-semibold hover:bg-primary/10 transition-all">
                Buka Website <ExternalLink size={14} />
             </Link>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-outline/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error font-semibold text-sm hover:bg-error/5 transition-all">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto h-screen p-10 bg-background">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-on-background capitalize">
              {menuItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
            <p className="text-secondary font-medium text-sm mt-1">Sistem Kontrol Minimalis Mitralabs</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-background">Ridho Robbi Pasi</p>
              <p className="text-[11px] text-secondary font-medium uppercase tracking-widest">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center font-bold text-sm">
              RP
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
           {children}
        </div>
      </main>
    </div>
  );
}
