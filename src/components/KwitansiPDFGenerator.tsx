"use client";

import { Download, Loader2 } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useState } from 'react';

interface InvoiceItem {
  desc: string;
  details?: string;
  price: number;
  qty: number;
}

interface InvoiceData {
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  created_at: string;
  due_date: string;
  project_period_start?: string;
  project_period_end?: string;
  items: InvoiceItem[] | string;
  amount: number;
  invoice_type?: string;
  status: string;
}

interface KwitansiPDFGeneratorProps {
  invoiceNumber: string;
  invoiceData: InvoiceData;
  className?: string;
}

export default function KwitansiPDFGenerator({ invoiceNumber, invoiceData, className }: KwitansiPDFGeneratorProps) {
  const { data: globalData } = useData();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const items = typeof invoiceData.items === 'string'
        ? JSON.parse(invoiceData.items)
        : invoiceData.items;

      const subtotal = items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.qty), 0);
      const total = subtotal;

      // Format Currency
      const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(num);
      };

      // Create temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '800px';
      container.style.backgroundColor = 'white';
      
      // DESAIN PIXEL-PERFECT (SAMA DENGAN VIEW PAGE)
      container.innerHTML = `
        <div style="width: 800px; font-family: 'Inter', sans-serif; color: #1D1D1F; background: #F5F5F7; padding: 40px; box-sizing: border-box;">
          <div style="background: white; border-radius: 32px; border: 1px solid #F2F2F7; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.03);">
            
            <!-- Lembar Copy -->
            <div style="background: #F9F9FB; padding: 10px 40px; border-bottom: 1px solid #F2F2F7; display: flex; justify-content: space-between; font-size: 9px; font-weight: bold; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px;">
              <span>Lembar 1: Pelanggan</span>
              <span>Original Receipt</span>
            </div>

            <!-- Header -->
            <div style="padding: 60px 60px 40px 60px; border-bottom: 1px solid #F2F2F7;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px;">
                    <div style="width: 60px; height: 60px; background: #1D1D1F; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 800;">M</div>
                    <div>
                      <h2 style="font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -1px;">${globalData.invoiceSettings.companyName}</h2>
                      <p style="font-size: 11px; font-weight: 600; color: #0066FF; text-transform: uppercase; letter-spacing: 3px; margin: 5px 0 0 0;">${globalData.invoiceSettings.companyTagline}</p>
                    </div>
                  </div>
                  <div style="font-size: 13px; color: #86868B; font-weight: 500; line-height: 1.6;">
                    <p style="margin: 0;">${globalData.invoiceSettings.companyAddress}, ${globalData.invoiceSettings.companyCity}</p>
                    <p style="margin: 5px 0 0 0;">${globalData.invoiceSettings.companyWebsite} • ${globalData.invoiceSettings.companyPhone}</p>
                  </div>
                </div>
                <div style="text-align: right;">
                  <h1 style="font-size: 48px; font-weight: 900; color: #1D1D1F; margin: 0; line-height: 1; italic; letter-spacing: -2px;">${invoiceData.invoice_type || "Kwitansi"}</h1>
                  <p style="font-size: 10px; font-weight: 800; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px; margin: 10px 0 30px 0;">E-Verification Success</p>
                  
                  <div style="background: #F5F5F7; padding: 15px 25px; border-radius: 12px; display: inline-block; text-align: left; border: 1px solid #F2F2F7;">
                    <p style="font-size: 9px; font-weight: 800; color: #86868B; text-transform: uppercase; margin: 0 0 5px 0; letter-spacing: 1px;">No. Referensi</p>
                    <p style="font-size: 16px; font-weight: 800; color: #1D1D1F; margin: 0;">${invoiceData.invoice_number}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Client & Payment -->
            <div style="padding: 40px 60px; display: flex; gap: 80px;">
              <div style="flex: 1;">
                <h4 style="font-size: 10px; font-weight: 800; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0;">Penerima Layanan</h4>
                <p style="font-size: 20px; font-weight: 800; color: #1D1D1F; margin: 0 0 5px 0;">${invoiceData.client_name}</p>
                <p style="font-size: 13px; font-weight: 800; color: #0066FF; margin: 0 0 20px 0;">${invoiceData.client_company || "-"}</p>
                <div style="font-size: 13px; color: #86868B; font-weight: 500; font-style: italic;">
                  <p style="margin: 0;">${invoiceData.client_email}</p>
                  <p style="margin: 5px 0 0 0; line-height: 1.5;">${invoiceData.client_address || "-"}</p>
                </div>
              </div>
              <div style="flex: 1;">
                <h4 style="font-size: 10px; font-weight: 800; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px 0;">Metode Pembayaran</h4>
                <div style="background: #F9F9FB; padding: 25px; border-radius: 24px; border: 1px solid #F2F2F7;">
                  <p style="font-size: 10px; font-weight: 800; color: #86868B; text-transform: uppercase; margin: 0 0 5px 0;">Transfer Bank</p>
                  <p style="font-size: 14px; font-weight: 800; color: #1D1D1F; margin: 0 0 15px 0;">${globalData.invoiceSettings.bankName}</p>
                  <div style="border-top: 1px solid #E8E8ED; padding-top: 15px;">
                    <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 8px;">
                      <span style="color: #86868B;">Penerima</span>
                      <span style="font-weight: bold;">${globalData.invoiceSettings.bankAccountName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px;">
                      <span style="color: #86868B;">Rekening</span>
                      <span style="font-weight: 800; letter-spacing: 1px;">${globalData.invoiceSettings.bankAccountNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items -->
            <div style="padding: 20px 60px 40px 60px;">
              <div style="font-size: 10px; font-weight: 800; color: #86868B; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span>Periode Proyek:</span>
                <span style="color: #1D1D1F;">
                  ${invoiceData.project_period_start ? `${new Date(invoiceData.project_period_start).toLocaleDateString('id-ID')} - ${new Date(invoiceData.project_period_end || '').toLocaleDateString('id-ID')}` : "-"}
                </span>
              </div>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #1D1D1F;">
                    <th style="padding: 0 0 20px 0; text-align: left; font-size: 10px; font-weight: 800; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Item Layanan</th>
                    <th style="padding: 0 20px 20px 20px; text-align: center; font-size: 10px; font-weight: 800; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Qty</th>
                    <th style="padding: 0 0 20px 0; text-align: right; font-size: 10px; font-weight: 800; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item: InvoiceItem) => `
                    <tr style="border-bottom: 1px solid #F5F5F7;">
                      <td style="padding: 25px 0;">
                        <p style="font-size: 15px; font-weight: 800; color: #1D1D1F; margin: 0 0 5px 0;">${item.desc}</p>
                        <p style="font-size: 11px; color: #86868B; font-weight: 500; margin: 0; line-height: 1.5; max-width: 400px;">${item.details || ""}</p>
                      </td>
                      <td style="padding: 25px 20px; text-align: center; font-size: 14px; font-weight: 800; color: #86868B;">${item.qty}</td>
                      <td style="padding: 25px 0; text-align: right; font-size: 15px; font-weight: 800; color: #1D1D1F;">${formatCurrency(item.qty * item.price)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Footer & Signature -->
            <div style="background: #F9F9FB; padding: 40px 60px; border-top: 1px solid #F2F2F7;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="max-width: 300px;">
                  <h5 style="font-size: 10px; font-weight: 800; color: #1D1D1F; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 15px 0;">Syarat & Ketentuan</h5>
                  <div style="font-size: 10px; color: #86868B; font-weight: 500; line-height: 1.7;">
                    ${globalData.invoiceSettings.termsAndConditions.split('\n').map((term: string) => `<p style="margin: 0 0 5px 0;">• ${term}</p>`).join('')}
                  </div>
                </div>
                <div style="text-align: right; width: 250px;">
                  <p style="font-size: 10px; font-weight: 800; color: #0066FF; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 10px 0;">Total Akhir</p>
                  <p style="font-size: 36px; font-weight: 900; color: #1D1D1F; letter-spacing: -2px; margin: 0 0 15px 0;">${formatCurrency(total)}</p>
                  <div style="background: #E8F5E9; padding: 8px 15px; border-radius: 50px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid #C8E6C9;">
                    <span style="font-size: 9px; font-weight: 900; color: #2E7D32; text-transform: uppercase; letter-spacing: 2px;">Verified Payment</span>
                  </div>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; margin-top: 60px; text-align: center;">
                <div style="flex: 1;">
                  <p style="font-size: 10px; font-weight: 800; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 60px;">Pelanggan,</p>
                  <div style="border-top: 1px solid #E8E8ED; width: 80%; margin: 0 auto; padding-top: 10px;">
                    <p style="font-size: 11px; font-weight: 800; color: #1D1D1F; margin: 0; text-transform: uppercase;">${invoiceData.client_name}</p>
                  </div>
                </div>
                <div style="flex: 1;">
                  <p style="font-size: 10px; font-weight: 800; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 60px;">Marketing,</p>
                  <div style="border-top: 1px solid #E8E8ED; width: 80%; margin: 0 auto; padding-top: 10px;">
                    <p style="font-size: 11px; font-weight: 800; color: #1D1D1F; margin: 0; text-transform: uppercase;">${globalData.invoiceSettings.signatureFields?.marketing || "Marketing Officer"}</p>
                  </div>
                </div>
                <div style="flex: 1; position: relative;">
                  <p style="font-size: 10px; font-weight: 800; color: #D2D2D7; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 60px;">Owner,</p>
                  ${total > 5000000 ? `
                  <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%) rotate(-10deg); border: 2px dashed #D2D2D7; padding: 5px 10px; border-radius: 5px; opacity: 0.3;">
                    <p style="font-size: 8px; font-weight: 800; margin: 0;">MATERAI 10.000</p>
                  </div>
                  ` : ''}
                  <div style="border-top: 1px solid #E8E8ED; width: 80%; margin: 0 auto; padding-top: 10px;">
                    <p style="font-size: 11px; font-weight: 800; color: #1D1D1F; margin: 0; text-transform: uppercase;">${globalData.invoiceSettings.signatureFields?.owner || "Direktur Utama"}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Dark -->
            <div style="background: #1D1D1F; padding: 40px 60px; display: flex; justify-content: space-between; align-items: center; color: white;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 24px; height: 24px; background: white; border-radius: 6px; color: #1D1D1F; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 12px; font-style: italic;">M</div>
                <span style="font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; italic;">${globalData.invoiceSettings.companyName}</span>
              </div>
              <div style="display: flex; gap: 40px; font-size: 9px; font-weight: bold; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">
                <div style="text-align: right;">
                  <p style="color: white; margin: 0 0 5px 0;">E-Verification</p>
                  <p style="margin: 0; opacity: 0.4;">ML-${invoiceData.invoice_number}-SECURE</p>
                </div>
                <div style="text-align: right;">
                  <p style="color: white; margin: 0 0 5px 0;">Timestamp</p>
                  <p style="margin: 0; opacity: 0.4;">${new Date().toLocaleString('id-ID')} WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F5F5F7',
      });

      document.body.removeChild(container);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Kwitansi-${invoiceNumber}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={className || "p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"}
      title="Download Kwitansi PDF"
    >
      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
    </button>
  );
}
