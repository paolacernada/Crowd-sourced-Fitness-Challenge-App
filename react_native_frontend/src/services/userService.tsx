// src/services/userService.ts
const API_URL = process.env.API_URL || "http://localhost:3000";

export const fetchUserProfile = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      headers: { "Content-Type": "application/json" },
    });

    // Check if the response status indicates a server error
    if (!response.ok) {
      // Throw an error with a server-specific message
      throw new Error(`Server error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Differentiate between network errors and server errors
    if (error instanceof TypeError) {
      // Network error, likely due to connectivity or CORS issue
      console.error("Network error: Could not connect to the server.");
      throw new Error(
        "Network error: Please check your connection and try again."
      );
    } else {
      // Re-throw server error to be handled by calling code
      throw error;
    }
  }
};
