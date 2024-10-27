import { Router } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

// Returns all tags
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tags").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error-- Unable to fetch "tags" data.' });
  }
});

// Returns user by id
router.get("/:id", async (req: any, res: any) => {
  // Todo: "any" bypasses the type checking here, but I need to figure it out eventually.
  // const {id} = req.params;  // Todo: look into if this is shorthand
  const id = req.params.id; // Extract the ID from the route parameters

  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("id", id) // Pass 'id' directly, not as an object-- this caused errors earlier for me
      .single(); // Fetch a single user (instead of all)

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to fetch tag data." });
  }
});

// Create new user
router.post("/", async (req: any, res: any) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "You must enter a tag" });
  }

  try {
    const { data, error } = await supabase
      .from("tags") //
      .insert({
        name: name, // registration_date is automatically handled by PostgreSQL table (via DEFAULT)
      })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // Responds with newly-created user data
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to create tag." });
  }
});

// Update user
router.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params; // Get the user ID from the URL
  const { name } = req.body; // Get the new name from the request body

  // Will do || checks when handling more than one field (like with Challenges)
  if (!name) {
    return res.status(400).json({ error: "You must provide a name to update" });
  }

  try {
    // Update user in Supabase database
    const { data, error } = await supabase
      .from("tags")
      .update({ name })
      .eq("id", id)
      .select(); // Returns updated row

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    // Responds with updated user data
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update tag (error)." });
  }
});

// Delete user
router.delete("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("tags")
      .delete()
      .eq("id", id)
      .select(); // Returns deleted row

    // Supabase error handler
    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete tag (error)." });
  }
});

export default router;
