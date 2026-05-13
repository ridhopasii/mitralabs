"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function TermsPage() {
  const { data } = useData();
  const { legal } = data;

  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-on-background transition-colors mb-12 font-medium">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <FileText size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Syarat & Ketentuan</h1>
            <p className="text-secondary text-lg">Terakhir diperbarui: {legal?.lastUpdated || "13 Mei 2026"}</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-on-surface/80 leading-relaxed whitespace-pre-wrap">
            {legal?.terms ? (
              legal.terms.split('\n\n').map((paragraph, index) => (
                <section key={index} className="space-y-4">
                  <h2 className="text-2xl font-bold text-on-surface">{index + 1}. {paragraph.split('\n')[0]}</h2>
                  <p>{paragraph.split('\n').slice(1).join('\n') || paragraph}</p>
                </section>
              ))
            ) : (
              <p>Memuat konten...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
