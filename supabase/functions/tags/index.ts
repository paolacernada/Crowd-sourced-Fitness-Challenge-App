import { config } from "https://deno.land/x/dotenv/mod.ts";

const env = config({ path: "../../.env.supabase" });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Environment variables are not set correctly.");
}

const supabaseFetch = async (url: string, options: RequestInit) => {
  const headers = {
    ...options.headers,
    "apikey": supabaseAnonKey,
    "Authorization": `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
  };

  // console.log("Request Headers:", headers); // Debug use for any header errors

  const response = await fetch(url, {
    ...options,
    headers,
  });
  return response;
};

// Utility function handling responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error response:", errorData);
    throw new Error(errorData);
  }
  return await response.json();
};

// Handles requests
const handleRequest = async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split("/");
  const id = path.pop();

  try {
    switch (req.method) {
      case "GET":
        return id && !isNaN(Number(id)) ? await getTag(id) : await getTags();

      case "POST":
        const body = await req.json();
        return await createTag(body);

      case "PATCH":
        const patchBody = await req.json();
        return await updateTag(id, patchBody);

      case "DELETE":
        return await deleteTag(id);

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
const getTags = async () => {
  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/tags`, {
    method: "GET",
  });
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// GET by id
const getTag = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/tags?id=eq.${id}`,
    { method: "GET" }
  );
  const data = await handleResponse(response);
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

// POST
const createTag = async (body: { name: string }) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must enter a tag name" }),
      { status: 400 }
    );
  }

  console.log("Request Body:", JSON.stringify(body));

  const response = await supabaseFetch(`${supabaseUrl}/rest/v1/tags`, {
    method: "POST",
    body: JSON.stringify({ name: body.name }),
  });

<<<<<<< HEAD
=======

>>>>>>> c363b0e780bb9344f738f756f0b59f5ab300f17e
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData);
  }

  const dataText = await response.text();
  if (dataText) {
    const jsonData = JSON.parse(dataText);
    return new Response(JSON.stringify(jsonData), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // Returns successful method if the response is empty
    return new Response(
      JSON.stringify({ message: "Tag created successfully." }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  }
};

// PATCH
const updateTag = async (id: string | undefined, body: { name: string }) => {
  if (!body.name) {
    return new Response(
      JSON.stringify({ error: "You must provide a name to update" }),
      { status: 400 }
    );
  }

  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/tags?id=eq.${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name: body.name }),
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
      headers: { "Content-Type": "application/json" },
    });
  } else {
    // Case: response is empty
    return new Response(
      JSON.stringify({ message: "Tag updated successfully." }),
      { status: 200 }
    );
  }
};

// DELETE
const deleteTag = async (id: string) => {
  const response = await supabaseFetch(
    `${supabaseUrl}/rest/v1/tags?id=eq.${id}`,
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
<<<<<<< HEAD
// console.log(`Server running on http://localhost:${port}`);
=======
// console.log(`Server running on http://localhost:${port}`);
>>>>>>> c363b0e780bb9344f738f756f0b59f5ab300f17e
