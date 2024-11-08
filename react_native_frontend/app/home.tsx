import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../src/config/supabaseClient";
import { useRouter } from "expo-router";
import styles from "../components/ScreenStyles";

export default function HomeScreen() {
  const [challengeName, setChallengeName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateChallenge = async () => {
    if (!challengeName) {
      Alert.alert("Error", "Challenge name cannot be empty.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("challenges")
      .insert([{ name: challengeName, created_at: new Date() }]);

    if (error) {
      Alert.alert("Error creating challenge", error.message);
      setLoading(false);
    } else {
      Alert.alert("Success", "Challenge created successfully!");
      setChallengeName("");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FitTogether Challenges!</Text>
      <Text style={styles.subtitle}>
        Track your progress, join challenges, and more.
      </Text>

      <TextInput
        placeholder="Enter a new challenge name"
        value={challengeName}
        onChangeText={setChallengeName}
        style={[styles.input, styles.lightInput]}
      />

      <TouchableOpacity
        style={[styles.button, loading ? { opacity: 0.5 } : null]}
        onPress={handleCreateChallenge}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating Challenge..." : "Start a New Challenge"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")}>
        <Text style={styles.linkText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}
