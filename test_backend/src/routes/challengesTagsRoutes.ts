import { Router } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

// Retrieve all challenge-tag relationships
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("challenge_tags").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to fetch challenge-tag relationships." });
  }
});

// Return challenge-tag relationship by id
router.get("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("challenge_tags")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res
        .status(404)
        .json({ error: "Challenge-Tag relationship not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to fetch challenge-tag relationship." });
  }
});

// Create new challenge-tag relationship
router.post("/", async (req: any, res: any) => {
  const { challenge_id, tag_id } = req.body;

  if (!challenge_id || !tag_id) {
    return res
      .status(400)
      .json({ error: "Challenge ID and Tag ID are required." });
  }

  try {
    // Check if both the challenge_id and tag_id exist
    const { data: challengeExists } = await supabase
      .from("challenges")
      .select("id")
      .eq("id", challenge_id)
      .single();

    const { data: tagExists } = await supabase
      .from("tags")
      .select("id")
      .eq("id", tag_id)
      .single();

    if (!challengeExists || !tagExists) {
      return res.status(404).json({ error: "Challenge or Tag not found." });
    }

    // Insert the new challenge-tag relationship
    const { data, error } = await supabase
      .from("challenge_tags")
      .insert({ challenge_id, tag_id })
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to create challenge-tag relationship." });
  }
});

// Update a challenge-tag relationship
router.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { challenge_id, tag_id } = req.body;

  // Validate input
  if (!challenge_id && !tag_id) {
    return res.status(400).json({
      error: "At least one of Challenge ID or Tag ID is required for update.",
    });
  }

  try {
    // Fetch the existing relationship to verify it exists
    const { data: existingData, error: fetchError } = await supabase
      .from("challenge_tags")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingData) {
      return res
        .status(404)
        .json({ error: "Challenge-Tag relationship not found." });
    }

    // Prepare the update object, only including fields that were provided
    const updateObject: any = {};
    if (challenge_id) updateObject.challenge_id = challenge_id;
    if (tag_id) updateObject.tag_id = tag_id;

    // Update the challenge-tag relationship
    const { data, error } = await supabase
      .from("challenge_tags")
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
      .json({ error: "Unable to update challenge-tag relationship." });
  }
});

// Delete a challenge-tag relationship
// Delete a challenge-tag relationship by ID
router.delete("/:id", async (req: any, res: any) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    // Attempt to delete the challenge-tag relationship
    const { data, error } = await supabase
      .from("challenge_tags")
      .delete()
      .eq("id", id)
      .select(); // Optionally return the deleted row

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: "Challenge-Tag relationship not found." });
    }

    res.status(204).send(); // No content to send back
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to delete challenge-tag relationship." });
  }
});

export default router;
