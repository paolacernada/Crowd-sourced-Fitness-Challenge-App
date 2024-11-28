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
  >([]); // Store completed challenges
  const { theme } = useTheme();

  // Fetch completed challenges
  useEffect(() => {
    const fetchCompletedChallengesData = async () => {
      setLoading(true);
      setError(null); // Reset error state

      try {
        const challenges = await getCompletedChallenges();
        setCompletedChallenges(challenges);
      } catch (err) {
        console.error("Error fetching completed challenges:", err);
        setError("Failed to load completed challenges.");
        Alert.alert(
          "Error",
          "Could not fetch completed challenges. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedChallengesData();
  }, []);

  // Show loading indicator
  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#000"}
          style={styles.loader}
        />
      </ScreenContainer>
    );
  }

  // Show error message
  if (error) {
    return (
      <ScreenContainer>
        <Text
          style={[
            styles.errorText,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          {error}
        </Text>
      </ScreenContainer>
    );
  }

  // Show message when no completed challenges
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

  // Show completed challenges list
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
       🎉 FitTogether Wall of Fame 🎉
      </Text>

      {/* Completed Challenges List */}
      <CompletedChallengesList challenges={completedChallenges} />
    </ScreenContainer>
  );
};

export default CompletedChallengesScreen;
