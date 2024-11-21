import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validates env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// Fetches data
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
  return response;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  const id = path.pop();

  try {
    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id))
          ? await getChallengeTag(id)
          : await getChallengeTags();

      case "POST":
        return await createChallengeTag(await req.json());

      case "DELETE":
        return await deleteChallengeTag(id);

      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Handlers for different HTTP methods
// GET (all) challenge-tag relationships
const getChallengeTags = async () => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_tags`,
    {
      method: "GET",
    }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// GET (challenge-tag relationship) by ID
const getChallengeTag = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_tags?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST: Create a new challenge-tag relationship
const createChallengeTag = async (req: Request) => {
  try {
    const body = await req.json();
    if (!body.challenge_id || !body.tag_id) {
      return new Response(
        JSON.stringify({ error: "Challenge ID and Tag ID are required." }),
        { status: 400 }
      );
    }

    // Check if the challenge exists
    const challengeResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/challenges?id=eq.${body.challenge_id}`,
      { method: "GET" }
    );
    const challengeData = await handleResponse(challengeResponse);
    if (!challengeData.length) {
      return new Response(JSON.stringify({ error: "Challenge not found." }), {
        status: 404,
      });
    }

    // Check if the tag exists
    const tagResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/tags?id=eq.${body.tag_id}`,
      { method: "GET" }
    );
    const tagData = await handleResponse(tagResponse);
    if (!tagData.length) {
      return new Response(JSON.stringify({ error: "Tag not found." }), {
        status: 404,
      });
    }

    // Create the challenge-tag relationship
    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/challenge_tags`,
      {
        method: "POST",
        body: JSON.stringify({
          challenge_id: body.challenge_id,
          tag_id: body.tag_id,
        }),
      }
    );

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating challenge-tag relationship:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create challenge-tag relationship." }),
      { status: 500 }
    );
  }
};

// DELETE: Remove challenge-tag relationship by ID
const deleteChallengeTag = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_tags?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204 });
};

// Start the server
Deno.serve(handleRequest);
