import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../src/config/supabaseClient";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../src/components/ScreenStyles";
import ScreenContainer from "../src/components/ScreenContainer";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";
import { ROUTES } from "../src/config/routes";
import { Challenge } from "@/src/types/Challenge";
import UserChallengesList from "@/src/components/userChallenges/UserChallengesList";
import { getUserChallenges } from "@/src/services/userChallengeService";

// const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`; // Edge function URL for challenges

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);  // userId state
  const [error, setError] = useState<string | null>(null);

  // Fetch user challenges when the component mounts
  // Fetch user ID and challenges on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        // Fetch the user data from Supabase auth
        const { data, error: authError } = await supabase.auth.getUser();
        console.log("Fetched user data:", data); // Log user data for debugging

        if (authError || !data?.user?.id) {
          setError("User not authenticated or unable to fetch user data.");
          return;
        }

        // Set the userId in state
        setUserId(data.user.id);
      } catch (err) {
        console.error("Error fetching user data:", err); // Log error details
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/landing");
  };

  return (
    <ScreenContainer>
      <Text
        style={[
          styles.appName,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      {/* Show error if there is one */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Show loading message */}
      {loading ? (
        <Text>Loading user data...</Text>
      ) : (
        // Pass the userId to the UserChallengesList component
        userId && <UserChallengesList userId={userId} />
      )}
      {/* Action buttons */}
      <View style={{ alignItems: "center", width: "100%", marginTop: 12 }}>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%" },
          ]}
          // onPress={() => router.push("/displayAllChallenges")}
          onPress={() => router.push(ROUTES.allChallenges)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "View Challenges..." : "View Existing Challenges"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%" },
          ]}
          // onPress={() => router.push("/CreateChallengeScreen")}
          onPress={() => router.push(ROUTES.createChallenge)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Create Challenge..." : "Create a New Challenges"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { marginTop: 4, width: "35%" },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
