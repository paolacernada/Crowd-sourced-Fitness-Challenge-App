import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
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
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 8,
          borderRadius: 5,
          width: "80%",
        }}
      />

      <Button
        title={loading ? "Creating Challenge..." : "Start a New Challenge"}
        onPress={handleCreateChallenge}
        disabled={loading}
      />

      <Button title="Log out" onPress={() => router.replace("/login")} />
    </View>
  );
}
