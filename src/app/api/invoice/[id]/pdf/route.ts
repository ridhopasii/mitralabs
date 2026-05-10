import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch invoice from Supabase
    const { data: invoice, error } = await supabase
      .from('Invoice')
      .select('*')
      .eq('invoice_number', id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Fetch settings
    const { data: config } = await supabase
      .from('SiteConfig')
      .select('json_content')
      .eq('id', 1)
      .maybeSingle();

    const invoiceSettings = config?.json_content?.invoiceSettings || {};

    // Parse items if string
    const items = typeof invoice.items === 'string'
      ? JSON.parse(invoice.items)
      : invoice.items;

    // Generate HTML for PDF
    const html = generateInvoiceHTML(invoice, items, invoiceSettings);

    // Return HTML with specific headers to trigger browser print-to-pdf or preview
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': `inline; filename="Invoice-${id}.pdf"`,
        'X-Frame-Options': 'DENY'
      },
    });
  } catch (error) {
    console.error('🔥 PDF Generator Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function generateInvoiceHTML(invoice: any, items: any[], settings: any) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  const tax = subtotal * (settings.taxRate || 0) / 100;
  const total = subtotal + tax;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number} - ${settings.companyName || 'MITRALABS'}</title>
  <style>
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; }
    body { font-family: 'Inter', -apple-system, sans-serif; color: #1e293b; line-height: 1.5; background: #f8fafc; }
    .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 10mm auto; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    @media print { body { background: white; } .page { margin: 0; box-shadow: none; } }
    
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; border-bottom: 2px solid #f1f5f9; padding-bottom: 30px; }
    .logo-area h1 { font-size: 28px; font-weight: 900; letter-spacing: -0.05em; color: #0f172a; }
    .company-info { font-size: 12px; color: #64748b; margin-top: 8px; max-width: 250px; }
    
    .invoice-title { text-align: right; }
    .invoice-title h2 { font-size: 48px; font-weight: 900; color: #f1f5f9; margin-bottom: -10px; }
    .invoice-number { font-size: 16px; font-weight: 700; color: #0f172a; }
    
    .details-grid { display: grid; grid-cols: 2; gap: 40px; margin-bottom: 60px; }
    .detail-box h4 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; margin-bottom: 12px; }
    .detail-box p { font-size: 14px; font-weight: 600; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    th { text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; padding: 15px; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px; font-size: 14px; border-bottom: 1px solid #f8fafc; }
    .item-desc { font-weight: 700; color: #0f172a; }
    .item-details { font-size: 12px; color: #64748b; margin-top: 4px; }
    
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; }
    .total-row.grand-total { border-top: 2px solid #0f172a; margin-top: 10px; padding-top: 20px; font-size: 20px; font-weight: 900; color: #0f172a; }
    
    .footer { margin-top: 80px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 30px; }
    .payment-instructions { background: #f8fafc; padding: 20px; rounded: 12px; margin-top: 40px; }
    .payment-instructions h4 { font-size: 12px; font-weight: 800; margin-bottom: 10px; color: #0f172a; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="logo-area">
        <h1>${settings.companyName || 'MITRALABS'}</h1>
        <div class="company-info">
          ${settings.companyAddress || 'Medan, Indonesia'}<br>
          ${settings.companyPhone || ''} | ${settings.companyEmail || ''}
        </div>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <div class="invoice-number"># ${invoice.invoice_number}</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
          Issue Date: ${new Date(invoice.created_at).toLocaleDateString('id-ID')}
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 100px; margin-bottom: 60px;">
      <div class="detail-box">
        <h4>Billed To</h4>
        <p style="font-size: 18px; margin-bottom: 5px;">${invoice.client_name}</p>
        <div style="font-size: 13px; color: #64748b;">${invoice.client_email}</div>
      </div>
      <div class="detail-box">
        <h4>Due Date</h4>
        <p>${new Date(invoice.due_date).toLocaleDateString('id-ID')}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>
              <div class="item-desc">${item.desc}</div>
              ${item.details ? `<div class="item-details">${item.details}</div>` : ''}
            </td>
            <td style="text-align: center;">${item.qty || 1}</td>
            <td style="text-align: right;">Rp ${item.price.toLocaleString('id-ID')}</td>
            <td style="text-align: right; font-weight: 700;">Rp ${(item.price * (item.qty || 1)).toLocaleString('id-ID')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span style="color: #64748b;">Subtotal</span>
        <span style="font-weight: 700;">Rp ${subtotal.toLocaleString('id-ID')}</span>
      </div>
      ${tax > 0 ? `
      <div class="total-row">
        <span style="color: #64748b;">${settings.taxLabel || 'Tax'}</span>
        <span style="font-weight: 700;">Rp ${tax.toLocaleString('id-ID')}</span>
      </div>
      ` : ''}
      <div class="total-row grand-total">
        <span>Total</span>
        <span>Rp ${total.toLocaleString('id-ID')}</span>
      </div>
    </div>

    <div class="payment-instructions">
      <h4>Metode Pembayaran</h4>
      <div style="font-size: 13px; color: #475569; line-height: 1.6;">
        ${settings.bankName}<br>
        No. Rekening: <strong>${settings.bankAccountNumber}</strong><br>
        A/N: <strong>${settings.bankAccountName}</strong><br>
        <br>
        <em style="font-size: 11px;">${settings.paymentInstructions || 'Harap kirimkan bukti transfer setelah melakukan pembayaran.'}</em>
      </div>
    </div>

    <div class="footer">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>${settings.footerNote || 'Thank you for your business.'}</div>
        <div style="font-weight: 800; color: #0f172a;">MITRALABS CRYPTOGRAPHIC PROTOCOL VERIFIED</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
