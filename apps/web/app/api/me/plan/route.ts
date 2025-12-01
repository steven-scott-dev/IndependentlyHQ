```ts
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { jobQueue, JobNames } from "@/lib/queue";

export async function POST(req: Request) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { goal_role_id } = await req.json();
  if (!goal_role_id) return NextResponse.json({ error: "goal_role_id required" }, { status: 400 });

  const start = new Date(); const end = new Date(); end.setDate(start.getDate() + 90);
  const { data: plan, error } = await supabaseAdmin
    .from("plans")
    .insert({ user_id: uid, goal_role_id, start_date: start, end_date: end, status: "active" })
    .select("id").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await jobQueue.add(JobNames.GeneratePlan, { planId: plan.id, userId: uid, goalRoleId: goal_role_id });
  return NextResponse.json({ planId: plan.id });
}
