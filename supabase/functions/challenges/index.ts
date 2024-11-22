// Import necessary modules
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables (If you are using dotenv for local development)
// const env = config({ path: "../../.env.edge" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
// Todo: add supabaseServiceKey equivalent to localbackend users routes too
// Service key for authenticated requests.
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("Environment variables are not set correctly.");
}

// CORS headers
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace '*' with your frontend URL for production
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
};

// Helper function for making requests to Supabase API
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

// Utility to handle the response from Supabase API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {}; // Return parsed JSON or empty object
  } catch (error) {
    console.error("Error parsing response:", error);
    return {};
  }
};

// Validates JWT token if provided
const validateJWT = async (token: string) => {
  const response = await supabaseFetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Invalid JWT");
  }

  return await response.json();
};

// Handle OPTIONS requests for CORS pre-flight
const handleOptions = () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

// Main request handler
const handleRequest = async (req: Request) => {
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS preflight");
    return handleOptions(); // Respond to preflight OPTIONS request
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  try {
    // Validate JWT if token is present
    if (token) {
      console.log("Validating JWT...");
      await validateJWT(token);
    }

    switch (req.method) {
      case "GET":
        console.log("GET request for challenge");
        return id && !isNaN(Number(id))
          ? await getChallenge(id)
          : await getChallenges();

      case "POST":
        console.log("POST request for creating challenge");
        return await createChallenge(await req.json());

      case "PATCH":
        console.log("PATCH request for updating challenge");
        return await updateChallenge(id, await req.json());

      case "DELETE":
        console.log("DELETE request for challenge");
        return await deleteChallenge(id);

      default:
        console.log("Method Not Allowed");
        return new Response("Method Not Allowed", {
          status: 405,
          headers: corsHeaders,
        });
    }
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// Fetch all challenges (GET)
const getChallenges = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/challenges`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};

// Fetch a single challenge by ID (GET)
const getChallenge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenges?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders,
  });
};

const createChallenge = async (body: {
  name: string;
  description: string;
  difficulty: string;
}) => {
  // Ensure that the 'name', 'description', and 'difficulty' fields are provided
  if (!body.name || !body.description || !body.difficulty) {
    return new Response(
      JSON.stringify({
        error: "Challenge name, description, and difficulty are required",
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Log the received data to ensure it's correct
  console.log("Received data:", body);

  try {
    const response = await supabaseFetch(`${supabaseUrl}/rest/v1/challenges`, {
      method: "POST",
      body: JSON.stringify({
        name: body.name,
        description: body.description, // Ensure description is included
        difficulty: body.difficulty, // Include difficulty as well
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
        "apikey": supabaseAnonKey,
      },
    });

    // Handle the response
    const data = await handleResponse(response);
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error in POST request:", error); // Log the error for debugging
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create challenge" }),
      { status: 500, headers: corsHeaders }
    );
  }
};

// Update an existing challenge (PATCH)
const updateChallenge = async (
  id: string | undefined,
  body: { name?: string; description?: string; difficulty?: string }
) => {
  // Check if at least one field is provided for update
  if (!body.name && !body.description && !body.difficulty) {
    return new Response(
      JSON.stringify({
        error:
          "You must provide at least one field (name, description, difficulty) to update",
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Construct the body with only the provided fields
  const updateData: {
    name?: string;
    description?: string;
    difficulty?: string;
  } = {};
  if (body.name) updateData.name = body.name;
  if (body.description) updateData.description = body.description;
  if (body.difficulty) updateData.difficulty = body.difficulty;

  // Send the PATCH request to Supabase API (adjust the table name and URL accordingly)
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenges?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: corsHeaders,
    });
  } else {
    // In case of an empty response, indicate the update was successful
    return new Response(
      JSON.stringify({ message: "Challenge updated successfully." }),
      { status: 200, headers: corsHeaders }
    );
  }
};

// Delete a challenge (DELETE)
const deleteChallenge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenges?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Start the function server (Supabase Edge function)
Deno.serve(handleRequest);
