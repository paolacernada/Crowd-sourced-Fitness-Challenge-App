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
          ? await getChallengeGoal(id)
          : await getChallengeGoals();

      case "POST":
        return await createChallengeGoal(await req.json());

      case "DELETE":
        return await deleteChallengeGoal(id);

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
// GET (all) challenge-goal relationships
const getChallengeGoals = async () => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_goals`,
    {
      method: "GET",
    }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// GET (challenge-goal relationship) by ID
const getChallengeGoal = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_goals?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST
const createChallengeGoal = async (req: Request) => {
  try {
    const body = await req.json();
    if (!body.challenge_id || !body.goal_id) {
      return new Response(
        JSON.stringify({ error: "Challenge ID and Goal ID are required." }),
        { status: 400 }
      );
    }

    // Checks if both challenge_id and goal_id exist
    const challengeResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/challenges?id=eq.${body.challenge_id}`,
      { method: "GET" }
    );

    const goalResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/goals?id=eq.${body.goal_id}`,
      { method: "GET" }
    );

    if (!challengeResponse.ok || !(await challengeResponse.json()).length) {
      return new Response(JSON.stringify({ error: "Challenge not found." }), {
        status: 404,
      });
    }

    if (!goalResponse.ok || !(await goalResponse.json()).length) {
      return new Response(JSON.stringify({ error: "Goal not found." }), {
        status: 404,
      });
    }

    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/challenge_goals`,
      {
        method: "POST",
        body: JSON.stringify({
          challenge_id: body.challenge_id,
          goal_id: body.goal_id,
        }),
      }
    );

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating challenge goal:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create challenge goal." }),
      { status: 500 }
    );
  }
};

// DELETE by ID
const deleteChallengeGoal = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_goals?id=eq.${id}`,
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
