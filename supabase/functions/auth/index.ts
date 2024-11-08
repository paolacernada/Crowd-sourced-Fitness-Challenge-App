import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
// Note: I used eslint-disable-next-line no-unused-vars
const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
// For testing
// console.log("SUPABASE_URL:", supabaseUrl);
// console.log("SUPABASE_ANON_KEY:", supabaseAnonKey);

// Validate env variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

// Fetch data
const supabaseFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "apikey": supabaseAnonKey,
      "Content-Type": "application/json",
    },
  });
  return response;
};

// Handler function to handle registration and return JWT
const handleRequest = async (req: Request) => {
  const { email, password } = await req.json();

  try {
    // Validate the request data
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400 }
      );
    }

    // Sign up user with Supabase Auth
    const response = await supabaseFetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const authData = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: authData.error || "Failed to sign up" }),
        { status: 400 }
      );
    }

    const { user, access_token } = authData;

    if (access_token && user) {
      // Send back the JWT token to the client
      return new Response(
        JSON.stringify({
          message: "User created successfully",
          access_token,
          userId: user.id,
        }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to get JWT token" }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

Deno.serve(handleRequest);

// REMOVE THIS BLOCK WHEN DEPLOYING
// // Start the server
// const port = 8000; // or any port of your choice
// Deno.serve({ port }, handler);
// console.log(`Server running on http://localhost:${port}`);
