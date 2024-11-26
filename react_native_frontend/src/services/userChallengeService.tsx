import { UserChallenge } from "@/src/types/UserChallenge";
import { CompletedChallenge } from "@/src/types/CompletedChallenge";
import { SUPABASE_URL } from "@env";

// Edge function URL for fetching user-specific challenges
const userChallengesUrl = `${SUPABASE_URL}/functions/v1/userChallenges`;

// Edge function URL for all completed challenges and associated user and challenge data
const completedChallengesUrl = `${SUPABASE_URL}/functions/v1/completedChallenges`;

/**
 * Update the favorite status of a user challenge.
 * @param userChallengeId The ID of the user_challenge relationship.
 * @param isFavorite The new favorite status.
 */
export const updateUserChallengeFavoriteStatus = async (
  userChallengeId: number,
  isFavorite: boolean
): Promise<void> => {
  const url = `${SUPABASE_URL}/functions/v1/userChallenges/${userChallengeId}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favorites: isFavorite,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error updating favorite status:", errorData);
      throw new Error(errorData || "Failed to update favorite status.");
    }

    console.log("Successfully updated favorite status.");
  } catch (error) {
    console.error("Error updating favorite status:", error);
    throw new Error("Failed to update favorite status.");
  }
};

/**
 * Fetch challenges for a specific user by their user ID
 * @param userUuid The UUID of the user to fetch challenges for. This is easily available in React Native's Supabase module
 * @returns A promise that resolves to an array of challenges the user is currently participating in
 */
export const getUserChallenges = async (
  userUuid: string
): Promise<UserChallenge[]> => {
  // console.log("Fetching challenges for userUuid:", userUuid);
  try {
    const encodedUserUuid = encodeURIComponent(userUuid);
    const url = `${userChallengesUrl}?user_uuid=${encodedUserUuid}`;
    // console.log("Fetching from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response (if available)
      console.error("Error fetching user challenges:", errorText); // Log error message from response
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    // console.log("Fetched data:", data);

    const userChallenges: UserChallenge[] = data.map((item: any) => ({
      id: item.id,
      user_uuid: item.user_uuid,
      challenge_id: item.challenge_id,
      completed: item.completed,
      favorites: item.favorites,
      challenges: item.challenges,
    }));

    // console.log("Formatted user challenges:", userChallenges);

    return userChallenges; // Return list of UserChallenges (the challenges the user is participating in)
  } catch (error) {
    console.error("Failed to load user challenges:", error);
    throw new Error("Failed to load user challenges.");
  }
};

/**
 * Fetch all user challenges using a shared function.
 * This function ensures that all screens fetch user challenges in a consistent way.
 * @param userUuid The UUID of the user whose challenges should be fetched
 * @returns A promise that resolves to an array of challenges
 */
export const fetchUserChallengesData = async (
  userUuid: string
): Promise<UserChallenge[]> => {
  try {
    console.log(`Fetching user challenges for userUuid: ${userUuid}`);
    const userChallenges = await getUserChallenges(userUuid);
    console.log("Fetched user challenges:", userChallenges);
    return userChallenges;
  } catch (error) {
    console.error("Error in fetchUserChallengesData:", error);
    throw new Error("Failed to fetch user challenges.");
  }
};

// Fetch all completed challenges (by all users)
export const getCompletedChallenges = async (): Promise<
  CompletedChallenge[]
> => {
  // console.log("Fetching completed challenges..."); // Debugging here

  try {
    const response = await fetch(completedChallengesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status for completed challenges:", response.status);

    if (!response.ok) {
      const errorText = await response.text(); // Get error details from response (if available)
      console.error("Failed to fetch completed challenges:", errorText); // Log error message from response
      throw new Error(
        `Failed to fetch completed challenges: ${response.statusText}`
      );
    }

    const data = await response.json();
    // console.log("Completed challenges data:", data);

    const completedChallenges: CompletedChallenge[] = data.map((item: any) => ({
      user_challenge_id: item.userChallenge_id, // userChallenge_id is the always-unique element here
      user_id: item.user_id,
      user_name: item.user_name,
      user_uuid: item.user_uuid,
      challenge_name: item.challenge_name,
      challenge_id: item.challenge_id,
    }));

    return completedChallenges;
  } catch (error) {
    console.error("Error fetching completed challenges:", error);
    throw new Error("Failed to fetch completed challenges.");
  }
};

// Helper function to add a challenge to the user
export const addChallengeToUser = async (
  userUuid: string,
  challengeId: number
): Promise<UserChallenge> => {
  // Changed return type to Promise<UserChallenge>
  const url = `${SUPABASE_URL}/functions/v1/userChallenges`;

  const body = JSON.stringify({
    user_uuid: userUuid,
    challenge_id: challengeId,
    completed: false,
    favorites: false,
  });

  console.log("Sending POST request to add challenge to user:");
  console.log("Request body:", body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body, // Send body with required data
    });

    console.log("Response status for addChallengeToUser:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response from addChallengeToUser:", errorData);
      throw new Error(errorData.error || "Failed to add challenge to user.");
    }

    const data = await response.json();
    // console.log("Successfully added challenge to user:", data);
    return data; // Return created relationship
  } catch (error) {
    console.error("Error adding challenge to user:", error);
    throw new Error("Failed to add challenge to user.");
  }
};

/**
 * Delete user-challenge relationship by its ID.
 */
export const deleteChallengeFromUser = async (
  userChallengeId: number
): Promise<void> => {
  const url = `${SUPABASE_URL}/functions/v1/userChallenges/${userChallengeId}`;

  // console.log("Sending DELETE request to URL:", url);

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // console.log("Response status:", response.status);
    const responseBody = await response.text();
    // console.log("Response body:", responseBody);

    if (!response.ok) {
      throw new Error(responseBody || "Failed to delete user challenge.");
    }

    console.log("Successfully deleted user challenge.");
  } catch (error) {
    console.error("Error deleting user challenge:", error);
    throw new Error("Failed to delete user challenge.");
  }
};
