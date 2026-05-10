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

    // Use Puppeteer or similar to generate PDF
    // For now, return HTML that will be converted to PDF by browser
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="Invoice-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function generateInvoiceHTML(invoice: any, items: any[], settings: any) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = subtotal * (settings.taxRate || 0) / 100;
  const total = subtotal + tax;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice_number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; }
    .invoice { max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; }
    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
    .invoice-number { font-size: 32px; font-weight: bold; margin: 20px 0; }
    .section { margin: 30px 0; }
    .label { font-size: 11px; text-transform: uppercase; color: #666; margin-bottom: 5px; }
    .value { font-size: 14px; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f5f5f5; padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .total-row { font-weight: bold; font-size: 18px; }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="company-name">${settings.companyName || 'MITRALABS.ID'}</div>
      <div>${settings.companyTagline || 'Precision Web Engineering'}</div>
      <div class="invoice-number">${invoice.invoice_number}</div>
    </div>

    <div class="section">
      <div class="label">Bill To</div>
      <div class="value">${invoice.client_name}</div>
      <div>${invoice.client_email}</div>
    </div>

    <div class="section">
      <div class="label">Issue Date</div>
      <div class="value">${new Date(invoice.created_at).toLocaleDateString('id-ID')}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.desc}</td>
            <td>${item.qty}</td>
            <td>Rp ${item.price.toLocaleString()}</td>
            <td>Rp ${(item.price * item.qty).toLocaleString()}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3">Total</td>
          <td>Rp ${total.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    <div class="section">
      <div class="label">Payment Instructions</div>
      <div>${settings.paymentInstructions || ''}</div>
    </div>

    <div class="section">
      <div class="label">Bank Details</div>
      <div>${settings.bankName || ''}</div>
      <div>${settings.bankAccountNumber || ''}</div>
      <div>${settings.bankAccountName || ''}</div>
    </div>
  </div>
  <script>
    // Auto-trigger print dialog
    window.onload = function() {
      window.print();
      // Close after print
      setTimeout(() => window.close(), 1000);
    };
  </script>
</body>
</html>
  `;
}
