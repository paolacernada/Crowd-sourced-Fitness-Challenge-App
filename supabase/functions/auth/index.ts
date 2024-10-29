export default async function handler(req, res) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Anon Key:", supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      message: "Environment variables are not set correctly.",
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
    });
  }

  return res.status(200).json({
    message: "Environment variables are set correctly!",
    supabaseUrl,
  });
}
