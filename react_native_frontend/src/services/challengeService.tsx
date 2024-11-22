import { Challenge } from "@/src/types/Challenge";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`; // Edge function URL for challenges

// Fetch all challenges
// Todo: refactor for DRY for the routes
export const getAllChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await fetch(edgeFunctionUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data: Challenge[] = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to load challenges");
  }
};

// Fetch challenge by ID
export const getChallengeById = async (id: number): Promise<Challenge> => {
  try {
    const response = await fetch(`${edgeFunctionUrl}/${id}`);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data: Challenge = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to load challenge with ID ${id}`);
  }
};

// Helper function to create a new challenge
export const createChallenge = async (
  challenge: Omit<Challenge, "id"> // Exclude 'id' when creating a new challenge
): Promise<Challenge> => {
  try {
    const response = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challenge),
    });

    if (!response.ok) {
      throw new Error("Failed to create challenge");
    }

    const data: Challenge = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to create challenge");
  }
};

// Function to update a challenge
export const updateChallenge = async (
  id: number,
  updatedChallenge: Challenge
): Promise<Challenge> => {
  try {
    const response = await fetch(`${edgeFunctionUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedChallenge),
    });

    if (!response.ok) {
      throw new Error("Failed to update challenge");
    }

    const data: Challenge = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to update challenge");
  }
};

// Function to delete a challenge
export const deleteChallenge = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${edgeFunctionUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete challenge");
    }
  } catch (error) {
    throw new Error("Failed to delete challenge");
  }
};
