import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables
const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers to allow frontend access
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace "*" with your frontend URL
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

// Helper function to make Supabase API requests
const supabaseFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Supabase response error:", errorData);
    throw new Error(errorData.message);
  }

  return response;
};

// Handle JSON response from Supabase
const handleResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing response:", error);
    return {};
  }
};

// GET: Fetch all challenge-tag relationships (M table)
const getAllChallengeTags = async () => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_tags`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), { headers: corsHeaders });
};

// GET: Fetch challenge-tag relationship by challenge_id
const getChallengeTagsByChallengeId = async (challengeId: string) => {
  // Ensure the challenge_id is a valid number
  const challengeIdNumber = Number(challengeId);

  if (isNaN(challengeIdNumber)) {
    return new Response(
      JSON.stringify({ error: "Invalid challenge ID format." }),
      { status: 400, headers: corsHeaders }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_tags?challenge_id=eq.${challengeIdNumber}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), { headers: corsHeaders });
};

// GET: Fetch challenge-tag relationship by tag_id
const getChallengeTagsByTagId = async (tagId: string) => {
  // Ensure the tag_id is a valid number
  const tagIdNumber = Number(tagId);

  if (isNaN(tagIdNumber)) {
    return new Response(JSON.stringify({ error: "Invalid tag ID format." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_tags?tag_id=eq.${tagIdNumber}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), { headers: corsHeaders });
};

// Handle OPTIONS preflight requests for CORS
const handleOptions = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// Main request handler
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const challengeId = url.searchParams.get("challenge_id"); // Extract challenge_id from query parameters
  const tagId = url.searchParams.get("tag_id"); // Extract tag_id from query parameters

  // Log for debugging
  console.log(`Request URL: ${req.url}`);
  console.log(`Challenge ID: ${challengeId}`);
  console.log(`Tag ID: ${tagId}`);

  // Handle preflight OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    switch (req.method) {
      case "GET":
        // If no specific query params, return all challenge tags
        if (!challengeId && !tagId) {
          return await getAllChallengeTags();
        }

        // If challenge_id is provided, fetch challenge tags by challenge_id
        if (challengeId) {
          return await getChallengeTagsByChallengeId(challengeId);
        }

        // If tag_id is provided, fetch challenge tags by tag_id
        if (tagId) {
          return await getChallengeTagsByTagId(tagId);
        }

        // If no valid parameters are passed, return an error
        return new Response(
          JSON.stringify({ error: "Missing valid query parameter." }),
          { status: 400, headers: corsHeaders }
        );

      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: corsHeaders,
        });
    }
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// Start the Deno edge function server
Deno.serve(handleRequest);
