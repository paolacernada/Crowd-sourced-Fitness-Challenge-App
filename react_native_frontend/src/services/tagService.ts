import { supabase } from "../config/supabaseClient";

export const getTags = async () => {
  try {
    const { data, error } = await supabase.from("tags").select("*");
    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};
