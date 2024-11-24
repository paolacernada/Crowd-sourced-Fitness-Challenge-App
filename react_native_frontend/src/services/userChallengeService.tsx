import { UserChallenge } from "@/src/types/UserChallenge";
import { CompletedChallenge } from "@/src/types/CompletedChallenge";
import { SUPABASE_URL } from "@env";

// Edge function URL for fetching user-specific challenges
const userChallengesUrl = `${SUPABASE_URL}/functions/v1/userChallenges`;

// Edge function URL for all completed challeneges and associated user and challenge data
const completedChallengesUrl = `${SUPABASE_URL}/functions/v1/completedChallenges`;

/**
 * Fetch challenges for a specific user by their user ID
 * @param userUuid The UUID of the user to fetch challenges for. This is easily available in React Native's Supabase module
 * @returns A promise that resolves to an array of challenges the user is involved in
 */
export const getUserChallenges = async (
  userUuid: string
): Promise<UserChallenge[]> => {
  // console.log("Fetching challenges for userUuid:", userUuid); // Log the userUuid to make sure it's correct
  try {
    const url = `${userChallengesUrl}?user_uuid=${userUuid}`;
    // console.log("Fetching from URL:", url); // Debugging-use: Log the full URL being fetched

    const response = await fetch(url, {
      method: "GET", // Use GET method to fetch challenges
      headers: {
        "Content-Type": "application/json",
        // Add Supabase JWT token when we implement it (and any other necessary authorization or headers that arise)
      },
    });

    // console.log("Response status:", response.status); // Debugging: Logs the response status code

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response if available
      console.error("Error fetching user challenges:", errorText); // Log error message from response
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse response body as UserChallenge[]
    const data = await response.json();
    // console.log("Fetched data:", data); // Debugging: logs data received from the server

    // Transform data into expected UserChallenge[] format
    const userChallenges: UserChallenge[] = data.map((item: any) => ({
      id: item.id,
      user_uuid: item.user_uuid,
      challenge_id: item.challenge_id,
      completed: item.completed,
      favorites: item.favorites,
      challenges: item.challenges, // The challenge object is nested inside 'challenges'
    }));

    // console.log("Formatted user challenges:", userChallenges); // Debugging: Log final user challenges array

    return userChallenges; // Return the list of UserChallenges
  } catch (error) {
    console.error("Failed to load user challenges:", error); // Log any error that occurred during the process
    throw new Error("Failed to load user challenges.");
  }
};

// Fetch all completed challenges (by all users)
export const getCompletedChallenges = async (): Promise<
  CompletedChallenge[]
> => {
  try {
    console.log("Fetching completed challenges..."); // Debugging here

    // Note: a different edge function URL is used for this fetch call
    const response = await fetch(completedChallengesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response if available
      console.error("Failed to fetch completed challenges:", errorText); // Log error message from response
      throw new Error(
        `Failed to fetch completed challenges: ${response.statusText}`
      );
    }

    // Parse response body as CompletedChallenge[]
    const data = await response.json();
    // console.log("Completed challenges data:", data); // Log the data received from the API

    // Transform data into expected CompletedChallenge[] format
    const completedChallenges: CompletedChallenge[] = data.map((item: any) => ({
      user_challenge_id: item.userChallenge_id, // userChallenge_id is the always-unique element here
      user_id: item.user_id, // Changed to match updated interface
      user_name: item.user_name,
      user_uuid: item.user_uuid,
      challenge_name: item.challenge_name,
      challenge_id: item.challenge_id,
    }));

    return completedChallenges; // Returns list of completed challenges
  } catch (error) {
    console.error("Error fetching completed challenges:", error); // Log any error that occurred
    throw new Error("Failed to fetch completed challenges.");
  }
};
