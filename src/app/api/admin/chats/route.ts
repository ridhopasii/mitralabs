import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { data: chats, error } = await supabase
      .from("ProjectChat")
      .select(`
        *,
        project:ClientProject (
          project_name,
          client:Client (full_name)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(chats || []);
  } catch (err: any) {
    console.error("❌ Chats API Error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const { projectId, message } = await req.json();

    const { data: newMessage, error } = await supabase
      .from("ProjectChat")
      .insert([{
        project_id: projectId,
        sender_type: "admin",
        message: message,
        is_read: false
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(newMessage);
  } catch (err: any) {
    console.error("❌ Chats API POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
