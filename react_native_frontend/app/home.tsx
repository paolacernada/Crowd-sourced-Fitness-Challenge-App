import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { supabase } from "../src/config/supabaseClient";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import ScreenContainer from "../components/ScreenContainer";
import styles from "../components/ScreenStyles";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";

const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/challenges`; // Edge function URL for challenges

export default function HomeScreen() {
  const [challengeName, setChallengeName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleCreateChallenge = async () => {
    if (!challengeName) {
      Alert.alert("Error", "Challenge name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ name: challengeName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create challenge");
      }

      Alert.alert("Success", "Challenge created successfully!");
      setChallengeName("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

      <View
        style={[
          styles.formContainer,
          theme === "dark" ? styles.darkForm : styles.lightForm,
          { paddingVertical: 20 },
        ]}
      >
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          Create a New Challenge
        </Text>

        <TextInput
          placeholder="Enter a new challenge name"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={challengeName}
          onChangeText={setChallengeName}
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />

        <View style={{ alignItems: "center", width: "100%", marginTop: 12 }}>
          <TouchableOpacity
            style={[
              styles.button,
              theme === "dark" ? styles.darkButton : styles.lightButton,
              { width: "70%" },
            ]}
            onPress={handleCreateChallenge}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Challenge..." : "Start a New Challenge"}
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
      </View>
    </ScreenContainer>
  );
}
