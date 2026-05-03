import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Andi Wijaya",
    role: "Owner, Kedai Kopi Nusantara",
    content: "Mitralabs benar-benar mengubah cara saya berbisnis. Website yang mereka buat sangat cepat dan mudah digunakan pelanggan. Penjualan naik 40% dalam 2 bulan!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=andi",
  },
  {
    name: "Siska Putri",
    role: "Kepala Humas, SMA Global Medan",
    content: "Sangat profesional. Tim Mitralabs paham betul kebutuhan institusi pendidikan. Portal pendaftaran siswa baru kami sekarang jauh lebih efisien.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=siska",
  },
  {
    name: "Budi Santoso",
    role: "Direktur, Sumatera Journey",
    content: "Terima kasih tim Mitralabs! Integrasi payment gateway di website travel kami berjalan sangat lancar. Klien merasa aman bertransaksi.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=budi",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-600 text-sm font-semibold mb-6">
              💬 Testimoni Klien
            </div>
            <h2 className="font-manrope text-4xl md:text-5xl font-extrabold text-[#131b2e] leading-tight">
              Apa Kata Mereka <br /> Tentang <span className="text-gradient">Mitralabs.id</span>
            </h2>
          </div>
          <p className="text-lg text-[#434656] max-w-sm">
            Kepercayaan klien adalah prioritas utama kami. Berikut adalah cerita sukses dari mereka.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-[#faf8ff] rounded-3xl p-8 border border-gray-100 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-200 transition-colors">
                <Quote size={40} fill="currentColor" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-amber-500 fill-amber-500" />
                ))}
              </div>

              <p className="text-[#434656] leading-relaxed mb-8 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <h4 className="font-manrope font-bold text-[#131b2e] text-sm">{t.name}</h4>
                  <p className="text-xs text-indigo-500 font-semibold">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
