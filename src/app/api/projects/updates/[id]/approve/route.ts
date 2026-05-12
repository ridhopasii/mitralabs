import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Supabase credentials missing');
  }

  return createClient(url, key);
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, password } = body;

    const supabase = getSupabase();

    // 1. Verify tracking credentials if provided
    if (email && password) {
      const { data: booking, error: authError } = await supabase
        .from('Booking')
        .select('id')
        .ilike('customer_email', email)
        .eq('tracking_password', password)
        .maybeSingle();

      if (authError || !booking) {
        return NextResponse.json({ error: 'Unauthorized: Invalid tracking credentials' }, { status: 401 });
      }

      // 2. Verify that this update belongs to a project linked to this booking
      const { data: update, error: updateError } = await supabase
        .from('ProjectUpdate')
        .select(`
          id,
          project:ClientProject!inner(booking_id)
        `)
        .eq('id', id)
        .single();

      if (updateError || !update) {
        return NextResponse.json({ error: 'Update not found' }, { status: 404 });
      }

      // @ts-expect-error - Supabase types can be tricky with !inner
      if (update.project.booking_id !== booking.id) {
        return NextResponse.json({ error: 'Unauthorized: This update does not belong to your project' }, { status: 403 });
      }
    }

    // 3. Perform approval
    const { data, error } = await supabase
      .from('ProjectUpdate')
      .update({
        is_approved: true,
        approved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('🔥 Approval Error:', error);
      return NextResponse.json({ error: 'Failed to approve update' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('🔥 API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
