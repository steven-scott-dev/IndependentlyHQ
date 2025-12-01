import { Worker } from "bullmq";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const connection = process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined;
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function parseResume(job: any) {
  const { resumeId, userId, filePath } = job.data;
  const { data: signed } = await supabase.storage.from("resumes").createSignedUrl(filePath, 600);
  if (!signed?.signedUrl) throw new Error("signed URL failed");

  // MVP: ask LLM for a minimal skills JSON
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Extract JSON {skills:[{name,level:0-5}] } from the resume content at the given URL if accessible." },
      { role: "user", content: `Resume (temporary URL): ${signed.signedUrl}` }
    ]
  });

  let parsed: any = { skills: [] };
  try { parsed = JSON.parse(completion.choices[0].message.content || `{"skills":[]}`); } catch {}

  await supabase.from("resumes").update({ parsed_json: parsed }).eq("id", resumeId);

  for (const s of parsed.skills || []) {
    const { data: skillRow } = await supabase.from("skills").select("id").eq("name", s.name).maybeSingle();
    const skillId = skillRow?.id || (await supabase.from("skills").insert({ name: s.name }).select("id").single()).data!.id;
    await supabase.from("user_skills").upsert(
      { user_id: userId, skill_id: skillId, level: Math.max(0, Math.min(5, s.level || 2)) },
      { onConflict: "user_id,skill_id" }
    );
  }
}

async function generatePlan(job: any) {
  const { planId } = job.data;
  for (let w = 1; w <= 12; w++) {
    const { data: week } = await supabase.from("plan_weeks").insert({ plan_id: planId, week_number: w, milestone: `Week ${w} milestone` }).select("id").single();
    const missions = Array.from({ length: 5 }).map((_, i) => ({
      plan_week_id: week!.id,
      title: `Do a 10-min skill rep #${(w - 1) * 5 + (i + 1)}`,
      description: "Refine a resume bullet or apply to 1 role with tailored keywords.",
      est_minutes: 10
    }));
    await supabase.from("missions").insert(missions);
  }
}

async function scheduleDailyMission(_job: any) {
  // Placeholder for future cron assignment
}

new Worker("ind-jobs", async (job) => {
  if (job.name === "parse-resume") return parseResume(job);
  if (job.name === "generate-plan") return generatePlan(job);
  if (job.name === "schedule-daily") return scheduleDailyMission(job);
}, { connection });

console.log("Worker up");
