import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
// import { supabase } from "../src/config/supabaseClient";
import { SUPABASE_URL } from "@env";
import { SUPABASE_ANON_KEY } from "@env";

import { useTheme } from "../src/context/ThemeContext";
const edgeFunctionUrl = `${SUPABASE_URL}/auth/v1/signup`; // Edge function URL

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(""); // New username state
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleRegister = async () => {
    setLoading(true);

    // Validate password
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      setLoading(false);
      return;
    }

    // Debugging: Log registration request data
    console.log("Registering user:", { email, firstName, lastName, username });

    try {
      // Attempt to sign up the user using Edge Function instead of embedded Supabase code
      const response = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email,
          password,
          name: `${firstName} ${lastName}`,
          username,
        }),
      });

      // Debugging: Log response status and data
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        Alert.alert("Registration Error", data.error || "Failed to register");
      } else {
        Alert.alert("Success", "Account created! Please log in.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        theme === "dark" ? styles.darkContainer : styles.lightContainer,
      ]}
    >
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
        <Text
          style={[
            styles.title,
            theme === "dark" ? styles.darkText : styles.lightText,
          ]}
        >
          New Member Registration
        </Text>
        <TextInput
          placeholder="First Name"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={firstName}
          onChangeText={setFirstName}
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={lastName}
          onChangeText={setLastName}
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />
        <TextInput
          placeholder="Username"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={username} // New username input
          onChangeText={setUsername}
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />
        <TextInput
          placeholder="Re-enter Password"
          placeholderTextColor={theme === "dark" ? "#999" : "#999"}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={[
            styles.input,
            theme === "dark" ? styles.darkInput : styles.lightInput,
          ]}
        />
        <TouchableOpacity
          style={[
            styles.button,
            theme === "dark" ? styles.darkButton : styles.lightButton,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text
            style={[
              styles.linkText,
              theme === "dark" ? styles.darkAppName : styles.lightAppName,
            ]}
          >
            Already have an account? Log in here.
          </Text>
        </TouchableOpacity>
      </View>
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
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#f7f9fc",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkAppName: {
    color: "#b05600",
  },
  lightAppName: {
    color: "#f48c42",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  formContainer: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  darkForm: {
    backgroundColor: "#333",
  },
  lightForm: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  darkInput: {
    borderColor: "#666",
    color: "#fff",
  },
  lightInput: {
    borderColor: "#ccc",
    color: "#000",
  },
  button: {
    backgroundColor: "#f48c42",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: "#b05600",
  },
  lightButton: {
    backgroundColor: "#f48c42",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    textAlign: "center",
  },
});
