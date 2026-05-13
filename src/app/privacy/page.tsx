import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-on-background transition-colors mb-12 font-medium">
          <ArrowLeft size={18} /> Kembali ke Beranda
        </Link>
        
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Kebijakan Privasi</h1>
            <p className="text-secondary text-lg">Terakhir diperbarui: 13 Mei 2026</p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-on-surface/80 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">1. Pengumpulan Informasi</h2>
              <p>Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami saat melakukan pemesanan layanan, termasuk nama, alamat email, nomor telepon, dan detail proyek Anda.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">2. Penggunaan Informasi</h2>
              <p>Informasi yang kami kumpulkan digunakan untuk memproses pesanan Anda, memberikan pembaruan status proyek melalui dashboard track, dan berkomunikasi dengan Anda mengenai layanan kami.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">3. Keamanan Data</h2>
              <p>Kami mengimplementasikan langkah-langkah keamanan teknis yang sesuai untuk melindungi data pribadi Anda dari akses yang tidak sah, perubahan, atau penghapusan.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface">4. Hak Anda</h2>
              <p>Anda berhak untuk mengakses, memperbaiki, atau meminta penghapusan data pribadi Anda yang kami simpan di sistem kami kapan saja melalui kontak admin kami.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
