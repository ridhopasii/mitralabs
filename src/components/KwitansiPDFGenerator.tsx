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

      const total = items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.qty), 0);

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
      container.style.top = '-0px';
      container.style.width = '800px';
      container.style.backgroundColor = '#F5F5F7';
      
      // DESAIN 100% IDENTIK DENGAN REACT CODE USER
      container.innerHTML = `
        <div style="width: 800px; font-family: 'Inter', -apple-system, sans-serif; color: #1D1D1F; background: #F5F5F7; padding: 48px; box-sizing: border-box;">
          
          <div style="width: 100%; background: white; border-radius: 32px; border: 1px solid #F1F1F1; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.03); position: relative;">
            
            <!-- Top Copy Indicator -->
            <div style="background: #F9F9FB; padding: 8px 40px; border-bottom: 1px solid #F1F1F1; display: flex; justify-content: space-between; align-items: center;">
              <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 2px;">Lembar 1: Pelanggan</div>
              <div style="font-size: 9px; font-weight: 800; color: #D1D5DB; text-transform: uppercase; letter-spacing: 2px; font-style: italic;">Original Receipt</div>
            </div>

            <!-- Header Section -->
            <div style="padding: 64px 64px 48px 64px; border-bottom: 1px solid #F2F2F7;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; flex-direction: column; gap: 32px;">
                  <div style="display: flex; align-items: center; gap: 20px;">
                    <div style="width: 64px; height: 64px; background: #1D1D1F; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 600; letter-spacing: -2px;">M</div>
                    <div>
                      <h2 style="font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -1px;">MITRALABS.WEB.ID</h2>
                      <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                        <div style="width: 6px; height: 6px; background: #0066FF; border-radius: 50%;"></div>
                        <span style="font-size: 11px; font-weight: 600; color: #0066FF; text-transform: uppercase; letter-spacing: 3px;">${globalData.invoiceSettings.companyTagline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #86868B; font-weight: 500;">
                    <p style="margin: 0; font-style: italic;">${globalData.invoiceSettings.companyAddress}, ${globalData.invoiceSettings.companyCity}</p>
                    <div style="display: flex; gap: 16px;">
                      <p style="margin: 0;">${globalData.invoiceSettings.companyWebsite}</p>
                      <p style="margin: 0;">${globalData.invoiceSettings.companyPhone}</p>
                    </div>
                  </div>
                </div>

                <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end;">
                  <div style="margin-bottom: 32px;">
                    <h1 style="font-size: 48px; font-weight: 700; color: #1D1D1F; margin: 0; letter-spacing: -2px; font-style: italic; line-height: 1;">Kwitansi</h1>
                    <p style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px;">E-Verification Success</p>
                  </div>

                  <div style="width: 220px;">
                    <div style="font-size: 11px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px;">No. Referensi</div>
                    <h3 style="font-size: 18px; font-weight: 700; color: #1D1D1F; margin: 0 0 16px 0; letter-spacing: -0.5px;">${invoiceData.invoice_number}</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                      <div style="background: #F5F5F7; padding: 8px 12px; border-radius: 8px; border: 1px solid #F1F1F1; display: inline-block;">
                        <span style="font-size: 9px; font-weight: 700; color: #86868B; text-transform: uppercase; display: block; margin-bottom: 2px;">Tanggal Terbit</span>
                        <span style="font-size: 12px; font-weight: 700;">${new Date(invoiceData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div style="background: #E8F5E9; padding: 8px 12px; border-radius: 8px; border: 1px solid #C8E6C9; display: inline-block;">
                        <span style="font-size: 9px; font-weight: 700; color: #2E7D32; text-transform: uppercase; display: block; margin-bottom: 2px;">Status</span>
                        <span style="font-size: 12px; font-weight: 700; color: #2E7D32;">${invoiceData.status === 'Paid' ? 'Lunas' : invoiceData.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Client & Bank Details -->
            <div style="padding: 48px 64px; display: flex; gap: 64px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 24px;">
                <h4 style="font-size: 11px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Penerima Layanan</h4>
                <div>
                  <p style="font-size: 24px; font-weight: 700; color: #1D1D1F; margin: 0; letter-spacing: -0.5px;">${invoiceData.client_name}</p>
                  <p style="font-size: 14px; font-weight: 700; color: #0066FF; margin: 4px 0 0 0;">${invoiceData.client_company || "-"}</p>
                  <div style="margin-top: 16px; font-size: 13px; color: #86868B; font-weight: 500; font-style: italic; display: flex; flex-direction: column; gap: 4px;">
                    <p style="margin: 0;">${invoiceData.client_email}</p>
                    <p style="margin: 0; line-height: 1.5;">${invoiceData.client_address || "-"}</p>
                  </div>
                </div>
              </div>

              <div style="flex: 1; display: flex; flex-direction: column; gap: 24px;">
                <h4 style="font-size: 11px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Metode Pembayaran</h4>
                <div style="background: #F5F5F7; padding: 24px; border-radius: 24px; border: 1px solid #F1F1F1; display: flex; flex-direction: column; gap: 16px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0066FF; border: 1px solid #E8E8ED;">
                      <span style="font-size: 16px;">💳</span>
                    </div>
                    <div>
                      <p style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; margin: 0; letter-spacing: -0.2px;">Transfer Bank</p>
                      <p style="font-size: 14px; font-weight: 700; color: #1D1D1F; margin: 0;">${globalData.invoiceSettings.bankName}</p>
                    </div>
                  </div>
                  <div style="border-top: 1px solid #E8E8ED; padding-top: 12px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 12px; color: #86868B; font-weight: 500;">Penerima</span>
                      <span style="font-size: 12px; font-weight: 700; color: #1D1D1F;">${globalData.invoiceSettings.bankAccountName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-size: 12px; color: #86868B; font-weight: 500;">No. Rekening</span>
                      <span style="font-size: 14px; font-weight: 700; color: #1D1D1F; letter-spacing: 1px; font-family: monospace;">${globalData.invoiceSettings.bankAccountNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items Table -->
            <div style="padding: 24px 64px 40px 64px;">
              <div style="margin-bottom: 16px; font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">
                <span style="color: #0066FF; margin-right: 8px;">ℹ️</span>
                Periode Proyek: <span style="color: #1D1D1F; font-weight: 700;">
                  ${invoiceData.project_period_start ? `${new Date(invoiceData.project_period_start).toLocaleDateString('id-ID')} - ${new Date(invoiceData.project_period_end || '').toLocaleDateString('id-ID')}` : "-"}
                </span>
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="border-bottom: 2px solid #1D1D1F;">
                    <th style="padding: 0 0 24px 0; text-align: left; font-size: 11px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Deskripsi Item</th>
                    <th style="padding: 0 16px 24px 16px; text-align: center; font-size: 11px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Qty</th>
                    <th style="padding: 0 0 24px 0; text-align: right; font-size: 11px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Total</th>
                  </tr>
                </thead>
                <tbody style="border-top: 1px solid #F5F5F7;">
                  ${items.map((item: InvoiceItem) => `
                    <tr style="border-bottom: 1px solid #F5F5F7;">
                      <td style="padding: 24px 16px 24px 0;">
                        <p style="font-size: 14px; font-weight: 700; color: #1D1D1F; margin: 0 0 4px 0; letter-spacing: -0.2px;">${item.desc}</p>
                        <p style="font-size: 11px; color: #86868B; font-weight: 500; margin: 0; line-height: 1.5; max-width: 400px;">${item.details || ""}</p>
                      </td>
                      <td style="padding: 24px 16px; text-align: center; font-size: 14px; font-weight: 700; color: #86868B;">${item.qty}</td>
                      <td style="padding: 24px 0; text-align: right; font-size: 14px; font-weight: 700; color: #1D1D1F;">${formatCurrency(item.qty * item.price)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Totals Section -->
            <div style="padding: 40px 64px; background: #FAFAFB; border-top: 1px solid #F2F2F7; display: flex; justify-content: space-between; gap: 48px;">
              <div style="max-width: 340px;">
                <h5 style="font-size: 10px; font-weight: 700; color: #1D1D1F; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">🛡️ Syarat & Ketentuan</h5>
                <div style="font-size: 10px; color: #86868B; font-weight: 500; line-height: 1.7; display: flex; flex-direction: column; gap: 6px;">
                  ${globalData.invoiceSettings.termsAndConditions.split('\n').map((term: string) => `<div style="display: flex; gap: 8px;"><span style="color: #D2D2D7;">•</span> <span>${term}</span></div>`).join('')}
                </div>
              </div>
              <div style="width: 280px; display: flex; flex-direction: column; gap: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E8E8ED; padding-bottom: 16px;">
                  <span style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">Subtotal</span>
                  <span style="font-size: 14px; font-weight: 700; color: #1D1D1F;">${formatCurrency(total)}</span>
                </div>
                <div style="text-align: right; margin-top: 16px;">
                  <p style="font-size: 10px; font-weight: 700; color: #0066FF; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 8px 0;">Total Akhir</p>
                  <p style="font-size: 40px; font-weight: 700; color: #1D1D1F; margin: 0; letter-spacing: -2px; line-height: 1;">${formatCurrency(total)}</p>
                  <div style="margin-top: 16px; background: #E8F5E9; border: 1px solid #C8E6C9; border-radius: 50px; display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px;">
                    <span style="font-size: 9px; font-weight: 900; color: #2E7D32; text-transform: uppercase; letter-spacing: 2px;">Verified Payment</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Signature Area -->
            <div style="padding: 64px; background: white; border-top: 1px sol              <div style="display: flex; justify-content: space-between; text-align: center;">
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                  <p style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Pelanggan,</p>
                  <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    ${invoiceData.client_signature ? `<img src="${invoiceData.client_signature}" style="max-height: 100%; max-width: 150px; mix-blend-multiply: multiply;" />` : ''}
                  </div>
                  <div style="width: 80%; border-top: 1px solid #D2D2D7; padding-top: 12px;">
                    <p style="font-size: 11px; font-weight: 700; color: #1D1D1F; margin: 0; text-transform: uppercase;">${invoiceData.client_name}</p>
                    <p style="font-size: 9px; color: #94A3B8; font-weight: 500; font-style: italic; text-transform: uppercase; margin-top: 2px;">Signature / Digital Verified</p>
                  </div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                  <p style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Marketing,</p>
                  <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    ${globalData.invoiceSettings.signatureFields?.marketingSignature ? `<img src="${globalData.invoiceSettings.signatureFields.marketingSignature}" style="max-height: 100%; max-width: 150px; mix-blend-multiply: multiply;" />` : ''}
                  </div>
                  <div style="width: 80%; border-top: 1px solid #D2D2D7; padding-top: 12px;">
                    <p style="font-size: 11px; font-weight: 700; color: #1D1D1F; margin: 0; text-transform: uppercase; font-style: italic;">${globalData.invoiceSettings.signatureFields?.marketingName || "Marketing Officer"}</p>
                    <p style="font-size: 9px; color: #94A3B8; font-weight: 500; text-transform: uppercase; margin-top: 2px;">${globalData.invoiceSettings.signatureFields?.marketingTitle || "Finance Department"}</p>
                  </div>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;">
                  <p style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Owner,</p>
                  ${total > 5000000 ? `
                  <div style="position: absolute; top: 30px; left: 50%; transform: translateX(-50%) rotate(-10deg); border: 2px dashed #D2D2D7; padding: 10px 15px; border-radius: 8px; background: rgba(245, 245, 247, 0.2); width: 80px; text-align: center;">
                    <p style="font-size: 7px; color: #94A3B8; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">E-Stamp Duty</p>
                    <p style="font-size: 10px; color: #94A3B8; font-weight: 900; line-height: 1;">MATERAI<br/>10.000</p>
                  </div>
                  ` : ''}
                  <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    ${globalData.invoiceSettings.signatureFields?.ownerSignature ? `<img src="${globalData.invoiceSettings.signatureFields.ownerSignature}" style="max-height: 100%; max-width: 150px; mix-blend-multiply: multiply;" />` : ''}
                  </div>
                  <div style="width: 80%; border-top: 1px solid #D2D2D7; padding-top: 12px; position: relative; z-index: 2;">
                    <p style="font-size: 11px; font-weight: 700; color: #1D1D1F; margin: 0; text-transform: uppercase;">${globalData.invoiceSettings.signatureFields?.ownerName || "Direktur Utama"}</p>
                    <p style="font-size: 9px; color: #94A3B8; font-weight: 500; text-transform: uppercase; margin-top: 2px;">${globalData.invoiceSettings.signatureFields?.ownerTitle || "Chief Executive"}</p>
                  </div>
                </div>
              </div>命中�中        </div>
              </div>

              <div style="margin-top: 64px; display: flex; flex-direction: column; align-items: center; gap: 16px;">
                <div style="background: #F5F5F7; padding: 8px 20px; border-radius: 50px; border: 1px solid #F1F1F1; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 10px; font-weight: 700; color: #86868B; text-transform: uppercase; letter-spacing: 2px;">NPWP: <span style="color: #1D1D1F;">${globalData.invoiceSettings.companyNPWP}</span></span>
                </div>
                <div style="display: flex; gap: 24px; color: #D2D2D7; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                  <span>${globalData.invoiceSettings.companyLinkedin}</span>
                  <span>${globalData.invoiceSettings.companyInstagram}</span>
                </div>
              </div>
            </div>

            <!-- Footer Dark -->
            <div style="background: #1D1D1F; padding: 40px 64px; display: flex; justify-content: space-between; align-items: center; color: white;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 32px; height: 32px; background: white; border-radius: 8px; color: #1D1D1F; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; font-style: italic;">M</div>
                <span style="font-size: 12px; font-weight: 700; letter-spacing: 1px; font-style: italic;">MITRALABS.WEB.ID</span>
              </div>
              <div style="display: flex; gap: 32px; align-items: center;">
                <div style="text-align: right;">
                  <p style="font-size: 10px; font-weight: 700; margin: 0 0 4px 0; color: white;">E-Verification</p>
                  <p style="font-size: 9px; opacity: 0.4; margin: 0; letter-spacing: 1px;">HASH: ML-${invoiceData.invoice_number}-SECURE</p>
                </div>
                <div style="width: 1px; height: 32px; background: #3A3A3C;"></div>
                <div style="text-align: right;">
                  <p style="font-size: 10px; font-weight: 700; margin: 0 0 4px 0; color: white;">Timestamp</p>
                  <p style="font-size: 9px; opacity: 0.4; margin: 0; font-style: italic;">${new Date().toLocaleString('id-ID')} WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Gunakan scale tinggi untuk hasil tajam (retina quality)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F5F5F7',
        logging: false
      });

      document.body.removeChild(container);

      // Flexibel Height: Mengikuti tinggi konten, bukan memaksa A4
      const imgWidth = 210; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [imgWidth, imgHeight] // CUSTOM FORMAT SESUAI KONTEN
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

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
