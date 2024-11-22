import React, { useEffect, useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { SUPABASE_URL } from "@env";

// Supabase Edge Function URL for challenges
const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`;

export default function SearchChallengeScreen() {
  // Challenges data state
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // todo: check if I need the following
  // const [searchTerm, setSearchTerm] = useState<string>(""); // Search input state
  // const router = useRouter();

  const { theme } = useTheme();

  const fetchChallenges = async () => {
    // todo: figure out if I want to incorporate this or not
    // setLoading(true);
    // setError(''); // This clears the previous error (if one exists)

    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const data = await getAllChallenges();

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

  // Use focus effect to refresh data when navigating to the screen
  useFocusEffect(
    useCallback(() => {
      fetchChallenges();
    }, [])
  );

  // helper for deleting a challenge
  const handleDelete = (id: number) => {
    // Delete challenge from backend database
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

  // Render each challenge in the list
  const renderChallenge = ({ item }: { item: Challenge }) => (
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
    </View>
  );

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
