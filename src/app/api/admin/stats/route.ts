import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // 1. Total Financials & Leads
    const [invoicesRes, bookingsRes, siteMessagesRes] = await Promise.all([
      supabase.from("Invoice").select("*"),
      supabase.from("Booking").select("*"),
      supabase.from("SiteMessage").select("*")
    ]);

    if (invoicesRes.error) throw invoicesRes.error;
    if (bookingsRes.error) throw bookingsRes.error;
    if (siteMessagesRes.error) throw siteMessagesRes.error;

    const invoices = invoicesRes.data || [];
    const bookings = bookingsRes.data || [];
    const siteMessages = siteMessagesRes.data || [];
    
    const totalRevenue = invoices.reduce((acc: number, inv: any) => acc + (inv.status === "Paid" ? inv.amount : 0), 0);
    const pendingRevenue = invoices.reduce((acc: number, inv: any) => acc + (inv.status !== "Paid" ? inv.amount : 0), 0);
    
    // 2. Project Distribution by Plan
    const planStats = bookings.reduce((acc: any, b: any) => {
      acc[b.plan_name] = (acc[b.plan_name] || 0) + 1;
      return acc;
    }, {});

    const planChartData = Object.keys(planStats).map(name => ({
      name,
      value: planStats[name]
    }));

    // 3. Conversion Stats
    const totalBookings = bookings.length;
    const activeOrDone = bookings.filter((b: any) => b.status === "Active" || b.status === "Done" || b.status === "Completed").length;
    const conversionRate = totalBookings > 0 ? ((activeOrDone / totalBookings) * 100).toFixed(1) : "0";
    const totalLeads = totalBookings + siteMessages.length;

    // 4. Monthly Revenue (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentInvoices = invoices.filter((inv: any) => 
      inv.status === "Paid" && new Date(inv.created_at) >= sixMonthsAgo
    ).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const monthlyStats = recentInvoices.reduce((acc: any, inv: any) => {
      const month = new Date(inv.created_at).toLocaleDateString('id-ID', { month: 'short' });
      acc[month] = (acc[month] || 0) + inv.amount;
      return acc;
    }, {});

    const revenueChartData = Object.keys(monthlyStats).map(month => ({
      month,
      revenue: monthlyStats[month]
    }));

    // 5. Service Distribution
    const serviceStats = bookings.reduce((acc: any, b: any) => {
      acc[b.service_type] = (acc[b.service_type] || 0) + 1;
      return acc;
    }, {});

    const serviceChartData = Object.keys(serviceStats).map(name => ({
      name,
      value: serviceStats[name]
    }));

    // 6. Quick Insights: Overdue & Upcoming
    const now = new Date();
    const overdueInvoices = invoices.filter((inv: any) => 
      inv.status === "Unpaid" && new Date(inv.due_date) < now
    ).slice(0, 3);

    const upcomingBookings = bookings.filter((b: any) => 
      b.status !== "Completed" && b.scheduled_date
    ).sort((a: any, b: any) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
    .slice(0, 3);

    return NextResponse.json({
      summary: {
        totalRevenue,
        pendingRevenue,
        totalBookings,
        totalInvoices: invoices.length,
        totalLeads,
        conversionRate
      },
      charts: {
        revenue: revenueChartData,
        plans: planChartData,
        services: serviceChartData
      },
      insights: {
        overdueInvoices,
        upcomingBookings
      }
    });
  } catch (error: any) {
    console.error("❌ Admin Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
