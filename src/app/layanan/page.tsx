import { Metadata } from "next";
import LayananClient from "./LayananClient";

export const metadata: Metadata = {
  title: "Layanan Website Profesional Medan",
  description: "Cek paket pembuatan website profesional Mitralabs.id. Solusi UMKM, Sekolah, dan Bisnis dengan desain premium dan performa tinggi.",
  openGraph: {
    title: "Layanan Website Profesional Medan | Mitralabs.id",
    description: "Cek paket pembuatan website profesional Mitralabs.id. Solusi UMKM, Sekolah, dan Bisnis dengan desain premium.",
    images: ["/og-layanan.jpg"],
  },
};

export default function ServicesPage() {
  return <LayananClient />;
}
