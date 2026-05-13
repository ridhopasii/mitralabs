"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Briefcase, BookOpen, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
命中

interface SearchResult {
  type: "blog" | "portfolio" | "booking" | "faq";
  id: number;
  title: string;
  subtitle?: string;
  url: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useData();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic
  const results = React.useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const allResults: SearchResult[] = [];

    // Search blog posts
    data.blog.posts.forEach((post) => {
      if (
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
      ) {
        allResults.push({
          type: "blog",
          id: post.id,
          title: post.title,
          subtitle: post.category,
          url: `/admin/blog`,
        });
      }
    });

    // Search portfolio
    data.portfolio.projects.forEach((project) => {
      if (
        project.title.toLowerCase().includes(searchTerm) ||
        project.category.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm)
      ) {
        allResults.push({
          type: "portfolio",
          id: project.id,
          title: project.title,
          subtitle: project.category,
          url: `/admin/portfolio`,
        });
      }
    });

    // Search bookings
    data.bookings.forEach((booking) => {
      if (
        booking.customer_name.toLowerCase().includes(searchTerm) ||
        booking.customer_email.toLowerCase().includes(searchTerm) ||
        booking.service_type.toLowerCase().includes(searchTerm) ||
        booking.plan_name.toLowerCase().includes(searchTerm)
      ) {
        allResults.push({
          type: "booking",
          id: booking.id,
          title: booking.customer_name,
          subtitle: `${booking.service_type} - ${booking.plan_name}`,
          url: `/admin/booking`,
        });
      }
    });

    // Search FAQs
    data.faqs.forEach((faq) => {
      if (
        faq.question.toLowerCase().includes(searchTerm) ||
        faq.answer.toLowerCase().includes(searchTerm)
      ) {
        allResults.push({
          type: "faq",
          id: faq.id,
          title: faq.question,
          subtitle: faq.category,
          url: `/admin/faq`,
        });
      }
    });

    return allResults.slice(0, 10); // Limit to 10 results
  }, [query, data]);

  const handleResultClick = (url: string) => {
    router.push(url);
    setIsOpen(false);
    setQuery("");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <BookOpen className="w-4 h-4" />;
      case "portfolio":
        return <Briefcase className="w-4 h-4" />;
      case "booking":
        return <FileText className="w-4 h-4" />;
      case "faq":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg group">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Command + K to search everything..."
          className="w-full pl-14 pr-12 py-4 bg-slate-100 border-none rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-slate-200 font-bold text-sm transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown with Glassmorphism */}
      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full mt-4 w-full bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-h-[32rem] overflow-y-auto z-[1000] custom-scrollbar p-3"
          >
            {results.length > 0 ? (
              <div className="space-y-1">
                <p className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Search Results</p>
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleResultClick(result.url)}
                    className="w-full px-5 py-4 flex items-center gap-5 hover:bg-white hover:shadow-lg rounded-2xl transition-all text-left group/item"
                  >
                    <div className="w-10 h-10 bg-slate-100 group-hover/item:bg-slate-900 group-hover/item:text-white rounded-xl flex items-center justify-center text-slate-500 transition-colors">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate tracking-tight">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest truncate mt-0.5">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover/item:text-slate-900 transition-colors">
                      {result.type}
                    </div>
                  </button>
                ))}
              </div>
            ) : query && (
              <div className="p-12 text-center space-y-4 opacity-30">
                <Search size={48} className="mx-auto" strokeWidth={1} />
                <p className="text-[11px] font-black uppercase tracking-widest">No matching records found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
