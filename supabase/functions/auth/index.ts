import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load custom .env file with the correct relative path -- The path was tricky
const env = config({ path: "../../.env.supabase" });
console.log("Loaded environment variables:", env); // Check what's loaded

// eslint-disable-next-line no-unused-vars
Deno.serve(async (req) => {
  //

  // For local serving:
  // const supabaseUrl = env.SUPABASE_URL;
  // const supabaseAnonKey = env.SUPABASE_ANON_KEY;
  // For deployment
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  //

  console.log("Supabase URL:", supabaseUrl); // Log the URL
  console.log("Supabase Anon Key:", supabaseAnonKey); // Log the Key

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response(
      JSON.stringify({
        message: "Environment variables are not set correctly.",
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: "Environment variables are set correctly!",
      supabaseUrl,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
});
