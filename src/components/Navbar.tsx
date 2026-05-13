"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useData } from "@/context/DataContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { data } = useData();
  const { brand, navbar } = data;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/register")) return null;

  const waUrl = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Halo Mitralabs! Saya ingin konsultasi gratis untuk website bisnis saya.")}`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled || mobileOpen ? "glass-apple border-b border-outline/10 py-2" : "bg-transparent py-4"}`}>
        <div className="section-container">
          <div className="flex justify-between items-center mb-2 md:mb-0">
            {/* Logo */}
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-xl font-bold tracking-tight text-on-background flex items-center gap-2.5 group shrink-0">
               <div className="w-7 h-7 bg-on-background text-background rounded-lg flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-110">
                  {navbar.logo.charAt(0)}
               </div>
               <span className="hidden sm:inline">{navbar.logo}</span>
            </Link>

            {/* Desktop Nav Links (Hidden on Mobile) */}
            <nav className="hidden md:flex items-center gap-10 text-[13px] font-semibold text-secondary tracking-tight">
              {navbar.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors hover:text-on-background relative group ${isActive ? "text-on-background" : ""}`}
                  >
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 w-full h-px bg-on-background origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-3 md:gap-6">
              <ThemeToggle />
              
              {/* Desktop CTA */}
              <Link
                href="/pesan-sekarang"
                className="hidden md:block bg-on-background text-background px-6 py-2.5 rounded-full text-[12px] font-bold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                {navbar.buttonText}
              </Link>

              {/* Small Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col gap-1 items-end p-2 z-[110]"
                aria-label="Toggle Menu"
              >
                <div className={`h-0.5 bg-on-background transition-all duration-300 ${mobileOpen ? "w-6 rotate-45 translate-y-1.5" : "w-5"}`} />
                <div className={`h-0.5 bg-on-background transition-all duration-300 ${mobileOpen ? "opacity-0" : "w-3"}`} />
                <div className={`h-0.5 bg-on-background transition-all duration-300 ${mobileOpen ? "w-6 -rotate-45 -translate-y-1.5" : "w-4"}`} />
              </button>
            </div>
          </div>

          {/* Mobile Scrollable Nav (Visible only on Mobile) */}
          <nav className="flex md:hidden items-center gap-6 overflow-x-auto no-scrollbar py-2 -mx-2 px-2 scroll-smooth">
            {navbar.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[10px] font-bold uppercase tracking-[0.15em] shrink-0 transition-colors ${isActive ? "text-primary" : "text-secondary hover:text-on-background"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-8 px-10 transition-transform duration-500 ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navbar.links.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-4xl font-semibold tracking-tight text-on-background transition-all duration-500 delay-${idx * 100} ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/pesan-sekarang"
            onClick={() => setMobileOpen(false)}
            className={`mt-10 btn-apple w-full text-center text-lg transition-all duration-500 delay-500 ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {navbar.buttonText}
          </Link>
        </div>
      </div>
    </>
  );
}
