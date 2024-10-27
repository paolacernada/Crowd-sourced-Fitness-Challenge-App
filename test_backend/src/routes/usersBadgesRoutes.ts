import { Router } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

// Retrieve all user-badge relationships
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users_badges").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to fetch user-badge relationships." });
  }
});

// Return user-badge relationship by id
router.get("/:id", async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("users_badges")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return res
        .status(404)
        .json({ error: "User-Badge relationship not found." });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch user-badge relationship." });
  }
});

// Create new user-badge relationship
router.post("/", async (req: any, res: any) => {
  const { user_id, badge_id } = req.body;

  if (!user_id || !badge_id) {
    return res
      .status(400)
      .json({ error: "User ID and Badge ID are required." });
  }

  try {
    // Check if both the user_id and badge_id exist
    const { data: userExists } = await supabase
      .from("users")
      .select("id")
      .eq("id", user_id)
      .single();

    const { data: badgeExists } = await supabase
      .from("badges")
      .select("id")
      .eq("id", badge_id)
      .single();

    if (!userExists || !badgeExists) {
      return res.status(404).json({ error: "User or Badge not found." });
    }

    // Insert the new user-badge relationship
    const { data, error } = await supabase
      .from("users_badges")
      .insert({ user_id, badge_id })
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to create user-badge relationship." });
  }
});

// Update a user-badge relationship
router.patch("/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { user_id, badge_id } = req.body;

  // Validate input
  if (!user_id && !badge_id) {
    return res.status(400).json({
      error: "At least one of Challenge ID or Tag ID is required for update.",
    });
  }

  try {
    // Fetch the existing relationship to verify it exists
    const { data: existingData, error: fetchError } = await supabase
      .from("users_badges")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!existingData) {
      return res
        .status(404)
        .json({ error: "User-Badge relationship not found." });
    }

    // Prepare the update object, only including fields that were provided
    const updateObject: any = {};
    if (user_id) updateObject.user_id = user_id;
    if (badge_id) updateObject.badge_id = badge_id;

    // Update the user-badge relationship
    const { data, error } = await supabase
      .from("users_badges")
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
      .json({ error: "Unable to update user-badge relationship." });
  }
});

// Delete a user-badge relationship by ID
router.delete("/:id", async (req: any, res: any) => {
  const { id } = req.params; // Extract the ID from the route parameters

  try {
    // Attempt to delete the user-badge relationship
    const { data, error } = await supabase
      .from("users_badges")
      .delete()
      .eq("id", id)
      .select(); // Optionally return the deleted row

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ error: "User_Badge relationship not found." });
    }

    res.status(204).send(); // No content to send back
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Unable to delete user-badge relationship." });
  }
});

export default router;
