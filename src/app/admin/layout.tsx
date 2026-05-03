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
  Type
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Editor Konten", icon: Type, href: "/admin/konten" },
    { name: "CMS Layanan", icon: Package, href: "/admin/layanan" },
    { name: "CMS Portfolio", icon: Briefcase, href: "/admin/portfolio" },
    { name: "Pengaturan", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-surface-container-lowest font-sans text-on-surface">
      {/* Sidebar */}
      <aside className="w-72 bg-inverse-surface text-inverse-on-surface flex flex-col shadow-2xl z-50">
        <div className="p-8 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl text-on-primary">
              M
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight">Mitralabs</span>
          </Link>
          <div className="mt-4 px-3 py-1 bg-primary/20 text-primary-fixed-dim rounded-full text-[10px] font-bold uppercase tracking-widest inline-block border border-primary/30">
            Admin Panel v2.0
          </div>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold ${
                  isActive 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "text-surface-variant/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {item.name}
                {isActive && <ChevronRight size={16} className="ml-auto opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <Link 
            href="/" 
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-error font-bold hover:bg-error/10 transition-all"
          >
            <LogOut size={20} />
            Keluar
          </Link>
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
