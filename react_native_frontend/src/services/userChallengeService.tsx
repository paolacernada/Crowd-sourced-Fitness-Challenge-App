import { UserChallenge } from "@/src/types/UserChallenge"; // Import UserChallenge type
import { SUPABASE_URL } from "@env";

// Define the Edge function URL for fetching user-specific challenges
const userChallengesUrl = `${SUPABASE_URL}/functions/v1/userChallenges`;

/**
 * Fetch challenges for a specific user by their user ID
 * @param userId The ID of the user to fetch challenges for
 * @returns A promise that resolves to an array of challenges the user is involved in
 */

export const getUserChallenges = async (
  userUuid: string
): Promise<UserChallenge[]> => {
  console.log("Fetching challenges for userUuid:", userUuid); // Log the userUuid to make sure it's correct
  try {
    const url = `${userChallengesUrl}?user_uuid=${userUuid}`; // Update to use user_uuid
    console.log("Fetching from URL:", url); // Log the full URL being fetched

    const response = await fetch(url, {
      method: "GET", // Use GET method to fetch challenges
      headers: {
        "Content-Type": "application/json",
        // Add any necessary authorization or headers (e.g., Supabase JWT token if needed)
      },
    });

    console.log("Response status:", response.status); // Log the response status code

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response if available
      console.error("Error fetching user challenges:", errorText); // Log error message from response
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the response body as UserChallenge[]
    const data = await response.json();
    console.log("Fetched data:", data); // Log the data received from the server

    // Transform the data into the expected UserChallenge[] format
    const userChallenges: UserChallenge[] = data.map((item: any) => ({
      id: item.id,
      challenge_id: item.challenge_id,
      challenges: item.challenges, // The challenge object is nested inside 'challenges'
    }));

    console.log("Formatted user challenges:", userChallenges); // Log the final user challenges array

    return userChallenges; // Return the list of UserChallenges
  } catch (error) {
    console.error("Failed to load user challenges:", error); // Log any error that occurred during the process
    throw new Error("Failed to load user challenges.");
  }
};
