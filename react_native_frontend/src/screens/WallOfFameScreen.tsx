import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator } from "react-native";
import { supabase } from "../config/supabaseClient";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";
import UserChallengesList from "../components/userChallenges/UserChallengesList";
import { getCompletedChallenges } from "../services/userChallengeService"; // Assuming you have a service to fetch completed challenges

const WallOfFameScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<any[]>([]); // Store completed challenges
  const { theme } = useTheme();

  // Fetch completed challenges for all users
  useEffect(() => {
    const fetchCompletedChallenges = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        // Fetch completed challenges where `completed = true` from the backend
        const challenges = await getCompletedChallenges(); // Assuming this function returns challenges with completed = true
        setCompletedChallenges(challenges); // Set the fetched challenges to state
      } catch (err) {
        console.error("Error fetching completed challenges:", err); // Log error details
        setError("Failed to load completed challenges.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedChallenges();
  }, []); // Runs once component mounts

  return (
    <ScreenContainer>
      {/* App Name */}
      <Text
        style={[
          styles.appName,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
          { marginBottom: 20 },
        ]}
      >
        Wall of Fame
      </Text>

      {/* Show Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Show Loading Indicator */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#000"}
        />
      ) : (
        // Display Completed Challenges List
        <UserChallengesList challenges={completedChallenges} />
      )}
    </ScreenContainer>
  );
};

export default WallOfFameScreen;