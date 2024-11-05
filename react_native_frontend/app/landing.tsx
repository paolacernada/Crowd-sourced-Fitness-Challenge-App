import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import styles from "../components/ScreenStyles";

export default function LandingScreen() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        theme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <View style={styles.topBar}>
        <Switch
          value={theme === "dark"}
          onValueChange={toggleTheme}
          thumbColor={theme === "dark" ? "#fff" : "#f48c42"}
          trackColor={{ false: "#ccc", true: "#333" }}
        />
      </View>

      <Text
        style={[
          styles.title,
          theme === "dark" ? styles.darkText : styles.lightText,
        ]}
      >
        FitTogether Challenges
      </Text>

      <TouchableOpacity
        style={[
          styles.loginButton,
          theme === "dark" ? styles.darkButton : styles.lightButton,
        ]}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.signupButton,
          theme === "dark" ? styles.darkButton : styles.lightButton,
        ]}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}
