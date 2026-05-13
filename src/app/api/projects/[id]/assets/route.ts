import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    
    const assets = await prisma.projectAsset.findMany({
      where: { project_id: id },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(assets);
  } catch (error: any) {
    console.error("❌ Error fetching assets:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prisma } = await import("@/lib/prisma");
    const body = await request.json();
    const { name, category, url, file_size, file_type } = body;

    const asset = await prisma.projectAsset.create({
      data: {
        project_id: id,
        name,
        category,
        url,
        status: "Received",
        file_size,
        file_type,
        uploaded_at: new Date(),
      },
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    console.error("❌ Error creating asset:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
