// src/services/userService.ts

export const fetchUserProfile = async (userId: number) => {
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};
