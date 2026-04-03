import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabase as publicSupabase } from "@/lib/supabase";

// Create an admin client that bypasses RLS for server-side mutations
const getAdminSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);
  }
  // Fallback to public client (will fail if RLS blocks anon inserts)
  return publicSupabase;
};

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function checkPassword(req: NextRequest) {
  const password = req.headers.get("x-admin-password");
  return password === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  const { data, error } = await publicSupabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!checkPassword(req)) return unauthorized();

  const body = await req.json();
  const { title, slug, excerpt, content } = body;

  const adminClient = getAdminSupabase();
  const { data, error } = await adminClient
    .from("posts")
    .insert([
      { title, slug, excerpt, content },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  if (!checkPassword(req)) return unauthorized();

  const body = await req.json();
  const { id, title, slug, excerpt, content } = body;

  const adminClient = getAdminSupabase();
  const { data, error } = await adminClient
    .from("posts")
    .update({ title, slug, excerpt, content })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!checkPassword(req)) return unauthorized();

  const { id } = await req.json();

  const adminClient = getAdminSupabase();
  const { error } = await adminClient
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
