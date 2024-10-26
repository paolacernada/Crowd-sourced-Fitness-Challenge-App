import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
