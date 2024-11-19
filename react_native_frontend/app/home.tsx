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
  const [error, setError] = useState<string | null>(null); // error state
  const [userId, setUserId] = useState<string | null>(null); // userId state
  const [challenges, setChallenges] = useState<Challenge[]>([]); // Store user challenges

  // Fetch user challenges when the component mounts
  // Fetch user ID and challenges on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        // Fetch the user data from Supabase auth to get the user UUID
        const { data, error: authError } = await supabase.auth.getUser();
        console.log("Fetched user data:", data); // Log user data for debugging

        if (authError || !data?.user?.id) {
          setError("User not authenticated or unable to fetch user data.");
          console.log("Auth Error: ", authError);  // Log authError if it exists
          return;
        }

        // We now have the user UUID from Supabase Auth (data.user.id)
        const userUuid = data.user.id; // This is the UUID of the authenticated user
        console.log("User UUID from Supabase Auth:", userUuid); // Log the UUID being used

        // Fetch user info from your /users/userbyuuid/{uuid} route
        console.log(`Fetching user by UUID from: ${SUPABASE_URL}/functions/v1/users/userbyuuid/${userUuid}`);
        const response = await fetch(`${SUPABASE_URL}/functions/v1/users/userbyuuid/${userUuid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add any necessary headers like authorization token if needed
          },
        });

        if (!response.ok) {
          setError("Failed to fetch user by UUID.");
          return;
        }

        const userData = await response.json();
        console.log("User data received from /users/userbyuuid:", userData); // Log the response data
        // console.log("User data by UUID:", userData); // Log user data

        // Set the userId in state based on the response
        if (userData && userData.id) {
          setUserId(userData.id); // Set the userId from the route response
          console.log("Set userId in state:", userData.id); // Log the userId being set
        } else {
          setError("User data not found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err); // Log error details
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Fetch challenges once userId is set
  useEffect(() => {
    const fetchUserChallenges = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await getUserChallenges(userId); // Assuming this function makes the API call
        console.log("Challenges response:", response); // Log the response
        if ("error" in response) { // Check if error is in the response
          if (typeof response.error === "string") {
            setError(response.error); // If error exists, set the error message
          } else {
            setError("An unknown error occurred.");
          }
        } else {
          setChallenges(response); // Store the fetched challenges
        }
      } catch (err) {
        console.error("Error fetching user challenges:", err);
        setError("Failed to load user challenges.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserChallenges();
  }, [userId]); // This effect runs when userId is set

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
