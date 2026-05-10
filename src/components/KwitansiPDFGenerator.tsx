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
      console.log('🔄 Starting PERFECT kwitansi PDF generation...');

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

      // PERFECT KWITANSI DESIGN - Indonesian Language with Modern Apple-Style Design
      container.innerHTML = `
        <div style="
          width: 794px;
          min-height: 1123px;
          background: #F5F5F7;
          padding: 0;
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          box-sizing: border-box;
        ">
          <!-- Main Content Card -->
          <div style="
            background: white;
            margin: 40px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            border: 1px solid #E5E7EB;
          ">
            <!-- Header Section -->
            <div style="
              background: linear-gradient(135deg, #1D1D1F 0%, #2C2C2E 100%);
              color: white;
              padding: 48px 48px 40px 48px;
              position: relative;
            ">
              <!-- Decorative Elements -->
              <div style="
                position: absolute;
                top: 0;
                right: 0;
                width: 200px;
                height: 200px;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(50%, -50%);
              "></div>

              <div style="
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                position: relative;
                z-index: 2;
              ">
                <!-- Company Info -->
                <div style="flex: 1; max-width: 400px;">
                  <div style="
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 8px;
                    letter-spacing: -1px;
                    line-height: 1.1;
                  ">${settings?.companyName || 'MITRALABS.ID'}</div>

                  <div style="
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 500;
                    margin-bottom: 24px;
                    letter-spacing: 0.5px;
                  ">${settings?.companyTagline || 'Precision Web Engineering'}</div>

                  <div style="
                    font-size: 14px;
                    opacity: 0.8;
                    line-height: 1.6;
                    font-weight: 400;
                  ">
                    <div style="margin-bottom: 6px;">${settings?.companyAddress || 'Jl. Contoh No. 123'}</div>
                    <div style="margin-bottom: 6px;">${settings?.companyCity || 'Medan'}, ${settings?.companyProvince || 'Sumatera Utara'} ${settings?.companyPostalCode || '20111'}</div>
                    <div style="margin-bottom: 6px;">Telp: ${settings?.companyPhone || '+62 823-8111-8520'}</div>
                    <div style="margin-bottom: 6px;">Email: ${settings?.companyEmail || 'contact@mitralabs.id'}</div>
                    <div style="margin-bottom: 6px;">Website: ${settings?.companyWebsite || 'www.mitralabs.id'}</div>
                    <div style="margin-bottom: 6px;">NPWP: ${settings?.companyNPWP || '00.000.000.0-000.000'}</div>
                    ${settings?.companyLinkedin ? `<div style="margin-bottom: 6px;">LinkedIn: ${settings.companyLinkedin}</div>` : ''}
                    ${settings?.companyInstagram ? `<div style="margin-bottom: 6px;">Instagram: ${settings.companyInstagram}</div>` : ''}
                  </div>
                </div>

                <!-- Kwitansi Badge -->
                <div style="
                  background: rgba(255, 255, 255, 0.15);
                  backdrop-filter: blur(10px);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  padding: 24px 40px;
                  border-radius: 20px;
                  text-align: center;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                ">
                  <div style="
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: 3px;
                    margin-bottom: 8px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  ">KWITANSI</div>
                  <div style="
                    font-size: 12px;
                    opacity: 0.9;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                  ">Tanda Terima Resmi</div>
                </div>
              </div>
            </div>

            <!-- Content Section -->
            <div style="padding: 48px;">
              <!-- Invoice Details Cards -->
              <div style="
                display: flex;
                gap: 32px;
                margin-bottom: 48px;
              ">
                <!-- Client Info Card -->
                <div style="
                  flex: 1;
                  background: #F8FAFC;
                  border: 1px solid #E2E8F0;
                  border-radius: 16px;
                  padding: 32px;
                  position: relative;
                  overflow: hidden;
                ">
                  <!-- Card Decoration -->
                  <div style="
                    position: absolute;
                    top: -20px;
                    right: -20px;
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                    border-radius: 50%;
                    opacity: 0.1;
                  "></div>

                  <div style="
                    font-size: 12px;
                    font-weight: 800;
                    color: #64748B;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 16px;
                    position: relative;
                    z-index: 2;
                  ">Ditagihkan Kepada</div>

                  <div style="
                    font-size: 20px;
                    font-weight: 800;
                    color: #1D1D1F;
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 2;
                  ">${invoiceData.client_name}</div>

                  ${invoiceData.client_company ? `
                  <div style="
                    font-size: 16px;
                    font-weight: 600;
                    color: #475569;
                    margin-bottom: 12px;
                    position: relative;
                    z-index: 2;
                  ">${invoiceData.client_company}</div>
                  ` : ''}

                  <div style="
                    font-size: 14px;
                    color: #64748B;
                    margin-bottom: 8px;
                    position: relative;
                    z-index: 2;
                  ">${invoiceData.client_email}</div>

                  ${invoiceData.client_address ? `
                  <div style="
                    font-size: 13px;
                    color: #64748B;
                    line-height: 1.6;
                    position: relative;
                    z-index: 2;
                  ">${invoiceData.client_address}</div>
                  ` : ''}
                </div>

                <!-- Invoice Info Card -->
                <div style="
                  flex: 1;
                  background: #F8FAFC;
                  border: 1px solid #E2E8F0;
                  border-radius: 16px;
                  padding: 32px;
                  position: relative;
                  overflow: hidden;
                ">
                  <!-- Card Decoration -->
                  <div style="
                    position: absolute;
                    top: -20px;
                    left: -20px;
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #10B981, #059669);
                    border-radius: 50%;
                    opacity: 0.1;
                  "></div>

                  <div style="margin-bottom: 24px; position: relative; z-index: 2;">
                    <div style="
                      font-size: 12px;
                      font-weight: 800;
                      color: #64748B;
                      text-transform: uppercase;
                      letter-spacing: 2px;
                      margin-bottom: 8px;
                    ">Nomor Kwitansi</div>
                    <div style="
                      font-size: 18px;
                      font-weight: 800;
                      color: #1D1D1F;
                      font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
                      background: #E2E8F0;
                      padding: 8px 12px;
                      border-radius: 8px;
                      display: inline-block;
                    ">${invoiceData.invoice_number}</div>
                  </div>

                  <div style="margin-bottom: 24px; position: relative; z-index: 2;">
                    <div style="
                      font-size: 12px;
                      font-weight: 800;
                      color: #64748B;
                      text-transform: uppercase;
                      letter-spacing: 2px;
                      margin-bottom: 8px;
                    ">Tanggal Terbit</div>
                    <div style="
                      font-size: 16px;
                      font-weight: 700;
                      color: #1D1D1F;
                    ">${new Date(invoiceData.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}</div>
                  </div>

                  ${invoiceData.project_period_start && invoiceData.project_period_end ? `
                  <div style="position: relative; z-index: 2;">
                    <div style="
                      font-size: 12px;
                      font-weight: 800;
                      color: #64748B;
                      text-transform: uppercase;
                      letter-spacing: 2px;
                      margin-bottom: 8px;
                    ">Periode Proyek</div>
                    <div style="
                      font-size: 16px;
                      font-weight: 700;
                      color: #1D1D1F;
                    ">${new Date(invoiceData.project_period_start).toLocaleDateString('id-ID')} - ${new Date(invoiceData.project_period_end).toLocaleDateString('id-ID')}</div>
                  </div>
                  ` : ''}
                </div>
              </div>

              <!-- Items Table -->
              <div style="
                background: white;
                border: 1px solid #E2E8F0;
                border-radius: 20px;
                overflow: hidden;
                margin-bottom: 48px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
              ">
                <!-- Table Header -->
                <div style="
                  background: linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%);
                  padding: 24px 32px;
                  border-bottom: 1px solid #E2E8F0;
                  display: flex;
                  font-size: 12px;
                  font-weight: 800;
                  color: #475569;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                ">
                  <div style="flex: 3; margin-right: 24px;">Deskripsi Layanan</div>
                  <div style="flex: 1; text-align: center; margin-right: 24px;">Qty</div>
                  <div style="flex: 1; text-align: right; margin-right: 24px;">Harga Satuan</div>
                  <div style="flex: 1; text-align: right;">Total Harga</div>
                </div>

                <!-- Table Body -->
                ${items.map((item: InvoiceItem, index: number) => `
                  <div style="
                    padding: 28px 32px;
                    border-bottom: ${index < items.length - 1 ? '1px solid #F1F5F9' : 'none'};
                    display: flex;
                    align-items: flex-start;
                    background: ${index % 2 === 0 ? '#FAFBFC' : 'white'};
                    transition: all 0.2s ease;
                  ">
                    <div style="flex: 3; margin-right: 24px;">
                      <div style="
                        font-size: 16px;
                        font-weight: 700;
                        color: #1D1D1F;
                        margin-bottom: 6px;
                        line-height: 1.4;
                      ">${item.desc}</div>
                      ${item.details ? `
                      <div style="
                        font-size: 13px;
                        color: #64748B;
                        line-height: 1.5;
                        font-weight: 500;
                      ">${item.details}</div>
                      ` : ''}
                    </div>
                    <div style="
                      flex: 1;
                      text-align: center;
                      margin-right: 24px;
                      font-size: 16px;
                      font-weight: 700;
                      color: #475569;
                    ">${item.qty}</div>
                    <div style="
                      flex: 1;
                      text-align: right;
                      margin-right: 24px;
                      font-size: 16px;
                      font-weight: 700;
                      color: #475569;
                    ">Rp ${item.price.toLocaleString('id-ID')}</div>
                    <div style="
                      flex: 1;
                      text-align: right;
                      font-size: 16px;
                      font-weight: 800;
                      color: #1D1D1F;
                    ">Rp ${(item.price * item.qty).toLocaleString('id-ID')}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Total Section -->
              <div style="
                display: flex;
                justify-content: flex-end;
                margin-bottom: 48px;
              ">
                <div style="
                  background: linear-gradient(135deg, #1D1D1F 0%, #2C2C2E 100%);
                  color: white;
                  padding: 32px 40px;
                  border-radius: 20px;
                  min-width: 320px;
                  box-shadow: 0 20px 40px rgba(29, 29, 31, 0.2);
                  position: relative;
                  overflow: hidden;
                ">
                  <!-- Decoration -->
                  <div style="
                    position: absolute;
                    top: -30px;
                    right: -30px;
                    width: 100px;
                    height: 100px;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    border-radius: 50%;
                  "></div>

                  ${subtotal !== total ? `
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    font-size: 16px;
                    opacity: 0.8;
                    position: relative;
                    z-index: 2;
                  ">
                    <span>Subtotal:</span>
                    <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    font-size: 16px;
                    opacity: 0.8;
                    position: relative;
                    z-index: 2;
                  ">
                    <span>${settings?.taxLabel || 'Pajak'}:</span>
                    <span>Rp ${tax.toLocaleString('id-ID')}</span>
                  </div>
                  ` : ''}
                  <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                  ">
                    <div style="
                      font-size: 16px;
                      font-weight: 700;
                      opacity: 0.9;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    ">Total Pembayaran</div>
                    <div style="
                      font-size: 28px;
                      font-weight: 900;
                      letter-spacing: -1px;
                    ">Rp ${total.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div style="
                background: #F8FAFC;
                border: 1px solid #E2E8F0;
                border-radius: 20px;
                padding: 32px;
                margin-bottom: 48px;
                position: relative;
                overflow: hidden;
              ">
                <!-- Decoration -->
                <div style="
                  position: absolute;
                  bottom: -40px;
                  left: -40px;
                  width: 120px;
                  height: 120px;
                  background: linear-gradient(135deg, #3B82F6, #1D4ED8);
                  border-radius: 50%;
                  opacity: 0.05;
                "></div>

                <div style="
                  font-size: 18px;
                  font-weight: 800;
                  color: #1D1D1F;
                  margin-bottom: 20px;
                  position: relative;
                  z-index: 2;
                ">Informasi Pembayaran</div>

                <div style="
                  font-size: 14px;
                  color: #475569;
                  line-height: 1.7;
                  margin-bottom: 24px;
                  position: relative;
                  z-index: 2;
                ">${settings?.paymentInstructions || 'Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran.'}</div>

                <div style="
                  background: white;
                  border: 1px solid #E2E8F0;
                  border-radius: 16px;
                  padding: 24px;
                  position: relative;
                  z-index: 2;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
                ">
                  <div style="
                    font-size: 18px;
                    font-weight: 800;
                    color: #1D1D1F;
                    margin-bottom: 12px;
                  ">${settings?.bankName || 'Bank Central Asia (BCA)'}</div>
                  <div style="
                    font-size: 15px;
                    color: #475569;
                    margin-bottom: 8px;
                  ">Nomor Rekening: <span style="font-weight: 700; font-family: 'SF Mono', monospace; background: #F1F5F9; padding: 4px 8px; border-radius: 6px;">${settings?.bankAccountNumber || '8000-7625-12'}</span></div>
                  <div style="
                    font-size: 15px;
                    color: #475569;
                    margin-bottom: 8px;
                  ">Nama Pemilik: <span style="font-weight: 700;">${settings?.bankAccountName || 'Ridho Robbi Pasi'}</span></div>
                  ${settings?.bankBranch ? `
                  <div style="
                    font-size: 15px;
                    color: #475569;
                  ">Cabang: <span style="font-weight: 700;">${settings.bankBranch}</span></div>
                  ` : ''}
                </div>
              </div>

              <!-- Signature Section -->
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                margin-bottom: 48px;
                gap: 40px;
              ">
                ${settings?.signatureFields?.marketing ? `
                <div style="
                  text-align: center;
                  flex: 1;
                ">
                  <div style="
                    font-size: 14px;
                    color: #64748B;
                    margin-bottom: 80px;
                    font-weight: 600;
                  ">${settings.signatureFields.marketing}</div>
                  <div style="
                    border-top: 2px solid #E2E8F0;
                    padding-top: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                  ">Tanda Tangan & Tanggal</div>
                </div>
                ` : ''}

                ${settings?.stampDutyRequired ? `
                <div style="
                  text-align: center;
                  flex: 1;
                ">
                  <div style="
                    width: 100px;
                    height: 100px;
                    border: 3px dashed #CBD5E1;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    font-size: 11px;
                    color: #94A3B8;
                    text-align: center;
                    line-height: 1.3;
                    font-weight: 700;
                    background: #F8FAFC;
                  ">MATERAI<br/>Rp ${(settings.stampDutyAmount || 10000).toLocaleString('id-ID')}</div>
                  <div style="
                    font-size: 12px;
                    color: #64748B;
                    font-weight: 600;
                  ">Bea Materai</div>
                </div>
                ` : ''}

                ${settings?.signatureFields?.owner ? `
                <div style="
                  text-align: center;
                  flex: 1;
                ">
                  <div style="
                    font-size: 14px;
                    color: #64748B;
                    margin-bottom: 80px;
                    font-weight: 600;
                  ">${settings.signatureFields.owner}</div>
                  <div style="
                    border-top: 2px solid #E2E8F0;
                    padding-top: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                  ">Tanda Tangan & Tanggal</div>
                </div>
                ` : ''}
              </div>

              <!-- Terms & Conditions -->
              ${settings?.termsAndConditions ? `
              <div style="
                background: #F8FAFC;
                border: 1px solid #E2E8F0;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 32px;
              ">
                <div style="
                  font-size: 14px;
                  font-weight: 800;
                  color: #475569;
                  margin-bottom: 16px;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                ">Syarat & Ketentuan</div>
                <div style="
                  font-size: 12px;
                  color: #64748B;
                  line-height: 1.7;
                  white-space: pre-line;
                  font-weight: 500;
                ">${settings.termsAndConditions}</div>
              </div>
              ` : ''}

              <!-- Footer -->
              <div style="
                text-align: center;
                padding-top: 24px;
                border-top: 1px solid #E2E8F0;
              ">
                <div style="
                  font-size: 11px;
                  color: #94A3B8;
                  font-weight: 600;
                  letter-spacing: 1px;
                ">${settings?.footerNote || 'Verified by Mitralabs Cryptographic Protocol'}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add the container to the document
      document.body.appendChild(container);

      console.log('📸 Capturing HTML as canvas with maximum quality...');

      // Capture the HTML as canvas with highest quality settings
      const canvas = await html2canvas(container, {
        scale: 3, // Ultra high resolution for perfect quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F5F5F7',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        imageTimeout: 0,
        removeContainer: false
      });

      // Remove the temporary container
      document.body.removeChild(container);

      console.log('📄 Converting to PDF with perfect quality...');

      // Create PDF from canvas with maximum quality
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');

      console.log('📥 Saving PERFECT kwitansi PDF...');
      // Save PDF - This will directly download
      pdf.save(`Kwitansi-${invoiceNumber}.pdf`);
      console.log('✅ PERFECT kwitansi PDF download completed successfully!');

    } catch (error) {
      console.error('❌ Error generating perfect kwitansi PDF:', error);
      alert('Gagal membuat kwitansi PDF. Silakan coba lagi.');
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
