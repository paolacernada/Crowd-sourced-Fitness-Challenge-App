// src/services/userChallengeService.ts
import { Challenge } from "@/src/types/Challenge"; // Assuming Challenge type is defined in the types folder
import { SUPABASE_URL } from "@env";

// Define the Edge function URL for fetching user-specific challenges
const userChallengesUrl = `${SUPABASE_URL}/functions/v1/userChallenges`;

/**
 * Fetch challenges for a specific user by their user ID
 * @param userId The ID of the user to fetch challenges for
 * @returns A promise that resolves to an array of challenges the user is involved in
 */
export const getUserChallenges = async (
  userId: string
): Promise<Challenge[]> => {
  try {
    const response = await fetch(`${userChallengesUrl}/${userId}`, {
      method: "GET", // Use GET method to fetch challenges
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authorization or headers (e.g., Supabase JWT token if needed)
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the response body as Challenge[] if the response is OK
    const data: Challenge[] = await response.json();
    console.log('Fetched challenges for user:', data);
    return data; // Return the list of challenges
  } catch (error) {
    console.error("Failed to load user challenges:", error);
    return { error: "Failed to load user challenges" }; // Return an error object
  }
};