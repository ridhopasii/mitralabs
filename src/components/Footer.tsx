"use client";

import Link from "next/link";
import { useData } from "@/context/DataContext";

const translateLabel = (label: string) => {
  if (!label) return "";
  const cleaned = label.trim().toLowerCase();
  if (cleaned === "home" || cleaned === "beranda") return "Beranda";
  if (cleaned === "services" || cleaned === "layanan") return "Layanan";
  if (cleaned === "about" || cleaned === "about us" || cleaned === "tentang") return "Tentang";
  if (cleaned === "contact" || cleaned === "contact us" || cleaned === "kontak") return "Kontak";
  if (cleaned === "portfolio" || cleaned === "portofolio") return "Portfolio";
  if (cleaned === "track project" || cleaned === "lacak projek" || cleaned === "track") return "Lacak Projek";
  return label;
};

export default function Footer() {
  const { data } = useData();
  const { footer, navbar } = data;

  return (
    <footer className="bg-background py-20 border-t border-outline/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
             <Link href="/" className="text-xl font-bold tracking-tight text-on-background mb-4 block">
                {navbar.logo}
             </Link>
             <p className="text-sm text-secondary font-medium leading-relaxed">
                {footer.description}
             </p>
          </div>
          <div className="md:col-span-2">
             <h4 className="text-[11px] font-bold text-on-background uppercase tracking-widest mb-6">Navigasi</h4>
             <ul className="space-y-4">
                {navbar.links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-secondary hover:text-on-background transition-colors font-medium">
                      {translateLabel(link.label)}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>
          <div className="md:col-span-2">
             <h4 className="text-[11px] font-bold text-on-background uppercase tracking-widest mb-6">Sosial</h4>
             <ul className="space-y-4">
                {footer.socials.filter(s => s.href !== '#designed-by').map((social, i) => (
                  <li key={i}>
                    <a href={social.href} target="_blank" className="text-sm text-secondary hover:text-on-background transition-colors font-medium">
                      {social.label}
                    </a>
                  </li>
                ))}
             </ul>
          </div>
          <div className="md:col-span-2">
             <h4 className="text-[11px] font-bold text-on-background uppercase tracking-widest mb-6">Klien</h4>
             <ul className="space-y-4">
                <li>
                  <Link href="/track" className="text-sm text-secondary hover:text-on-background transition-colors font-medium">
                    Lacak Projek
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-sm text-secondary hover:text-on-background transition-colors font-medium">
                    Client Area
                  </Link>
                </li>
                <li>
                  <Link href="/kontak" className="text-sm text-secondary hover:text-on-background transition-colors font-medium">
                    Bantuan
                  </Link>
                </li>
             </ul>
          </div>
          <div className="md:col-span-2">
             <h4 className="text-[11px] font-bold text-on-background uppercase tracking-widest mb-6">Legal</h4>
             <ul className="space-y-4">
                {footer.links.filter(l => l.href.includes('privacy') || l.href.includes('terms')).map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="text-sm text-secondary hover:text-on-background transition-colors font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
             </ul>
          </div>
          <div className="md:col-span-4">
             <h4 className="text-[11px] font-bold text-on-background uppercase tracking-widest mb-6">Newsletter</h4>
             <p className="text-sm text-secondary mb-6 font-medium">Dapatkan info terbaru seputar tren digital.</p>
             <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-surface-container px-5 py-3 rounded-xl outline-none text-sm w-full focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button className="bg-on-background text-background px-6 py-3 rounded-xl font-semibold text-sm">Join</button>
             </form>
          </div>
        </div>
        <div className="pt-8 border-t border-outline/5 text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
           <p className="text-xs text-secondary/60 font-medium">© {new Date().getFullYear()} {data.brand.name}. All rights reserved.</p>
            <p className="text-xs text-secondary/60 font-medium">
              {footer.socials.find(s => s.href === '#designed-by')?.label || "Dibangun dengan ☕ & cinta di Medan, Sumatera Utara."}
            </p>
        </div>
      </div>
    </footer>
  );
}
