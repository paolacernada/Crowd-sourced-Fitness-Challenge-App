import express from "express";
// import supabase from "./config/supabaseClient";
import combinedRoutes from './routes/index'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Todo: I might not need this

app.get("/", (req, res) => {
  res.send("The backend server is running!");
});

// Returns all users
app.use('/api', combinedRoutes); // Prefixes all routes in importer router with "api"


// // Returns all users
// app.get("/api/users", async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("users") // Replace with your table name
//       .select("*");

//     if (error) {
//       throw error;
//     }

//     res.status(200).json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error-- Unable to fetch "users" data.' });
//   }
// });



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
