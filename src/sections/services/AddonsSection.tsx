import { TrendingUp, Edit3, ShieldCheck, Camera, Share2, Search } from "lucide-react";

const addons = [
  {
    icon: TrendingUp,
    title: "SEO Optimization",
    desc: "Riset kata kunci komprehensif, optimasi on-page, dan backlink strategis untuk mendominasi pencarian lokal Medan.",
    price: "Mulai Rp 2.5jt",
    period: "/bln",
  },
  {
    icon: Edit3,
    title: "Content Writing",
    desc: "Artikel blog teroptimasi SEO, copywriting halaman utama, dan deskripsi produk yang persuasif oleh penulis lokal.",
    price: "Mulai Rp 300rb",
    period: "/artikel",
  },
  {
    icon: ShieldCheck,
    title: "Maintenance & Security",
    desc: "Pembaruan sistem rutin, backup berkala, perlindungan malware, dan dukungan teknis prioritas via WhatsApp.",
    price: "Mulai Rp 1jt",
    period: "/bln",
  },
  {
    icon: Camera,
    title: "Professional Photography",
    desc: "Sesi foto produk dan kantor untuk memberikan kesan visual yang lebih trust-worthy dan premium pada website.",
    price: "Mulai Rp 1.5jt",
    period: "/sesi",
  },
  {
    icon: Share2,
    title: "Social Media Integration",
    desc: "Sinkronisasi otomatis feed Instagram, Facebook Pixel, dan auto-share dari blog ke media sosial bisnis Anda.",
    price: "Mulai Rp 500rb",
    period: "/setup",
  },
  {
    icon: Search,
    title: "Google Business Setup",
    desc: "Optimasi Google Maps dan Profil Bisnis agar muncul di pencarian lokal Medan dengan rating dan ulasan bintang 5.",
    price: "Mulai Rp 750rb",
    period: "/setup",
  },
];

export default function AddonsSection() {
  return (
    <section className="py-24 bg-[#faf8ff]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="font-manrope text-4xl font-extrabold text-[#131b2e] mb-4 text-center md:text-left">
            Layanan Tambahan <span className="text-gradient">(Add-ons)</span>
          </h2>
          <p className="text-[#434656] text-center md:text-left max-w-2xl">
            Lengkapi website Anda dengan layanan operasional khusus untuk memastikan pertumbuhan bisnis yang maksimal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addons.map((addon) => (
            <div key={addon.title} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <addon.icon size={26} />
              </div>
              <h3 className="font-manrope text-xl font-bold text-[#131b2e] mb-3">{addon.title}</h3>
              <p className="text-sm text-[#434656] leading-relaxed mb-6 flex-grow">
                {addon.desc}
              </p>
              <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs font-semibold text-[#434656] uppercase tracking-wider">Estimasi</span>
                <span className="font-manrope font-extrabold text-blue-600">
                  {addon.price}<span className="text-xs font-normal text-[#434656]">{addon.period}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
