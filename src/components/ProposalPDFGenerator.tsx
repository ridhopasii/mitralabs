"use client";

import { FileText, Loader2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useState } from 'react';

interface ProposalData {
  customer_name: string;
  customer_email: string;
  service_type: string;
  plan_name: string;
  total_price: number;
  project_brief: string;
  created_at: string;
}

interface ProposalPDFGeneratorProps {
  data: ProposalData;
  className?: string;
  autoGenerate?: boolean;
}

export default function ProposalPDFGenerator({ data: proposalData, className, autoGenerate = false }: ProposalPDFGeneratorProps) {
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

      // Header with subtle background
      pdf.setFillColor(...colors.light);
      pdf.rect(0, 0, pageWidth, 60, 'F');

      // Company Logo / Circle
      pdf.setFillColor(...colors.primary);
      pdf.circle(25, 30, 8, 'F');

      // Company Name
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text(data?.navbar?.logo || 'MITRALABS', 40, 32);

      // Document Type Label
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.accent);
      pdf.text('PROJECT PROPOSAL', pageWidth - 25, 32, { align: 'right' });

      let yPos = 80;

      // Title
      pdf.setFontSize(32);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.text);
      pdf.text('Modern Digital\nExperience.', 25, yPos);
      
      yPos += 30;

      // Client Intro
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      pdf.text(`Prepared for ${proposalData.customer_name}`, 25, yPos);
      
      yPos += 15;

      // Info Card
      pdf.setFillColor(...colors.light);
      pdf.roundedRect(25, yPos, pageWidth - 50, 45, 8, 8, 'F');
      
      const cardY = yPos + 12;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('SERVICE TYPE', 35, cardY);
      pdf.text('PLAN LEVEL', 90, cardY);
      pdf.text('INVESTMENT', 145, cardY);

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.text);
      pdf.text(proposalData.service_type, 35, cardY + 8);
      pdf.text(proposalData.plan_name, 90, cardY + 8);
      pdf.text(`Rp ${proposalData.total_price.toLocaleString()}`, 145, cardY + 8);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.subtle);
      pdf.text('PROPOSAL DATE', 35, cardY + 22);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.text);
      pdf.text(new Date(proposalData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 35, cardY + 30);

      yPos += 65;

      // Project Brief Section
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('Project Vision', 25, yPos);
      
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...colors.secondary);
      const briefLines = pdf.splitTextToSize(proposalData.project_brief || 'No brief provided.', pageWidth - 50);
      pdf.text(briefLines, 25, yPos);

      yPos += (briefLines.length * 5) + 20;

      // Why Mitralabs
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...colors.primary);
      pdf.text('The Mitralabs Edge', 25, yPos);
      
      const features = [
        'Apple-style minimalist design aesthetic',
        'Performance optimized engineering',
        'SEO-ready structural foundation',
        'End-to-end technical support'
      ];

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      features.forEach(f => {
        pdf.setTextColor(...colors.accent);
        pdf.text('•', 25, yPos);
        pdf.setTextColor(...colors.secondary);
        pdf.text(f, 32, yPos);
        yPos += 7;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.subtle);
      pdf.text('mitralabs.web.id — build for the future.', pageWidth / 2, 285, { align: 'center' });

      if (!autoGenerate) {
        pdf.save(`Proposal-${proposalData.customer_name.replace(/\s+/g, '-')}.pdf`);
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
      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
      Download Proposal
    </button>
  );
}
