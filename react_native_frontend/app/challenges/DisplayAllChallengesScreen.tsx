import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";

import { getAllChallenges } from "@/src/services/challengeService";
import { useTheme } from "../../src/context/ThemeContext";
import styles from "../../src/components/ScreenStyles";
import ScreenContainer from "../../src/components/ScreenContainer";
import { Challenge } from "@/src/types/Challenge";

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

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

  useEffect(() => {
    const fetchChallenges = async () => {
      // todo: figure out if I want to incorporate this or not
      // setLoading(true);
      // setError(''); // This clears the previous error (if one exists)

      try {
        const data = await getAllChallenges();
        setChallenges(data); // This sets the data to the state
      } catch (err) {
        setError("Failed to load challenges");
        Alert.alert(
          "Error",
          "Could net fetch challenges. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

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
    <View style={styles.challengeItem}>
      <Text
        style={[
          styles.challengeText,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        {item.name}
      </Text>
      <Text
        style={[
          styles.challengeText,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        {item.difficulty}
      </Text>
      <Text
        style={[
          styles.challengeText,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        {item.description}
      </Text>
      <button onClick={() => handleDelete(item.id)}>Delete</button>
    </View>
  );

  // Shows a spinner if loading
  if (loading) {
    return (
      <ScreenContainer
      //  style={styles.container}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <Text>{error}</Text>
      </ScreenContainer>
    );
  }
  return (
    <ScreenContainer>
      <FlatList
        data={challenges}
        renderItem={renderChallenge}
        keyExtractor={(item) => item.id.toString()}
        // style={styles.container}
        ListEmptyComponent={<Text>No challenges found.</Text>}
      />
    </ScreenContainer>
  );
}
