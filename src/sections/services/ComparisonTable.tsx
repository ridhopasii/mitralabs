import { Check, Minus } from "lucide-react";

const features = [
  { name: "Harga", basic: "Rp 1.5jt", standard: "Rp 3.5jt", premium: "Rp 7jt" },
  { name: "Timeline", basic: "3 Hari", standard: "7 Hari", premium: "14 Hari" },
  { name: "Halaman", basic: "1 Hal", standard: "3–5 Hal", premium: "7–10 Hal" },
  { name: "Desain", basic: "Template", standard: "Semi-custom", premium: "Full custom" },
  { name: "Mobile Responsive", basic: true, standard: true, premium: true },
  { name: "Tombol WhatsApp", basic: true, standard: true, premium: true },
  { name: "Form Kontak", basic: false, standard: true, premium: true },
  { name: "Google Maps", basic: false, standard: true, premium: true },
  { name: "Galeri Foto", basic: false, standard: true, premium: true },
  { name: "SEO Dasar", basic: false, standard: true, premium: true },
  { name: "Blog / Artikel", basic: false, standard: false, premium: true },
  { name: "Sistem Booking", basic: false, standard: false, premium: true },
  { name: "Animasi", basic: false, standard: false, premium: true },
  { name: "Domain .com", basic: false, standard: false, premium: "Gratis (1 Thn)" },
  { name: "Hosting", basic: false, standard: "Opsional", premium: "Gratis (1 Thn)" },
  { name: "Revisi", basic: "2x", standard: "2x", premium: "2x" },
  { name: "Garansi Bug", basic: "7 Hari", standard: "7 Hari", premium: "7 Hari" },
];

export default function ComparisonTable() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-manrope text-4xl font-extrabold text-[#131b2e] mb-4">
            Perbandingan <span className="text-gradient">Fitur Lengkap</span>
          </h2>
          <p className="text-[#434656]">Transparansi penuh atas apa yang Anda dapatkan di setiap paket.</p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-xl shadow-blue-500/5">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-[#faf8ff] border-b border-gray-100">
                <th className="p-8 font-manrope font-bold text-[#131b2e] text-lg">Fitur Utama</th>
                <th className="p-8 font-manrope font-bold text-[#131b2e] text-lg text-center">Basic</th>
                <th className="p-8 font-manrope font-bold text-blue-600 text-lg text-center bg-blue-50/30">Standard</th>
                <th className="p-8 font-manrope font-bold text-[#131b2e] text-lg text-center">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {features.map((f) => (
                <tr key={f.name} className="hover:bg-gray-50 transition-colors">
                  <td className="p-8 text-[#131b2e] font-semibold">{f.name}</td>
                  <td className="p-8 text-center text-[#434656]">
                    {typeof f.basic === 'boolean' ? (
                      f.basic ? <Check className="mx-auto text-teal-500" /> : <Minus className="mx-auto text-gray-200" />
                    ) : f.basic}
                  </td>
                  <td className="p-8 text-center text-[#131b2e] font-bold bg-blue-50/10">
                    {typeof f.standard === 'boolean' ? (
                      f.standard ? <Check className="mx-auto text-teal-500" /> : <Minus className="mx-auto text-gray-200" />
                    ) : f.standard}
                  </td>
                  <td className="p-8 text-center text-[#434656]">
                    {typeof f.premium === 'boolean' ? (
                      f.premium ? <Check className="mx-auto text-teal-500" /> : <Minus className="mx-auto text-gray-200" />
                    ) : f.premium}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
