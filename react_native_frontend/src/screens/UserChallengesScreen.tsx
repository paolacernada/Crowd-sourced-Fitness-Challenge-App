/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator } from "react-native";
import { supabase } from "../config/supabaseClient";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";
import UserChallengesList from "../components/userChallenges/UserChallengesList";

const UserChallengesScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: authError } = await supabase.auth.getUser();

        if (authError || !data?.user?.id) {
          setError("User not authenticated or unable to fetch user data.");
          return;
        }

        const fetchedUserUuid = data.user.id;
        setUserUuid(fetchedUserUuid);
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
        userUuid && <UserChallengesList userUuid={userUuid} />
      )}
    </ScreenContainer>
  );
};

export default UserChallengesScreen;
