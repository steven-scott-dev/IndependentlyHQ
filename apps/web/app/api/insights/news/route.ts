import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("news_items")
    .select("*")
    .order("relevance_score", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(12);

  if (error) {
    console.error("[/api/insights/news] error", error);
    return NextResponse.json(
      {
        error: error.message ?? "Supabase error",
        code: (error as any).code ?? null,
        details: error,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ items: data ?? [] });
}
