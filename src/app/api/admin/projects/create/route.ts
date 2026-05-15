import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    let currentClientId = payload.client_id;
    const now = new Date();

    if (!currentClientId) {
      let existingClient = await prisma.client.findUnique({
        where: { email: payload.customer_email }
      });

      if (existingClient) {
        currentClientId = existingClient.id;
      } else {
        currentClientId = crypto.randomUUID();
        await prisma.client.create({
          data: {
            id: currentClientId,
            email: payload.customer_email,
            full_name: payload.customer_name,
            company_name: payload.organization_name,
            phone: payload.customer_phone,
            created_at: now,
            updated_at: now
          }
        });
      }

      await prisma.booking.update({
        where: { id: payload.booking_id },
        data: { client_id: currentClientId }
      });
    }

    const newProj = await prisma.clientProject.create({
      data: {
        id: crypto.randomUUID(),
        booking_id: payload.booking_id,
        client_id: currentClientId,
        project_name: `Projek ${payload.plan_name} - ${payload.customer_name.split(' ')[0]}`,
        description: `Workspace otomatis untuk pesanan ${payload.service_type}: ${payload.plan_name}. ${payload.project_brief || ''}`,
        status: "Active",
        progress: 0,
        created_at: now,
        updated_at: now
      }
    });

    return NextResponse.json({ success: true, project: newProj }, { status: 200 });
  } catch (error: any) {
    console.error("Create Project Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
