"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-12 overflow-x-auto no-scrollbar py-2">
      <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 shrink-0">
        <Home size={14} /> Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4 shrink-0">
          <ChevronRight size={14} className="opacity-20" />
          {item.href ? (
            <Link href={item.href} className="text-on-surface-variant hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-primary">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
