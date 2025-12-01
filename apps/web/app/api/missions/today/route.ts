import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: plan } = await supabaseAdmin.from("plans").select("id").eq("user_id", uid).eq("status", "active").order("start_date", { ascending: false }).limit(1).maybeSingle();
  if (!plan?.id) return NextResponse.json(null);

  const { data: rows } = await supabaseAdmin.from("missions")
    .select("id,title,description,est_minutes,status,completed_at,plan_week_id")
    .order("completed_at", { ascending: true })
    .limit(1);
  return NextResponse.json(rows?.[0] ?? null);
}
