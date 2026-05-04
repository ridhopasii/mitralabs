"use client";

import { useState } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";

export default function Footer() {
  const { data } = useData();
  const { footer, navbar } = data;
  const [loading, setLoading] = useState(false);

  return (
    <footer className="bg-surface-container-low border-t border-surface-container-highest">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 font-body text-sm text-on-surface-variant">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="font-bold text-on-background text-2xl font-display tracking-tighter">
            {navbar.logo}.id
          </Link>
          <p>© 2024 {navbar.logo}.id. {footer.description}</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-12 flex-1">
           <div className="flex flex-col gap-4 min-w-[200px]">
              <h4 className="font-black text-on-surface text-[10px] uppercase tracking-widest">Navigation</h4>
              {footer.links.map((link, i) => (
                <Link key={i} href={link.href} className="text-on-surface-variant hover:text-primary transition-colors font-bold">
                  {link.label}
                </Link>
              ))}
           </div>
           
           <div className="flex flex-col gap-6 max-w-sm">
              <h4 className="font-black text-on-surface text-[10px] uppercase tracking-widest">Newsletter</h4>
              <p className="text-xs opacity-60 font-medium">Dapatkan tips digital marketing & info promo terbaru.</p>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  // Future: add to supabase newsletter_subs
                  alert(`Terima kasih! ${email} telah terdaftar.`);
                  setLoading(false);
                  form.reset();
                }}
                className="flex gap-2"
              >
                 <input 
                   name="email"
                   type="email" 
                   placeholder="Email anda..." 
                   required
                   disabled={loading}
                   className="bg-white border border-surface-container-highest rounded-xl px-4 py-3 text-xs outline-none focus:border-primary flex-1 font-bold"
                 />
                 <button 
                  disabled={loading}
                  className="bg-on-surface text-surface px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                 >
                    {loading ? "..." : "Join"}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </footer>
  );
}
