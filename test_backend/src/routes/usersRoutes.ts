import { Router } from "express";
// import { Router } from 'express';
import supabase from "../config/supabaseClient";

const router = Router();

// Returns all users
router.get("/", async (req, res) => {
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

// Returns user by id
router.get("/:id", async (req: any, res: any) => {
  // Todo: "any" bypasses the type checking here, but I need to figure it out eventually.
  // const {id} = req.params;  // Todo: look into if this is shorthand
  const id = req.params.id; // Extract the ID from the route parameters

  try {
    const { data, error } = await supabase
      .from("users") // Replace with your table name
      .select("*")
      .eq("id", id) // Pass 'id' directly, not as an object
      .single(); // Fetch a single user (instead of all)

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to fetch user data." });
  }
});

// Create new user
router.post("/", async (req: any, res: any) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "You must enter a username" });
  }

  try {
    const { data, error } = await supabase
      .from("users") //
      .insert({
        name: name, // registration_date is automatically handled by PostgreSQL table (via DEFAULT)
      })
      .select();

    if (error) {
      throw error;
    }

    // Respond with newly-created user data
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to create user." });
  }
});

// router.post('/', async (req: any, res: any) => {
//     const { name } = req.body;

//     if (!name) {
//         return res.status(404).json({ error: "You must enter a username" });
//       }

//     try {
//         const { data, error } = await supabase
//           .from("users") // Replace with your table name
//           .insert({
//             name: name,
//             // registration_date: "NOW()"
//         })
//           .select();

//         if (error) {
//           throw error;
//         }

//         res.status(200).json(data);
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Error-- Unable to fetch user data." });
//       }
//     });

// Update user

// Delete user

export default router;
