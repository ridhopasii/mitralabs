"use client";

import { Download } from 'lucide-react';
import { useData } from '@/context/DataContext';

interface InvoiceItem {
  desc: string;
  price: number;
  qty: number;
}

interface InvoiceData {
  invoice_number: string;
  client_name: string;
  client_email: string;
  created_at: string;
  due_date: string;
  items: InvoiceItem[] | string;
}

interface InvoicePDFGeneratorProps {
  invoiceNumber: string;
  invoiceData: InvoiceData;
  className?: string;
}

export default function InvoicePDFGenerator({ invoiceNumber, invoiceData, className }: InvoicePDFGeneratorProps) {
  const { data } = useData();
  const settings = data.invoiceSettings;

  const generatePDF = async () => {
    try {
      console.log('🔄 Starting PDF generation...');

      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import('jspdf');
      console.log('✅ jsPDF loaded successfully');

      const items = typeof invoiceData.items === 'string'
        ? JSON.parse(invoiceData.items)
        : invoiceData.items;

      console.log('📄 Invoice data:', { invoiceNumber, items });

      const subtotal = items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.qty), 0);
      const tax = subtotal * (settings?.taxRate || 0) / 100;
      const total = subtotal + tax;

      console.log('💰 Calculations:', { subtotal, tax, total });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Set font
      pdf.setFont('helvetica');

      let yPos = 30;

      // Header - Company Name
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      const companyName = settings?.companyName || 'MITRALABS.ID';
      pdf.text(companyName, pageWidth / 2, yPos, { align: 'center' });

      yPos += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const tagline = settings?.companyTagline || 'Precision Web Engineering';
      pdf.text(tagline, pageWidth / 2, yPos, { align: 'center' });

      yPos += 15;

      // Invoice Number
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text(invoiceData.invoice_number, pageWidth / 2, yPos, { align: 'center' });

      yPos += 25;

      // Bill To
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO STAKEHOLDER', 20, yPos);

      yPos += 8;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(invoiceData.client_name, 20, yPos);

      yPos += 6;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(invoiceData.client_email, 20, yPos);

      yPos += 20;

      // Dates
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ISSUE DATE', 20, yPos);
      pdf.text('DUE DATE', 120, yPos);

      yPos += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.text(new Date(invoiceData.created_at).toLocaleDateString('id-ID'), 20, yPos);
      pdf.setTextColor(239, 68, 68); // Red color for due date
      pdf.text(new Date(invoiceData.due_date).toLocaleDateString('id-ID'), 120, yPos);
      pdf.setTextColor(0, 0, 0); // Reset to black

      yPos += 25;

      // Table Header
      pdf.setFillColor(245, 245, 245);
      pdf.rect(20, yPos - 5, pageWidth - 40, 12, 'F');

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DESCRIPTION', 25, yPos);
      pdf.text('QTY', 120, yPos, { align: 'center' });
      pdf.text('PRICE', 140, yPos, { align: 'right' });
      pdf.text('TOTAL', 180, yPos, { align: 'right' });

      yPos += 15;

      // Table Items
      pdf.setFont('helvetica', 'normal');
      items.forEach((item: InvoiceItem) => {
        pdf.text(item.desc, 25, yPos);
        pdf.text(item.qty.toString(), 120, yPos, { align: 'center' });
        pdf.text(`Rp ${item.price.toLocaleString()}`, 140, yPos, { align: 'right' });
        pdf.text(`Rp ${(item.price * item.qty).toLocaleString()}`, 180, yPos, { align: 'right' });
        yPos += 8;
      });

      yPos += 10;

      // Total
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('TOTAL', 140, yPos, { align: 'right' });
      pdf.text(`Rp ${total.toLocaleString()}`, 180, yPos, { align: 'right' });

      yPos += 25;

      // Payment Instructions
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PAYMENT INSTRUCTIONS', 20, yPos);

      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      const paymentInstructions = settings?.paymentInstructions || 'Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran.';
      const splitInstructions = pdf.splitTextToSize(paymentInstructions, pageWidth - 40);
      pdf.text(splitInstructions, 20, yPos);

      yPos += splitInstructions.length * 5 + 15;

      // Bank Details
      pdf.setFont('helvetica', 'bold');
      pdf.text('BANK TRANSFER DETAILS', 20, yPos);

      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(settings?.bankName || 'Bank Central Asia (BCA)', 20, yPos);
      yPos += 5;
      pdf.text(`Account: ${settings?.bankAccountNumber || '8000-7625-12'}`, 20, yPos);
      yPos += 5;
      pdf.text(`Name: ${settings?.bankAccountName || 'Ridho Robbi Pasi'}`, 20, yPos);
      if (settings?.bankBranch) {
        yPos += 5;
        pdf.text(`Branch: ${settings.bankBranch}`, 20, yPos);
      }

      // Footer
      yPos = pageHeight - 20;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const footerNote = settings?.footerNote || 'Verified by Mitralabs Cryptographic Protocol';
      pdf.text(footerNote, pageWidth / 2, yPos, { align: 'center' });

      console.log('📥 Saving PDF...');
      // Save PDF - This will directly download
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
      console.log('✅ PDF download initiated successfully!');

    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className={className || "p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"}
      title="Download Invoice PDF"
    >
      <Download size={16} />
    </button>
  );
}
