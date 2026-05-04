import { Metadata } from "next";
import TentangClient from "./TentangClient";

export const metadata: Metadata = {
  title: "Tentang Kami - Software House & Creative Agency",
  description: "Kenali lebih dekat Mitralabs.id. Kami adalah tim kreatif dan teknis yang berdedikasi untuk membantu bisnis Anda bertransformasi di era digital.",
  openGraph: {
    title: "Tentang Kami | Mitralabs.id",
    description: "Kenali lebih dekat Mitralabs.id. Kami adalah tim kreatif dan teknis yang berdedikasi untuk membantu bisnis Anda.",
    images: ["/og-about.jpg"],
  },
};

export default function AboutPage() {
  return <TentangClient />;
}
