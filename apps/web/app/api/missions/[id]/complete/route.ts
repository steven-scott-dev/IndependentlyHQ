import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const uid = getUserIdFromRequest(_);
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const id = params.id;
  const { error } = await supabaseAdmin.from("missions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await supabaseAdmin.from("progress_events").insert({ user_id: uid, type: "mission_completed", meta: { mission_id: id } });
  return NextResponse.json({ ok: true });
}
