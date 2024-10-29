// functions/users/index.ts
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

// Load environment variables from .env.supabase file
const env = config({ path: ".env.supabase" });
const supabaseUrl = env.SUPABASE_URL!;
const supabaseAnonKey = env.SUPABASE_ANON_KEY!;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);

console.log("Loaded environment variables:", env);

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

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Handle different HTTP methods
  if (req.method === "GET") {
    const id = path.split("/").pop();
    if (id && !isNaN(Number(id))) {
      // Fetch a single user by ID
      try {
        const response = await supabaseFetch(
          `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          return new Response(JSON.stringify({ error: errorData.message }), {
            status: response.status,
          });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error(err);
        return new Response(
          JSON.stringify({ error: "Error-- Unable to fetch user data." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Fetch all users
      try {
        const response = await supabaseFetch(`${supabaseUrl}/rest/v1/users`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          return new Response(JSON.stringify({ error: errorData.message }), {
            status: response.status,
          });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error(err);
        return new Response(
          JSON.stringify({ error: "Error-- Unable to fetch users data." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new Response(
        JSON.stringify({ error: "You must enter a username" }),
        { status: 400 }
      );
    }

    try {
      const response = await supabaseFetch(`${supabaseUrl}/rest/v1/users`, {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.text(); // Get response as text
        console.error("Supabase Error:", errorData);
        return new Response(JSON.stringify({ error: errorData }), {
          status: response.status,
        });
      }

      // Handle response data
      const data = await response.text();
      const jsonData = data ? JSON.parse(data) : {}; // Parse or set to empty object
      return new Response(JSON.stringify(jsonData), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Internal Error:", err);
      return new Response(
        JSON.stringify({ error: "Error-- Unable to create user." }),
        { status: 500 }
      );
    }
  }

  if (req.method === "PATCH") {
    const id = path.split("/").pop();
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new Response(
        JSON.stringify({ error: "You must provide a name to update" }),
        { status: 400 }
      );
    }

    try {
      const response = await supabaseFetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name }),
        }
      );

      // Check if the response is ok
      if (!response.ok) {
        const errorData = await response.text(); // Get response as text
        console.error("Supabase Error:", errorData);
        return new Response(JSON.stringify({ error: errorData }), {
          status: response.status,
        });
      }

      // Handle the response
      const data = await response.text();
      const jsonData = data ? JSON.parse(data) : {}; // Parse or set to empty object

      // Return the updated user data or a success message
      return new Response(JSON.stringify(jsonData), {
        status: 200, // Use 200 for successful updates
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Internal Error:", err);
      return new Response(JSON.stringify({ error: "Unable to update user." }), {
        status: 500,
      });
    }
  }

  if (req.method === "DELETE") {
    const id = path.split("/").pop();

    try {
      const response = await supabaseFetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return new Response(JSON.stringify({ error: errorData.message }), {
          status: response.status,
        });
      }

      return new Response(null, { status: 204 });
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({ error: "Unable to delete user." }), {
        status: 500,
      });
    }
  }

  // Handle unsupported methods
  return new Response("Method Not Allowed", { status: 405 });
};

// Start the server
const port = 8000; // or any port of your choice
Deno.serve({ port }, handler);
console.log(`Server running on http://localhost:${port}`);
