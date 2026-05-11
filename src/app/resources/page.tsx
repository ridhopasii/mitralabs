import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { FileText, Download, Shield, Briefcase, FileCheck, ClipboardList } from "lucide-react";

export const metadata: Metadata = {
  title: "Resource & Dokumen — Mitralabs.web.id",
  description: "Download dokumen pendukung, template brief, dan informasi legal Mitralabs.web.id untuk transparansi kerja sama.",
};

const documents = [
  {
    title: "Company Profile & Rate Card",
    desc: "Informasi lengkap mengenai profil perusahaan dan daftar harga layanan terbaru.",
    icon: Briefcase,
    file: "CompanyProfile-RateCard-Mitralabs.web.id-v2.docx",
  },
  {
    title: "Proposal Kerja Sama",
    desc: "Template proposal standar kami untuk berbagai skala project digital.",
    icon: FileText,
    file: "Proposal-Mitralabs.web.id-v2.docx",
  },
  {
    title: "SOP Pengerjaan Project",
    desc: "Standar Operasional Prosedur kami dalam menangani project dari awal hingga selesai.",
    icon: ClipboardList,
    file: "SOP-Mitralabs.web.id-v2.docx",
  },
  {
    title: "Form Brief Klien",
    desc: "Formulir untuk membantu Anda merumuskan kebutuhan project secara detail.",
    icon: FileCheck,
    file: "FormBrief-Klien-Mitralabs.docx",
  },
  {
    title: "Surat Garansi & SPK",
    desc: "Dokumen legalitas penjaminan kualitas dan surat perintah kerja (SPK) resmi.",
    icon: Shield,
    file: "SuratGaransi-Mitralabs.docx",
  },
  {
    title: "MoU & Kontrak Kerja Sama",
    desc: "Draft Memorandum of Understanding untuk landasan kerja sama jangka panjang.",
    icon: FileText,
    file: "MoU-Mitralabs.docx",
  },
  {
    title: "Surat Penawaran Harga (SPH)",
    desc: "Template surat penawaran harga resmi untuk pengajuan ke instansi atau vendor.",
    icon: FileText,
    file: "SuratPenawaranHarga-Mitralabs.docx",
  },
  {
    title: "Berita Acara Serah Terima (BAST)",
    desc: "Dokumen bukti penyelesaian project dan penyerahan aset ke tangan klien.",
    icon: FileCheck,
    file: "BeritaAcara-SerahTerima-Mitralabs.docx",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <div className="pt-32 pb-20 bg-[#faf8ff]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
             📂 Resource Klien
          </div>
          <h1 className="font-manrope text-5xl md:text-6xl font-extrabold text-[#131b2e] leading-tight mb-6">
            Transparansi <span className="text-gradient">& Dokumen</span>
          </h1>
          <p className="text-lg text-[#434656] max-w-2xl mx-auto leading-relaxed">
            Kami menyediakan akses terbuka ke dokumen legal, template, dan informasi operasional kami untuk menjamin kepercayaan dan kelancaran kerja sama.
          </p>
        </div>
      </div>

      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc) => (
              <div key={doc.title} className="p-8 bg-[#faf8ff] rounded-[32px] border border-gray-100 hover:border-blue-500 transition-all group flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <doc.icon size={26} />
                </div>
                <h3 className="font-manrope text-xl font-bold text-[#131b2e] mb-3">{doc.title}</h3>
                <p className="text-sm text-[#434656] leading-relaxed mb-8 flex-grow">
                  {doc.desc}
                </p>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DOCX / PDF</span>
                   <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all">
                      Unduh <Download size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 rounded-[40px] bg-[#0a0f1e] text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />
             <h3 className="text-2xl font-bold mb-4 relative z-10">Butuh Dokumen Lain?</h3>
             <p className="text-white/60 mb-8 max-w-xl mx-auto relative z-10">Jika Anda membutuhkan dokumen penawaran harga khusus atau proposal untuk instansi pemerintah, silakan hubungi admin kami.</p>
             <a href="/kontak" className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all relative z-10">
                Hubungi Admin
             </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
