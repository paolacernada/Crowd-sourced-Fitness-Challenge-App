import supabase from "../config/supabaseClient";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("challenges").select("*");
    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "unable to find challenges data" });
  }
});

// Returns user by id
router.get("/:id", async (req: any, res: any) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", id) // Pass 'id' directly, not as an object-- this caused errors earlier for me
      .single(); // Fetch a single user (instead of all)

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to fetch challenge data." });
  }
});

// Create a new challenge
router.post("/", async (req: any, res: any) => {
  const { name, description, difficulty } = req.body;

  // Validate all required fields
  if (!name || !description || !difficulty) {
    return res
      .status(400)
      .json({ error: "You must enter a name, description, and difficulty." });
  }

  try {
    const { data, error } = await supabase
      .from("challenges")
      .insert({
        name: name,
        description: description,
        difficulty: difficulty,
      })
      .select();

    // If an error occurs, it is most likely on the Supabase side
    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // Responds with newly-created challenge data
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to create challenge." });
  }
});

// Update user
router.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description, difficulty } = req.body;

  // Todo: refactor-- it's currently making the query even if the parameters are all the same
  const updates: any = {};
  if (name) updates.name = name;
  if (description) updates.description = description;
  if (difficulty) updates.difficulty = difficulty;

  // Check that at least one field was provided
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      error:
        "You must give at least one field (name, description, or difficulty) to update.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("challenges")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      // Logs error-- If there's an error in this code it's mostly like a Supabase error
      console.error("Supabase Error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Unable to update challenge." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Challenge not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update challenge (error)." });
  }
});

// Todo: Delete challenge

export default router;
