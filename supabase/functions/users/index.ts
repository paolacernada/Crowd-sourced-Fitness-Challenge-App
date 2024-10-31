import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config({ path: "../../.env.supabase" });
// console.log("Loaded environment variables:", env); // Testing use, to check what's loaded

// For local serving:
// const supabaseUrl = env.SUPABASE_URL;
// const supabaseAnonKey = env.SUPABASE_ANON_KEY;
// For deployment
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Testing use
// console.log("Supabase URL:", supabaseUrl);
// console.log("Supabase Anon Key:", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

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

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // GET method
  if (req.method === "GET") {
    const id = path.split("/").pop();
    if (id && !isNaN(Number(id))) {
      // Fetch a single user by ID
      try {
        const response = await supabaseFetch(
          `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
          { method: "GET" }
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
          { status: 500, headers: { "Content-Type": "application/json" } }
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
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Internal Error:", err);
        return new Response(
          JSON.stringify({ error: "Error-- Unable to fetch users data." }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // POST method
  if (req.method == "POST") {
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
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase Error:", errorData);
        return new Response(JSON.stringify({ error: errorData }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const dataText = await response.text(); // Todo: Is using .text() (to handle all types of responses) strictly needed?
      console.log("Supabase Response:", dataText);

      // This is to prevent an error message caused by Supabase returning
      // an empty response even if POST is successful
      if (dataText) {
        const data = JSON.parse(dataText);
        return new Response(JSON.stringify(data), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // The empty response is specifically handled here
        return new Response(
          JSON.stringify({ message: "User created successfully." }),
          {
            status: 201,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (err) {
      console.error("Internal Error:", err);
      return new Response(
        JSON.stringify({
          error: "Error-- Unable to create user.",
          details: err.message,
        }),
        { status: 500 }
      );
    }
  }

  // PATCH method
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
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase Error:", errorData);
        return new Response(JSON.stringify({ error: errorData }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const dataText = await response.text();
      console.log("Supabase Response:", dataText);

      if (dataText) {
        const jsonData = JSON.parse(dataText);
        return new Response(JSON.stringify(jsonData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Same as above, this handles a successful operation where no response was returned by Supabase
        return new Response(
          JSON.stringify({ message: "User updated successfully." }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (err) {
      console.error("Internal Error:", err);
      return new Response(JSON.stringify({ error: "Unable to update user." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // DELETE method
  if (req.method === "DELETE") {
    const id = path.split("/").pop();

    try {
      const response = await supabaseFetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Supabase Error:", errorData);
        return new Response(JSON.stringify({ error: errorData }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Case: Succesful deletion
      return new Response(null, { status: 204 });
    } catch (err) {
      console.error("Internal Error:", err);
      return new Response(JSON.stringify({ error: "Unable to delete user." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Handle unsupported methods
  return new Response("Method Not Allowed", { status: 405 });
});

// REMOVE THIS BLOCK WHEN DEPLOYING
// // Start the server
// const port = 8000; // or any port of your choice
// Deno.serve({ port }, handler);
// console.log(`Server running on http://localhost:${port}`);
