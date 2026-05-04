import { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio Project Website & Digital Marketing",
  description: "Lihat karya terbaik Mitralabs.id dalam membangun ekosistem digital. Portfolio pembuatan website UMKM, Sekolah, dan Solusi Bisnis di Medan.",
  openGraph: {
    title: "Portfolio Project | Mitralabs.id",
    description: "Lihat karya terbaik Mitralabs.id dalam membangun ekosistem digital. Portfolio pembuatan website profesional.",
    images: ["/og-portfolio.jpg"],
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
