import { Metadata } from "next";
import TentangClient from "./TentangClient";

export const metadata: Metadata = {
  title: "Tentang Kami — Mitralabs.web.id",
  description: "Kenali lebih dekat Mitralabs.web.id. Kami adalah tim kreatif dan teknis yang berdedikasi untuk membantu bisnis Anda bertransformasi di era digital.",
  openGraph: {
    title: "Tentang Kami | Mitralabs.web.id",
    description: "Kenali lebih dekat Mitralabs.web.id. Kami adalah tim kreatif dan teknis yang berdedikasi untuk membantu bisnis Anda.",
    images: ["/og-about.jpg"],
  },
};

export default function AboutPage() {
  return <TentangClient />;
}
