import { NextResponse } from "next/server";
import { getSupabaseServer } from "../../../../lib/supabaseServer";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    // SUPER SIMPLE QUERY: no ordering, no fancy columns
    const { data, error } = await supabase.from("news_items").select("*").limit(12);

    if (error) {
      console.error("[/api/insights/news] Postgrest error:", error);
      return NextResponse.json(
        { error: error.message ?? "Unknown Supabase error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err: any) {
    console.error("[/api/insights/news] unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
