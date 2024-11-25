import { SUPABASE_URL } from "@env";

const userByUuidUrl = `${SUPABASE_URL}/functions/v1/users/userbyuuid/`;

/**
 * Fetch user data by their UUID
 * @param userUuid The UUID of the user
 * @returns A promise that resolves to the user data
 */

export const getUserByUuid = async (userUuid: string) => {
  try {
    // Construct the URL with the UUID in the URL path
    const url = `${userByUuidUrl}/${userUuid}`;

    // Set up the fetch request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch user: ${response.statusText}. ${errorText}`
      );
    }

    // Parse and return the JSON data if the request is successful
    const data = await response.json();
    return data; // Assuming the response is the user data object
  } catch (error) {
    console.error("Error fetching user by UUID:", error);
    throw new Error("Failed to load user by UUID.");
  }
};
