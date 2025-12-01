import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { jobQueue, JobNames } from "@/lib/queue";

export async function POST(req: Request) {
  const uid = getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "missing file" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const fileName = `${uid}/${Date.now()}-${file.name}`;
  const { data: upload, error } = await supabaseAdmin.storage.from("resumes").upload(fileName, bytes, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const file_url = upload.path;
  const { data: row, error: insErr } = await supabaseAdmin.from("resumes").insert({ user_id: uid, file_url }).select("id").single();
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  await jobQueue.add(JobNames.ParseResume, { resumeId: row.id, userId: uid, filePath: file_url });
  return NextResponse.json({ resumeId: row.id, status: "queued" }, { status: 202 });
}
