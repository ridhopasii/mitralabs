"use client";

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download } from 'lucide-react';
import { useData } from '@/context/DataContext';

interface InvoicePDFGeneratorProps {
  invoiceNumber: string;
  invoiceData: any;
  className?: string;
}

const InvoiceTemplate = ({ invoiceData, settings }: any) => {
  const items = typeof invoiceData.items === 'string'
    ? JSON.parse(invoiceData.items)
    : invoiceData.items;

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.qty), 0);
  const tax = subtotal * (settings?.taxRate || 0) / 100;
  const total = subtotal + tax;

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>
          {settings?.companyName || 'MITRALABS.ID'}
        </h1>
        <p style={{ margin: '0 0 20px 0', color: '#666' }}>
          {settings?.companyTagline || 'Precision Web Engineering'}
        </p>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: '20px 0' }}>
          {invoiceData.invoice_number}
        </h2>
      </div>

      {/* Bill To */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '5px' }}>
          BILL TO STAKEHOLDER
        </p>
        <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
          {invoiceData.client_name}
        </p>
        <p style={{ margin: '5px 0 0 0' }}>{invoiceData.client_email}</p>
      </div>

      {/* Dates */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '5px' }}>
            ISSUE DATE
          </p>
          <p style={{ fontWeight: 'bold' }}>
            {new Date(invoiceData.created_at).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '5px' }}>
            DUE DATE
          </p>
          <p style={{ fontWeight: 'bold', color: '#ef4444' }}>
            {new Date(invoiceData.due_date).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', textTransform: 'uppercase' }}>
              STRATEGIC SERVICE DEFINITION
            </th>
            <th style={{ padding: '12px', textAlign: 'center', fontSize: '11px', textTransform: 'uppercase' }}>
              QUANTITY
            </th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase' }}>
              UNIT LOGIC
            </th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '11px', textTransform: 'uppercase' }}>
              FINAL COMMITMENT
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: any, idx: number) => (
            <tr key={idx}>
              <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                {item.desc}
              </td>
              <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                {item.qty}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                Rp {item.price.toLocaleString()}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #eee' }}>
                Rp {(item.price * item.qty).toLocaleString()}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
              TOTAL
            </td>
            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
              Rp {total.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Payment Instructions */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '10px' }}>
          PAYMENT INSTRUCTIONS
        </p>
        <p style={{ lineHeight: '1.6' }}>
          {settings?.paymentInstructions || 'Silakan transfer ke rekening yang tertera dan kirimkan bukti transfer ke WhatsApp kami untuk konfirmasi pembayaran.'}
        </p>
      </div>

      {/* Bank Details */}
      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', color: '#666', marginBottom: '10px' }}>
          BANK TRANSFER DETAILS
        </p>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {settings?.bankName || 'Bank Central Asia (BCA)'}
        </p>
        <p>Account: {settings?.bankAccountNumber || '8000-7625-12'}</p>
        <p>Name: {settings?.bankAccountName || 'Ridho Robbi Pasi'}</p>
        {settings?.bankBranch && <p>Branch: {settings.bankBranch}</p>}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
        <p style={{ fontSize: '10px', color: '#666' }}>
          {settings?.footerNote || 'Verified by Mitralabs Cryptographic Protocol'}
        </p>
      </div>
    </div>
  );
};

export default function InvoicePDFGenerator({ invoiceNumber, invoiceData, className }: InvoicePDFGeneratorProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  // Get settings from DataContext
  const { data } = useData();
  const settings = data.invoiceSettings;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${invoiceNumber}`,
    onAfterPrint: () => {
      console.log('PDF generated successfully');
    },
  });

  return (
    <>
      <button
        onClick={handlePrint}
        className={className || "p-3 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"}
        title="Download Invoice PDF"
      >
        <Download size={16} />
      </button>

      {/* Hidden component for printing */}
      <div style={{ display: 'none' }}>
        <div ref={componentRef}>
          <InvoiceTemplate invoiceData={invoiceData} settings={settings} />
        </div>
      </div>
    </>
  );
}
