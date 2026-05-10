"use client";

import { Download } from 'lucide-react';
import { useData } from '@/context/DataContext';

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
}

interface KwitansiPDFGeneratorProps {
  invoiceNumber: string;
  invoiceData: InvoiceData;
  className?: string;
}

export default function KwitansiPDFGenerator({ invoiceNumber, invoiceData, className }: KwitansiPDFGeneratorProps) {
  const { data } = useData();
  const settings = data.invoiceSettings;

  const generatePDF = async () => {
    try {
      console.log('🔄 Starting premium kwitansi PDF generation...');

      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      console.log('✅ Libraries loaded successfully');

      const items = typeof invoiceData.items === 'string'
        ? JSON.parse(invoiceData.items)
        : invoiceData.items;

      console.log('📄 Kwitansi data:', { invoiceNumber, items });

      const subtotal = items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.qty), 0);
      const tax = subtotal * (settings?.taxRate || 0) / 100;
      const total = subtotal + tax;

      console.log('💰 Calculations:', { subtotal, tax, total });

      // Create a temporary container for the HTML content
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '794px'; // A4 width in pixels at 96 DPI
      container.style.minHeight = '1123px'; // A4 height in pixels at 96 DPI
      container.style.backgroundColor = 'white';
      container.style.fontFamily = 'Inter, system-ui, -apple-system, sans-serif';
      container.style.fontSize = '14px';
      container.style.lineHeight = '1.5';
      container.style.color = '#1f2937';

      // Premium kwitansi HTML template with Inter font and sophisticated styling
      container.innerHTML = `
        <div style="
          width: 794px;
          min-height: 1123px;
          background: white;
          padding: 60px;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          position: relative;
        ">
          <!-- Header Section -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 50px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f1f5f9;
          ">
            <!-- Company Info -->
            <div style="flex: 1;">
              <div style="
                font-size: 28px;
                font-weight: 800;
                color: #0f172a;
                margin-bottom: 8px;
                letter-spacing: -0.5px;
              ">${settings?.companyName || 'MITRALABS.ID'}</div>
              <div style="
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                margin-bottom: 20px;
              ">${settings?.companyTagline || 'Precision Web Engineering'}</div>

              <div style="
                font-size: 12px;
                color: #475569;
                line-height: 1.6;
                font-weight: 400;
              ">
                <div style="margin-bottom: 4px;">${settings?.companyAddress || 'Jl. Contoh No. 123'}</div>
                <div style="margin-bottom: 4px;">${settings?.companyCity || 'Medan'}, ${settings?.companyProvince || 'Sumatera Utara'} ${settings?.companyPostalCode || '20111'}</div>
                <div style="margin-bottom: 4px;">Tel: ${settings?.companyPhone || '+62 823-8111-8520'}</div>
                <div style="margin-bottom: 4px;">Email: ${settings?.companyEmail || 'contact@mitralabs.id'}</div>
                <div style="margin-bottom: 4px;">Web: ${settings?.companyWebsite || 'www.mitralabs.id'}</div>
                <div style="margin-bottom: 4px;">NPWP: ${settings?.companyNPWP || '00.000.000.0-000.000'}</div>
                ${settings?.companyLinkedin ? `<div style="margin-bottom: 4px;">LinkedIn: ${settings.companyLinkedin}</div>` : ''}
                ${settings?.companyInstagram ? `<div style="margin-bottom: 4px;">Instagram: ${settings.companyInstagram}</div>` : ''}
              </div>
            </div>

            <!-- Kwitansi Badge -->
            <div style="
              background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
              color: white;
              padding: 16px 32px;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
            ">
              <div style="
                font-size: 24px;
                font-weight: 800;
                letter-spacing: 2px;
                margin-bottom: 4px;
              ">KWITANSI</div>
              <div style="
                font-size: 11px;
                opacity: 0.8;
                font-weight: 500;
                letter-spacing: 1px;
              ">OFFICIAL RECEIPT</div>
            </div>
          </div>

          <!-- Invoice Details -->
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          ">
            <div style="flex: 1; margin-right: 40px;">
              <div style="
                background: #f8fafc;
                padding: 24px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              ">
                <div style="
                  font-size: 11px;
                  font-weight: 700;
                  color: #64748b;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  margin-bottom: 12px;
                ">BILL TO</div>

                <div style="
                  font-size: 18px;
                  font-weight: 700;
                  color: #0f172a;
                  margin-bottom: 8px;
                ">${invoiceData.client_name}</div>

                ${invoiceData.client_company ? `
                <div style="
                  font-size: 14px;
                  font-weight: 600;
                  color: #475569;
                  margin-bottom: 8px;
                ">${invoiceData.client_company}</div>
                ` : ''}

                <div style="
                  font-size: 13px;
                  color: #64748b;
                  margin-bottom: 6px;
                ">${invoiceData.client_email}</div>

                ${invoiceData.client_address ? `
                <div style="
                  font-size: 12px;
                  color: #64748b;
                  line-height: 1.5;
                ">${invoiceData.client_address}</div>
                ` : ''}
              </div>
            </div>

            <div style="flex: 1;">
              <div style="
                background: #f8fafc;
                padding: 24px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              ">
                <div style="margin-bottom: 16px;">
                  <div style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                  ">KWITANSI NUMBER</div>
                  <div style="
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    font-family: 'Courier New', monospace;
                  ">${invoiceData.invoice_number}</div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                  ">ISSUE DATE</div>
                  <div style="
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                  ">${new Date(invoiceData.created_at).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}</div>
                </div>

                ${invoiceData.project_period_start && invoiceData.project_period_end ? `
                <div>
                  <div style="
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                  ">PROJECT PERIOD</div>
                  <div style="
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                  ">${new Date(invoiceData.project_period_start).toLocaleDateString('id-ID')} - ${new Date(invoiceData.project_period_end).toLocaleDateString('id-ID')}</div>
                </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div style="
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 40px;
          ">
            <!-- Table Header -->
            <div style="
              background: #f1f5f9;
              padding: 16px 24px;
              border-bottom: 1px solid #e2e8f0;
              display: flex;
              font-size: 11px;
              font-weight: 700;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">
              <div style="flex: 3; margin-right: 20px;">DESCRIPTION</div>
              <div style="flex: 1; text-align: center; margin-right: 20px;">QTY</div>
              <div style="flex: 1; text-align: right; margin-right: 20px;">RATE</div>
              <div style="flex: 1; text-align: right;">AMOUNT</div>
            </div>

            <!-- Table Body -->
            ${items.map((item: InvoiceItem, index: number) => `
              <div style="
                padding: 20px 24px;
                border-bottom: ${index < items.length - 1 ? '1px solid #f1f5f9' : 'none'};
                display: flex;
                align-items: flex-start;
                ${index % 2 === 0 ? 'background: #fafbfc;' : 'background: white;'}
              ">
                <div style="flex: 3; margin-right: 20px;">
                  <div style="
                    font-size: 14px;
                    font-weight: 600;
                    color: #0f172a;
                    margin-bottom: 4px;
                  ">${item.desc}</div>
                  ${item.details ? `
                  <div style="
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.4;
                  ">${item.details}</div>
                  ` : ''}
                </div>
                <div style="
                  flex: 1;
                  text-align: center;
                  margin-right: 20px;
                  font-size: 14px;
                  font-weight: 600;
                  color: #475569;
                ">${item.qty}</div>
                <div style="
                  flex: 1;
                  text-align: right;
                  margin-right: 20px;
                  font-size: 14px;
                  font-weight: 600;
                  color: #475569;
                ">Rp ${item.price.toLocaleString('id-ID')}</div>
                <div style="
                  flex: 1;
                  text-align: right;
                  font-size: 14px;
                  font-weight: 700;
                  color: #0f172a;
                ">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
              </div>
            `).join('')}
          </div>

          <!-- Total Section -->
          <div style="
            display: flex;
            justify-content: flex-end;
            margin-bottom: 50px;
          ">
            <div style="
              background: #0f172a;
              color: white;
              padding: 24px 32px;
              border-radius: 12px;
              min-width: 280px;
              box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
            ">
              ${subtotal !== total ? `
              <div style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 14px;
                opacity: 0.8;
              ">
                <span>Subtotal:</span>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 16px;
                padding-bottom: 16px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 14px;
                opacity: 0.8;
              ">
                <span>${settings?.taxLabel || 'Tax'}:</span>
                <span>Rp ${tax.toLocaleString('id-ID')}</span>
              </div>
              ` : ''}
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
                <div style="
                  font-size: 14px;
                  font-weight: 600;
                  opacity: 0.9;
                ">TOTAL AMOUNT</div>
                <div style="
                  font-size: 24px;
                  font-weight: 800;
                  letter-spacing: -0.5px;
                ">Rp ${total.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div style="
            background: #f8fafc;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 40px;
          ">
            <div style="
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 16px;
            ">PAYMENT INFORMATION</div>

            <div style="
              font-size: 13px;
              color: #475569;
              line-height: 1.6;
              margin-bottom: 20px;
            ">${settings?.paymentInstructions || 'Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran.'}</div>

            <div style="
              background: white;
              padding: 20px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            ">
              <div style="
                font-size: 16px;
                font-weight: 700;
                color: #0f172a;
                margin-bottom: 8px;
              ">${settings?.bankName || 'Bank Central Asia (BCA)'}</div>
              <div style="
                font-size: 14px;
                color: #475569;
                margin-bottom: 4px;
              ">Account Number: <span style="font-weight: 600; font-family: 'Courier New', monospace;">${settings?.bankAccountNumber || '8000-7625-12'}</span></div>
              <div style="
                font-size: 14px;
                color: #475569;
                margin-bottom: 4px;
              ">Account Name: <span style="font-weight: 600;">${settings?.bankAccountName || 'Ridho Robbi Pasi'}</span></div>
              ${settings?.bankBranch ? `
              <div style="
                font-size: 14px;
                color: #475569;
              ">Branch: <span style="font-weight: 600;">${settings.bankBranch}</span></div>
              ` : ''}
            </div>
          </div>

          <!-- Signature Section -->
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          ">
            ${settings?.signatureFields?.marketing ? `
            <div style="
              text-align: center;
              flex: 1;
              margin-right: 40px;
            ">
              <div style="
                font-size: 12px;
                color: #64748b;
                margin-bottom: 60px;
              ">${settings.signatureFields.marketing}</div>
              <div style="
                border-top: 1px solid #cbd5e1;
                padding-top: 8px;
                font-size: 12px;
                font-weight: 600;
                color: #475569;
              ">Signature & Date</div>
            </div>
            ` : ''}

            ${settings?.stampDutyRequired ? `
            <div style="
              text-align: center;
              flex: 1;
              margin: 0 20px;
            ">
              <div style="
                width: 80px;
                height: 80px;
                border: 2px dashed #cbd5e1;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 12px;
                font-size: 10px;
                color: #94a3b8;
                text-align: center;
                line-height: 1.2;
              ">MATERAI<br/>Rp ${(settings.stampDutyAmount || 10000).toLocaleString('id-ID')}</div>
              <div style="
                font-size: 11px;
                color: #64748b;
              ">Stamp Duty</div>
            </div>
            ` : ''}

            ${settings?.signatureFields?.owner ? `
            <div style="
              text-align: center;
              flex: 1;
              margin-left: 40px;
            ">
              <div style="
                font-size: 12px;
                color: #64748b;
                margin-bottom: 60px;
              ">${settings.signatureFields.owner}</div>
              <div style="
                border-top: 1px solid #cbd5e1;
                padding-top: 8px;
                font-size: 12px;
                font-weight: 600;
                color: #475569;
              ">Signature & Date</div>
            </div>
            ` : ''}
          </div>

          <!-- Terms & Conditions -->
          ${settings?.termsAndConditions ? `
          <div style="
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            margin-bottom: 30px;
          ">
            <div style="
              font-size: 12px;
              font-weight: 700;
              color: #475569;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
            ">TERMS & CONDITIONS</div>
            <div style="
              font-size: 11px;
              color: #64748b;
              line-height: 1.6;
              white-space: pre-line;
            ">${settings.termsAndConditions}</div>
          </div>
          ` : ''}

          <!-- Footer -->
          <div style="
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          ">
            <div style="
              font-size: 10px;
              color: #94a3b8;
              font-weight: 500;
            ">${settings?.footerNote || 'Verified by Mitralabs Cryptographic Protocol'}</div>
          </div>
        </div>
      `;

      // Add the container to the document
      document.body.appendChild(container);

      console.log('📸 Capturing HTML as canvas...');

      // Capture the HTML as canvas with high quality
      const canvas = await html2canvas(container, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0
      });

      // Remove the temporary container
      document.body.removeChild(container);

      console.log('📄 Converting to PDF...');

      // Create PDF from canvas
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      console.log('📥 Saving premium kwitansi PDF...');
      // Save PDF - This will directly download
      pdf.save(`Kwitansi-${invoiceNumber}.pdf`);
      console.log('✅ Premium kwitansi PDF download initiated successfully!');

    } catch (error) {
      console.error('❌ Error generating kwitansi PDF:', error);
      alert('Failed to generate kwitansi PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className={className || "p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"}
      title="Download Kwitansi PDF"
    >
      <Download size={16} />
    </button>
  );
}
