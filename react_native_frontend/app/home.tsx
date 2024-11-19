import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../src/config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../src/components/ScreenStyles";
import ScreenContainer from "../src/components/ScreenContainer";

export default function HomeScreen() {
  const [loading] = useState(false);
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace("landing");
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
        {" "}
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%", marginBottom: 14, marginTop: 16 },
          ]}
          // onPress={() => router.push("/displayAllChallenges")}
          onPress={() => navigation.navigate("Challenges")}
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
            { width: "70%", marginBottom: 14 },
          ]}
          // onPress={() => router.push("/CreateChallengeScreen")}
          onPress={() => navigation.navigate("CreateChallenge")}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Create Challenge..." : "Create a New Challenge"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "35%", marginBottom: 14, marginTop: 14 },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
