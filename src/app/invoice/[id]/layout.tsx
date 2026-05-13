import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;

  try {
    const { data: invoice } = await supabase
      .from("Invoice")
      .select("invoice_number, client_name, invoice_type")
      .eq("invoice_number", id)
      .single();

    if (!invoice) {
      return {
        title: "Dokumen Tidak Ditemukan | Mitralabs",
      };
    }

    const type = invoice.invoice_type || "Kwitansi";
    
    return {
      title: `${type} #${invoice.invoice_number} - ${invoice.client_name} | Mitralabs`,
      description: `Dokumen digital resmi dari Mitralabs untuk ${invoice.client_name}. Verifikasi status pembayaran secara real-time.`,
      openGraph: {
        title: `${type} #${invoice.invoice_number} - ${invoice.client_name}`,
        description: `Lihat dan unduh dokumen digital Mitralabs.`,
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: "Invoice | Mitralabs",
    };
  }
}

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
