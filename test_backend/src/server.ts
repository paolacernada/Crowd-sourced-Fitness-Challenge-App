import express from "express";
import supabase from "./config/supabaseClient";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("The backend server is running!");
});

// Returns all users
app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users") // Replace with your table name
      .select("*");

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error-- Unable to fetch "users" data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
