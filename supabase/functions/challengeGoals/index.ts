import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
// const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validates env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers to allow frontend access
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // You can replace "*" with your frontend's URL later
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS", // Allow methods for CORS
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey", // Allow headers for requests
};

// Fetches data from Supabase
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

// Handles the response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

// Main request handler
const handleRequest = async (req: Request) => {
  // Handle preflight OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  const id = path.pop();

  const challengeId = url.searchParams.get("challenge_id");
  const goalId = url.searchParams.get("goal_id");

  try {
    switch (req.method) {
      case "GET":
        // If an ID is passed, get the specific challenge-goal
        if (id && !isNaN(Number(id))) {
          return await getChallengeGoal(id);
        }
        // If challenge_id or goal_id is provided, filter by that
        if (challengeId) {
          return await getChallengeGoalsByChallengeId(challengeId);
        }
        if (goalId) {
          return await getChallengeGoalsByGoalId(goalId);
        }
        // Otherwise, return all challenge-goal relationships
        return await getChallengeGoals();

      case "POST":
        return await createChallengeGoal(await req.json());

      case "DELETE":
        return await deleteChallengeGoal(id);

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
    headers: corsHeaders,
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
    headers: corsHeaders,
  });
};

// GET challenge-goal relationships by challenge_id
const getChallengeGoalsByChallengeId = async (challengeId: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_goals?challenge_id=eq.${challengeId}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
  });
};

// GET challenge-goal relationships by goal_id
const getChallengeGoalsByGoalId = async (goalId: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_goals?goal_id=eq.${goalId}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
  });
};

// POST a new challenge-goal relationship
const createChallengeGoal = async (req: Request) => {
  try {
    const body = await req.json();
    if (!body.challenge_id || !body.goal_id) {
      return new Response(
        JSON.stringify({ error: "Challenge ID and Goal ID are required." }),
        { status: 400, headers: corsHeaders }
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
        headers: corsHeaders,
      });
    }

    if (!goalResponse.ok || !(await goalResponse.json()).length) {
      return new Response(JSON.stringify({ error: "Goal not found." }), {
        status: 404,
        headers: corsHeaders,
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
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating challenge goal:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create challenge goal." }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// DELETE challenge-goal relationship by ID
const deleteChallengeGoal = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge_goals?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Start the server
Deno.serve(handleRequest);
