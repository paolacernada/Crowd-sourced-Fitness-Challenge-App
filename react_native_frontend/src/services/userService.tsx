const API_URL = process.env.API_URL || "http://localhost:3000";

export const fetchUserProfile = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Server error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error("Network error: Could not connect to the server.");
      throw new Error(
        "Network error: Please check your connection and try again."
      );
    } else {
      throw error;
    }
  }
};
