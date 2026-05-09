"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FileText, Briefcase, BookOpen, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";

interface SearchResult {
  type: "blog" | "portfolio" | "booking" | "faq";
  id: number;
  title: string;
  subtitle?: string;
  url: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
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
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

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

    setResults(allResults.slice(0, 10)); // Limit to 10 results
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
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search blog, portfolio, bookings, FAQs..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}-${index}`}
              onClick={() => handleResultClick(result.url)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0 text-left transition-colors"
            >
              <div className="mt-1 text-gray-500 dark:text-gray-400">
                {getIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {result.title}
                </div>
                {result.subtitle && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {result.subtitle}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                {result.type}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
