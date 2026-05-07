"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useData } from "@/context/DataContext";
import ThemeToggle from "./ThemeToggle";

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "glass-apple shadow-apple py-3" : "bg-transparent py-6"}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center antialiased">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-on-background flex items-center gap-2 group">
             <div className="w-7 h-7 bg-on-background text-background rounded-lg flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-105">
                M
             </div>
             <span>Mitralabs</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[12px] font-medium text-secondary">
            {navbar.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-on-background ${isActive ? "text-on-background" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-on-background text-background px-6 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-all"
            >
              {navbar.buttonText}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-on-surface"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-full bg-background transition-transform duration-500 flex flex-col items-center justify-center gap-10 ${
            mobileOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navbar.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-4xl font-semibold tracking-tight text-on-background"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={waUrl}
            target="_blank"
            className="mt-10 bg-on-background text-background px-10 py-4 rounded-full text-lg font-semibold"
          >
            {navbar.buttonText}
          </a>
        </div>
      </div>
    </>
  );
}
