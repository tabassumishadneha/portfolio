import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkPassword(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkPassword(req)) return unauthorized();

  const { data, error } = await supabase.rpc("get_contact_messages");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!checkPassword(req)) return unauthorized();

  const { id, read } = await req.json();

  const { error } = await supabase.rpc("set_message_read", {
    msg_id: id,
    is_read: read,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!checkPassword(req)) return unauthorized();

  const { id } = await req.json();

  const { error } = await supabase.rpc("delete_message", {
    msg_id: id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
