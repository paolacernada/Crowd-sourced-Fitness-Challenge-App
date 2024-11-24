import { config } from "https://deno.land/x/dotenv/mod.ts";

// Production deployment: Load environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validates env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers to allow frontend access
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace "*" with frontend URL if frontend is deployed
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS", // Allow these methods for CORS
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

// Handles the response from Supabase
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

// GET: Retrieve all completed challenges with user details
const getCompletedChallenges = async () => {
  // Adjust query to include 'id' from the users_challenges table
  const query = `${supabaseUrl}/rest/v1/users_challenges?completed=eq.true&select=id,users(id,name,uuid),challenges(id,name)&user_id=not.is.null`;

  const response = await supabaseFetch(query, {
    method: "GET",
  });

  const data = await handleResponse(response);

  if (data.length === 0) {
    return new Response(
      JSON.stringify({ error: `No completed challenges found.` }),
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  }

  // Format the data to include the userChallenge id
  const formattedData = data.map((entry: any) => ({
    userChallenge_id: entry.id, // Include userChallenge id
    user_id: entry.users.id,
    user_name: entry.users.name,
    user_uuid: entry.users.uuid,
    challenge_name: entry.challenges.name,
    challenge_id: entry.challenges.id,
  }));

  return new Response(JSON.stringify(formattedData), {
    headers: corsHeaders,
  });
};

// POST: Create or update completed challenge for a user
const postCompletedChallenge = async (req: Request) => {
  const { user_id, challenge_id } = await req.json();

  if (!user_id || !challenge_id) {
    return new Response(
      JSON.stringify({ error: "User ID and Challenge ID are required." }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  // Check if this user has already completed this challenge
  const checkQuery = `${supabaseUrl}/rest/v1/users_challenges?user_id=eq.${user_id}&challenge_id=eq.${challenge_id}`;

  const checkResponse = await supabaseFetch(checkQuery, { method: "GET" });
  const existingChallenge = await handleResponse(checkResponse);

  if (existingChallenge.length > 0) {
    // If the challenge is already completed, update the `completed` status if needed
    const updateQuery = `${supabaseUrl}/rest/v1/users_challenges?id=eq.${existingChallenge[0].id}`;
    const updateResponse = await supabaseFetch(updateQuery, {
      method: "PATCH",
      body: JSON.stringify({ completed: true }),
    });
    const updatedChallenge = await handleResponse(updateResponse);

    return new Response(JSON.stringify(updatedChallenge), {
      headers: corsHeaders,
    });
  } else {
    // Insert new challenge completion record
    const insertQuery = `${supabaseUrl}/rest/v1/users_challenges`;
    const insertResponse = await supabaseFetch(insertQuery, {
      method: "POST",
      body: JSON.stringify({ user_id, challenge_id, completed: true }),
    });
    const insertedChallenge = await handleResponse(insertResponse);

    return new Response(JSON.stringify(insertedChallenge), {
      headers: corsHeaders,
    });
  }
};

// Handle all incoming requests
const handleRequest = async (req: Request) => {
  // Handles preflight OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").filter(Boolean);
  const id = path.pop(); // Note: we might use this later

  try {
    switch (req.method) {
      case "GET":
        return await getCompletedChallenges(); // Fetch completed challenges
      case "POST":
        return await postCompletedChallenge(req); // Handle completion post
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

// Start the server
Deno.serve(handleRequest);
