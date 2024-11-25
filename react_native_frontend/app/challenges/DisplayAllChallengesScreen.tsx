import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../src/context/ThemeContext";
import styles from "../../src/components/ScreenStyles";
import ScreenContainer from "../../src/components/ScreenContainer";
import { Challenge } from "@/src/types/Challenge";
import { getAllChallenges } from "@/src/services/challengeService";
import { getUserChallenges } from "@/src/services/userChallengeService";
import { useFocusEffect } from "@react-navigation/native";
import { SUPABASE_URL } from "@env";
import { addChallengeToUser } from "@/src/services/userChallengeService"; // Note: need to write this
import { supabase } from "../../src/config/supabaseClient";
import { Ionicons } from "@expo/vector-icons";

// Supabase Edge Function URL for challenges
const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`;

export default function SearchChallengeScreen() {
  // Challenges data state
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [userChallenges, setUserChallenges] = useState<any[]>([]); // State to store user challenges
  const [userUuid, setUserUuid] = useState<string | null>(null); // State for user UUID

  // todo: check if I need the following
  // const [searchTerm, setSearchTerm] = useState<string>(""); // Search input state
  // const router = useRouter();

  const { theme } = useTheme();

  const fetchChallenges = async () => {
    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const data = await getAllChallenges();
      // TODO: this sort isn't working
      const sortedChallenges = data.sort((a, b) => a.id - b.id); // Ascending order

      setChallenges(sortedChallenges); // Update state with fetched challenges
    } catch (err) {
      setError("Failed to load challenges");
      Alert.alert(
        "Error",
        "Could not fetch challenges. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch user challenges from backend
  const fetchUserChallenges = async (userUuid: string) => {
    try {
      const data = await getUserChallenges(userUuid); // Get user challenges
      setUserChallenges(data); // Set them in state
    } catch (err) {
      console.error("Error fetching user challenges:", err);
      Alert.alert("Error", "Could not load user challenges.");
    }
  };

  // Fetch user UUID using Supabase Auth
  const fetchUserUuid = async () => {
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError || !data?.user?.id) {
        setError("User not authenticated or unable to fetch user data.");
        console.error("Auth Error: ", authError); // Log authError if it exists
        return;
      }
      setUserUuid(data.user.id); // Set the user UUID to the state
    } catch (error) {
      console.error("Error fetching user UUID:", error);
      setError("Failed to fetch user UUID.");
    }
  };

  // Use focus effect to fetch challenges and user data when navigating to the screen
  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
      fetchUserUuid(); // Fetch user UUID when screen is focused
    }, [])
  );

  // Fetch user challenges once the user UUID is available
  useEffect(() => {
    if (userUuid) {
      fetchUserChallenges(userUuid); // Fetch challenges only if the UUID is available
    }
  }, [userUuid]);

  // helper for deleting a challenge
  const handleDelete = (id: number) => {
    // Delete challenge from backend edge database
    fetch(`${edgeFunctionUrl}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete challenge");
        }
        // If delete successful, remove it from the state
        setChallenges(challenges.filter((challenge) => challenge.id !== id));
        Alert.alert("Success", "Challenge deleted!");
      })
      .catch((error) => {
        Alert.alert("Error", error.message || "Something went wrong.");
      });
  };

  // Function to handle adding a challenge to the user
  const handleAddChallenge = async (userUuid: string, challengeId: number) => {
    try {
      if (userUuid) {
        await addChallengeToUser(userUuid, challengeId);
        Alert.alert("Success", "Challenge added to your challenges!");
        // Re-fetch user challenges to update the state
        fetchUserChallenges(userUuid);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add challenge to your challenges.");
    }
  };

  // Render each challenge in the list
  const renderChallenge = ({ item }: { item: Challenge }) => {
    // Check if the current challenge is already in the userChallenges list
    const isUserChallenge = userChallenges.some(
      (userChallenge) => userChallenge.challenge_id === item.id
    );

    return (
      <View
        style={[
          styles.challengeItem,
          theme === "dark" ? styles.darkForm : styles.lightForm,
          {
            padding: 16,
            marginBottom: 20,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme === "dark" ? "#b05600" : "#f48c42",
          },
        ]}
      >
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
          ]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontSize: 14, marginBottom: 6 },
          ]}
        >
          Difficulty: {item.difficulty}
        </Text>
        <Text
          style={[
            styles.challengeText,
            theme === "dark" ? styles.darkText : styles.lightText,
            { fontSize: 14, marginBottom: 16 },
          ]}
        >
          {item.description}
        </Text>

        {/* Delete Button */}
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { alignSelf: "center", paddingHorizontal: 20, marginBottom: -4 },
          ]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        {/* Conditional Add/Check Button */}
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { alignSelf: "center", paddingHorizontal: 20, marginTop: 8 },
          ]}
          onPress={() => {
            if (!isUserChallenge && userUuid) {
              // Check if userUuid is not null
              handleAddChallenge(userUuid, item.id);
            }
          }}
        >
          <Ionicons
            name={isUserChallenge ? "checkmark-done" : "add"}
            size={24}
            color={theme === "dark" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator
          size="large"
          color={theme === "dark" ? "#fff" : "#000"}
        />
      </ScreenContainer>
    );
  }

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

      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
          { marginBottom: 20 },
        ]}
      >
        Explore All Challenges
      </Text>

      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
        ListEmptyComponent={
          <Text
            style={[
              styles.lightText,
              theme === "dark" ? styles.darkText : styles.lightText,
            ]}
          >
            No challenges found.
          </Text>
        }
      />
    </ScreenContainer>
  );
}
