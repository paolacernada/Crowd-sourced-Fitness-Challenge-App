// functions/helloWorld.ts
const handler = (req: Request): Response => {
  const data = { message: "Hello, world!" };
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};

Deno.serve({ port: 8000 }, handler);



// // functions/helloWorld.ts
// import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// serve((req) => {
//   const data = { message: "Hello, world!" };
//   return new Response(JSON.stringify(data), {
//     headers: { "Content-Type": "application/json" },
//   });
// });
