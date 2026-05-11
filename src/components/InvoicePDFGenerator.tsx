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
      console.log('🔄 Starting Apple-style PDF generation...');

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

      // Create PDF with Apple-style modern design
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Apple-style color palette
      const colors = {
        primary: [0, 0, 0] as [number, number, number],        // Pure black
        secondary: [128, 128, 128] as [number, number, number], // Medium gray
        light: [248, 248, 250] as [number, number, number],    // Light gray background
        accent: [0, 122, 255] as [number, number, number],     // Apple blue
        success: [52, 199, 89] as [number, number, number],    // Apple green
        text: [29, 29, 31] as [number, number, number],        // Apple text color
        subtle: [174, 174, 178] as [number, number, number],   // Subtle gray
        white: [255, 255, 255] as [number, number, number]     // Pure white
      };

      // Set default font
      pdf.setFont('helvetica');

      let yPos = 25;

      // Modern Header with subtle background
      pdf.setFillColor(...colors.light);
      pdf.rect(0, 0, pageWidth, 50, 'F');

      // Company Logo Area (simulated with modern circle)
      pdf.setFillColor(...colors.primary);
      pdf.circle(25, 25, 6, 'F');

      // Company Name - Apple style typography
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      const companyName = settings?.companyName || 'MITRALABS.WEB.ID';
      pdf.text(companyName, 38, 27);

      // Tagline - subtle and clean
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      const tagline = settings?.companyTagline || 'Precision Web Engineering';
      pdf.text(tagline, 38, 33);

      // Invoice status badge (top right)
      const badgeX = pageWidth - 45;
      pdf.setFillColor(...colors.success);
      pdf.roundedRect(badgeX, 18, 35, 10, 5, 5, 'F');
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.white);
      pdf.text('INVOICE', badgeX + 17.5, 24.5, { align: 'center' });

      yPos = 65;

      // Invoice Number - Large and prominent
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text(invoiceData.invoice_number, pageWidth / 2, yPos, { align: 'center' });

      yPos += 25;

      // Client Information Card
      pdf.setFillColor(...colors.white);
      pdf.roundedRect(20, yPos, pageWidth - 40, 30, 6, 6, 'F');
      pdf.setDrawColor(...colors.light);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(20, yPos, pageWidth - 40, 30, 6, 6, 'S');

      // Bill To Label
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('BILL TO', 28, yPos + 8);

      // Client Name
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text(invoiceData.client_name, 28, yPos + 16);

      // Client Email
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text(invoiceData.client_email, 28, yPos + 23);

      // Dates section (right side of card)
      const dateX = pageWidth - 65;

      // Issue Date
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('ISSUE DATE', dateX, yPos + 8);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.primary);
      pdf.text(new Date(invoiceData.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }), dateX, yPos + 15);

      // Due Date
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('DUE DATE', dateX, yPos + 20);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 59, 48); // Apple red for due date
      pdf.text(new Date(invoiceData.due_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }), dateX, yPos + 27);

      yPos += 50;

      // Items Table - Clean and minimal
      // Table header
      pdf.setFillColor(...colors.light);
      pdf.rect(20, yPos, pageWidth - 40, 12, 'F');

      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('DESCRIPTION', 28, yPos + 8);
      pdf.text('QTY', pageWidth - 85, yPos + 8, { align: 'center' });
      pdf.text('RATE', pageWidth - 60, yPos + 8, { align: 'right' });
      pdf.text('AMOUNT', pageWidth - 28, yPos + 8, { align: 'right' });

      yPos += 18;

      // Table items with alternating background
      items.forEach((item: InvoiceItem, index: number) => {
        if (index % 2 === 0) {
          pdf.setFillColor(252, 252, 253);
          pdf.rect(20, yPos - 3, pageWidth - 40, 12, 'F');
        }

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...colors.primary);

        // Description - wrap text if too long
        const maxDescWidth = pageWidth - 120;
        const wrappedDesc = pdf.splitTextToSize(item.desc, maxDescWidth);
        pdf.text(wrappedDesc[0], 28, yPos + 3); // Only show first line for clean look

        // Quantity
        pdf.text(item.qty.toString(), pageWidth - 85, yPos + 3, { align: 'center' });

        // Rate
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Rp ${item.price.toLocaleString()}`, pageWidth - 60, yPos + 3, { align: 'right' });

        // Amount
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Rp ${(item.price * item.qty).toLocaleString()}`, pageWidth - 28, yPos + 3, { align: 'right' });

        yPos += 12;
      });

      yPos += 15;

      // Total Section - Apple style card
      const totalCardY = yPos;
      pdf.setFillColor(...colors.primary);
      pdf.roundedRect(pageWidth - 100, totalCardY, 80, 25, 6, 6, 'F');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.white);
      pdf.text('TOTAL AMOUNT', pageWidth - 60, totalCardY + 8, { align: 'center' });

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Rp ${total.toLocaleString()}`, pageWidth - 60, totalCardY + 18, { align: 'center' });

      yPos += 40;

      // Payment Information Card
      pdf.setFillColor(...colors.white);
      pdf.roundedRect(20, yPos, pageWidth - 40, 40, 6, 6, 'F');
      pdf.setDrawColor(...colors.light);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(20, yPos, pageWidth - 40, 40, 6, 6, 'S');

      // Payment Instructions
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('PAYMENT INSTRUCTIONS', 28, yPos + 10);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      const paymentInstructions = settings?.paymentInstructions || 'Transfer to the account below and send proof to our WhatsApp for confirmation.';
      const splitInstructions = pdf.splitTextToSize(paymentInstructions, pageWidth - 60);
      pdf.text(splitInstructions, 28, yPos + 16);

      // Bank Details
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('BANK DETAILS', 28, yPos + 26);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text(settings?.bankName || 'Bank Central Asia (BCA)', 28, yPos + 32);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text(`${settings?.bankAccountNumber || '8000-7625-12'} • ${settings?.bankAccountName || 'Ridho Robbi Pasi'}`, 28, yPos + 37);

      // Footer - Minimal and clean
      yPos = pageHeight - 25;
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.subtle);
      const footerNote = settings?.footerNote || 'Verified by Mitralabs Cryptographic Protocol';
      pdf.text(footerNote, pageWidth / 2, yPos, { align: 'center' });

      console.log('📥 Saving Apple-style PDF...');
      // Save PDF - This will directly download
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
      console.log('✅ Apple-style PDF download initiated successfully!');

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
