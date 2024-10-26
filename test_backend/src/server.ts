import express from "express";
// import supabase from "./config/supabaseClient";
import combinedRoutes from "./routes/index";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("The backend server is running!");
});

// Returns all users
app.use("/api", combinedRoutes); // Prefixes all routes in importer router with "api"

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
