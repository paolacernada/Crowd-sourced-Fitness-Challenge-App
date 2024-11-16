import { supabase } from "../config/supabaseClient";

export const getChallenges = async (tagIds?: number[]) => {
  try {
    let query = supabase.from("challenges").select(`
      id,
      name,
      description,
      difficulty,
      challenge_tags (tag_id),
      tags (id, name)
    `);

    if (tagIds && tagIds.length > 0) {
      query = query.in("challenge_tags.tag_id", tagIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw error;
  }
};

// Fetch a challenge by ID
export const getChallengeById = async (challengeId: number) => {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select(
        `
        id,
        name,
        description,
        difficulty,
        challenge_goals (goal_id),
        goals (id, name, description)
      `
      )
      .eq("id", challengeId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching challenge by ID:", error);
    throw error;
  }
};
