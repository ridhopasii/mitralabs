"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function Navbar() {
  const { data } = useData();
  const { settings, navbar } = data;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin konsultasi gratis untuk website bisnis saya.")}`;

  return (
    <>
      <header className={`bg-white/80 backdrop-blur-md border-b border-surface-container shadow-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center font-body antialiased">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-on-background font-display flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-black text-sm group-hover:rotate-12 transition-transform">
              {navbar.logo[0]}
            </div>
            {navbar.logo}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
            {navbar.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all duration-300 ease-in-out ${
                    isActive
                      ? "text-primary pb-1"
                      : "text-on-surface-variant/60 hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-on-primary px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.95] shadow-lg shadow-primary/20 inline-block"
            >
              {navbar.buttonText}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-on-surface-variant"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-surface shadow-2xl transition-transform duration-500 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-10 pt-32 flex flex-col gap-8">
            {navbar.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-black tracking-tight ${
                    isActive ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 bg-primary text-on-primary px-8 py-5 rounded-2xl text-center text-lg font-black shadow-xl shadow-primary/20"
            >
              {navbar.buttonText}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
