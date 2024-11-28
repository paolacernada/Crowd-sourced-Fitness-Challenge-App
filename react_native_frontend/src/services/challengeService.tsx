import { Challenge } from "@/src/types/Challenge";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

// Edge function URLs
const challengesEdgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`;
const challengeTagsEdgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challengeTags`;

/**
 * Fetch challenges with optional tag filtering
 * @param selectedTags Array of tag IDs to filter challenges
 * @returns Promise resolving to an array of Challenge objects
 */
export const getChallenges = async (
  selectedTags: number[] = []
): Promise<Challenge[]> => {
  try {
    let url = challengesEdgeFunctionUrl;

    if (selectedTags.length > 0) {
      const tagParams = selectedTags.map((tagId) => `tag=${tagId}`).join("&");
      url += `?${tagParams}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching challenges:", errorText);
      throw new Error(`Error: ${response.statusText}`);
    }

    const data: Challenge[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to load challenges:", error);
    throw new Error("Failed to load challenges");
  }
};

// Fetch all challenges
export const getAllChallenges = async (): Promise<Challenge[]> => {
  return getChallenges();
};

// Fetch challenge by ID
export const getChallengeById = async (id: number): Promise<Challenge> => {
  try {
    const response = await fetch(`${challengesEdgeFunctionUrl}/${id}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data: Challenge = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to load challenge with ID ${id}`);
  }
};

/**
 * Function to associate a challenge with a tag
 * @param challengeId ID of the challenge
 * @param tagId ID of the tag
 * @returns Promise resolving to void
 */
export const associateChallengeWithTag = async (
  challengeId: number,
  tagId: number
): Promise<void> => {
  try {
    const response = await fetch(challengeTagsEdgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        challenge_id: challengeId,
        tag_id: tagId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error("Failed to associate challenge with tag:", error);
    throw new Error("Failed to associate challenge with tag");
  }
};

// Helper function to create a new challenge
export const createChallenge = async (
  challenge: Omit<Challenge, "id"> // Exclude 'id' when creating a new challenge
): Promise<Challenge> => {
  try {
    const response = await fetch(challengesEdgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(challenge),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${errorText}`);
    }

    const data: Challenge = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create challenge:", error);
    throw new Error("Failed to create challenge");
  }
};

// Function to update a challenge
export const updateChallenge = async (
  id: number,
  updatedChallenge: Partial<Challenge>
): Promise<Challenge> => {
  try {
    const response = await fetch(`${challengesEdgeFunctionUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(updatedChallenge),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${errorText}`);
    }

    const data: Challenge = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update challenge:", error);
    throw new Error("Failed to update challenge");
  }
};

// Function to delete a challenge
export const deleteChallenge = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${challengesEdgeFunctionUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error("Failed to delete challenge:", error);
    throw new Error("Failed to delete challenge");
  }
};
