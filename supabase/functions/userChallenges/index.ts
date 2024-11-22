// import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validates env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers to allow frontend access (adjust as needed)
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace "*" with your frontend's URL once it's deployed
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS", // Allow methods for CORS
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

// GET (all) user-challenge relationships or by user_id
const getUserChallenges = async (userUuid: string | null) => {
  const query = userUuid
    ? `${supabaseUrl}/rest/v1/users_challenges?user_uuid=eq.${userUuid}&select=id,challenge_id,users(id,name,uuid),challenges(id,name,description,difficulty)`
    : `${supabaseUrl}/rest/v1/users_challenges?select=id,challenge_id,users(id,name,uuid),challenges(id,name,description,difficulty)`;

  const response = await supabaseFetch(query, {
    method: "GET",
  });

  const data = await handleResponse(response);

  if (data.length === 0) {
    return new Response(JSON.stringify({ error: `No challenges found.` }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
  });
};

// POST: Create a user-challenge relationship
const createUserChallenge = async (req: Request) => {
  try {
    // Since the request body is already parsed, use it directly
    const body = req; // The body is already parsed as an object, no need for req.text()

    // Check if user_uuid and challenge_id are provided in the body
    if (!body.user_uuid || !body.challenge_id) {
      return new Response(
        JSON.stringify({ error: "User UUID and Challenge ID are required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if the user exists based on user_uuid
    const userResponse = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users?uuid=eq.${body.user_uuid}`,
      { method: "GET" }
    );
    const userData = await handleResponse(userResponse);
    if (!userData.length) {
      return new Response(JSON.stringify({ error: "User not found." }), {
        status: 404,
        headers: corsHeaders,
      });
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
        headers: corsHeaders,
      });
    }

    // Create the user-challenge relationship
    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users_challenges`,
      {
        method: "POST",
        body: JSON.stringify({
          user_uuid: body.user_uuid, // Save the user_uuid instead of user_id
          challenge_id: body.challenge_id,
        }),
      }
    );

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error creating user challenge:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to create user challenge: ${error.message}`,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// const createUserChallenge = async (req: Request) => {
//   try {
//     const body = JSON.parse(await req.text());

//     if (!body.user_uuid || !body.challenge_id) {
//       return new Response(
//         JSON.stringify({ error: "User UUID and Challenge ID are required." }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // Check if the user exists based on user_uuid
//     const userResponse = await supabaseFetch(
//       `${supabaseUrl}/rest/v1/users?uuid=eq.${body.user_uuid}`,
//       { method: "GET" }
//     );
//     const userData = await handleResponse(userResponse);
//     if (!userData.length) {
//       return new Response(JSON.stringify({ error: "User not found." }), {
//         status: 404,
//         headers: corsHeaders,
//       });
//     }

//     // Check if the challenge exists
//     const challengeResponse = await supabaseFetch(
//       `${supabaseUrl}/rest/v1/challenges?id=eq.${body.challenge_id}`,
//       { method: "GET" }
//     );
//     const challengeData = await handleResponse(challengeResponse);
//     if (!challengeData.length) {
//       return new Response(JSON.stringify({ error: "Challenge not found." }), {
//         status: 404,
//         headers: corsHeaders,
//       });
//     }

//     // Create the user-challenge relationship
//     const response = await supabaseFetch(
//       `${supabaseUrl}/rest/v1/users_challenges`,
//       {
//         method: "POST",
//         body: JSON.stringify({
//           user_uuid: body.user_uuid, // Save the user_uuid instead of user_id
//           challenge_id: body.challenge_id,
//         }),
//       }
//     );

//     const data = await handleResponse(response);
//     return new Response(JSON.stringify(data), {
//       status: 201,
//       headers: corsHeaders,
//     });
//   } catch (error) {
//     console.error("Error creating user challenge:", error);
//     return new Response(
//       JSON.stringify({
//         error: `Failed to create user challenge: ${error.message}`,
//       }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// };

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

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Handle all incoming requests
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
  const userUuid = url.searchParams.get("user_uuid"); // Get user_uuid from query params

  try {
    switch (req.method) {
      case "GET":
        // If user_uuid is provided in query params, return user-specific challenges
        if (userUuid) {
          return await getUserChallenges(userUuid);
        }
        // If no user_uuid is provided, return all challenges
        return await getUserChallenges(null);

      case "POST":
        const body = JSON.parse(await req.text());
        return await createUserChallenge(body);

      case "DELETE":
        return await deleteUserChallenge(id);

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
