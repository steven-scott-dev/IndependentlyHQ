import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabaseAdmin.from("profiles").select("*").eq("user_id", uid).maybeSingle();
  const { data: streak } = await supabaseAdmin.from("streaks").select("current_streak,longest_streak").eq("user_id", uid).maybeSingle();
  const { data: plan } = await supabaseAdmin.from("plans").select("id").eq("user_id", uid).eq("status", "active").order("start_date", { ascending: false }).limit(1).maybeSingle();

  return NextResponse.json({ profile, streak, currentPlan: plan ? { id: plan.id } : null });
}
