import supabase from "../config/supabaseClient";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to find badges data" });
  }
});

// Returns user by id
router.get("/:id", async (req: any, res: any) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from("badges")
      .select("*")
      .eq("id", id) // Pass 'id' directly, not as an object-- this caused errors earlier for me
      .single(); // Fetch a single user (instead of all)

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Badge not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to fetch badge data." });
  }
});

// Create a new badge
router.post("/", async (req: any, res: any) => {
  const { name, description } = req.body;

  // Validate all required fields
  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "You must enter a name and a description." });
  }

  try {
    const { data, error } = await supabase
      .from("badges")
      .insert({
        name: name,
        description: description,
      })
      .select();

    // If an error occurs, it is most likely on the Supabase side
    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // Responds with newly-created badge data
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to create badge." });
  }
});

// Update badge
router.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // Todo: refactor-- it's currently making the query even if the parameters are all the same
  const updates: any = {};
  if (name) updates.name = name;
  if (description) updates.description = description;

  // Check that at least one field was provided
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: "You must give at least one field (name, description) to update.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("badges")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      // Logs error-- If there's an error in this code it's mostly like a Supabase error
      console.error("Supabase Error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Unable to update badge." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Badge not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update badge (error)." });
  }
});

// Delete badge
router.delete("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("badges")
      .delete()
      .eq("id", id)
      .select(); // Returns deleted row

    // Supabase error handler
    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Badge not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete badge (error)." });
  }
});

export default router;
