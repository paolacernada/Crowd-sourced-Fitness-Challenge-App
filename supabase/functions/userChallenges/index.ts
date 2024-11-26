import { config } from "https://deno.land/x/dotenv/mod.ts";

// Local testing: Load env variables
// const env = config({ path: "../../.env.supabase" });

// Production deployment :Load env variables
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
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", // Allow these methods for CORS
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

// GET (all) user-challenge relationships or by user_uuid (the latter is readily available in React Native)
const getUserChallenges = async (userUuid: string | null) => {
  const query = userUuid
    ? `${supabaseUrl}/rest/v1/users_challenges?user_uuid=eq.${userUuid}&select=id,challenge_id,completed,favorites,users(id,name,uuid),challenges(id,name,description,difficulty)&order=id.asc`
    : `${supabaseUrl}/rest/v1/users_challenges?select=id,challenge_id,completed,favorites,users(id,name,uuid),challenges(id,name,description,difficulty)&order=id.asc`;

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
    const body = await req.json(); // Parse the JSON body

    // Check if user_uuid and challenge_id are provided in the body
    if (!body.user_uuid || !body.challenge_id) {
      return new Response(
        JSON.stringify({ error: "User UUID and Challenge ID are required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Fetch the user_id based on the user_uuid
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

    // Get the user_id from the fetched user data
    const user_id = userData[0].id; // Assuming userData contains the 'id' field

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

    // Create the user-challenge relationship with both user_id and user_uuid, as well as the rest of the data
    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users_challenges`,
      {
        method: "POST",
        body: JSON.stringify({
          user_id: user_id, // Insert user_id
          user_uuid: body.user_uuid, // Insert user_uuid
          challenge_id: body.challenge_id,
          completed: body.completed || false, // Default to false if not provided
          favorites: body.favorites || false, // Default to false if not provided
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

// PATCH: Update user-challenge relationship (completed and favorites)
const updateUserChallenge = async (id: string, req: Request) => {
  try {
    const body = await req.json(); // Parse the JSON body

    // Prepare the update fields
    const updates: Record<string, any> = {};
    if (typeof body.completed === "boolean") {
      updates.completed = body.completed;
    }
    if (typeof body.favorites === "boolean") {
      updates.favorites = body.favorites;
    }

    // Ensure at least one field (completed or favorites) is provided for updating
    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Update the user-challenge relationship
    const response = await supabaseFetch(
      `${supabaseUrl}/rest/v1/users_challenges?id=eq.${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );

    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error updating user challenge:", error);
    return new Response(
      JSON.stringify({
        error: `Failed to update user challenge: ${error.message}`,
      }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// DELETE: Delete user-challenge relationship by ID
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
  // Handles preflight OPTIONS requests for CORS
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
        return await createUserChallenge(req); // Pass the request to createUserChallenge

      case "PATCH":
        if (id) {
          return await updateUserChallenge(id, req); // Handle updating an existing user challenge
        }
        return new Response("ID required for update", {
          status: 400,
          headers: corsHeaders,
        });

      case "DELETE":
        if (id) {
          return await deleteUserChallenge(id);
        }
        return new Response("ID required for deletion", {
          status: 400,
          headers: corsHeaders,
        });

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

// import { config } from "https://deno.land/x/dotenv/mod.ts";

// // Local testing: Load env variables
// // const env = config({ path: "../../.env.supabase" });

// // Production deployment :Load env variables
// const supabaseUrl = Deno.env.get("SUPABASE_URL");
// const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// // Validates env variables
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Environment variables are not set correctly.");
// }

// // CORS headers to allow frontend access
// const corsHeaders = {
//   "Content-Type": "application/json",
//   "Access-Control-Allow-Origin": "*", // Replace "*" with frontend URL if frontend is deployed
//   "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS", // Allow these methods for CORS
//   "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey", // Allow headers for requests
// };

// // Fetches data from Supabase
// const supabaseFetch = async (url: string, options: RequestInit) => {
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       "apikey": supabaseAnonKey,
//       "Authorization": `Bearer ${supabaseAnonKey}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return response;
// };

// // Handles the response
// const handleResponse = async (response: Response) => {
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message);
//   }
//   const text = await response.text();
//   if (!text) {
//     return {};
//   }

//   try {
//     return JSON.parse(text);
//   } catch (error) {
//     console.error("Error parsing response:", error);
//     return {};
//   }
// };

// // GET (all) user-challenge relationships or by user_uuid (the latter is readily available in React Native)
// const getUserChallenges = async (userUuid: string | null) => {
//   const query = userUuid
//     ? `${supabaseUrl}/rest/v1/users_challenges?user_uuid=eq.${userUuid}&select=id,challenge_id,completed,favorites,users(id,name,uuid),challenges(id,name,description,difficulty)`
//     : `${supabaseUrl}/rest/v1/users_challenges?select=id,challenge_id,completed,favorites,users(id,name,uuid),challenges(id,name,description,difficulty)`;

//   const response = await supabaseFetch(query, {
//     method: "GET",
//   });

//   const data = await handleResponse(response);

//   if (data.length === 0) {
//     return new Response(JSON.stringify({ error: `No challenges found.` }), {
//       status: 404,
//       headers: corsHeaders,
//     });
//   }

//   return new Response(JSON.stringify(data), {
//     headers: corsHeaders,
//   });
// };

// // POST: Create a user-challenge relationship
// const createUserChallenge = async (req: Request) => {
//   try {
//     const body = await req.json(); // Parse the JSON body

//     // Check if user_uuid and challenge_id are provided in the body
//     if (!body.user_uuid || !body.challenge_id) {
//       return new Response(
//         JSON.stringify({ error: "User UUID and Challenge ID are required." }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // Fetch the user_id based on the user_uuid
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

//     // Get the user_id from the fetched user data
//     const user_id = userData[0].id; // Assuming userData contains the 'id' field

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

//     // Create the user-challenge relationship with both user_id and user_uuid, as well as the rest of the data
//     const response = await supabaseFetch(
//       `${supabaseUrl}/rest/v1/users_challenges`,
//       {
//         method: "POST",
//         body: JSON.stringify({
//           user_id: user_id, // Insert user_id
//           user_uuid: body.user_uuid, // Insert user_uuid
//           challenge_id: body.challenge_id,
//           completed: body.completed || false, // Default to false if not provided
//           favorites: body.favorites || false, // Default to false if not provided
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

// // PATCH: Update user-challenge relationship (completed and favorites)
// const updateUserChallenge = async (id: string, req: Request) => {
//   try {
//     const body = await req.json(); // Parse the JSON body

//     // Prepare the update fields
//     const updates: Record<string, any> = {};
//     if (typeof body.completed === "boolean") {
//       updates.completed = body.completed;
//     }
//     if (typeof body.favorites === "boolean") {
//       updates.favorites = body.favorites;
//     }

//     // Ensure at least one field (completed or favorites) is provided for updating
//     if (Object.keys(updates).length === 0) {
//       return new Response(
//         JSON.stringify({ error: "No valid fields to update." }),
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // Update the user-challenge relationship
//     const response = await supabaseFetch(
//       `${supabaseUrl}/rest/v1/users_challenges?id=eq.${id}`,
//       {
//         method: "PATCH",
//         body: JSON.stringify(updates),
//       }
//     );

//     const data = await handleResponse(response);
//     return new Response(JSON.stringify(data), {
//       status: 200,
//       headers: corsHeaders,
//     });
//   } catch (error) {
//     console.error("Error updating user challenge:", error);
//     return new Response(
//       JSON.stringify({
//         error: `Failed to update user challenge: ${error.message}`,
//       }),
//       { status: 500, headers: corsHeaders }
//     );
//   }
// };

// // DELETE: Delete user-challenge relationship by ID
// const deleteUserChallenge = async (id: string) => {
//   const response = await supabaseFetch(
//     `${supabaseUrl}/rest/v1/users_challenges?id=eq.${id}`,
//     { method: "DELETE" }
//   );

//   if (!response.ok) {
//     const errorData = await response.text();
//     throw new Error(errorData);
//   }

//   return new Response(null, { status: 204, headers: corsHeaders });
// };

// // Handle all incoming requests
// const handleRequest = async (req: Request) => {
//   // Handles preflight OPTIONS requests for CORS
//   if (req.method === "OPTIONS") {
//     return new Response(null, {
//       status: 204,
//       headers: corsHeaders,
//     });
//   }

//   const url = new URL(req.url);
//   const path = url.pathname.split("/").filter(Boolean);
//   const id = path.pop();
//   const userUuid = url.searchParams.get("user_uuid"); // Get user_uuid from query params

//   try {
//     switch (req.method) {
//       case "GET":
//         // If user_uuid is provided in query params, return user-specific challenges
//         if (userUuid) {
//           return await getUserChallenges(userUuid);
//         }
//         // If no user_uuid is provided, return all challenges
//         return await getUserChallenges(null);

//       case "POST":
//         return await createUserChallenge(req); // Pass the request to createUserChallenge

//       case "PATCH":
//         if (id) {
//           return await updateUserChallenge(id, req); // Handle updating an existing user challenge
//         }
//         return new Response("ID required for update", {
//           status: 400,
//           headers: corsHeaders,
//         });

//       case "DELETE":
//         if (id) {
//           return await deleteUserChallenge(id);
//         }
//         return new Response("ID required for deletion", {
//           status: 400,
//           headers: corsHeaders,
//         });

//       default:
//         return new Response("Method Not Allowed", {
//           status: 405,
//           headers: corsHeaders,
//         });
//     }
//   } catch (error) {
//     console.error("Internal Error:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// };

// // Start the server
// Deno.serve(handleRequest);
