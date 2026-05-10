import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Client Portal | Mitralabs",
  description: "Track your project's progress",
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col`}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 mt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
