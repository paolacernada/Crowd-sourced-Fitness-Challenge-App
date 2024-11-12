import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../src/config/supabaseClient";
import { useTheme } from "../src/context/ThemeContext";
import ScreenContainer from "../components/ScreenContainer";
import styles from "../components/ScreenStyles";

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

    // Attempt to sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    const user = data?.user; // Accessing user from the data object

    // Debugging output
    console.log("Sign-up response:", { user, error });
    // // Note: delete this after figuring out why the uuid isn't being inserted in the users entry
    // console.log("User object:", user, error);

    if (error) {
      console.error("Sign-up error:", error);
      Alert.alert("Registration Error", error.message);
      setLoading(false);
      return; // todo: double check if returning here is the best approach
    }

    // Insert new user data (with uuid) into PostgreSQL database
    // todo: use deployed Supabase Edge Functions instead of embedded Supabase code
    const { error: dbError } = await supabase.from("users").insert([
      {
        name: `${firstName} ${lastName}`,
        username, // Include username
        uuid: user?.id, // Using the Supabase Auth UUID
      },
    ]);

    if (dbError) {
      Alert.alert("Database Error", dbError.message);
      setLoading(false);
    } else {
      Alert.alert("Success", "Account created! Please log in.");
      setLoading(false);
      router.push("/login");
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
          { alignItems: "center", paddingVertical: 20 },
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
          value={username}
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
            { width: "45%" },
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
    </ScreenContainer>
  );
}
