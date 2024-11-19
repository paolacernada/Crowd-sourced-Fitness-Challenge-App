// import { config } from "https://deno.land/x/dotenv/mod.ts";

// // Load env variables
// const env = config({ path: "../../.env.supabase" });

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
          ? await getUserChallenge(id)
          : await getUserChallenges();

      case "POST":
        return await createUserChallenge(await req.json());

      case "DELETE":
        return await deleteUserChallenge(id);

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
// GET (all) user-challenge relationships
const getUserChallenges = async () => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users_challenges`,
    {
      method: "GET",
    }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// GET (user-challenge relationship) by ID with challenge details
const getUserChallenge = async (userId: string) => {
  try {
    // Query users_challenges table; SQL join with 'challenges' table to get challenge details instead of id#
    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users_challenges?user_id=eq.${userId}&select=id,challenge_id,challenges(id,name,description,difficulty)`,
      {
        method: "GET",
      }
    );

    const data = await handleResponse(response);

    // If no challenges are found for the user, return a 404 response
    if (data.length === 0) {
      return new Response(
        JSON.stringify({ error: `No challenges found for user ID ${userId}.` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the challenges associated with the user
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching user challenges:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user challenges." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// POST
const createUserChallenge = async (req: Request) => {
  try {
    const body = await req.json();
    if (!body.user_id || !body.challenge_id) {
      return new Response(
        JSON.stringify({ error: "User ID and Challenge ID are required." }),
        { status: 400 }
      );
    }

    // Checks if both user_id and challenge_id exist
    const userResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users?id=eq.${body.user_id}`,
      { method: "GET" }
    );

    const challengeResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/challenges?id=eq.${body.challenge_id}`,
      { method: "GET" }
    );

    if (!userResponse.ok || !(await userResponse.json()).length) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
      });
    }

    if (!challengeResponse.ok || !(await challengeResponse.json()).length) {
      return new Response(JSON.stringify({ error: "Challenge not found." }), {
        status: 404,
      });
    }

    // Create the user-challenge relationship
    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users_challenges`,
      {
        method: "POST",
        body: JSON.stringify({
          user_id: body.user_id,
          challenge_id: body.challenge_id,
        }),
      }
    );

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating user challenge:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user challenge." }),
      { status: 500 }
    );
  }
};

// DELETE by ID
const deleteUserChallenge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users_challenges?id=eq.${id}`,
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
