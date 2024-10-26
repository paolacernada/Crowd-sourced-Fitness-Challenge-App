import { Router } from "express";
import supabase from "../config/supabaseClient";

const router = Router();

// Returns all difficulties
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("difficulty").select("*");

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: 'Error-- Unable to fetch "difficulties" data.' });
  }
});

export default router;
