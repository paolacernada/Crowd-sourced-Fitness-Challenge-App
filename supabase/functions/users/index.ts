import { config } from "https://deno.land/x/dotenv/mod.ts";

// Load env variables
// Note: I used eslint-disable-next-line no-unused-vars
// const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
// Todo: add supabaseServiceKey equivalent to localbackend users routes too
// Service key for authenticated requests.
// const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// For testing
console.log("SUPABASE_URL:", supabaseUrl);
console.log("SUPABASE_ANON_KEY:", supabaseAnonKey);
console.log("SUPABASE_SERVICE_KEY:", supabaseServiceKey);

// Validate env variables
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
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

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return await response.json();
};

// Validate JWT
const validateJWT = async (token: string) => {
  const response = await supabaseFetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Invalid JWT");
  }

  return await response.json();
};

// Defines CORS globally, so we don't need to paste it in to every route function
// CORS headers to be added to all responses
// Todo: That means all responses for all routes
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*", // Replace '*' with the frontend domain once its deployed (for security reasons)
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS", // Allow the HTTP methods
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey", // Allow headers for the request
};

const handleRequest = async (req: Request) => {
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return new Response(null, {
      status: 204, // No Content for OPTIONS request
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();
  const token = req.headers.get("Authorization")?.split("Bearer ")[1];

  try {
    // Validate JWT if provided
    if (token) {
      await validateJWT(token);
    }

    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id)) ? await getUser(id) : await getUsers();

      case "POST":
        return await createUser(await req.json());

      case "PATCH":
        return await updateUser(id, await req.json());

      case "DELETE":
        return await deleteUser(id); // todo: the code works, but this probably still needs to be fixed

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

// Handlers for different HTTP methods
// GET
const getUsers = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/users`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
  });
};

// GET by id
const getUser = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
  });
};

// POST
// POST route: Create a user
const createUser = async (body: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  // Check that required fields are provided
  if (!body.name || !body.username || !body.email || !body.password) {
    return new Response(
      JSON.stringify({
        error: "You must enter a name, username, email, and password",
      }),
      {
        status: 400,
        headers: corsHeaders, // Include CORS headers on error responses
      }
    );
  }

  try {
    // Sign up user with Supabase Auth
    const response = await supabaseFetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const authData = await handleResponse(response);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: authData.error || "Failed to sign up" }),
        { status: 400, headers: corsHeaders } // CORS headers included
      );
    }


    // After successful signup, insert user details into the database
    const { user } = authData;

    // For authData debugging:
    console.log(user.id);

    // Test if there is no user ID to be found
    if (!user || !user.id) {
      return new Response(
        JSON.stringify({ error: "User creation failed, no user ID" }),
        { status: 500, headers: corsHeaders } // CORS headers included
      );
    }

    console.log("Inserting into users table with data:", {
      name: body.name,
      username: body.username,
      uuid: user.id,
    });

    // Insert user data into the "users" table
    const dbResponse = await supabaseFetch(`${supabaseUrl}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`, // Use Supabase service key
      },
      body: JSON.stringify({
        name: body.name,
        username: body.username,
        uuid: user.id, // UUID from Supabase Auth
      }),
    });

    const data = await handleResponse(dbResponse);

    // Check for any errors from the database
    if (!dbResponse.ok) {
      return new Response(
        JSON.stringify({
          error: data.error || "Failed to insert into database",
        }),
        { status: 400, headers: corsHeaders } // CORS headers included
      );
    }

    // Return the success response
    return new Response(JSON.stringify(data), {
      status: 201, // Created
      headers: corsHeaders, // Include CORS headers
    });
  } catch (error) {
    console.error("Error during user creation:", error);

    // Return a generic error if something went wrong
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500, // Internal Server Error
        headers: corsHeaders, // CORS headers included
      }
    );
  }
};
// const createUser = async (body: {
//   name: string;
//   username: string;
//   email: string;
//   password: string;
// }) => {
//   if (!body.name || !body.username || !body.email || !body.password) {
//     return new Response(
//       JSON.stringify({
//         error: "You must enter a name, username, email, and password",
//       }),
//       { status: 400, headers: corsHeaders }
//     );
//   }

//   // Sign up user with Supabase Auth
//   const response = await supabaseFetch(`${supabaseUrl}/auth/v1/signup`, {
//     method: "POST",
//     body: JSON.stringify({
//       email: body.email,
//       password: body.password,
//     }),
//   });

//   const authData = await handleResponse(response);

//   if (!response.ok) {
//     return new Response(
//       JSON.stringify({ error: authData.error || "Failed to sign up" }),
//       { status: 400 }
//     );
//   }

//   // After successful signup, insert user details into the database
//   const { user } = authData;
//   // Test if there is no user ID to be found
//   if (!user || !user.id) {
//     return new Response(
//       JSON.stringify({ error: "User creation failed, no user ID" }),
//       { status: 500 }
//     );
//   }

//   console.log("Inserting into users table with data:", {
//     name: body.name,
//     username: body.username,
//     uuid: user.id,
//   });

//   const dbResponse = await supabaseFetch(`${supabaseUrl}/rest/v1/users`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${supabaseServiceKey}`, // Use Supabase-granted access token
//       // "Authorization": `Bearer ${authData.access_token}`, // Use Supabase-granted access token
//     },
//     body: JSON.stringify({
//       name: body.name,
//       username: body.username,
//       // Use the UUID provided by Supabase Auth
//       uuid: user.id,
//     }),
//   });

//   const data = await handleResponse(dbResponse);

//   // Check for errors from the postgreSQL database
//   if (!dbResponse.ok) {
//     return new Response(
//       JSON.stringify({
//         error: data.error || "Failed to insert into database",
//       }),
//       { status: 400 }
//     );
//   }

//   return new Response(JSON.stringify(data), {
//     status: 201,
//     headers: corsHeaders,
//   });
// };

// PATCH
const updateUser = async (id: string | undefined, body: { name: string }) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must provide a name to update" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
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
      headers: corsHeaders,
    });
  } else {
    // Case: response is empty
    return new Response(
      JSON.stringify({ message: "User updated successfully." }),
      { status: 200, headers: corsHeaders }
    );
  }
};

// DELETE
const deleteUser = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/users?id=eq.${id}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  return new Response(null, { status: 204, headers: corsHeaders });
};

// Start the server
Deno.serve(handleRequest);

// REMOVE THIS BLOCK WHEN DEPLOYING
// // Start the server
// const port = 8000; // or any port of your choice
// Deno.serve({ port }, handler);
// console.log(`Server running on http://localhost:${port}`);
