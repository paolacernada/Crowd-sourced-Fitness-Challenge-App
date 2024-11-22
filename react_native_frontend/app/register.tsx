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
  const [username, setUsername] = useState(""); // New username state
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleRegister = async () => {
    setLoading(true);

<<<<<<< HEAD
    // Validate password

    // Validate password
=======
>>>>>>> samberven
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      setLoading(false);
      return;
    }

<<<<<<< HEAD
    // Attempt to sign up the user
    // Attempt to sign up the user
    const { data, data, error } = await supabase.auth.signUp({
      email,
      password,
    });
=======
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
>>>>>>> samberven

      const data = await response.json();

<<<<<<< HEAD
    // Debugging output
    console.log("Sign-up response:", { user, error });
    // // Note: delete this after figuring out whiy the uuid isn't being inserted in the users entry
    // console.log("User object:", user, error);

    const user = data?.user; // Accessing user from the data object

    // Debugging output
    console.log("Sign-up response:", { user, error });
    // // Note: delete this after figuring out whiy the uuid isn't being inserted in the users entry
    // console.log("User object:", user, error);

    if (error) {
      console.error("Sign-up error:", error);
      Alert.alert("Registration Error", error.message);
      setLoading(false);
      return; // todo: doublecheck if returning here is the best approach
    }

    // Insert new user data (with uuid) into PostgreSQL database
<<<<<<< HEAD
    // todo: update local and deployed Supabase Edge Functions and use those instead of Supabase code
=======
    // todo: use deployed Supabase Edge Functions instead of embedded Supabase code
>>>>>>> 0e759db (Implement authentication + postgresql users entry (Use embedded supabase code in react native))
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
      return; // todo: doublecheck if returning here is the best approach
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
=======
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
>>>>>>> samberven
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
