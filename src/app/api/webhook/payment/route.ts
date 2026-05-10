import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("x-callback-token");

    // 1. Basic Security Check (Using environment variable for token)
    if (process.env.PAYMENT_WEBHOOK_TOKEN && signature !== process.env.PAYMENT_WEBHOOK_TOKEN) {
      console.warn("⚠️ Unauthorized webhook attempt blocked.");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Extract Payment Info (Example for common gateways like Midtrans/Xendit)
    const { 
      order_id, 
      transaction_status, 
      status, // Xendit uses status
      external_id // Xendit uses external_id for order_id
    } = payload;

    const invoiceNumber = order_id || external_id;
    const isPaid = ['settlement', 'capture', 'PAID', 'COMPLETED'].includes(transaction_status || status);

    if (isPaid && invoiceNumber) {
      console.log(`✅ Payment confirmed for Invoice: ${invoiceNumber}`);

      // 3. Update Invoice Status in Database
      const { error } = await supabaseAdmin
        .from('Invoice')
        .update({ 
          status: 'Paid',
          updated_at: new Date().toISOString()
        })
        .eq('invoice_number', invoiceNumber);

      if (error) {
        console.error(`❌ Failed to update invoice ${invoiceNumber}:`, error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      return NextResponse.json({ status: 'success', message: `Invoice ${invoiceNumber} marked as Paid` }, { status: 200 });
    }

    return NextResponse.json({ status: 'ignored', message: 'Status not paid or invalid payload' }, { status: 200 });
  } catch (error: any) {
    console.error("🔥 Webhook Critical Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
