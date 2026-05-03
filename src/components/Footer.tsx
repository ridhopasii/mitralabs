"use client";

import Link from "next/link";
import { useData } from "@/context/DataContext";

export default function Footer() {
  const { data } = useData();
  const { footer, navbar } = data;

  return (
    <footer className="bg-surface-container-low border-t border-surface-container-highest">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 font-body text-sm text-on-surface-variant">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-bold text-on-background text-2xl font-display tracking-tighter">
            {navbar.logo}.id
          </Link>
          <p>© 2024 {navbar.logo}.id. {footer.description}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {footer.links.map((link, i) => (
            <Link key={i} href={link.href} className="text-on-surface-variant hover:text-primary transition-colors font-bold">
              {link.label}
            </Link>
          ))}
          {footer.socials.map((social, i) => (
             <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant hover:text-primary transition-colors font-bold">
               {social.label}
             </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
