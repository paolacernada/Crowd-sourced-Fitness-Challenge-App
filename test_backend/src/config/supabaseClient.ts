import dotenv from "dotenv";
dotenv.config({ path: ".env.server" });

import { createClient } from "@supabase/supabase-js";
if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is not yet set/defined");
}
const supabaseUrl: string = process.env.SUPABASE_URL as string; // NOTE: double check that the "as string" doesn't potentially cause bugs

if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_ANON_KEY is not yet set/defined");
}
const supabaseKey: string = process.env.SUPABASE_ANON_KEY as string; // NOTE: double check that the "as string" doesn't potentially cause bugs

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
