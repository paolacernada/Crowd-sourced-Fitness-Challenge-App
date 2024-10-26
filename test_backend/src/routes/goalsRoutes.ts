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

// Todo: Update goal

// Todo: Delete goal

export default router;
