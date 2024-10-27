import supabase from "../config/supabaseClient";
import { Router } from "express";

const router = Router();

// Get all goals
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("goals").select("*");
    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error-- Unable to fetch "goals" data.' });
  }
});

router.get("/:id", async (req: any, res: any) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error-- Unable to fetch goal data" });
  }
});

// Create new goal
router.post("/", async (req: any, res: any) => {
  const { name, description } = req.body;

  // Validate request body
  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "You must enter both a name and a description" });
  }
  try {
    const { data, error } = await supabase
      .from("goals")
      .insert({
        name: name, // registration_date is automatically handled by PostgreSQL table (via DEFAULT)
        description: description,
      })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // Responds with goal data that was just created
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error-- Unable to create goal." });
  }
});

// Update goal
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
      error:
        "You must give at least one field (name or description) to update.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      // Logs error-- If there's an error in this code it's mostly like a Supabase error
      console.error("Supabase Error:", error);
      return res
        .status(400)
        .json({ error: error.message || "Unable to update goal." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to update goal (error)." });
  }
});

//  Delete goal
router.delete("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .select(); // Returns deleted row

    // Supabase error handler
    if (error) {
      throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete goal (error)." });
  }
});

export default router;
