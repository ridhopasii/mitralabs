import { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog & Insight Digital - Mitralabs.id",
  description: "Dapatkan wawasan terbaru seputar teknologi, website, dan digital marketing dari tim ahli Mitralabs.id.",
  openGraph: {
    title: "Blog & Insight Digital | Mitralabs.id",
    description: "Dapatkan wawasan terbaru seputar teknologi, website, dan digital marketing.",
    images: ["/og-blog.jpg"],
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
