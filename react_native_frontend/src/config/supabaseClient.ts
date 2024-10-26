import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase URL or Anon Key is missing in environment variables."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
