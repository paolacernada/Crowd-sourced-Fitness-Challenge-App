import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";
import { useTheme } from "../src/context/ThemeContext";
import ScreenContainer from "../src/components/ScreenContainer";
import styles from "../src/components/ScreenStyles";

const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/users/`; // Edge function URL

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

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
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

      const data = await response.json();

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
            { width: "40%", marginBottom: 10 },
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registering..." : "Register"}
          </Text>
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
    </ScreenContainer>
  );
}
