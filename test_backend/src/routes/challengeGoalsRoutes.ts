import { Router } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

// Retrieve all challenge-goal relationships
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("challenge_goals").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to fetch challenge-goal relationships." });
  }
});

// Returns a challenge-goal relationship by id
router.get("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("challenge_goals")
      .select("*")
      .eq("id", id)
      .single(); // Fetch a single relationship by its ID

    if (error) {
      throw error;
    }

    if (!data) {
      return res
        .status(404)
        .json({ error: "Challenge-Goal relationship not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to fetch challenge-goal relationship." });
  }
});

// Create a new challenge-goal relationship
router.post("/", async (req: any, res: any) => {
  const { challenge_id, goal_id } = req.body;

  if (!challenge_id || !goal_id) {
    return res
      .status(400)
      .json({ error: "Challenge ID and Goal ID are required." });
  }

  try {
    // Check if both the challenge_id and goal_id exist
    const { data: challengeExists } = await supabase
      .from("challenges")
      .select("id")
      .eq("id", challenge_id)
      .single();

    const { data: goalExists } = await supabase
      .from("goals")
      .select("id")
      .eq("id", goal_id)
      .single();

    if (!challengeExists || !goalExists) {
      return res.status(404).json({ error: "Challenge or Goal not found." });
    }

    // Insert the new challenge-goal relationship
    const { data, error } = await supabase
      .from("challenge_goals")
      .insert({ challenge_id, goal_id })
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to create challenge-goal relationship." });
  }
});

// Update a challenge-goal relationship
router.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { challenge_id, goal_id } = req.body;

  // Validate input
  if (!challenge_id && !goal_id) {
    return res.status(400).json({
      error: "At least one of Challenge ID or Goal ID is required for update.",
    });
  }

  try {
    // Fetch the existing relationship to verify it exists
    const { data: existingData, error: fetchError } = await supabase
      .from("challenge_goals")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingData) {
      return res
        .status(404)
        .json({ error: "Challenge-Goal relationship not found." });
    }

    // Prepare the update object, only including fields that were provided
    const updateObject: any = {};
    if (challenge_id) updateObject.challenge_id = challenge_id;
    if (goal_id) updateObject.goal_id = goal_id;

    // Update the challenge-goal relationship
    const { data, error } = await supabase
      .from("challenge_goals")
      .update(updateObject)
      .eq("id", id)
      .select(); // Optionally, return the updated row

    if (error) {
      throw error;
    }

    res.status(200).json(data); // Return the updated relationship
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to update challenge-goal relationship." });
  }
});

// Delete a challenge-goal relationship
// Delete a challenge-goal relationship by ID
router.delete("/:id", async (req: any, res: any) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    // Attempt to delete the challenge-goal relationship
    const { data, error } = await supabase
      .from("challenge_goals")
      .delete()
      .eq("id", id)
      .select(); // Optionally return the deleted row

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: "Challenge-Goal relationship not found." });
    }

    res.status(204).send(); // No content to send back
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to delete challenge-goal relationship." });
  }
});
// router.delete("/", async (req: any, res: any) => {
//   const { challenge_id, goal_id } = req.body;

//   if (!challenge_id || !goal_id) {
//     return res
//       .status(400)
//       .json({ error: "Challenge ID and Goal ID are required." });
//   }

//   try {
//     const { data, error } = await supabase
//       .from("challenge_goals")
//       .delete()
//       .match({ challenge_id, goal_id })
//       .select(); // Use .select() to get the deleted row(s)

//     if (error) {
//       throw error;
//     }

//     // Check if data is null or an empty array
//     // This was what was messing up before
//     if (!data || (Array.isArray(data) && data.length === 0)) {
//       return res
//         .status(404)
//         .json({ error: "Challenge-Goal relationship not found." });
//     }

//     res.status(204).send();
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ error: "Unable to delete challenge-goal relationship." });
//   }
// });

export default router;
