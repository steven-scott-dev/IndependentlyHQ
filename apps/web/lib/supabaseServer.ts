import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Supabase URL missing in environment");
  }
  if (!key) {
    throw new Error("Supabase key missing in environment");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
}
