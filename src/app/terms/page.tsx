import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
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
            <p className="text-secondary text-lg">Terakhir diperbarui: 13 Mei 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-on-surface/80 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">1. Layanan Kami</h2>
              <p>Mitralabs menyediakan jasa pembuatan website, pengembangan sistem informasi, dan konsultasi IT. Setiap proyek akan dikerjakan berdasarkan kesepakatan dalam SPK (Surat Perjanjian Kerja).</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">2. Pembayaran</h2>
              <p>Pembayaran dilakukan dalam beberapa termin sesuai yang disepakati. Pekerjaan akan dimulai setelah Down Payment (DP) diterima. Invoice akan diterbitkan melalui sistem tracking kami.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">3. Hak Kekayaan Intelektual</h2>
              <p>Setelah pelunasan pembayaran, hak atas kode sumber dan aset desain akan diserahkan sepenuhnya kepada klien, kecuali modul-modul pihak ketiga yang memiliki lisensi tersendiri.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">4. Batasan Tanggung Jawab</h2>
              <p>Mitralabs tidak bertanggung jawab atas kerugian bisnis yang disebabkan oleh penggunaan website yang tidak semestinya oleh klien atau gangguan dari penyedia layanan hosting pihak ketiga.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
