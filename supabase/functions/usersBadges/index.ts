import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
// const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Validate env variables
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

// Utility function -> Handles responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

// Handles requests
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop(); // This is for capturing user_badge id if needed

  try {
    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id))
          ? await getUserBadge(id)
          : await getUserBadges();

      case "POST":
        return await createUserBadge(await req.json());

      case "PATCH":
        return await updateUserBadge(id, await req.json());

      case "DELETE":
        return await deleteUserBadge(id);

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
// GET all user badges
const getUserBadges = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/users_badges`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

// GET user badge by ID
const getUserBadge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users_badges?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

// POST: Create user badge
const createUserBadge = async (body: { user_id: number; badge_id: number }) => {
  if (!body.user_id || !body.badge_id) {
    return new Response(
      JSON.stringify({ error: "Both user_id and badge_id are required" }),
      { status: 400 }
    );
  }

  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/users_badges`, {
    method: "POST",
    body: JSON.stringify({
      user_id: body.user_id,
      badge_id: body.badge_id,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    return new Response(
      JSON.stringify({ message: "User badge created successfully." }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

// PATCH: Update user badge (could be adding/removing badges)
const updateUserBadge = async (
  id: string | undefined,
  body: { user_id?: number; badge_id?: number }
) => {
  if (!body.user_id && !body.badge_id) {
    return new Response(
      JSON.stringify({
        error: "At least user_id or badge_id must be provided",
      }),
      { status: 400 }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users_badges?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        user_id: body.user_id,
        badge_id: body.badge_id,
      }),
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
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    return new Response(
      JSON.stringify({ message: "User badge updated successfully." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

// DELETE: Remove user badge
const deleteUserBadge = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users_badges?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, {
    status: 204,
    headers: { "Access-Control-Allow-Origin": "*" },
  });
};

// Start the server
Deno.serve(handleRequest);
