import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";
import CompletedChallengesList from "../components/WallOfFame/WallOfFameList";
import { getCompletedChallenges } from "../services/userChallengeService";
import { CompletedChallenge } from "@/src/types/CompletedChallenge";

const CompletedChallengesScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [completedChallenges, setCompletedChallenges] = useState<
    CompletedChallenge[]
  >([]); // Store completed challenges as CompletedChallenge[] type
  const { theme } = useTheme();

  // Fetch completed Callenges upon mounting
  useEffect(() => {
    const fetchCompletedChallengesData = async () => {
      setLoading(true);
      setError(null); // Reset error state (before fetching)

      try {
        // console.log("Fetching completed challenges..."); // Debugging: log before fetching
        const challenges = await getCompletedChallenges(); // Call 'get completed challenges' service
        // console.log("Fetched completed challenges:", challenges); // Debugging: log fetched data

        setCompletedChallenges(challenges); // Set fetched completed challenges to state
      } catch (err) {
        console.error("Error fetching completed challenges:", err); // Log error details
        setError("Failed to load completed challenges.");
        Alert.alert(
          "Error",
          "Could not fetch completed challenges. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedChallengesData(); // Fetch completed challenges upon mount
  }, []);

  // If loading, show loading indicator
  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#000"}
          style={{ marginTop: 20 }}
        />
      </ScreenContainer>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <ScreenContainer>
        <Text style={styles.errorText}>{error}</Text>
      </ScreenContainer>
    );
  }

  // If no completed challenges, display appropriate message
  if (completedChallenges.length === 0) {
    return (
      <ScreenContainer>
        <Text
          style={[
            styles.errorText,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          There are no completed challenges yet.
        </Text>
      </ScreenContainer>
    );
  }

  // Show list of completed challenges
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

      {/* Title */}
      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
          { marginBottom: 20 },
        ]}
      >
        FitTogether Wall of Fame
      </Text>

      {/* Show Completed Challenges List */}
      <CompletedChallengesList challenges={completedChallenges} />
    </ScreenContainer>
  );
};

export default CompletedChallengesScreen;
