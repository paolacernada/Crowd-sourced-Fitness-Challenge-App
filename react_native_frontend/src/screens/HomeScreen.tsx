import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../config/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import styles from "../components/ScreenStyles";
import ScreenContainer from "../components/ScreenContainer";

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
      {/* App name */}
      <Text
        style={[
          styles.appName,
          theme === "dark" ? styles.darkAppName : styles.lightAppName,
        ]}
      >
        FitTogether Challenges
      </Text>

      {/* Form container */}
      <View
        style={[
          styles.formContainer,
          theme === "dark" ? styles.darkForm : styles.lightForm,
          { paddingVertical: 20 },
        ]}
      >
        {/* Page title */}
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
            { marginBottom: 20 },
          ]}
        >
          Start Your Journey
        </Text>

        {/* Buttons */}
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
            { width: "70%", marginBottom: 14, marginTop: 5 },
          ]}
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
            { width: "35%", marginBottom: 4, marginTop: 10 },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
