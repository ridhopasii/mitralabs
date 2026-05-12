"use client";
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useState } from 'react';

interface SPKData {
  customer_name: string;
  customer_email: string;
  service_type: string;
  plan_name: string;
  total_price: number;
  created_at: string;
}

interface SPKPDFGeneratorProps {
  data: SPKData;
  className?: string;
  autoGenerate?: boolean;
}

export default function SPKPDFGenerator({ data: spkData, className, autoGenerate = false }: SPKPDFGeneratorProps) {
  const { data } = useData();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      const colors = {
        primary: [0, 0, 0] as [number, number, number],
        secondary: [128, 128, 128] as [number, number, number],
        light: [248, 248, 250] as [number, number, number],
        accent: [0, 122, 255] as [number, number, number],
        text: [29, 29, 31] as [number, number, number],
        subtle: [174, 174, 178] as [number, number, number],
        white: [255, 255, 255] as [number, number, number]
      };

      pdf.setFont('helvetica');

      // Formal Header
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.white);
      pdf.text('SURAT PERINTAH KERJA', 25, 22);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.white);
      pdf.text(`NO: ML/${new Date().getFullYear()}/SPK/${Math.floor(1000 + Math.random() * 9000)}`, 25, 28);

      let yPos = 55;

      // Pihak-pihak
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('PIHAK PERTAMA (PENYEDIA JASA)', 25, yPos);
      
      yPos += 7;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text([
        'Nama: Mitralabs Digital Agency',
        'Website: mitralabs.web.id',
        'Email: hello@mitralabs.web.id'
      ], 25, yPos);

      yPos += 20;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('PIHAK KEDUA (KLIEN)', 25, yPos);
      
      yPos += 7;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text([
        `Nama: ${spkData.customer_name}`,
        `Email: ${spkData.customer_email}`
      ], 25, yPos);

      yPos += 25;

      // Lingkup Kerja
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('PASAL 1: LINGKUP PEKERJAAN', 25, yPos);
      
      yPos += 8;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text([
        `Pihak Pertama setuju untuk melaksanakan pembuatan ${spkData.service_type} (${spkData.plan_name})`,
        'sesuai dengan detail brief yang telah disepakati sebelumnya.'
      ], 25, yPos);

      yPos += 15;

      // Nilai Kontrak
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('PASAL 2: NILAI KONTRAK & PEMBAYARAN', 25, yPos);
      
      yPos += 8;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text([
        `Total nilai investasi yang disepakati adalah sebesar Rp ${spkData.total_price.toLocaleString()}`,
        'Pembayaran dilakukan sesuai dengan termin yang disepakati (DP 50% & Pelunasan 50%).'
      ], 25, yPos);

      yPos += 20;

      // Durasi
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('PASAL 3: WAKTU PENGERJAAN', 25, yPos);
      
      yPos += 8;
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text([
        'Waktu pengerjaan akan dimulai segera setelah pembayaran uang muka (DP) diterima.',
        'Estimasi waktu penyelesaian disesuaikan dengan kompleksitas fitur yang diminta.'
      ], 25, yPos);

      yPos += 30;

      // Signature Area
      const sigY = yPos;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('PIHAK PERTAMA', 25, sigY);
      pdf.text('PIHAK KEDUA', pageWidth - 60, sigY);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(...colors.subtle);
      pdf.text('(Digital Signature Attached)', 25, sigY + 20);
      pdf.text('(Digital Signature Attached)', pageWidth - 60, sigY + 20);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('Mitralabs Agency', 25, sigY + 30);
      pdf.text(spkData.customer_name, pageWidth - 60, sigY + 30);

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.subtle);
      pdf.text('Dokumen ini dihasilkan secara otomatis dan sah sebagai bukti kesepakatan digital.', pageWidth / 2, 285, { align: 'center' });

      if (!autoGenerate) {
        pdf.save(`SPK-${spkData.customer_name.replace(/\s+/g, '-')}.pdf`);
      }

      return pdf.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs transition-all disabled:opacity-50 ${className}`}
    >
      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
      Download SPK
    </button>
  );
}
