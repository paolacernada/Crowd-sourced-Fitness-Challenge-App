// import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load environment variables

// const env = config({ path: "../../.env.supabase" });

// Use environment variables for deployment
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"); // Add service key if needed

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  throw new Error("Environment variables are not set correctly.");
}

// Helper function for fetching data
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

// Utility function to handle responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

// Function to handle requests
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();

  try {
    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id))
          ? await getChallenge(id)
          : await getChallenges();

      case "POST":
        return await createChallenge(await req.json());

      case "PATCH":
        return await updateChallenge(id, await req.json());

      case "DELETE":
        return await deleteChallenge(id); // todo: the code works, but this probably still needs to be fixed

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
// GET
const getChallenges = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/challenges`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// GET by id
const getChallenge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenges?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST
const createChallenge = async (body: { name: string }) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must enter a challenge" }),
      { status: 400 }
    );
  }

  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/challenges`, {
    method: "POST",
    body: JSON.stringify({ name: body.name }),
  });

  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

// PATCH
const updateChallenge = async (
  id: string | undefined,
  body: { name: string }
) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must provide a name to update" }),
      { status: 400 }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenge?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name: body.name }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text(); // .text() used to handle potential empty response -- Supabase returns an empty response even after some successful operations
    throw new Error(errorData);
  }

  const dataText = await response.text();
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // Case: response is empty
    return new Response(
      JSON.stringify({ message: "Challenge updated successfully." }),
      { status: 200 }
    );
  }
};

// DELETE
const deleteChallenge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/challenges?id=eq.${id}`,
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

// REMOVE THIS BLOCK WHEN DEPLOYING
// // Start the server
// const port = 8000; // or any port of your choice
// Deno.serve({ port }, handler);
// console.log(`Server running on http://localhost:${port}`);
