import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator } from "react-native";
import { supabase } from "../config/supabaseClient";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";
import UserChallengesList from "../components/userChallenges/UserChallengesList";
import { deleteChallengeFromUser } from "../services/userChallengeService";

const UserChallengesScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const { theme } = useTheme();

  // Fetch user's UUID when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const { data, error: authError } = await supabase.auth.getUser();
        // console.log("Fetched user data:", data); // Log user data for debugging

        if (authError || !data?.user?.id) {
          setError("User not authenticated or unable to fetch user data.");
          // console.log("Auth Error: ", authError); // Log authError if it exists
          return;
        }

        // Grab user UUID from the authenticated user data...
        const fetchedUserUuid = data.user.id;
        setUserUuid(fetchedUserUuid); // ...then Use to set userUuid in state
        // console.log("User UUID from Supabase Auth:", fetchedUserUuid);
      } catch (err) {
        console.error("Error fetching user data:", err); // Log error details
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Runs once component mounts

  const handleRemove = async (userChallengeId: number) => {
    try {
      // console.log("handleRemove called with ID:", userChallengeId);
      // console.log("Calling deleteChallengeFromUser with ID:", userChallengeId);
      await deleteChallengeFromUser(userChallengeId);
      // console.log(`Successfully removed challenge with ID: ${userChallengeId}`);
    } catch (error) {
      // console.error("Error removing challenge:", error);
    }
  };

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
        My Challenges
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
        // Display User Challenges List if User is Authenticated
        userUuid && (
          <UserChallengesList userUuid={userUuid} onRemove={handleRemove} />
        )
      )}
    </ScreenContainer>
  );
};

export default UserChallengesScreen;
