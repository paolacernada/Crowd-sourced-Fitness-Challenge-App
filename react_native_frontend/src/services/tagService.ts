import { supabase } from "../config/supabaseClient";

export interface Tag {
  id: number;
  name: string;
}

/**
 * Fetch all tags from the Supabase 'tags' table.
 * @returns Promise resolving to an array of Tag objects.
 */
export const getTags = async (): Promise<Tag[]> => {
  try {
    const { data, error } = await supabase.from<Tag>("tags").select("*");
    if (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTags:", error);
    throw error;
  }
};
