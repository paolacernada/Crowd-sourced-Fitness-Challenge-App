import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers to allow frontend access (adjust as needed)
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace "*" with your frontend's URL once it's deployed
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", // Allow methods for CORS
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey", // Allow headers for requests
};

// Helper function to fetch data from Supabase
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

// Helper function to handle the response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
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

// GET: Fetch all user-goals or filter by user_id, goal_id, or challenge_id
const getUserGoals = async (
  userId: string | null,
  goalId: string | null,
  challengeId: string | null
) => {
  let query = `${supabaseUrl}/rest/v1/user_goals?select=id,user_id,goal_id,challenge_id,completed,users(id,name),goals(id,name),challenges(id,name)`;

  if (userId) {
    query += `&user_id=eq.${userId}`;
  }

  if (goalId) {
    query += `&goal_id=eq.${goalId}`;
  }

  if (challengeId) {
    query += `&challenge_id=eq.${challengeId}`;
  }

  const response = await supabaseFetch(query, { method: "GET" });
  const data = await handleResponse(response);

  return new Response(JSON.stringify(data), { headers: corsHeaders });
};

// GET: Fetch user-goal relationship by id

// GET: Fetch users by goal_id
const getUsersByGoal = async (goalId: string) => {
  const query = `${supabaseUrl}/rest/v1/user_goals?select=user_id,users(id,name)&goal_id=eq.${goalId}&users(id,name)`;

  const response = await supabaseFetch(query, { method: "GET" });
  const data = await handleResponse(response);

  if (data.length === 0) {
    return new Response(
      JSON.stringify({ error: "No users found for the given goal." }),
      { status: 404, headers: corsHeaders }
    );
  }

  return new Response(JSON.stringify(data), { headers: corsHeaders });
};

// GET: Fetch goals by user_id
const getGoalsByUser = async (userId: string) => {
  const query = `${supabaseUrl}/rest/v1/user_goals?select=goal_id,goals(id,name)&user_id=eq.${userId}&goals(id,name)`;

  const response = await supabaseFetch(query, { method: "GET" });
  const data = await handleResponse(response);

  if (data.length === 0) {
    return new Response(
      JSON.stringify({ error: "No goals found for the given user." }),
      { status: 404, headers: corsHeaders }
    );
  }

  return new Response(JSON.stringify(data), { headers: corsHeaders });
};

// POST: Create a user-goal relationship
const createUserGoal = async (req: Request) => {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.user_id || !body.goal_id || !body.challenge_id) {
      return new Response(
        JSON.stringify({
          error: "user_id, goal_id, and challenge_id are required.",
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert the new user-goal relationship
    const response = await supabaseFetch(`${supabaseUrl}/rest/v1/user_goals`, {
      method: "POST",
      body: JSON.stringify({
        user_id: body.user_id,
        goal_id: body.goal_id,
        challenge_id: body.challenge_id,
        completed: body.completed || false,
      }),
    });

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating user goal:", error);
    return new Response(
      JSON.stringify({ error: `Failed to create user goal: ${error.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// PATCH: Update the 'completed' status of a user-goal relationship
const updateUserGoal = async (id: string, req: Request) => {
  try {
    const body = await req.json();
    const { completed } = body;

    if (completed === undefined) {
      return new Response(
        JSON.stringify({ error: "Completed field is required for update." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/user_goals?id=eq.${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ completed }),
      }
    );

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), { headers: corsHeaders });
  } catch (error) {
    console.error("Error updating user goal:", error);
    return new Response(
      JSON.stringify({ error: `Failed to update user goal: ${error.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// DELETE: Remove a user-goal relationship by ID
const deleteUserGoal = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/user_goals?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Handle OPTIONS preflight requests for CORS
const handleOptions = () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

// Main request handler
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  const id = path.pop();

  const userId = url.searchParams.get("user_id");
  const goalId = url.searchParams.get("goal_id");

  // Handle preflight OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return handleOptions();
  }

  try {
    switch (req.method) {
      case "GET":
        // Handle searches based on query parameters
        if (userId && goalId) {
          return await getUserGoals(userId, goalId, null);
        } else if (userId) {
          return await getGoalsByUser(userId);
        } else if (goalId) {
          return await getUsersByGoal(goalId);
        }
        return await getUserGoals(null, null, null);

      case "POST":
        return await createUserGoal(req);

      case "PATCH":
        if (!id) {
          return new Response(
            JSON.stringify({ error: "Goal ID is required for PATCH request." }),
            { status: 400, headers: corsHeaders }
          );
        }
        return await updateUserGoal(id, req);

      case "DELETE":
        if (!id) {
          return new Response(
            JSON.stringify({
              error: "Goal ID is required for DELETE request.",
            }),
            { status: 400, headers: corsHeaders }
          );
        }
        return await deleteUserGoal(id);

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
