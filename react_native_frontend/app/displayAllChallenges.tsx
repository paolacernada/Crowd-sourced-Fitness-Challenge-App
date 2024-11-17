import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
// import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";

import { supabase } from "../src/config/supabaseClient";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../src/components/ScreenStyles";
import ScreenContainer from "../src/components/ScreenContainer";

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

interface Challenge {
  id: number;
  name: string;
  description: string;
  difficulty: string;
}

const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`; // Edge function URL for challenges

export default function SearchChallengeScreen() {
  const [challenges, setChallenges] = useState<Challenge[]>([]); // Challenges data state
  // const [challenges, setChallenges] = useState("");

  // const [loading, setLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // todo: do I need these 3?
  // const [searchTerm, setSearchTerm] = useState<string>(""); // Search input state
  // const router = useRouter();

  const { theme } = useTheme();

  useEffect(() => {
    const fetchChallenges = async () => {
      // setLoading(true);
      // setError(''); // This clears the previous error (if one exists)

      try {
        const response = await fetch(edgeFunctionUrl);

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
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

  // // Handle updating a challenge
  // const handleUpdate = (id: number) => {

  // }

  // Handle deleting a challenge
  const handleDelete = (id: number) => {
    // First, delete the challenge from the database (API call)
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
        // If the delete is successful, remove it from the state
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
