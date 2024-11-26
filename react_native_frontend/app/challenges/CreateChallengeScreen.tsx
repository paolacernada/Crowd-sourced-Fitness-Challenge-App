/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../src/context/ThemeContext";
import ScreenContainer from "../../src/components/ScreenContainer";
import styles from "../../src/components/ScreenStyles";

import { ChallengeForm } from "../../src/components/challenges/ChallengeForm";
import { createChallenge } from "@/src/services/challengeService";

export default function CreateChallengeScreen() {
  // const [challengeId, setChallengeId] = useState("");
  // const [challengeName, setChallengeName] = useState("");
  // const [challengeDescription, setChallengeDescription] = useState("");
  // const [challengeDifficulty, setChallengeDifficulty] = useState("");

  const [loading, setLoading] = useState(false);
  const [challengeData, setChallengeData] = useState({
    name: "",
    description: "",
    difficulty: "",
  });

  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleCreateChallenge = async () => {
    // todo: use a map to make this code cleaner
    if (!challengeData.name) {
      Alert.alert("Error", "Challenge name cannot be empty.");
      return;
    }
    if (!challengeData.description) {
      Alert.alert("Error", "Challenge description cannot be empty.");
      return;
    }
    if (!challengeData.difficulty) {
      Alert.alert("Error", "Challenge difficulty cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      // Call the service function to create the challenge in the backend
      const createdChallenge = await createChallenge(challengeData);

      // Alert the user and reset form state
      Alert.alert("Success", "Challenge created successfully!");
      setChallengeData({ name: "", description: "", difficulty: "" });

      // Navigate to the "All Challenges" screen, showing newly-created challenge included with the other challenges
      navigation.navigate("Challenges"); // Navigate to all challenges screen
    } catch (error) {
      // Handle errors that occur during the challenge creation
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
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
        ]}
      >
        {/* Title */}
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
            { marginBottom: 20 },
          ]}
        >
          Create a New Challenge
        </Text>
        <ChallengeForm
          challengeData={challengeData}
          setChallengeData={setChallengeData}
          theme={theme}
        />

        {/* Button to submit the form */}
        <View style={{ width: "100%", alignItems: "center", marginTop: 12 }}>
          <TouchableOpacity
            style={[
              styles.button,
              theme === "dark" ? styles.darkButton : styles.lightButton,
              { width: "50%", marginTop: -6, marginBottom: 2 },
            ]}
            onPress={handleCreateChallenge}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Creating Challenge..." : "Let’s Go!"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
