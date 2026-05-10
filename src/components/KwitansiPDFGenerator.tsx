"use client";

import React, { useRef } from 'react';
import { Download } from 'lucide-react';
import { useData, Invoice } from '@/context/DataContext';

interface InvoiceItem {
  desc: string;
  details?: string;
  price: number;
  qty: number;
}

interface KwitansiPDFGeneratorProps {
  invoiceNumber: string;
  invoiceData: Invoice;
  className?: string;
}

export default function KwitansiPDFGenerator({ invoiceNumber, invoiceData, className }: KwitansiPDFGeneratorProps) {
  const { data } = useData();
  const settings = data.invoiceSettings;
  const kwitansiRef = useRef<HTMLDivElement>(null);

  const items = typeof invoiceData.items === 'string'
    ? JSON.parse(invoiceData.items)
    : invoiceData.items;

  const subtotal = items.reduce((sum: number, item: InvoiceItem) => sum + (item.price * item.qty), 0);
  const tax = subtotal * (settings?.taxRate || 0) / 100;
  const total = subtotal + tax;

  // Format currency to Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date to Indonesian format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const generatePDF = async () => {
    try {
      console.log('🔄 Starting Kwitansi HTML-to-PDF generation...');

      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      if (!kwitansiRef.current) {
        throw new Error('Kwitansi element not found');
      }

      console.log('📄 Capturing kwitansi element...');

      // Configure html2canvas for high quality
      const canvas = await html2canvas(kwitansiRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: kwitansiRef.current.scrollWidth,
        height: kwitansiRef.current.scrollHeight,
      });

      console.log('🖼️ Canvas created, generating PDF...');

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit the page
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;

      let imgWidth = pageWidth - 20; // 10mm margin on each side
      let imgHeight = imgWidth / ratio;

      // If height exceeds page, scale down
      if (imgHeight > pageHeight - 20) {
        imgHeight = pageHeight - 20;
        imgWidth = imgHeight * ratio;
      }

      // Center the image
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      // Convert canvas to image and add to PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      console.log('📥 Saving Kwitansi PDF...');
      // Save PDF - This will directly download
      pdf.save(`Kwitansi-${invoiceNumber}.pdf`);
      console.log('✅ Kwitansi PDF download initiated successfully!');

    } catch (error) {
      console.error('❌ Error generating Kwitansi PDF:', error);
      alert('Failed to generate Kwitansi PDF. Please try again.');
    }
  };

  return (
    <>
      {/* Hidden Kwitansi Design for PDF Generation */}
      <div ref={kwitansiRef} className="fixed -left-[9999px] top-0 w-[794px] bg-white">
        {/* Kwitansi Design - Based on provided HTML */}
        <div className="w-full bg-white p-12 font-sans">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">KWITANSI</h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">No: {invoiceData.invoice_number}</p>
          </div>

          {/* Company Info */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {settings?.companyName || 'MITRALABS.ID'}
            </h2>
            <p className="text-gray-600 mb-1">{settings?.companyTagline || 'Precision Web Engineering'}</p>
            <p className="text-gray-600 mb-1">
              {settings?.companyAddress || 'Jl. Contoh No. 123'}, {settings?.companyCity || 'Medan'}
            </p>
            <p className="text-gray-600 mb-1">
              {settings?.companyProvince || 'Sumatera Utara'} {settings?.companyPostalCode || '20111'}
            </p>
            <p className="text-gray-600 mb-1">Telp: {settings?.companyPhone || '+62 823-8111-8520'}</p>
            <p className="text-gray-600 mb-1">Email: {settings?.companyEmail || 'contact@mitralabs.id'}</p>
            {settings?.companyWebsite && (
              <p className="text-gray-600 mb-1">Website: {settings.companyWebsite}</p>
            )}
            {settings?.companyNPWP && (
              <p className="text-gray-600">NPWP: {settings.companyNPWP}</p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-300 mb-8"></div>

          {/* Receipt Details */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Client Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Telah Terima Dari:</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Nama:</span> {invoiceData.client_name}
                  </p>
                  {invoiceData.client_company && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Perusahaan:</span> {invoiceData.client_company}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {invoiceData.client_email}
                  </p>
                  {invoiceData.client_address && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Alamat:</span> {invoiceData.client_address}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column - Receipt Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Kwitansi:</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Tanggal:</span> {formatDate(invoiceData.created_at)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Jatuh Tempo:</span> {formatDate(invoiceData.due_date)}
                  </p>
                  {invoiceData.project_period_start && invoiceData.project_period_end && (
                    <>
                      <p className="text-gray-700">
                        <span className="font-semibold">Periode Mulai:</span> {formatDate(invoiceData.project_period_start)}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Periode Selesai:</span> {formatDate(invoiceData.project_period_end)}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Untuk Pembayaran:</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Deskripsi</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Harga</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: InvoiceItem, index: number) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 border-b">
                        <div>
                          <p className="font-medium text-gray-800">{item.desc}</p>
                          {item.details && (
                            <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center border-b text-gray-700">{item.qty}</td>
                      <td className="px-4 py-3 text-right border-b text-gray-700">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right border-b font-semibold text-gray-800">
                        {formatCurrency(item.price * item.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="mb-8">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-700">{settings?.taxLabel || 'PPN (11%)'}:</span>
                      <span className="font-semibold text-gray-800">{formatCurrency(tax)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-300 pt-2">
                    <div className="flex justify-between py-2">
                      <span className="text-xl font-bold text-gray-800">TOTAL:</span>
                      <span className="text-xl font-bold text-blue-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {settings?.paymentInstructions && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Instruksi Pembayaran:</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-line">{settings.paymentInstructions}</p>
              </div>
            </div>
          )}

          {/* Bank Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Bank:</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Bank:</span> {settings?.bankName || 'Bank Central Asia (BCA)'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">No. Rekening:</span> {settings?.bankAccountNumber || '8000-7625-12'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Atas Nama:</span> {settings?.bankAccountName || 'Ridho Robbi Pasi'}
                  </p>
                  {settings?.bankBranch && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Cabang:</span> {settings.bankBranch}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left - Marketing Signature */}
              {settings?.signatureFields?.marketing && (
                <div className="text-center">
                  <p className="text-gray-700 mb-16">Yang Menerima,</p>
                  <div className="border-b border-gray-400 mb-2"></div>
                  <p className="text-gray-700 font-semibold">{settings.signatureFields.marketing}</p>
                </div>
              )}

              {/* Right - Owner Signature */}
              {settings?.signatureFields?.owner && (
                <div className="text-center">
                  <p className="text-gray-700 mb-16">Hormat Kami,</p>
                  <div className="border-b border-gray-400 mb-2"></div>
                  <p className="text-gray-700 font-semibold">{settings.signatureFields.owner}</p>
                </div>
              )}
            </div>
          </div>

          {/* Stamp Duty */}
          {settings?.stampDutyRequired && (
            <div className="mb-8 text-center">
              <div className="inline-block border-2 border-gray-400 p-4 transform rotate-12">
                <p className="text-sm font-bold text-gray-700">MATERAI</p>
                <p className="text-xs text-gray-600">{formatCurrency(settings.stampDutyAmount || 10000)}</p>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          {settings?.termsAndConditions && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Syarat & Ketentuan:</h3>
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {settings.termsAndConditions}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {settings?.footerNote || 'Verified by Mitralabs Cryptographic Protocol'}
            </p>
            {(settings?.companyLinkedin || settings?.companyInstagram) && (
              <div className="mt-2 space-x-4">
                {settings?.companyLinkedin && (
                  <span className="text-sm text-gray-500">LinkedIn: {settings.companyLinkedin}</span>
                )}
                {settings?.companyInstagram && (
                  <span className="text-sm text-gray-500">Instagram: {settings.companyInstagram}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={generatePDF}
        className={className || "p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"}
        title="Download Kwitansi PDF"
      >
        <Download size={16} />
      </button>
    </>
  );
}
