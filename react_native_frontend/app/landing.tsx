import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  topBar: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#f7f9fc",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
  },
  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#f48c42",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: "#f48c42",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: "#333",
  },
  lightButton: {
    backgroundColor: "#f48c42",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
