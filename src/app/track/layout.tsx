import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Project — Dashboard Pelacakan Proyek Mitralabs",
  description: "Pantau progres pengerjaan proyek digital Anda secara real-time. Unggah aset, beri masukan, dan kelola dokumen dalam satu dashboard aman.",
  openGraph: {
    title: "Track Project | Mitralabs Digital Agency",
    description: "Dashboard pelacakan progres proyek digital secara real-time.",
    images: ["/og-track.jpg"],
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
